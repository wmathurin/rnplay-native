'use strict';

import React from 'react';
var Colors = require('../Utilities/Colors');

import {
  ActivityIndicator,
} from 'react-native';

class Spinner extends React.Component {
  render() {
    return (
      <ActivityIndicator
        color={Colors.tintColor}
        style={{flex: 1}}
        animating={this.props.isLoading}
        size="large" />
    );
  }
}

module.exports = Spinner;
