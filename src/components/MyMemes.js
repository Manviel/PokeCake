import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const MyMemes = (props) => {
  return (
    <Fragment>
      {
        props.myMemes.map((meme, i) => {
          return (
            <img key={i}
              src={meme.data.url}
              alt="my"
              className="picture"
            />
          )
        })
      }
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    myMemes: state.myMemes
  }
}

export default connect(mapStateToProps, null)(MyMemes);