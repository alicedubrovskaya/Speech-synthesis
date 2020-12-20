const synth = window.speechSynthesis;

const inputForm = document.querySelector('form');
const inputTxt = document.querySelector('.text');
const voicesList = document.querySelector('select');
const pauseBtn = document.querySelector('#pause')
const resumeBtn = document.querySelector('#resume')

const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('.value--pitch-value');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('.value--rate-value');
const volume = document.querySelector('#volume');
const volumeValue = document.querySelector('.value--volume-value');

let voices = [];

window.onbeforeunload = function() {
  synth.cancel();
};

function populateVoiceList() {
  voices = synth.getVoices();
  const selectedIndex =
    voicesList.selectedIndex < 0 ? 0 : voicesList.selectedIndex;
  voicesList.innerHTML = '';
  for (i = 0; i < voices.length; i++) {
    if (voices[i].lang.startsWith("ru") || voices[i].lang.startsWith("en")){
      const option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
  
      if (voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }
  
      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voicesList.appendChild(option);
    }
  }
  voicesList.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    synth.cancel();
    setTimeout(speak, 300);
  } else if (inputTxt.value !== '') {
    const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function(event) {
      console.log('SpeechSynthesisUtterance.onend');
    };
    utterThis.onerror = function(event) {
      console.error('SpeechSynthesisUtterance.onerror');
    };
    const selectedOption = voicesList.selectedOptions[0].getAttribute(
      'data-name'
    );
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }

    utterThis.onpause = function(event) {
      const char = event.utterance.text.charAt(event.charIndex);
      console.log(
        'Speech paused at character ' +
          event.charIndex +
          ' of "' +
          event.utterance.text +
          '", which is "' +
          char +
          '".'
      );
    };

    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    utterThis.volume = volume.value;
    
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;

    synth.speak(utterThis);
    
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
};

pauseBtn.onclick = function(event) {
  event.preventDefault();

  synth.pause();
  resumeBtn.disabled = false;
  pauseBtn.disabled = true;

  inputTxt.blur();
}

resumeBtn.onclick = function(event) {
  event.preventDefault();

  synth.resume();
  resumeBtn.disabled = true;
  pauseBtn.disabled = false;

  inputTxt.blur();
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function() {
  rateValue.textContent = rate.value;
};

volume.onchange = function() {
  volumeValue.textContent = volume.value;
};

voicesList.onchange = function() {
  speak();
};