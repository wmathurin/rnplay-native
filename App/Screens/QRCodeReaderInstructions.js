'use strict';

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

var Icon = require('../Components/Icon');
var Colors = require('../Utilities/Colors');

var QRCodeReaderInstructions = React.createClass({
  propTypes: {
    onCameraOpen: React.PropTypes.func.isRequired,
  },

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          On rnplay.org, find an app.
        </Text>
        <Text style={styles.text}>
          Click <Text style={styles.runOnDevice}>Run on device</Text>.
        </Text>
        <Text style={styles.text}>
          Tap below and point the camera at the displayed code.
        </Text>

        <TouchableOpacity onPress={this.props.onCameraOpen} >
          <Icon
            name='ios-camera'
            size={80}
            style={styles.cameraButton}
            color={Colors.grey}
          />
        </TouchableOpacity>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize:18,
    padding: 20,
    fontFamily: "Avenir Next",
    textAlign: 'center',
  },
  runOnDevice: {
    fontStyle: 'italic'
  },
  cameraButton: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent'
  },
});

module.exports = QRCodeReaderInstructions;
