'use strict';

import React from 'react'

import {
  Modal,
  StatusBar
} from 'react-native'

var generateAppURL = require('../Utilities/generateAppURL');
var BarCodeReader = require('../Components/BarCodeReader');
var QRCodeReaderInstructions = require('./QRCodeReaderInstructions');
var reloadApp = require('../Utilities/reloadApp');
var TimerMixin = require('react-timer-mixin');

var QRCodeReader = React.createClass({
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle='light-content' />
        <QRCodeReaderInstructions onCameraOpen={() => this.setState({modalVisible: true})} />
        <Modal visible={this.state.modalVisible}>
          <BarCodeReader key="preventWarning" onRead={this.onBarCodeRead} onClose={this.onBarCodeClose} />
        </Modal>
      </View>
    );
  }
});

module.exports = QRCodeReader;
