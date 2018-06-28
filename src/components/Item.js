import React from 'react';
import { connect } from 'react-redux';

import { newMeme } from '../actions';

const MemeItem = (props) => {

  const postMeme = () => {
    const obj = {
      id: props.meme.id,
      text: props.text
    }
    props.newMeme(obj);
  }

  return (
    <div className="item">
      <img src={props.meme.url}
        alt={props.meme.name}
        className="abs meme"
        onClick={postMeme}
      />
      <p className="abs text">{props.meme.name}</p>
    </div>
  );
}

export default connect(null, { newMeme })(MemeItem);