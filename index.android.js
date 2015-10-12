/**
 * @providesModule EmployeeDirectory
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  View,
} = React;

var EmployeesPage = require('./EmployeesPage');
var EmployeePage = require('./EmployeePage');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'search') {
    return (
      <EmployeesPage navigator={navigationOperations} />
    );
  } else if (route.name === 'EmployeePage') {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title={route.employee.firstName+' '+route.employee.lastName} />
        <EmployeePage
          style={{flex: 1}}
          navigator={navigationOperations}
          employee={route.employee}
        />
      </View>
    );
  }
};

var EmployeeDirectory = React.createClass({
  render: function() {
    var initialRoute = {name: 'search'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

AppRegistry.registerComponent('EmployeeDirectory', () => EmployeeDirectory);

module.exports = EmployeeDirectory;
