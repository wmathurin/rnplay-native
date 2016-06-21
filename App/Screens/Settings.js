'use strict';

import React from 'react';
var NavigationBar = require('../Components/NavigationBar');

import {
  StyleSheet,
  Text,
  StatusBar,
  View,
} from 'react-native';

var Settings = React.createClass({

  render(){
    <StatusBar barStyle='light-content' />

    return (
      <View style={styles.mainContainer}>
        <NavigationBar title={'Settings'} />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },

});

module.exports = Settings;
