/**
 * React Native Playground
 * https://github.com/rnplay/rnplay-native
 */

'use strict';

import React from 'react'

var Home = require('../Screens/Home');

import {
  AppRegistry,
  View,
} from 'react-native'

var RNPlayNative = React.createClass({
  render() {
    return (
      <View style={{flex: 1}}>
        <Home />
      </View>
    )
  }
});

module.exports = RNPlayNative;
