import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCustomers } from '../store/actions/customer';

import '../css/Style.css';

class Customers extends Component {
  componentWillMount() {
    this.props.getCustomers();
  }

  render() {
    return (
      <article className="container">
        <section className="flex bot">
          <h2 className="head">Your Cart</h2>
          <button className="btn">Check Out</button>
        </section>
        <h3 className="title bot">Order Summary</h3>
        <ul className="list">
          {this.props.customers.map(customer =>
            <li key={customer.id}>{customer.firstName} {customer.lastName}</li>
          )}
        </ul>
      </article>
    );
  }
}

const mapStateToProps = (state) => ({
  customers: state.customers
})

const dispatchToProps = (dispatch) => ({
  getCustomers: () => dispatch(getCustomers())
})

export default connect(mapStateToProps, dispatchToProps)(Customers);
