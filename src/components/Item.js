import React from 'react';

const MemeItem = (props) => {
  return (
    <div className="item">
      <img src={props.meme.url}
        alt={props.meme.name}
        className="abs meme"
      />
      <p className="abs text">{props.meme.name}</p>
    </div>
  );
}

export default MemeItem;