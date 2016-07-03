'use strict';

import React from 'react'

import {
  AlertIOS,
} from 'react-native'

var Alert = {
  alert(title, message = null, buttons = [{text: 'OK'}], type = null) {
    AlertIOS.alert(title, message, buttons, type);
  }
};

module.exports = Alert;
