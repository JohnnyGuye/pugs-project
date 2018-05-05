export const DataTypes = Object.freeze({
  HELLO:                "hello",
  ASK_SPEAKER_DATA:     "speaking_data_ask",
  SPEAKER_DATA:         "speaking_data",
  SPEAKER_RECOGNITION_DATA:   "speaker_recognition_data",
  ASK_RESET:            "ask_reset",
  RESETED:              "reseted"
})

export class Speak {
  name: string = ""
  timeSpoken: number = 0
  timestamp: number = Date.now()
}

export class SpeakerData {
  dataType: string
  packageNumber: number
  timestamp: number
  time: number
  speakers: Array<Speak>

  constructor() {
    this.dataType = DataTypes.SPEAKER_DATA
    this.packageNumber = -1
    this.timestamp = 0
    this.time = 0
    this.speakers = []
  }

  init() {
    this.packageNumber = 0
    this.timestamp = Date.now()
    this.time = 0
    this.speakers.length = 0
  }

  addSpeak(speak) {
    this.packageNumber += 1
    this.time       += speak.timeSpoken
    this.timestamp  = speak.timestamp
    this.speakers.push( speak )
  }

  lastSpeakData() {
    let lsd = new SpeakerData()
    lsd.packageNumber = this.packageNumber
    lsd.time          = this.time
    lsd.timestamp     = this.timestamp
    if(this.speakers.length > 0)
      lsd.speakers    = this.speakers.slice(-1)
    return lsd
  }
}

export class UISpeakerData {
  public speaker: string = ""
  public timeSpoken: number = 0
  public speakUp: number = -1

  reset() {
    this.timeSpoken = 0
    this.speakUp = 0
  }
}

export class UIData {

  public start: Date
  private _data: Array<UISpeakerData> = []
  private _speakers: Array<string>  = []
  private _timesSpoken: Array<number> = []
  private _timesSpokenPerc: Array<number> = []

  private _speakUp: Array<number> = []

  constructor() {

  }

  reset() {
    this.start = new Date()
    this._data.forEach(s => s.reset())
    for(let i in this._timesSpoken)
      this._timesSpoken[i] = 0
    for(let i in this._timesSpokenPerc ) {
      this._timesSpokenPerc[i] = 0
    }
    for(let i in this._speakUp) {
      this._speakUp[i] = 0
    }
  }

  getOrCreateSpeaker(name: string) : UISpeakerData {
    let idx = this.getIndex(name)
    if(idx != -1) return this._data[idx]

    let sd = new UISpeakerData()
    sd.speaker = name
    this._data.push( sd )
    this._speakUp.push( 0 )
    this._computeSpeakers()
    return sd
  }

  private getIndex(name: string): number {
    for(let i = 0; i < this._data.length; i++) {
      if(this._data[i].speaker == name) {
        return i
      }
    }
    return -1
  }

  private _orderByTimeSpoken() {
    this._data.sort( (rhs, lhs) => { return lhs.timeSpoken - rhs.timeSpoken })
  }

  private _computeSpeakers() {
    this._speakers.length = 0
    for(let sd of this._data) {
      this._speakers.push( sd.speaker )
    }
  }

  private _computeTimesSpoken() {

    let sum = 0
    for(let i = 0; i < this._data.length; i++) {
      let sd = this._data[i]
      if( i < this._timesSpoken.length)
        this._timesSpoken[i] = sd.timeSpoken
      else
        this._timesSpoken.push( sd.timeSpoken )
      sum += sd.timeSpoken
    }
    for(let i = 0; i < this._timesSpoken.length; i++) {
      if( i < this._timesSpokenPerc.length)
        this._timesSpokenPerc[i] = ( this._timesSpoken[i] * 100 / sum)
      else
        this._timesSpokenPerc.push( this._timesSpoken[i] * 100 / sum)
    }
  }

  addTimeTo(name: string, time: number) {
    let sd = this.getOrCreateSpeaker(name)
    sd.timeSpoken += time
    this._speakUp[this.getIndex(name)]++
    //this._orderByTimeSpoken()
    this._computeTimesSpoken()
    this._computeSpeakers()
  }

  get speakUp() : Array<number> {
    return this._speakUp
  }

  get speakers() : Array<string> {
    return this._speakers
  }

  get timesSpoken() : Array<number> {
    return this._timesSpoken
  }

  get timesSpokenPerc() : Array<number> {
    return this._timesSpokenPerc
  }
}
