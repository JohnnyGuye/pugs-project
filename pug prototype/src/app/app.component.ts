import { Component } from '@angular/core';

import { DatabaseService }      from "./services/database.service";
import { DataService }          from "./services/data.service";
import { AudioService }         from "./services/audio.service";

import { User }                 from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Charts
  public vocalLegend: any = "Legend never dies"
  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartLegend:boolean = true;

  private _vocalDatas = [{data: this.dataServ.data.timesSpokenPerc}]
  get vocalsDatas() {
    return [{data: this.dataServ.data.timesSpokenPerc}]
  }

  private _speakUpDatas = [{data: this.dataServ.data.speakUp}]
  get speakUpDatas() {
    return this._speakUpDatas
  }

  get vocalSpeakers() {
    return this.dataServ.data.speakers
  }

  constructor(
    private db: DatabaseService,
    private dataServ: DataService,
    private audioServ: AudioService) {

  }

  public toggleRecording() {
      this.audioServ.toggle()
  }

  public get recording(): boolean {
    return this.audioServ.isRecording
  }

  public value: string = "UI - prototype"

  public openConnection() {
    this.dataServ.openSocket(this.value)
  }

  public closeConnection() {
    this.dataServ.socket.close()
  }

  public get isSocketOpen() {
    return this.dataServ.isSocketOpen
  }

  resetConversation() {
    this.dataServ.resetConversation()
  }

  public get startDate(): string {
    if(this.dataServ.data.start)
      return this.dataServ.data.start.toLocaleTimeString()
    return "Not yet started"
  }

  public get timeComputed(): string {
    if(this.dataServ.ellapsed) {
      let d = new Date(this.dataServ.ellapsed)
      return `${d.getUTCHours()} :${d.getMinutes()}: ${d.getSeconds()}`
    }
    return " - "
  }
  // Database

  private updateUser() {
    let u = new User()
    this.db.updateUser(u)
  }
}
