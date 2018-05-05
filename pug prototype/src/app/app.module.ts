import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule} from "@angular/common/http"

import { AppComponent } from './app.component';
import { WaveComponent } from './components/wave/wave.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment }      from "../environments/environment";

import { DatabaseService }    from "./services/database.service";
import { DataService }        from "./services/data.service";
import { AudioService }         from "./services/audio.service";
import { StoryGameComponent } from './components/story-game/story-game.component'

@NgModule({
  declarations: [
    AppComponent,
    WaveComponent,
    StoryGameComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [
    DatabaseService,
    DataService,
    AudioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
