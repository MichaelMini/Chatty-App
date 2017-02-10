// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
let connectionCounter = 0;
const connectionCounterStr = JSON.parse(connectionCounter);
wss.on('connection', (ws) => {
  connectionCounter++;
  console.log('Client connected');
  let message = {
    type: 'updateCount',
    content: connectionCounter,
    color: '#'+Math.floor(Math.random()*16777215).toString(16)
  }
  broadcast(message);

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    message = JSON.parse(message);
    switch(message.type) {
      case "postMessage":
        // handle incoming message
        message.type = 'incomingMessage';
        message.id = uuid.v1();
        console.log('postMessage: ', message);
        break;
      case "postNotification":
        // handle incoming notification
        message.type= 'incomingNotification';
        console.log('postNote: ', message);
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + message.type);
    }
    broadcast(message);
  });


  // ws.send('something');
  ws.on('close', () => {
    connectionCounter--;
    console.log('Client disconnected');
    let message = {
      type: 'updateCount',
      content: connectionCounter,
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    }
    broadcast(message);
  });
});


function broadcast(data) {
  // The 'clients' property on the socket_server object is maintained
  // by the ws library. It contains an array of all the pipelines
  // that the server is currently keeping track of
  wss.clients.forEach((ws) => {
    // Not all wss are 'open', so we only want to broadcast the message
    // to open wss.
    if(ws.readyState === WebSocket.OPEN) {
      strData = JSON.stringify(data);
      ws.send(strData);
    }
  });
};

