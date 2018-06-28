import React, { Component } from 'react';
import { connect } from 'react-redux';

import MemeItem from './Item';
import '../css/Style.css';

class Memes extends Component {
  constructor() {
    super();

    this.state = { limit: 10 }
  }

  handleClick = () => {
    this.setState({
      limit: this.state.limit + 10
    });
  }

  render() {
    return (
      <section className="content">
        {
          this.props.memes.slice(0, this.state.limit).map((item, index) => {
            return (
              <MemeItem key={index} meme={item} />
            )
          })
        }
        <footer>
          <button className="btn mg" onClick={this.handleClick}>Load more...</button>
        </footer>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, null)(Memes);
