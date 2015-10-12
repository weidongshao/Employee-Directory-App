/**
 * @providesModule EmployeeDirectory
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = React;

var EmployeesPage = require('./EmployeesPage');

var EmployeeDirectory = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Employees',
          component: EmployeesPage,
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('EmployeeDirectory', () => EmployeeDirectory);

module.exports = EmployeeDirectory;
