'use strict';

var React = require('react-native');
var Api = require('../Api/Core');

var {
  TouchableOpacity,
  View,
  Platform,
  StyleSheet,
  StatusBar
} = React;

var AppList = require("../Components/AppList");
var NavigationBar = require('../Components/NavigationBar');

var MyApps = React.createClass({

  _signOut() {
    Api.delete('/users/sign_out');
    this.props.deleteProfile();
    this.props.navigator.replace({ id: 'login'});
  },

  _renderIOSNavBar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          title={'My Apps'}
          nextTitle={'Sign Out'}
          onNext={this._signOut}/>
      );
    } else {
      return <View />;
    }
  },

  render() {
    <StatusBar barStyle='light-content' />
    return (
      <View style={styles.container}>
        {this._renderIOSNavBar()}
        <AppList
          url="/apps.json"
          autoAdjustInsets={false}
          hideCreator={true} />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 49 : null,
  },
});

var {deleteProfile} = require('../Actions');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

module.exports = connect(
  (state) => {
    return {
      profile: state.profile
    }
  },
  (dispatch) => {
    return bindActionCreators({deleteProfile}, dispatch)
  }
)(MyApps)
