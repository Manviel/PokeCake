import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createMeme } from '../actions';

class MemeItem extends Component {

  postMeme = () => {
    const obj = {
      template_id: this.props.meme.id,
      text0: this.props.text0,
      text1: this.props.text1
    }
    this.props.createMeme(obj);
  }

  render() {
    return (
      <div className="item" onClick={this.postMeme}>
        <img src={this.props.meme.url}
          alt={this.props.meme.name}
          className="abs meme"
        />
        <p className="abs text">{this.props.meme.name}</p>
      </div>
    );
  }
}

export default connect(null, { createMeme })(MemeItem);