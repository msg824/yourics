import React from 'react';
// import axios from 'axios';
import './css/pre.css';

class Pre extends React.Component {
    state = {
      focused: false
    }
    componentDidMount() {
      this.input.addEventListener('focus', this.focus);
      this.input.addEventListener('blur', this.focus);
    }
    focus = () => {
      this.setState((state) => ({ focused: !state.focused }))
    }
    render() {
      return (
        <div className="pre">
          <div className="pre-container">
            <input
              ref={input => this.input = input}
              className={['input', this.state.focused && 'input-focused'].join(' ')}
            />
          </div>
        </div>
      );
    }
  }

  export default Pre;