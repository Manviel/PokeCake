import React, { Component } from 'react';
import { connect } from 'react-redux';

import MemeItem from './components/Item';
import MyMemes from './components/MyMemes';

import './css/Style.css';
import './css/App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      limit: 10,
      text0: '',
      text1: ''
    }
  }

  handleClick = () => {
    this.setState({
      limit: this.state.limit + 10
    });
  }

  render() {
    return (
      <article className="container">
        <h1 className="title">Welcome to the Meme Generator</h1>
        <MyMemes />
        <form className="form">
          <div className="group">
            <label htmlFor="text0" className="label mg">Top text</label>
            <input type="text" id="text0"
              onChange={(e) => this.setState({ text0: e.target.value })}
              className="input"
              placeholder="Type some text"
            />
          </div>
          <div className="group">
            <label htmlFor="text1" className="label mg">Bottom text</label>
            <input type="text" id="text1"
              onChange={(e) => this.setState({ text1: e.target.value })}
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
                  text0={this.state.text0}
                  text1={this.state.text1}
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

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, null)(App);
