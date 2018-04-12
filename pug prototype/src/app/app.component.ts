import { Component } from '@angular/core';

import { DatabaseService }      from "./services/database.service";
import { DataService }          from "./services/data.service";
import { User }                 from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Charts
  public vocalLegend: any = "Legend never dies"

  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartLegend:boolean = true;

  get vocalsDatas() {
    return [{data: this.dataServ.data.timesSpokenPerc}]
  }

  get vocalSpeakers() {
    return this.dataServ.data.speakers
  }

  constructor(
    private db: DatabaseService,
    private dataServ: DataService) {

    setInterval( ()=> {
      let speakers = this.dataServ.data.speakers
      let r = Math.floor(Math.random()*speakers.length)
      this.dataServ.data.addTimeTo(speakers[r], 2)
    }, 500)
  }

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
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
