import { Injectable } from '@angular/core';

declare var MediaRecorder

@Injectable()
export class AudioService {

  private recorder: any
  private _isRecording: boolean = false
  private lastRecord: any = null

  constructor( ) {
    this.init()
  }

  init() {
    navigator.mediaDevices.getUserMedia({
        audio: true
      }).then((stream: any) => {
        this.recorder = new MediaRecorder(stream)

        // (listen to dataavailable) TODO: STREAM processing
        // Currently triggers whenever there is an audio blob available
        this.recorder.addEventListener(
          'dataavailable',
          (e: any) => {
            console.log(e)
            this.lastRecord = e
          });
      });
  }

  startRecord() {
    this.recorder.start()
    this._isRecording = true
  }

  stopRecord() {
    this.recorder.stop()
    this._isRecording = false
  }

  toggle() {
    if(this.isRecording) {
      this.stopRecord()
    } else {
      this.startRecord()
    }
  }

  get isRecording(): boolean {
    return this._isRecording
  }
}
