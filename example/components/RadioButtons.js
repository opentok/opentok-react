import React, { Component } from 'react';
import { uniqueId } from 'lodash';

export default class RadioButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: uniqueId('RadioButtons'),
      value: this.props.initialChecked
    };
  }

  onChange = (event) => {
    let value = event.currentTarget.value;
    this.setState({ value });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.value !== this.state.value &&
      typeof this.props.onChange === 'function'
    ) {
      this.props.onChange(this.state.value);
    }
  }

  renderButtons() {
    return this.props.buttons.map((button, index) => {
      let key = this.state.id + '_' + index + '_' + button.value;
      return (
        <div key={key}>
          <label htmlFor={key}>
            {button.label}
          </label>
          <input
            type="radio"
            checked={this.state.value === button.value}
            id={key}
            name={this.state.id}
            value={button.value}
            onChange={this.onChange}
          />
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderButtons()}
      </div>
    );
  }
}
