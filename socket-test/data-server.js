"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';
// Port where we'll run the websocket server
var webSocketsServerPort = 8001;
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Global variables
 */
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];

function randRange(min, max) {
  if(max == null) max = 0
  if(max < min) max,min=min,max
  return Math.floor(Math.random() * (max-min) + min)
}
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
  return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin);
  // we need to know client index to remove them on 'close' event
  var index = clients.push(connection) - 1;
  var userName = false;
  var userColor = false;

  let speakerNames = ["Antoine", "Brandon", "Johnny", "Arafa", ""]
  let lastIdx = randRange(speakerNames.length)
  let lastDate = Date.now()
  console.log((new Date()) + ' Connection accepted.');
  // send back chat history
  if (history.length > 0) {
    connection.sendUTF(
        JSON.stringify({ type: 'history', data: history} ));
  }
  // user sent some message
  connection.on('message', function(message) {
    if (message.type === 'utf8') { // accept only text
     let data = JSON.parse(message.utf8Data)
    // first message sent by user is their name
     switch(data.dataType) {
       case "hello":
         // remember user name
         userName = htmlEntities(data.name);
         // get random color and send it back to the user
         userColor = colors.shift();
         connection.sendUTF(
             JSON.stringify({ dataType: "attribution", type:'color', data: userColor }));
         console.log((new Date()) + ' User is known as: ' + userName
                     + ' with ' + userColor + ' color.');
        break;
      case "speaking_data_ask":

        let now = Date.now()
        let time = 0
        let speakers = []
        let nbSpeakers = randRange(2,8)
        for (let i = 0; i < nbSpeakers; i++) {
          let r = randRange(1,speakerNames.length)
          lastIdx = (r + lastIdx) % speakerNames.length
          let name = speakerNames[lastIdx]
          let timeSpoken = randRange(1,20)

          speakers.push({ name: name, timeSpoken: timeSpoken, timestamp: now })
          time += timeSpoken * 1000
        }
        time /= 1000

        let newDatas = {
          dataType: "speaking_data",
          packageNumber: 1,
          timestamp: now,
          time: time,
          speakers: speakers
        }

        let json = JSON.stringify( newDatas )
        //connection.sendUTF( json )
        console.log((new Date()) + ' Received Message from '
                    + userName + ' asking for speakers data');

        // we want to keep history of all sent messages
        // var obj = {
        //   time: (new Date()).getTime(),
        //   text: htmlEntities(message.utf8Data),
        //   author: userName,
        //   color: userColor
        // };
        // history.push(obj);
        // history = history.slice(-100);
        // broadcast message to all connected clients
        // var json = JSON.stringify({ type:'message', data: obj });
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
        break;
      default:
        break;
     }
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
    if (userName !== false && userColor !== false) {
      console.log((new Date()) + " Peer "
          + connection.remoteAddress + " disconnected.");
      // remove user from the list of connected clients
      clients.splice(index, 1);
      // push back user's color to be reused by another user
      colors.push(userColor);
    }
  });
});
