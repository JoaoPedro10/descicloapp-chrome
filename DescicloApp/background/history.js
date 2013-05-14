/**
 * history.js
 *
 * @fileoverview Contain all the interaction with the history
 * @author Thomas Genin <thomas.genin@ask.com>
 * 2011
 */

//****************************************************************************

/**
 * ATB_History
 * @constructor
 */
var ATB_History = function () {
    if (ATB.Message) {
        ATB.Message.receiveAddSearchHistory(this._addSearchHistory);
        ATB.Message.receiveClearSearchHistory(this._clearSearchHistory);
    }
};

//------------------------------------------------------------------------------
/**
 * Add the new query value of a search to the search history
 *
 * @param val {String} Value of the query
 */
ATB_History.prototype._addSearchHistory = function (val) {
    var searchHistory = ATB.Pref.getSearchHistory() || [];
    if (typeof val == "object")
        val = val.query;

    //avoid duplication of search terms in the search history
    if (searchHistory.indexOf(val) != -1) {
        return;
    }

    //remove oldest element
    if (searchHistory.length == ATB.CONFIG.SEARCH.HISTORY_STORED) {
        searchHistory.shift();
    }
    searchHistory.push(val);

    ATB.Pref.setSearchHistory(searchHistory);
};
//------------------------------------------------------------------------------
/**
 * Clear the searchHistory
 */
ATB_History.prototype._clearSearchHistory = function (message, sendResponse) {
    ATB.Pref.setSearchHistory([]);
    sendResponse(true);
};
//------------------------------------------------------------------------------
/**
 * Return the list of element in the search history which match the query
 *
 * @param query {String} Query
 * @return array List of terms which match the query
 */
ATB_History.prototype.getSearchHistorySuggestion = function (query) {
    var res = [];

    var searchHistory = ATB.Pref.getSearchHistory().reverse() || [];
    var searchHistoryLen = searchHistory.length;
    var queryLen = query.length;
    var max = ATB.CONFIG.SEARCH.HISTORY_NUMBER;

    for (var i = 0; i < searchHistoryLen; i++) {
        if (searchHistory[i].substring(0, queryLen) == query) {
            res.push(searchHistory[i]);
            //we have the number max of elements
            if (res.length == max) {
                break;
            }
        }
    }

    return res;
};
