/**
 * @providesModule SearchBar
 * @flow
 */
'use strict';

var React = require('react-native');
var SearchBarIOS = require('react-native-search-bar');

var {
  ActivityIndicatorIOS,
  TextInput,
  StyleSheet,
  View,
} = React;

var SearchBar = React.createClass({
  render: function() {
    return (
      <View style={styles.searchBar}>
        <SearchBarIOS placeholder='Search'
          onChange={this.props.onSearchChange}
          onSearchButtonPress={this.props.onSearchChange}
          onCancelButtonPress={this.props.onClearSearch}
          hideBackground={true}
        />
        <ActivityIndicatorIOS
          animating={this.props.isLoading}
          style={styles.spinner}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  searchBar: {
    marginTop: 64,
    //flexDirection: 'row',
    //alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  spinner: {
    width: 30,
    position: 'absolute',
    right: 100,
    top: 10,

  },
});

module.exports = SearchBar;
