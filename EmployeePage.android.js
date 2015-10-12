/**
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} = React;

var getImageSource = require('./getImageSource');

var EmployeePage = React.createClass({

  render: function() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
            * omit a property or set it to undefined if it's inside a shape,
            * even if it isn't required */}
          <Image
            source={getImageSource(this.props.employee)}
            style={styles.detailsImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.employeeTitle} numberOfLines={2}>
              {this.props.employee.firstName}&nbsp;{this.props.employee.lastName}
            </Text>
            <Text>
              {this.props.employee.title}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.textContainer}>
          <Text>View Direct Reports</Text>
          <Text>
            {this.props.employee.reports}
          </Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.textContainer}
          >
          <Text>Call Office</Text>
          <Text>
            {this.props.employee.officePhone}
          </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.textContainer}
          >
          <Text>Call Cell</Text>
          <Text>
            {this.props.employee.mobilePhone}
          </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.textContainer}
          >
          <Text>SMS</Text>
          <Text>
            {this.props.employee.mobilePhone}
          </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.textContainer}
          >
          <Text>Email</Text>
          <Text>
            {this.props.employee.email}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  },

});

var styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    margin: 40,
    marginTop: 30,
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 10
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: '#ffffff',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  employeeTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  castTitle: {
    fontWeight: '500',
    marginBottom: 3,
  },
  castActor: {
    marginLeft: 2,
  },
});

module.exports = EmployeePage;
