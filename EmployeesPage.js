/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  TextInput,
  View,
  AppRegistry,
} = React;
var TimerMixin = require('react-timer-mixin');

var invariant = require('invariant');
var dismissKeyboard = require('dismissKeyboard');

var SearchBar = require('SearchBar');

var config = require('./config');
var EmployeeCell = require('./EmployeeCell');
var EmployeePage = require('./EmployeePage');

var API_URL = config.API;

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var LOADING = {};

var EmployeesPage = React.createClass({
  mixins: [TimerMixin],

  timeoutID: (null: any),

  getInitialState: function() {
    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
    };
  },

  componentDidMount: function() {
    this.searchEmployees('');
  },

  _urlForQueryAndPage: function(query: string, pageNumber: number): string {
    if (query) {
      return (
        API_URL + '?q=' +
        encodeURIComponent(query) + '&page_limit=20&page=' + pageNumber
      );
    } else {
      // With no query, load latest movies
      return (
        API_URL + '?page_limit=20&page=' + pageNumber
      );
    }
  },

  searchEmployees: function(query: string) {
    this.timeoutID = null;

    this.setState({filter: query});

    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false
        });
      } else {
        this.setState({isLoading: true});
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
      isLoadingTail: false,
    });
    fetch(this._urlForQueryAndPage(query, 1))
      .then((response) => response.json())
      .catch((error) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = undefined;

        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })
      .then((responseData) => {
        LOADING[query] = false;
        resultsCache.totalForQuery[query] = responseData.total;
        resultsCache.dataForQuery[query] = responseData.employees;
        resultsCache.nextPageNumberForQuery[query] = 2;

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoading: false,
          dataSource: this.getDataSource(responseData.employees),
        });
      })
      .done();
  },

  hasMore: function(): boolean {
    var query = this.state.filter;
    if (!resultsCache.dataForQuery[query]) {
      return true;
    }
    return (
      resultsCache.totalForQuery[query] !==
      resultsCache.dataForQuery[query].length
    );
  },

  onEndReached: function() {
    var query = this.state.filter;
    if (!this.hasMore() || this.state.isLoadingTail) {
      // We're already fetching or have all the elements so noop
      return;
    }

    if (LOADING[query]) {
      return;
    }

    LOADING[query] = true;
    this.setState({
      isLoadingTail: true,
    });

    var page = resultsCache.nextPageNumberForQuery[query];
    invariant(page != null, 'Next page number for "%s" is missing', query);
    fetch(this._urlForQueryAndPage(query, page))
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var employeesForQuery = resultsCache.dataForQuery[query].slice();

        LOADING[query] = false;
        // We reached the end of the list before the expected number of results
        if (!responseData.employees) {
          resultsCache.totalForQuery[query] = moviesForQuery.length;
        } else {
          for (var i in responseData.employees) {
            employeesForQuery.push(responseData.employees[i]);
          }
          resultsCache.dataForQuery[query] = employeesForQuery;
          resultsCache.nextPageNumberForQuery[query] += 1;
        }

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  },

  getDataSource: function(employees: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(employees);
  },

  onSearchChange: function(event: Object) {
    var filter = event.nativeEvent.text.toLowerCase();
    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.searchEmployees(filter), 100);
  },

  onClearSearch: function(event: Object) {
    var filter = '';
    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.searchEmployees(filter), 100);
  },

  selectEmployee: function(employee: Object) {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: employee.firstName + ' ' + employee.lastName,
        component: EmployeePage,
        passProps: {employee},
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: employee.firstName + ' ' + employee.lastName,
        name: 'EmployeePage',
        employee: employee,
      });
    }
  },

  renderFooter: function() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }
    if (Platform.OS === 'ios') {
      return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
    } else {
      return (
        <View  style={{alignItems: 'center'}}>
          <ProgressBarAndroid styleAttr="Large"/>
        </View>
      );
    }
  },

  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    );
  },

  renderRow: function(
    employee: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <EmployeeCell
        key={employee.id}
        onSelect={() => this.selectEmployee(employee)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        employee={employee}
      />
    );
  },

  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoEmployees
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={styles.container}>
        <SearchBar
          onSearchChange={this.onSearchChange}
          isLoading={this.state.isLoading}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo(0, 0)}
        />
        <View style={styles.separator} />
        {content}
      </View>
    );
  }
});

var NoEmployees = React.createClass({
  render: function() {
    var text = '';
    if (this.props.filter) {
      text = `No results for "${this.props.filter}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No employees found';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noMoviesText}>{text}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = EmployeesPage;
