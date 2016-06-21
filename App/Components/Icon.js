'use strict';

import React from 'react';
var VectorIcon = require('react-native-vector-icons/Ionicons');

var Icon = React.createClass({
  render() {
    return(
      <VectorIcon
        name={this.props.name}
        size={this.props.size}
        style={this.props.style}
        color={this.props.color}
      />
    );
  }
});

module.exports = Icon;
