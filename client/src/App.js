import React, { Fragment } from 'react';

import Customers from './components/Customers';
import './css/App.css';

const App = () => {
  return (
    <Fragment>
      <header className="container">
        <h1 className="title">Saga Cart</h1>
        <p className="sub">Please wait while we fetch your info</p>
      </header>
      <Customers />
    </Fragment>
  );
}

export default App;
