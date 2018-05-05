"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'PUG server';

// ========= Imports
let Server  = require('websocket').server
let http    = require('http')
let Util    = require('./util.js')
let Log     = require('./log.js')

// ========= Config
let config = {
  port: 8001
}

// ========= Enums & Constants
let DataTypes = Object.freeze({
  HELLO:                "hello",
  ASK_SPEAKER_DATA:     "speaking_data_ask",
  SPEAKER_DATA:         "speaking_data",
  SPEAKER_RECOGNITION_DATA:   "speaker_recognition_data",
  ASK_RESET:            "ask_reset",
  RESETED:              "reseted"
})

let SPEAKER_NAMES = ["Antoine", "Brandon", "Johnny", "Arafa", ""]

// ========= Class

class Speak {
  constructor() {
    this.name = ""
    this.timeSpoken = 0
    this.timestamp = Date.now()
  }
}

class SpeakerData {
  constructor() {
    this.dataType = DataTypes.SPEAKER_DATA
    this.packageNumber = -1
    this.timestamp = 0
    this.time = 0
    this.speakers = []
  }

  init() {
    this.packageNumber = 0
    this.timestamp = Date.now()
    this.time = 0
    if(this.speakers) this.speakers.length = 0
    else              this.speakers = []
  }

  addSpeak(speak) {
    this.packageNumber += 1
    this.time       += speak.timeSpoken
    this.timestamp  = speak.timestamp
    this.speakers.push( speak )
    Log.warn("update")
  }

  lastSpeakData() {
    let lsd = new SpeakerData()
    lsd.packageNumber = this.packageNumber
    lsd.time          = this.time
    lsd.timestamp     = this.timestamp
    if(this.speakers.length > 0)
      lsd.speakers    = this.speakers.slice(-1)
    return lsd
  }

  clear() {
    this.init()
  }
}

// ========= Globals
let client_users = [ ];

let sessionSpeakerDatas = null

function initSpeakerData() {
  Log.warn("Starting a conversation")
  if(!sessionSpeakerDatas)
    sessionSpeakerDatas = new SpeakerData()
  sessionSpeakerDatas.init()
}
// ======= -----------------------
// For testing purpose
// ======= -----------------------
let lastIdx = Util.randRange(SPEAKER_NAMES.length)
function generateRandomSpeak() {
  let s = new Speak()
  let r = Util.randRange(1,SPEAKER_NAMES.length)
  lastIdx = (r + lastIdx) % SPEAKER_NAMES.length
  s.name = SPEAKER_NAMES[lastIdx]
  s.timestamp = Date.now()
  s.timeSpoken = s.timestamp - sessionSpeakerDatas.timestamp

  sessionSpeakerDatas.addSpeak( s )
  return sessionSpeakerDatas.lastSpeakData( s )
}

// ======= -----------------------
/**
 * Create the server
 */
let server = http.createServer((request, response) => {});
server.listen(config.port, function() {
  Log.warn(" Server is listening on port "  + config.port);
});

let wsServer = new Server({ httpServer: server });

function broadcastUTF(json) {
  for (let cu of client_users) {
    cu.sendUTF(json);
  }
}

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {

  Log.warn('Connection from origin ' + request.origin + '.')
  let connection = request.accept(null, request.origin);
  // we need to know client index to remove them on 'close' event
  let index = client_users.push(connection) - 1;
  let userName = false;

  let lastIdx = Util.randRange(SPEAKER_NAMES.length)
  let lastDate = Date.now()

  Log.good("Connection accepted.")

  // user sent some message
  connection.on('message', function(message) {
    if (message.type !== 'utf8') return

    let data = JSON.parse(message.utf8Data)
    // first message sent by user is their name
    switch(data.dataType) {

      case DataTypes.HELLO:

      userName = Util.htmlEntities(data.name)
      connection.sendUTF( JSON.stringify({ dataType: "attribution" }) )


      Log.log('User connection: ' + connection.adress );

      if(sessionSpeakerDatas === null || sessionSpeakerDatas.packageNumber == -1)
        initSpeakerData()

      broadcastUTF( JSON.stringify( sessionSpeakerDatas ) )

      break;

    case DataTypes.SPEAKER_RECOGNITION_DATA:

      let speak = new Speak()
      speak.name = data.speakerName
      speak.timeSpoken = data.duration
      speak.timestamp = data.timestamp - data.duration

      sessionSpeakerDatas.addSpeak( speak )
      let last = sessionSpeakerDatas.lastSpeakData()

      broadcastUTF( JSON.stringify( last ) )

      break;
    case DataTypes.ASK_SPEAKER_DATA:

      let json = JSON.stringify( generateRandomSpeak() )
      Log.log('From ' + userName + ': asks for speakers data');
      broadcastUTF(json)

      break;

    case DataTypes.ASK_RESET:
      sessionSpeakerDatas.clear()
      broadcastUTF(JSON.stringify({ dataType: DataTypes.RESETED }))
      break;
    default:
      break;
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
    if (userName !== false ) {
      Log.err("Peer " + connection.remoteAddress + " disconnected.");
      // remove user from the list of connected client_users
      client_users.splice(index, 1);
    }
  });
});
