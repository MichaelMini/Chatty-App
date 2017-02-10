import React, { Component } from 'react';

// import Message from 'Message.jsx';


export default class Message extends Component {
  render() {
    var divStyle = {
      color: this.props.color
    };
		return (
			<div className="message">
        <span className="message-username" style={divStyle}>{this.props.username}</span>
			  <span className="message-content">{this.props.content}</span>
			</div>
		);
	}
}

