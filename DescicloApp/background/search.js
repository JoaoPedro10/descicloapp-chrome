/**
 * search.js
 *
 * @fileOverview contain all the search related function
 * @author Thomas Genin <thomas.genin@ask.com>
 * @copyright APN LLC, 2011
 */

/**
 * ATB_Search
 *
 * Class which contain all the search function
 * @constructor
 */
var ATB_Search = function () {
    this._$xhr = null;
    this.cache = {}; //Cache maintained for suggestions per session
    var that = this;

    if (ATB.Message) {
        ATB.Message.receiveSearch(function (message, sendResponse, sender) {
            that.search(message, sendResponse, sender);
        });
        ATB.Message.receiveGetSearchSuggestions(function (message, sendResponse, sender) {
            that._searchSuggestion(message, sendResponse, sender);
        });
    };
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PUBLIC
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * search
 *
 * Make a research in the search box, redirect tab to search page results
 * @param tabId {Number} ID of the tab which need to display the results
 * @param query {String} Value searched
 */
ATB_Search.prototype.search = function (query, sendResponse, sender) {
    if (!this.searchUrl)
        this.searchUrl = this._generateSearchUrl();
    if (!this.tabSearchUrl)
        this.tabSearchUrl = this._generateTabSearchUrl();

    var queryStr, searchType;
    if ( typeof query == "object") {
        queryStr = query.query;
        searchType = query.type;
    } else {
        queryStr = query;
    }

    var url = ATB.Utils.Macro.replaceSpecificMacro(searchType == "new-tab" ? this.tabSearchUrl
                                                                           : this.searchUrl,
                                                   'query', queryStr);
    chrome.tabs.update(sender.tab.id, {url: url});
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PRIVATE
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * _searchSuggestion
 *
 * Get search sugestion data for a query
 */
ATB_Search.prototype._searchSuggestion = function (query, callback) {
    var that = this;
    try {
        this._$xhr.abort();
    }
    catch(e) {
        // do nothing
    }

    var searchHistory = [];
    if (ATB.Pref.getDisplaySearchHistory()) {
        searchHistory = ATB.History.getSearchHistorySuggestion(query);
    }

    //-- get search suggestion only for US, UK, EU
    var curLocale = ATB.Pref.getLocale();
    if (curLocale != 'US' &&
        curLocale != 'UK' &&
        curLocale != 'EU')
    {
        callback({
                     'query': query,
                     'history': searchHistory,
                     'suggestion': []
                 });
        return;
    }
    if (that.cache[query]) {
        callback({
                     'query': query,
                     'history': searchHistory,
                     'suggestion': that.cache[query]
                 });
        return;
    }
    $.extend (ATB.CONFIG.SEARCH.SUGGESTION_URL.params, {q: query});
    this._$xhr = $.ajax(ATB.Utils.buildURL(ATB.CONFIG.SEARCH.SUGGESTION_URL),
                        {
                            dataType: "json",
                            timeout: 5000,
                            error: function (xhr, error_message) {
                                console.log ('error: ' + xhr.status);
                            },
                            success: function (ret) {
                                that.cache[query] = ret[1].filter( function (element, index, array) {
                                                                       return (element.length <= ATB.CONFIG.SEARCH.SUGGESTION_N_CHARS_ALLOWED);
                                                                   });
                                callback({
                                             'query': query,
                                             'history': searchHistory,
                                             'suggestion': that.cache[query]
                                         });
                            }
                });
};

/**
 * macro-replace the search url
 *
 * @return url needed to search, with all the parameters
 */
ATB_Search.prototype._generateSearchUrl = function () {
    return ATB.Utils.Macro.replace(ATB.CONFIG.SEARCH.SEARCH_URL);
};

/**
 * macro-replace the search url for the new-tabs page
 *
 * @return url needed to search, with all the parameters
 */
ATB_Search.prototype._generateTabSearchUrl = function () {
    return ATB.Utils.Macro.replace(ATB.CONFIG.SEARCH.TAB_SEARCH_URL);
};

/**
 * init the search suggestion url and leave the macro for query term in place
 * @return String
 */
ATB_Search.prototype._generateSearchSuggestionUrl = function () {
    return ATB.Utils.Macro.replace(ATB.CONFIG.SEARCH.SUGGESTION_URL);
};
