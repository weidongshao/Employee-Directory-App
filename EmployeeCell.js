/**
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = React;

var getImageSource = require('./getImageSource');

var EmployeeCell = React.createClass({
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      //TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
              * omit a property or set it to undefined if it's inside a shape,
              * even if it isn't required */}
            <Image
              source={getImageSource(this.props.employee)}
              style={styles.cellImage}
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
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  employeeTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
    height: 90
  },
  cellImage: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 32,
    height: 64,
    marginRight: 10,
    marginLeft: 10,
    width: 64,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

module.exports = EmployeeCell;
