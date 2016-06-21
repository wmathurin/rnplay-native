'use strict';

import React from 'react';
var Colors = require('../Utilities/Colors');

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

var NoResults = React.createClass({
  render() {
    return(
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No Results</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  noResultsText: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.lightGrey,
    fontFamily: 'Avenir Next',
  },
});

module.exports = NoResults;
