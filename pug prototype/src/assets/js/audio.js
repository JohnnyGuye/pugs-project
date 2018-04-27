var recorder, talkbtn, isPlaying;

window.onload = function () {
  talkbtn =  document.getElementById('talkbtn');
  // get audio stream from microphone
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
	isPlaying = false;
	talkbtn.addEventListener('click', btnClick);
    recorder = new MediaRecorder(stream);

	// (listen to dataavailable) TODO: STREAM processing
    // Currently triggers whenever there is an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};


function btnClick() {
	document.getElementById('talkbtn').classList.toggle('changed');
	togglePlay();
}
function togglePlay() {
	if (isPlaying) {
		recorder.stop();
		isPlaying = false;
		//alert(isPlaying);
	} else {
		recorder.start();
		isPlaying = true;
		//alert(isPlaying);
	}
};

function onRecordingReady(e) {
  var audio = document.getElementById('speaker');
  // e.data contains a blob representing the recording
  speaker.src = URL.createObjectURL(e.data);
  speaker.play();
}
