import { SpeakerModel }     from "./speaker";
export { SpeakerModel }     from "./speaker";

export class User {

  id: string
  name: string
  speakerModel: SpeakerModel

  constructor() {
    this.id = "-1"
    this.name = "John Doe"
    this.speakerModel = new SpeakerModel()
  }

  isDefault(): boolean {
    return this.id == "-1"
  }

  stringify() {
    return JSON.stringify(this.jsonify())
  }

  jsonify(): any {
    let sm = this.speakerModel.jsonify()
    return {
      id: this.id,
      name: this.name,
      speakerModel: sm
    }
  }
}
