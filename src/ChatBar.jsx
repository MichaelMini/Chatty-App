import React, { Component } from 'react';

export default class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.enterMsgChange = this.enterMsgChange.bind(this);
    this.enterNameChange = this.enterNameChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleMsgChange = this.handleMsgChange.bind(this);
    this.state = {
      type: '',
      username: props.currentUser,
      content: ''
    }
  }

  handleUserChange(event) {
    this.setState({
      username: event.target.value
    })
  }

  handleMsgChange(event) {
    this.setState({
      content: event.target.value
    })
  }

  enterNameChange(event) {
    if (event !== 'focus') {
      this.props.onPostNotification( this.state.username );
    }
  }

  enterMsgChange(event) {
    // some code here, partially involving this.setState()
    const hitEnter = 13;
    if (event.keyCode === hitEnter) {
      this.props.onSendMessage(this.state.username, this.state.content);
      this.state.content = '';
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          placeholder="Your Name (Optional)"
          value={this.state.username}
          onChange={this.handleUserChange}
          onBlur={this.enterNameChange}
        />
        <input
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
          value={this.state.content}
          onChange={this.handleMsgChange}
          onKeyUp={this.enterMsgChange}
        />
      </footer>
    );
  }
}