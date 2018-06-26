import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCustomers } from '../store/actions/customer';

import '../css/customers.css';

class Customers extends Component {
  componentWillMount() {
    this.props.getCustomers();
  }

  render() {
    return (
      <div>
        <h2>Customers</h2>
        <ul>
          {this.props.customers.map(customer =>
            <li key={customer.id}>{customer.firstName} {customer.lastName}</li>
          )}
        </ul>
      </div>
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
