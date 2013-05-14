/**
 * tabs.js
 *
 * @fileoverview Contian all the code related to the manipulation of tabs
 * @author Thomas Genin <thomas.genin@ask.com>
 * @copyright APN LLC, 2011
 */

/******************************************************************************
 * ATB_Tabs
 *
 * Deals with all the interaction implying tabs and chrome.tabs API
 * @constructor
 */
var ATB_Tabs = function () {
    //public
    this.selectedTab = null;
    this._activeTab = {};
    var that = this;
    this._currentURL = null;
    this._previousURL = null;

    //init, get id current tab
    chrome.tabs.getSelected(null, function (tab) {
        that.selectedTab = tab.id;
    });
    //chrome API events
    chrome.tabs.onSelectionChanged.addListener(function (e) {
        that._tabSelectionChanged(e);
    });
    chrome.windows.onFocusChanged.addListener(function (e) {
        that._windowSelectionChange(e);
    });
    chrome.tabs.onRemoved.addListener(function (id, removeInfo) {
        var tab = that._activeTab[id];
        delete that._activeTab[id];
        that._onTabClose(tab);
    });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (tab.status === 'loading') {
            that._previousURL = that._currentURL;
            that._currentURL = tab.url;
            if (that._previousURL == null ||
                (that._previousURL && that._currentURL && that._previousURL !== that._currentURL)) {
                that._updateActiveTabs(tab);
            }
        }
        if (changeInfo.url) {
            ATB.Message.broadcastNavigated(changeInfo.url);
        }
    });
    //internal event
    ATB.Message.receiveNavigate(this._navigate);
    var self = this;
    // navigate messages
    //XXX: case where url is already an object needs to be handled
    ATB.Message.receiveNavigateCurrentTab(function (url, sendResponse, sender) {
        self._navigate({ url: url }, sendResponse, sender);
    });
    ATB.Message.receiveNavigateNewTab(function (url, sendResponse, sender) {
        self._navigate({ url: url, newTab: true }, sendResponse, sender);
    });
    ATB.Message.receiveNavigateNewWindow(function (url, sendResponse, sender) {
        self._navigate({ url: url, newWindow: true }, sendResponse, sender);
    });
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PUBLIC
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**----------------------------------------------------------------------------
 * Return the list of id of all the tabs
 *
 * @return {Array} List of id of tabs
 */
ATB_Tabs.prototype.getAll = function () {
    var listTabs = [];
    //see http://code.google.com/chrome/extensions/windows.html#method-getAll
    chrome.windows.getAll({ 'populate': true }, function (arrOfWindow) {
        arrOfWindow.forEach(function (elem) {
            var tabs = elem.tabs;
            tabs.forEach(function (tab) {
                listTabs.push(tab.id);
            });
        });
    });
    return listTabs;
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PRIVATE
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**----------------------------------------------------------------------------
 * _tabSelectionChanged
 *
 * Handle change of selection of the tabs
 * @param tabID         {jQuery Event}
 * @param e.tabID   {Number} Id of the tab to redirect
 * @param e.href    {String} URL to load
 * @private
 */
ATB_Tabs.prototype._tabSelectionChanged = function (tabID, selectInfo) {
    //close any widget in the previous tab
    ATB.Message.sendCloseDropdownWidget(null, null, null, { tab: { id: this.selectedTab } });
    this.selectedTab = tabID;
};

/**----------------------------------------------------------------------------
 * _windowSelectionChange
 *
 * Handle change of focus windows event
 * @param windID {Number} ID of the new selected windows
 * @private
 */
ATB_Tabs.prototype._windowSelectionChange = function (winID) {
    var that = this;
    if (!winID || winID === -1)
        return;
    chrome.tabs.getSelected(winID, function (tab) {
        that.selectedTab = tab.id;
    });
};

/**----------------------------------------------------------------------------
 * _navigate
 *
 * Redirect a tab to an URL
 * @param urlObj {path, params, basepath}
 * @param sendResponse callback that sends a response to the message
 * @param sender the identifying information
 * @private
 */
ATB_Tabs.prototype._navigate = function (message, sendResponse, sender) {
    var url = (typeof message.url == "object") ? ATB.Utils.buildURL(message.url,
                                                                    message.basepath)
                                               : message.url;

    if( message.newTab ) {
        chrome.tabs.create({
            url: url,
            active: true,
            openerTabId: (sender ? sender.tab.id : null)
        });
    }
    else if( message.newWindow ) {
        chrome.windows.create({
            url: url,
            focused: true,
            type: "normal"
        });
    }
    else {
        chrome.tabs.update(sender.tab.id, { url: url });
    }
    sendResponse();
};

/**----------------------------------------------------------------------------
 * _onTabClose
 *
 * save webpage title, url, and icon to local storage if currently closed page is not a new tab page
 * @param tab {title, url, icon}
 * @private
 */
ATB_Tabs.prototype._onTabClose = function (tab) {
    var tbName = 'apn-'+ATB.CONSTANT.PID+'-toolbar';
    if ((tab.url == "chrome://"+tbName+"/content/config/skin/new-tab.html") || (tab.url == "chrome://newtab/")) {
        return;
    }
    //copy array from pref
    var temp = ATB.Pref.getTabRecentClosed().slice(0);

    if (!temp)
        temp = [];

    if (temp.length == ATB.CONFIG.NEW_TAB.NB_RECENT_CLOSE) {
        //remove oldest -> first one
        temp.shift();
    }
    //add new one at the end
    temp.push({ title: tab.title,
                url: tab.url,
                favIcon : tab.favIcon || ""
              });
    ATB.Pref.setTabRecentClosed(temp);
};

ATB_Tabs.prototype._updateActiveTabs = function (tab) {
    this._activeTab[tab.id] = tab;
};
