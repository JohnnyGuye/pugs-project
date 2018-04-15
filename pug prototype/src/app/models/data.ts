export class SpeakerData {
  public speaker: string = ""
  public timeSpoken: number = 0
  public speakUp: number = 0
}

export class Data {

  public start: Date
  private _data: Array<SpeakerData> = []
  private _speakers: Array<string>  = []
  private _timesSpoken: Array<number> = []
  private _timesSpokenPerc: Array<number> = []

  private _speakUp: Array<number> = []

  constructor() {

  }

  getOrCreateSpeaker(name: string) : SpeakerData {
    let idx = this.getIndex(name)
    if(idx != -1) return this._data[idx]

    let sd = new SpeakerData()
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
    this._speakers = []
    for(let sd of this._data) {
      this._speakers.push( sd.speaker )
    }
  }

  private _computeTimesSpoken() {
    this._timesSpoken = []
    this._timesSpokenPerc = []
    let sum = 0
    for(let sd of this._data) {
      this._timesSpoken.push( sd.timeSpoken )
      sum += sd.timeSpoken
    }
    for(let i = 0; i < this._timesSpoken.length; i++) {
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

  get
}
