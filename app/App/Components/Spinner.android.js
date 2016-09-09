'use strict';

var React = require('react-native');

var {
  ProgressBarAndroid,
  View,
} = React;

var Colors = require('../Utilities/Colors');

class Spinner extends React.Component {
  render() {
    if (this.props.isLoading) {
      return (
        <ProgressBarAndroid
          style={{ flex: 1 }}
          styleAttr="Large"
          color={Colors.tintColor}
        />
      );
    } else {
      return ( <View /> );
    }
  }
}

module.exports = Spinner;
