'use strict';

import React from 'react';
var Colors = require('../Utilities/Colors');

import {
  ActivityIndicator,
} from 'react-native';

class Spinner extends React.Component {
  render() {
    if (this.props.isLoading) {
      return (
        <ActivityIndicator
          color={Colors.tintColor}
          style={{flex: 1}}
          hidesWhenStopped={false}
          animating={this.props.isLoading}
          size="large" />
      );
    } else {
      return null
    }
  }
}

module.exports = Spinner;
