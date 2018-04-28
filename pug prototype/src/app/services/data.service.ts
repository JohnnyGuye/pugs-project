import { Injectable } from '@angular/core';

import { Data, SpeakerData }    from "../models/data";

export class Socket {

  socket: WebSocket = null

  constructor(private root: string = "ws://localhost", private port: number = 8001 ) {

  }

  get adress(): string {
    return this.root + ":" + this.port
  }

  open() {
    if(this.isOpen_ing()) this.socket.close()
    this.socket = new WebSocket(this.adress)
    this.socket.onmessage = (ev: any) => { this.onMessage(ev) }
    this.socket.onerror = (ev: any) => { console.error('Error: ', ev)  }
    this.socket.onopen = (ev: any) => {
      this.send({dataType: "hello", name: "Johnny"})
    }
  }

  send(str: string);
  send(obj: any);
  send(obj: any) {
    if(typeof obj != "string")
      obj = JSON.stringify(obj)
    this.socket.send(obj)
  }

  close() {
    if(this.isClose_ing())  return
    this.socket.close()
  }

  onMessage(ev: any) {
    console.log("Recieved: ", JSON.parse(ev.data))
  }

  private isOpen_ing(): boolean {
    return (this.socket != null) && (this.socket.readyState == this.socket.OPEN || this.socket.readyState == this.socket.CONNECTING)
  }

  private isClose_ing(): boolean {
    return (this.socket != null) && (this.socket.readyState == this.socket.CLOSED || this.socket.readyState == this.socket.CLOSING)
  }
}

@Injectable()
export class DataService {

  data: Data = new Data();
  lastRecep: Date
  socket: Socket

  constructor() {
    this.testData()
    this.socket = new Socket()

    this.socket.onMessage = (ev: any) => {
      let data = JSON.parse(ev.data)
      //console.log("Recieved: ", data)
      switch(data.dataType) {
        case "speaking_data":

          //console.log(this.data)
          if(this.data.start == null)  this.data.start = new Date(data.timestamp)
          this.lastRecep = new Date(data.timestamp)

          let speakers = data.speakers
          for(let speaker of speakers) {
            if(speaker.name)
              this.data.addTimeTo(speaker.name, speaker.timeSpoken)
          }
          break;
        default:
          console.log(data.dataType)
      }
    }
    this.socket.open()

    setInterval(() => {
      this.socket.send({dataType:"speaking_data_ask"})
    },500)
  }

  get ellapsed() {
    if(this.lastRecep && this.data.start)
      return this.lastRecep.getTime() - this.data.start.getTime()
    return 0
  }

  testData() {
    this.data.addTimeTo("Johnny", 0)

    this.data.addTimeTo("Brandon", 0)

    this.data.addTimeTo("Antoine", 0)

    this.data.addTimeTo("Arafa", 0)
  }

}
