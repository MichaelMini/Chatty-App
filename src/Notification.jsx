import React, { Component } from 'react';

// import Notification from 'Notification.jsx';

export default class Notification extends Component {
	render() {
		return (
      <div className="message system">
        <span className="message-content">{this.props.content}</span>
      </div>
		);
	}
}

