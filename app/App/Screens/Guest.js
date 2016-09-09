/**
 * React Native Playground
 * https://github.com/jsierles/rnplay
 */

'use strict';

var React = require('react-native');

var {
  ActivityIndicatorIOS,
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} = React;

var reloadApp = require('../Utilities/reloadApp');
var Camera = require('react-native-camera');
var Colors = require('../Utilities/Colors');

var Api = require("../Api/Core");

var RECENT_PLAYS_URL = '/builds/0.5.0-rc1/apps/public.json';
var MY_PLAYS_URL = '/apps.json';

var Guest = React.createClass({
  getInitialState() {
    return {
      loaded: false,
      isModalOpen: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },

  componentDidMount() {
    this.fetchApps();
  },

  fetchApps() {
    Api.get(RECENT_PLAYS_URL)
      .then((data) => {
        if (data.error) {
          this.navigator.replace({id: "login"});
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
          loaded: true
        });
      })
      .done();
  },

  renderAppList() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>React Native Playground</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderApp}
          style={styles.listView}
        />
        <TouchableOpacity onPress={() => this.setState({isModalOpen: true})}>
          <Image style={styles.cameraButton} resizeMode="contain" source={require("../../assets/photo-camera5.png")} />
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalOpen}>
          <Camera
            ref="cam"
            style={styles.container}
            onBarCodeRead={this.onBarCodeRead}>
            <TouchableOpacity onPress={() => this.setState({isModalOpen: false})}>
              <Text style={styles.cancelButton}>X</Text>
            </TouchableOpacity>
          </Camera>
        </Modal>
      </View>
    );
  },

  renderCreator(app) {
    return app.creator ?
    <View style={styles.creator}>
      <Image style={styles.avatar} source={{uri: app.creator.avatar_url || 'https://facebook.github.io/react-native/img/header_logo.png'}} />
      <Text style={styles.username}>{app.creator.username || 'anonymous'}</Text>
    </View> : null
  },

  renderApp(app) {
    return (
      <View style={styles.appContainer}>
        <TouchableOpacity onPress={() => this.selectApp(app)}>
          <Text style={styles.app}>{app.name || app.module_name}</Text>
        </TouchableOpacity>
        { this.renderCreator(app) }
      </View>
    );

  },

  selectApp(app) {
    reloadApp(app.bundle_url, app.module_name);
  },

  renderLoading() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS size="large" />
      </View>
    );
  },

  onBarCodeRead(data) {
    if (!this.barCodeRead) {
      this.barCodeRead = true
      var appdata = JSON.parse(data.data)
      reloadApp(appdata.url, appdata.module_name);
    }
  },

  render() {
    if (!this.state.loaded) {
      return this.renderLoading();
    } else {
      return this.renderAppList();
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30
  },
  appContainer: {
    marginBottom: 20
  },
  creator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  username: {
    fontSize: 12,
    opacity: .5
  },
  cameraButton: {
    height: 60,
    width: 20,
    alignSelf: 'center',
    marginLeft: 5
  },
  avatar: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 10,
    opacity: .5,
    marginTop: 3,
    backgroundColor: "#000"
  },
  cancelButton: {
    color: '#fff',
    flex: 1,
    fontSize: 25,
    marginLeft: 20
  },
  header: {
    textAlign: "center",
    fontSize: 25,
    paddingBottom: 20,
    color: Colors.grey,
  },
  app: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#2B608A'
  }
});

module.exports = Guest;
