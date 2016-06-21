'use strict';

import React from 'react';
var Colors = require('../Utilities/Colors');

import {
  ActivityIndicatorIOS,
} from 'react-native';

class Spinner extends React.Component {
  render() {
    return (
      <ActivityIndicatorIOS
        color={Colors.tintColor}
        style={{flex: 1}}
        animating={this.props.isLoading}
        size="large" />
    );
  }
}

module.exports = Spinner;
