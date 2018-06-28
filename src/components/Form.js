import React, { Component } from 'react';

class Form extends Component {
  constructor() {
    super();

    this.state = {
      text: ''
    }
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    return (
      <form className="form">
        <div className="group">
          <label for="text" className="label mg">Write text</label>  
          <input type="text" id="text"
            onChange={this.handleChange}
            className="input"
            placeholder="Type some text"
          />
        </div>
      </form>
    );
  }
}

export default Form;