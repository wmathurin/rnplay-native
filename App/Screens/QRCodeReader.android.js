'use strict';

import React from 'react'

import {
  Modal,
  StatusBar,
  View
} from 'react-native'

var generateAppURL = require('../Utilities/generateAppURL');
var BarCodeReader = require('../Components/BarCodeReader');
var QRCodeReaderInstructions = require('./QRCodeReaderInstructions');
var reloadApp = require('../Utilities/reloadApp');
var TimerMixin = require('react-timer-mixin');

class QRCodeReader extends React.Component {

  state = {
    modalVisible: false
  }

  closeModal = () => {
    this.setState({modalVisible: true})
  }

  onBarCodeRead(e) {
    var app = JSON.parse(e.data);
    this.setTimeout(
      () => {
        Portal.closeModal(portalTag);
      }
    )

    reloadApp(generateAppURL(app), app.bundle_path, app.module_name, app.name);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle='light-content' />
        <QRCodeReaderInstructions onCameraOpen={this.closeModal} />
        <Modal visible={this.state.modalVisible} onRequestClose={this.closeModal}>
          <BarCodeReader key="preventWarning" onRead={this.onBarCodeRead} onClose={this.closeModal} />
        </Modal>
      </View>
    );
  }

}

module.exports = QRCodeReader;
