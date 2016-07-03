'use strict';

import React from 'react'

import {
  ToastAndroid,
} from 'react-native'

var Alert = {
  alert(title, message = null, buttons = [{text: 'OK'}], type = null) {
    ToastAndroid.show(title + ': ' + message, ToastAndroid.SHORT);
  },
};

module.exports = Alert;
