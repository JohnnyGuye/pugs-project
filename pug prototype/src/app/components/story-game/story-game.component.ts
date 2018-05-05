import { Component, OnInit } from '@angular/core';

import { HttpClient } from "@angular/common/http"

@Component({
  selector: 'story-game',
  templateUrl: './story-game.component.html',
  styleUrls: ['./story-game.component.css']
})
export class StoryGameComponent implements OnInit {

  dico: Array<string> = []

  words: Array<string> = []
  readonly MAX_NB_WORDS_IN_PLAY = 10
  wordsUsed:number = 0

  constructor(private http: HttpClient) {
    this.init()
  }

  init() {
    this.words = []
  }

  start() {
    this.loadDictionary()
  }

  replaceWord(idx: number) {
    let r = Math.floor(Math.random() * this.dico.length)
    let nw = this.dico[r]
    this.words[idx] = nw
    this.wordsUsed+=1
  }

  loadDictionary() {
      this.http.get("/assets/data/dico.json")
        .subscribe(
          (r) => {
            this.dico = r["words"]
            this.words = []
            for(let i = 0; i < this.MAX_NB_WORDS_IN_PLAY; i++) {
              this.words.push("")
              this.replaceWord(i)
            }
            this.wordsUsed = 0
            console.log(r)
          }
        )
  }

  ngOnInit() {
  }

}
