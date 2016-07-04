'use strict';

import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import ApplicationBase from './App/ApplicationBase'

class RNPlayNative extends Component {
  render() {
    return (
      <ApplicationBase />
    )
  }
}

AppRegistry.registerComponent('RNPlayNative', () => RNPlayNative)
