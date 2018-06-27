import React, { Component } from 'react';

import '../css/Style.css';

class Customers extends Component {
  render() {
    return (
      <article className="container">
        <section className="flex bot">
          <h2 className="head">Your Cart</h2>
          <button className="btn">Check Out</button>
        </section>
        <h3 className="title bot">Order Summary</h3>
      </article>
    );
  }
}

export default Customers;
