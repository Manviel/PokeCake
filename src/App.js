import React, { Component } from 'react';
import { connect } from 'react-redux';

import MemeItem from './components/Item';
import './css/Style.css';
import './css/App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      limit: 10,
      text: ''
    }
  }

  handleClick = () => {
    this.setState({
      limit: this.state.limit + 10
    });
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    return (
      <article className="container">
        <h1 className="title">Welcome to the Meme Generator</h1>
        <form className="form">
          <div className="group">
            <label htmlFor="text" className="label mg">Write text</label>
            <input type="text" id="text"
              onChange={this.handleChange}
              className="input"
              placeholder="Type some text"
            />
          </div>
        </form>
        <section className="content">
          {
            this.props.memes.slice(0, this.state.limit).map((item, index) => {
              return (
                <MemeItem key={index}
                  meme={item}
                  text={this.state.text}
                />
              )
            })
          }
          <footer>
            <button className="btn mg" onClick={this.handleClick}>Load more...</button>
          </footer>
        </section>
      </article>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, null)(App);
