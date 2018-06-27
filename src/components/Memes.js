import React, { Component } from 'react';
import { connect } from 'react-redux';

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
              <h4 key={index} className="item">{item.name}</h4>
            )
          })
        }
        <button className="btn" onClick={this.handleClick}>Load more...</button>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, null)(Memes);
