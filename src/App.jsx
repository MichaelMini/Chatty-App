import React, {Component} from 'react';

import MessageList from './MessageList.jsx';

import ChatBar from './ChatBar.jsx';

// const socket = new WebSocket('ws://localhost:4000');
// const uuid = require('node-uuid');

let defaultState = {
  currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [],
  userCount: 0,
  color: 'black'
}
    // {
    //   username: "Bob",
    //   content: "Has anyone seen my marbles?",
    // },
    // {
    //   username: "Anonymous",
    //   content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
    // }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://www.localhost:4000");
    this.socket.onerror = (event) => {
      console.log(event);
    }
    this.socket.onopen = function (event) {
      console.log("Socket is now opened.");
      // this.socket.send(JSON.stringify({testing: 'Hello'}));
    }.bind(this);
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, type: 'incomingMessage', name: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
    // Set up a callback for when a message comes in from the server
    this.socket.onmessage = (event) => {
      // event.data is a string with JSON encoded data.
      // console.log("Server said: ", event.data);
      // Parse the string into a JavaScript object
      const serverMsg = JSON.parse(event.data);
      // const messages = this.state.messages.concat(serverMsg);
      // console.log(messages);
      // this.setState({messages});

      // The socket event data is encoded as a JSON string.
      // This line turns it into an object
      try {
        switch(serverMsg.type) {
          case "incomingMessage":
          case "incomingNotification":
            // handle incoming message
            const messages = this.state.messages.concat(serverMsg);
            console.log(messages);
            this.setState({messages});
            break;
          case "updateCount":
            let userCount = serverMsg.content;
            let color = serverMsg.color;
            this.setState({userCount});
            this.setState({color});
            console.log('userCount: ', userCount);
            console.log('Color: ', this.state.color);
            break;
          default:
            // show an error in the console if the message type is unknown
            throw new Error("Unknown event type " + serverMsg.type);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  concatMessageToList(user, msg) {
    const postMsg = {
      type: 'postMessage',
      name: user,
      content: msg,
      color: this.state.color
    }
    this.socket.send(JSON.stringify(postMsg));
  }

  concatNotification(nameUpdate) {
    const postNote = {
      type: 'postNotification',
      content: `${this.state.currentUser.name} has changed their name to ${nameUpdate}`
    }
    this.setState({currentUser: {name: nameUpdate}});
    this.socket.send(JSON.stringify(postNote));
  }


  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className="pull-right">{this.state.userCount} {this.state.userCount===1 ? 'user' : 'users'} online</span>
        </nav>
        <MessageList messages={this.state.messages}/>
        <ChatBar
          currentUser={this.state.currentUser.name}
          onSendMessage={this.concatMessageToList.bind(this)}
          onPostNotification={this.concatNotification.bind(this)}
        />
      </div>
    );
  }
}
export default App;
