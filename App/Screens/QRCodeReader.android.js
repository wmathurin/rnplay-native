'use strict';

var React = require('react-native');
var Portal = require('react-native/Libraries/Portal/Portal.js');

var generateAppURL = require('../Utilities/generateAppURL');
var StatusBar = require('../Components/StatusBar');
var BarCodeReader = require('../Components/BarCodeReader');
var QRCodeReaderInstructions = require('./QRCodeReaderInstructions');
var reloadApp = require('../Utilities/reloadApp');
var TimerMixin = require('react-timer-mixin');

let portalTag;

var QRCodeReader = React.createClass({
  mixins: [TimerMixin],

  componentWillMount() {
    portalTag = Portal.allocateTag();
  },

  componentWillUnmount() {
    portalTag = null;
  },

  onBarCodeRead(e) {
    var app = JSON.parse(e.data);
    this.setTimeout(
      () => {
        Portal.closeModal(portalTag);
      }
    )

    reloadApp(generateAppURL(app), app.bundle_path, app.module_name, app.name);
  },

  onBarCodeClose() {
    Portal.closeModal(portalTag);
  },

  onCameraOpen() {
    Portal.showModal(portalTag, this.renderBarCodeReader());
  },

  renderBarCodeReader() {
    return (
      <BarCodeReader key="preventWarning" onRead={this.onBarCodeRead} onClose={this.onBarCodeClose} />
    );
  },

  render(){
    StatusBar.setStyle('default');

    return (
      <QRCodeReaderInstructions onCameraOpen={this.onCameraOpen} />
    );
  }
});

module.exports = QRCodeReader;
