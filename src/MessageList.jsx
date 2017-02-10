import React, { Component } from 'react';
import Message from './Message.jsx';
import Notification from './Notification.jsx';

export default class MessageList extends Component {
  render() {

    const messages = this.props.messages.map(({ type, name, content, color }, i) => {
      if(type === "incomingMessage"){
        return (<Message username={ name } content={ content } color={ color } key={i} />);
      } else {
        return (<Notification content={ content } key={i} />);
      }
    })
    return (
      <main className="messages">
        {messages}
      </main>
    );
  }
}