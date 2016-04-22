'use strict';

var React = require('react-native');
var {
  Modal,
  StatusBar
} = React;

var generateAppURL = require('../Utilities/generateAppURL');
var BarCodeReader = require('../Components/BarCodeReader');
var QRCodeReaderInstructions = require('./QRCodeReaderInstructions');
var reloadApp = require('../Utilities/reloadApp');
var TimerMixin = require('react-timer-mixin');

let portalTag;

var QRCodeReader = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    return {
      cameraOpen: false
    }
  },

  onBarCodeRead(e) {
    var app = JSON.parse(e.data);
    this.setTimeout(
      () => {
        this.setState({cameraOpen: false});
      }
    )

    reloadApp(generateAppURL(app), app.bundle_path, app.module_name, app.name);
  },

  onBarCodeClose() {
    this.setState({cameraOpen: false});
  },

  onCameraOpen() {
    this.setState({cameraOpen: true});
  },

  renderBarCodeReader() {
    return (
      <BarCodeReader onRead={this.onBarCodeRead} onClose={this.onBarCodeClose} />
    );
  },

  render(){
    <StatusBar barStyle='light-content' />

    if (this.state.cameraOpen) {
      return (
        <Modal isVisible={true}>
          {this.renderBarCodeReader()}
        </Modal>
      );
    }

    return (
      <QRCodeReaderInstructions onCameraOpen={this.onCameraOpen} />
    );
  }
});

module.exports = QRCodeReader;
