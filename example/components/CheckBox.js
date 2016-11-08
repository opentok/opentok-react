import React, { Component } from 'react';
import { uniqueId } from 'lodash';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: uniqueId('Checkbox'),
      isChecked: this.props.initialChecked
    };
  }

  onChange = (event) => {
    let isChecked = event.currentTarget.checked;
    this.setState({ isChecked });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isChecked !== this.state.isChecked &&
      typeof this.props.onChange === 'function'
    ) {
      this.props.onChange(this.state.isChecked);
    }
  }

  render() {
    return (
      <div>
        <label htmlFor={this.state.id}>
          {this.props.label}
        </label>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          id={this.state.id}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
