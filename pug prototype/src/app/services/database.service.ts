import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User, SpeakerModel }       from "../models/user";

@Injectable()
export class DatabaseService {

  constructor( private db: AngularFirestore ) { }

  updateUser(user: User) {
    this.db.collection("users/").doc(user.id).set(user.jsonify(), {merge: true});
  }
}
