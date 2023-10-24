/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

"use strict";

const localVideo = document.getElementById("local");
const recordedVideo = document.getElementById("recorded");
const startBtn = document.getElementById("start");
const recordBtn = document.getElementById("record");
const playBtn = document.getElementById("play");
const downloadBtn = document.getElementById("download");
let mediaRecorder;
let recordedBlobs;

function getLocalMediaStream(mediaStream) {
  recordBtn.disabled = false;
  const localStream = mediaStream;
  localVideo.srcObject = mediaStream;
  window.stream = mediaStream;
}

function handleLocalMediaStreamError(error) {
  console.log(`navigator.getUserMedia error: ${error}`);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  const options = { mimeType: "video/webm;codecs=vp9" };

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (error) {
    console.log(`Exception while creating MediaRecorder: ${error}`);
    return;
  }

  console.log("Created MediaRecorder", mediaRecorder);
  recordBtn.textContent = "録画停止";
  playBtn.disabled = true;
  downloadBtn.disabled = true;

  mediaRecorder.onstop = event => {
    console.log("Recorder stopped: ", event);
  };

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10);
  console.log("MediaRecorder started", mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  console.log("Recorded media.");
}

startBtn.addEventListener("click", () => {
  const constraints = {
    video: {
      width: 1280,
      height: 720
    }
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(getLocalMediaStream)
    .catch(handleLocalMediaStreamError);
});

recordBtn.addEventListener("click", () => {
  if (recordBtn.textContent === "録画開始") {
    startRecording();
  } else {
    stopRecording();
    recordBtn.textContent = "録画開始";
    playBtn.disabled = false;
    downloadBtn.disabled = false;
  }
});

playBtn.addEventListener("click", () => {
  const superBuffer = new Blob(recordedBlobs, { type: "video/webm" });
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob(recordedBlobs, { type: "video/webm" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "rec.webm";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});