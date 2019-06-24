import React, { Component } from "react";

import Map from "../components/Map";
import Header from "../components/Header";

import "../css/Style.css";
import "../css/App.css";

class Home extends Component {
  constructor() {
    super();

    this.state = {
      limit: 10,
      text0: "",
      text1: ""
    };
  }

  handleClick = () => {
    this.setState({
      limit: this.state.limit + 10
    });
  };

  render() {
    return (
      <article className="container">
        <Header />
        <section className="content">
          <Map />
        </section>
      </article>
    );
  }
}

export default Home;
