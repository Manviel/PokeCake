import React from 'react';

import Memes from './components/Memes';
import Form from './components/Form';
import './css/App.css';

const App = () => {
  return (
    <article className="container">
      <h1 className="title">Welcome to the Meme Generator</h1>
      <Form />
      <Memes />
    </article>
  );
}

export default App;
