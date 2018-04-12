import { Injectable } from '@angular/core';

import { Data, SpeakerData }    from "../models/data";

@Injectable()
export class DataService {

  data: Data = new Data();

  constructor() {
    this.testData()
  }

  testData() {
    this.data.addTimeTo("Johnny", 0)

    this.data.addTimeTo("Brandon", 0)

    this.data.addTimeTo("Antoine", 0)

    this.data.addTimeTo("Arafa", 0)
  }

}
