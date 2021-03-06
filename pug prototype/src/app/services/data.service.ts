import { Injectable } from '@angular/core';

import { UIData, UISpeakerData, DataTypes }    from "../models/data";

const herokuAdress = "ws://rocky-peak-17324.herokuapp.com"
const localAdress = "ws://localhost"
export class Socket {

  socket: WebSocket = null

  constructor(private root: string = localAdress, private port: number = 8001 ) {

  }

  get adress(): string {
    return this.root + ":" + this.port
  }

  open(onOpen: (ev: any) => void = null) {
    if(this.isOpen_ing()) this.socket.close()
    this.socket = new WebSocket(this.adress)
    this.socket.onmessage = (ev: any) => { this.onMessage(ev) }
    this.socket.onerror = (ev: any) => { console.error('Error: ', ev)  }
    if(onOpen)
      this.socket.onopen = onOpen
    else
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

  isOpen_ing(): boolean {
    return (this.socket != null) && (this.socket.readyState == this.socket.OPEN || this.socket.readyState == this.socket.CONNECTING)
  }

  isClose_ing(): boolean {
    return (this.socket != null) && (this.socket.readyState == this.socket.CLOSED || this.socket.readyState == this.socket.CLOSING)
  }
}

@Injectable()
export class DataService {

  data: UIData = new UIData();
  lastRecep: Date
  socket: Socket
  readonly SPEAKER_NAMES = ["","Antoine", "Brandon", "Johnny", "Arafa"]

  activeKeys = []

  constructor() {
    this.testData()
    this.socket = new Socket()
    this.initSRKeyMimic()
  }

  initSRKeyMimic() {
    addEventListener(
      "keydown",
      (ev: KeyboardEvent) => {
        let cst =  +ev.key
        if(Number.isNaN(cst) || this.activeKeys[cst])  return
        this.activeKeys[cst] = Date.now();
      })
    addEventListener(
      "keyup",
      (ev: KeyboardEvent) => {
        let cst = +ev.key
        if(Number.isNaN(cst))  return
        if(cst < this.SPEAKER_NAMES.length && this.socket.isOpen_ing()) {
          this.socket.send({
            dataType: DataTypes.SPEAKER_RECOGNITION_DATA,
            speakerName: this.SPEAKER_NAMES[cst],
            duration: Date.now() - this.activeKeys[cst],
            timestamp: Date.now()
          })
        }
        this.activeKeys[cst] = 0;
      }
    )
    for(let i = 0; i < 10; i++)
      this.activeKeys.push( false )
  }

  openSocket(name: string = "UI - prototype") {
    this.socket = new Socket()

    this.socket.onMessage = (ev: any) => {
      let data = JSON.parse(ev.data)
      //console.log("Recieved: ", data)
      switch(data.dataType) {
        case DataTypes.RESETED:
          this.data.reset()
          break;
        case DataTypes.SPEAKER_DATA:

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
    let polling = () => {
      if(this.socket.isClose_ing())  return
      this.socket.send({dataType:"speaking_data_ask"})
      setTimeout(polling, 20000)
    }
    this.socket.open(
      (ev: any) => {
        this.socket.send({dataType: "hello", name: name})
      }
    )
  }

  resetConversation() {
    if(this.socket.isClose_ing()) return
    this.socket.send({dataType: DataTypes.ASK_RESET})
  }

  get isSocketOpen(): boolean {
    return this.socket.isOpen_ing()
  }

  get ellapsed() {
    if(this.lastRecep && this.data.start)
      return this.lastRecep.getTime() - this.data.start.getTime()
    return 0
  }

  testData() {
    for(let n of this.SPEAKER_NAMES)
      if(n)this.data.addTimeTo(n, 0)
  }

}
