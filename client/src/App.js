import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';

import Customers from './components/Customers';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">React/Redux Express Starter</h1>
          </header>
          <Customers />
        </div>
      </Provider>
    )
  }
}

export default App;
