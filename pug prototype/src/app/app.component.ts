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

  get vocalsDatas() {
    return [{data: this.dataServ.data.timesSpokenPerc}]
  }

  get speakUpDatas() {
    return [{data: this.dataServ.data.speakUp}]
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

  public value: string = "Arafa"

  public socketConnection() {
    console.log("socket start button pressed...")
    return this.dataServ.toggleSocket()
  }

  /*public get socketOpen(): boolean {
    return this.dataServ.isSocketOpen
  }*/
  public get iWantToShowSomething(): string {
    return "I'm something"
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
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  // Database

  private updateUser() {
    let u = new User()
    this.db.updateUser(u)
  }
}
