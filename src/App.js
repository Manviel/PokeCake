import React, { Fragment } from 'react';

import Customers from './components/Customers';
import './css/App.css';

const App = () => {
  return (
    <Fragment>
      <header className="container">
        <h1 className="title">Welcome to the Meme Generator</h1>
      </header>
      <Customers />
    </Fragment>
  );
}

export default App;
