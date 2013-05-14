// TODO: The rest of this file is Firefox specific and should be a ff only shim.
if (typeof chrome == "undefined") {
    chrome = (function(window, navigator) {
    //******************************CONSOLE****************************************
    if ( typeof console == "undefined") {
        console = {
            log: function (msg) {
                dump("##Log##    " + msg + "\n");
            },
            debug: function (msg) {
                dump("##Debug##    " + msg + "\n");
            },
            info: function (msg) {
                dump("^^Info^^     " + msg + "\n");
            },
            warn: function (msg) {
                dump("@@Warn@@     " + msg + "\n");
            },
            error: function (msg) {
                dump("**Error** " + msg + "\n");
            },
            groupCollapsed: function (msg) {
                dump("++Group Start+++++++\n" + msg + "\n");
            },
            groupEnd: function () {
                dump("++Group End+++++++++\n");
            },
            dir: function (msg) {
                dump("##Dir##     " + (msg instanceof Object ? msg.toSource() : msg) + "\n");
            }
        };
    }

    var requestListeners = [];
    if (typeof window.fireRequest == "undefined") {
        window.fireRequest = function (message, chromeWin) {
            var sender = { tab: { id: chromeWin } };
            if (requestListeners) {
                for (var i = 0; i < requestListeners.length; i++) {
                    requestListeners[i].call(null, message, sender);
                }
            }
        };
    }

    //******************CHROME API*********************************
    /**
     * chrome object implementation
     *
     * @param {Object} handler
     */
    return {
        extension: {
            sendRequest: function (message) {
                try {
                    var self = this;
                    window.setTimeout(function () {
                                  self.getBackgroundPage() && self.getBackgroundPage().fireRequest(message, window);
                               }, 1);
                } catch(e) {
                    console.error(" in sendErrorRequest:" + e);
                }
            },
            onRequest: {
                addListener: function (handler) {
                    requestListeners.push(handler);
                }
            },
            onRequestExternal: {
                addListener: function (handler) {}
            },
            getURL: function (url) {
                url = "chrome://" + ATB.CONSTANT.EXT_PKG_ID + "/content/" + url;
                return url;
            },
            setUpdateUrlData: function () {},
            getBackgroundPage: function () {
                var bgIfr = bgIframe ? bgIframe : parent.bgIframe;
                return bgIfr.contentWindow;
            }
        },

        //Potentially we could implement this for Firefox
        windows: {
            get: function () { },
            getAll: function () { },
            onFocusChanged: {
                addListener: function (handler) { }
            },
            onRemoved: {
                //could use nsiWindowMediator.addListener - onWindowClose
                addListener: function (handler) { }
            },
            onCreated: {
                //could use nsiWindowMediator.addListener - onWindowOpen
                addListener: function (handler) { }
            },
            create: function (urlobj) {
                window.open(urlobj.url);
            }
        },

        tabs: {
            /**
             * chrome.tabs.sendRequest - a function to send a request to a tab,
             * ff implementation
             *
             * @param destWin   {Object}   ID of the tab which must receive the message
             * @param message   {Object}    Parameters of the message ( cmd is include )
             * @param callback  {Function}  Function to call if a response is send
             */

            sendRequest: function (destWin, message) {
                window.setTimeout(function () {
                    destWin.fireRequest(message, window);
                }, 1);
            },
            getSelected: function () {},
            /**
             * Function which changes the location of the current window with the
             * new url
             *
             * @param chromeWin    {Number}    (e.tabID) in chrome
             * @param obj.url    {string}    Url of the new page to navigate to
             */
            update: function (chromeWin, obj) {
                console.log("Page:" + chromeWin + " should navigate to " + obj.url);
                try {
                    chromeWin.parent.getBrowser().contentDocument.location.href = obj.url;
                }
                catch(e) {
                    chromeWin.document.location.href = obj.url;
                }
            },
            onRemoved: {
                addListener: function (handler) {
                    try {
                        var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                               .getInterface(Components.interfaces.nsIWebNavigation)
                                               .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                                               .rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                               .getInterface(Components.interfaces.nsIDOMWindow);
                        if (mainWindow && mainWindow.gBrowser) {
                            var container = mainWindow.gBrowser.tabContainer;
                            container.addEventListener("TabClose", handler, false);
                        }
                    }
                    catch (e) {
                        console.log("chrome.tabs.onRemoved.addListener in browser-shim throws an exception:" + e);
                    }
                }
            },
            onUpdated: {
                addListener: function (handler) {}
            },
            onSelectionChanged: {
                addListener: function (handler) {}
            },
            create: function (handler) {
                var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                                   .getService(Components.interfaces.nsIWindowMediator);
                var mainWindow = wm.getMostRecentWindow("navigator:browser");
                mainWindow.gBrowser.selectedTab = mainWindow.gBrowser.addTab(handler.url);
            }
        },

        browserAction: {
            /**
             * Not supported in FF,  just a stub
             * @param {Object} obj
             */
            setIcon: function (obj) {} //Ignore
        },

        /**
         * chrome.history.search - searches the history for most visited page ,
         * ff implementation
         *
         * @param query   {Object}      this parameter is not used in FF, only in GC
         * @param callback  {Function}  callback function
         */
        history : {
            search : function(query, callback) {
                try {
                    var navHistory = [];
                    var historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"]
                                                   .getService(Components.interfaces.nsINavHistoryService);
                    var hisQuery = historyService.getNewQuery();

                    var options = historyService.getNewQueryOptions();
                    options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
                    if (options.redirectsMode) {
                        options.redirectsMode = options.REDIRECTS_MODE_TARGET;
                    }
                    options.maxResults = hisQuery.maxResults;

                    var result = historyService.executeQuery(hisQuery, options);
                    result.root.containerOpen = true;

                    for (var i = 0; i < result.root.childCount && navHistory.length < ATB.CONFIG.NEW_TAB.MOST_VISITED.NB; i++) {
                        node = result.root.getChild(i);
                        navHistory.push({
                            "title" : node.title,
                            "url" : node.uri,
                            "favIcon" : node.icon || node.icon.spec,
                            "visitCount" : 1 //XXX awin this should calculate actual visitCount see https://developer.mozilla.org/en/Querying_Places
                        });
                    }
                    result.root.containerOpen = false;
                    typeof callback == "function" && callback(navHistory);
                }
                catch (e) {
                    console.log("chrome.history.search in browser-shim throws an exception:" + e);
                }
            }
        }
    };

// shouldn't get here!
throw new Error("Unexpected: chrome is undefined, and browser isn't Mozilla!");

})(ATB.USE_CONTENT ? content.window : window,
   ATB.USE_CONTENT ? content.navigator : navigator);
}
