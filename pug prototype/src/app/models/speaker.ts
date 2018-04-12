export class SpeakerModel {

  sampletrain: number = 1
  mcc: Array<any> = []

  contructor() {

  }

  stringify(): string {
    return JSON.stringify(this)
  }

  jsonify(): string {
    return JSON.parse(this.stringify())
  }

}
