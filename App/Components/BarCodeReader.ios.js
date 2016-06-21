'use strict';

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import Camera from 'react-native-camera';

var Icon = require('react-native-vector-icons/Ionicons');

var BarCodeReader = React.createClass({
  render() {
    return (
      <Camera
        ref="cam"
        style={styles.camera}
        onBarCodeRead={this.props.onRead}>
        <TouchableOpacity onPress={this.props.onClose}>
          <Icon name='close'
            size={30}
            style={styles.closeButton}
            color='white' />
        </TouchableOpacity>
      </Camera>
    );
  }
});

var styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 30,
    right: 20,
  },
});

module.exports = BarCodeReader;
