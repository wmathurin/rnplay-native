'use strict';

import React from 'react'
var Colors = require('../Utilities/Colors');

import {
  ToolbarAndroid,
  StyleSheet,
} from 'react-native'

var NavigationBar = React.createClass({
  render() {
    return (
      <ToolbarAndroid
        title={this.props.title}
        navIcon={require("../../assets/ic_menu_white_24dp.png")}
        onActionSelected={this.onActionSelected}
        titleColor="white"
        onIconClicked={this.props.handleNavIconTap}
        style={styles.toolbarAndroid} />
    );
  }
});

var styles = StyleSheet.create({
  toolbarAndroid: {
    backgroundColor: Colors.tintColor,
    height: 56,
  },
});

module.exports = NavigationBar;
