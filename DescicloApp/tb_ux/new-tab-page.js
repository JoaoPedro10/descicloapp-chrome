var bgIframe = null; // global var is necessary-browser-shim.js expected it
/**
 * new-tab.js
 *
 * @fileoverview Create the APN new tab page
 * @author Thomas Genin <thomas.genin@ask.com>
 */
ATB.Message = new ATB_Message("content script");

$(document).ready(function () {
    var bgPg = null;

    if ($.browser.webkit) {
        bgPg = chrome.extension.getBackgroundPage();
    }
    else if ($.browser.mozilla) {
        try {
            var bgWin = Components.classes["@mozilla.org/appshell/appShellService;1"].getService(Components.interfaces.nsIAppShellService).hiddenDOMWindow;
            bgIframe = bgWin.document.getElementById(ATB.CONSTANT.BG_IFRAME_ID);
            bgPg = bgIframe.contentWindow;
        }
        catch(e) {
            console.error("Error in getting background page: " + e);
        }
    }

    $('#dynamic a').live('click', function (e) {
        window.location = $(this).attr('src');
    });

    $('.app').live('click', function (e) {
        e.preventDefault();
        APP.launch($(this).attr('id'));
    });

    $("#disable-new-tab").live('click', function (e) {
        e.preventDefault();
        ATB.NewTab.handleDisableLinkClick (e);
    });

    $('#search-form').live('submit', function (ev) {
        ev.preventDefault();
        var searchUrl = ATB.CONFIG.TAB_SEARCH_URL; //default
        var searchBoxCfg = ATB.CONFIG.leftDock.filter(function (elem) {
            if (elem.id)
                return elem.id.indexOf("com.apn.search-box") != -1;
            return false;
        });
        if (searchBoxCfg) {
            searchUrl = searchBoxCfg[0].windows.nav.url;
        }
        searchUrl.params.q = $('#search-value').val();
        searchUrl.params.gct = "tab";
        ATB.Message.sendNavigate({ url: { path: searchUrl.path,
                                          params: searchUrl.params
                                        }});
    });
    APP.init();
    ATB.NewTab.init(bgPg, $("#mostVisited"), $('#recentlyClosed'));
    if ($.browser.mozilla || navigator.appCodeName == "Envjs") {//Mozilla Firefox
        $("#appsSection").addClass("hidden");
        if (bgPg.ATB.Pref.getNewTabIsOn()) {
            var $lnk = $("#disable-new-tab");
            $lnk.text('Disable this custom new tabs page');
        }
    }
});

/**
 * APP
 * responsible for displaying and launch applications in Apps section (this only applies to GC)
 */
var APP = {
    init: function () {
        if ($.browser.webkit) {
            //INSTALL
            chrome.management.onInstalled.addListener(APP._displayApps);

            //UNINSTALL
            chrome.management.onUninstalled.addListener(APP._displayApps);

            //DISABLE
            chrome.management.onDisabled.addListener(APP._displayApps);

            //ENABLE
            chrome.management.onEnabled.addListener(APP._displayApps);

            APP._displayApps();
        }
    },
    /**
     * _getListApps
     *
     * Get the list of app from the list of installed extensions
     * @private
     */
    _displayApps: function () {
        chrome.management.getAll(function (arr) {
            var chromeStore = {
                isApp: true,
                enabled: true,
                id: 'chromeStore',
                icons: [{
                    size: 128,
                    url: chrome.extension.getURL('config/skin/images/IDR_WEBSTORE_ICON.png')
                }],
                name: 'Web Store',
                description: 'Download new App, extensions and Theme for Google Chrome',
                appLaunchUrl: 'https://chrome.google.com/webstore'

            };
            arr.splice(0, 0, chromeStore);
            var len = arr.length;
            var listApps = [];
            for (var i = 0; i < len; i++) {
                var app = arr[i];
                if (app.isApp && app.enabled == true) {
                    //prevent to add duplicate app
                    for (var a in listApps) {
                        if (listApps[a].id == app.id) {
                            continue;
                        }
                    }

                    listApps.push({
                        id: app.id,
                        iconURL: APP._appGetBigIconUrl(app.icons),
                        name: app.name,
                        description: app.description,
                        url: app.appLaunchUrl
                    });
                }
            }
            APP._generateAppUI(listApps);
        });
    },
    /**
     * _generateAppUI
     *
     * create DocumentFragment which contains a list of installed extensions, and append it to the #apps element
     * @param listApps {Array } list of Apps object
     * @private
     */
    _generateAppUI: function (listApps) {
        var len = listApps.length;
        var frag = document.createDocumentFragment();

        //list of apps
        for (var i = 0; i < len; i++) {
            var app = listApps[i];
            var el = document.createElement('div');
            el.setAttribute('class', 'app');
            el.setAttribute('id', app.id);
            el.addEventListener('click', function () {
                window.location = app.url;
            });
            var img = document.createElement('img');
            img.setAttribute('src', app.iconURL);
            img.setAttribute('alt', app.description);

            var name = document.createElement('p');
            name.appendChild(document.createTextNode(app.name));

            el.appendChild(img);
            el.appendChild(name);

            frag.appendChild(el);
        }
        $("#apps").empty().append(frag.cloneNode(true));
    },
    /**
     * _appGetIconUrl
     *
     * For an app icons list, return the url to the biggest one
     * @param icons {Array } Icons of the app http://code.google.com/chrome/extensions/management.html#type-IconInfo
     * @return String The url of the icon
     * @private
     */
    _appGetBigIconUrl: function (icons) {
        var max = 0;
        var maxURL = null;
        var len = icons.length;
        for (var i = 0; i < len; i++) {
            var size = parseInt(icons[i].size, 10);
            if (size > max) {
                max = size;
                maxURL = icons[i].url;
            }
        }
        return maxURL;
    },
    launch: function (id) {
        if (id == 'chromeStore') {
            window.location = 'https://chrome.google.com/webstore';
        } else {
            chrome.management.launchApp(id);
        }
    }
};



var ATB = (function(ATB) {
/**
 * ATB.NewTab
 * responsible for displaying/event handling related to Most visited, recently closed section, and handling disable link click
 */
    ATB.NewTab = {
        backgroundPage: null,
        $mostVisitedNode: null,
        $recentlyClosedNode: null,
        init: function (bg, mostVisited, recentlyClosed) {
            ATB.NewTab.backgroundPage = bg;
            ATB.NewTab.$mostVisitedNode = mostVisited;
            ATB.NewTab.$recentlyClosedNode = recentlyClosed;
            chrome.tabs.onRemoved.addListener(ATB.NewTab.displayRecentlyClosed);
            ATB.NewTab.displayMostVisited();
            ATB.NewTab.displayRecentlyClosed ();
        },
        displayMostVisited: function () {
            //get the history
            // http://code.google.com/chrome/extensions/history.html#method-search
            chrome.history.search({
                text: '',
                maxResults: 900000000
            }, function (arrHistoryItem) {
                var mostVisted = ATB.NewTab._getMostVisited (arrHistoryItem);
                ATB.NewTab._populateAreaWithList(mostVisted.filter(function (e) {
                    return e.visitCount != 0;
                }), ATB.NewTab.$mostVisitedNode);
            });
        },
        displayRecentlyClosed: function () {
            var a = ATB.NewTab.backgroundPage.ATB.Pref.getTabRecentClosed().slice(0);
            if (a && Array.isArray(a)) {
                ATB.NewTab._populateAreaWithList(a.reverse(), ATB.NewTab.$recentlyClosedNode);
            }
        },
        handleDisableLinkClick : function(e) {
            var bgPg = ATB.NewTab.backgroundPage;
            bgPg.ATB.Pref.setNewTabIsOn(false);
            if ($.browser.mozilla || navigator.appCodeName == "Envjs") {//Mozilla Firefox
                window.location.href = "about:newtab";
            } else {
                chrome.tabs.update({url:"chrome-internal://newtab/"});
            }
        },
        /**
         * Populates a given $node with elements from the list (with an <a> tag with <img> <label>)
         *
         * @param   list    The array of elements that have url/favicon etc defined
         * @param   $node    The node which needs to be populated with the elements
         * @return
         */
        _populateAreaWithList: function (list, $node) {
            var len = list.length;
            var frag = document.createDocumentFragment();
            for (var i = 0; i < len; i++) {
                var listItem = list[i];
//                console.log ($node.attr('id') + '-' + i + '] favIcon: ' + listItem.favIcon + ', icon: ' + listItem.icon);
                var url = listItem.url;
                var item = document.createElement('li');
                var link = document.createElement('a');

                link.setAttribute('href', url);

                //Set Image
                var favIcon = document.createElement('img');
                favIcon.setAttribute('class', 'favicon');
                favIcon.setAttribute('src', listItem.favIcon || ATB.NewTab._getDefaultFavIcon()(url));

                //set Label
                var label = document.createElement('label');
                var labelText = decodeURIComponent(listItem.title || listItem.name || url);
                if($.browser.webkit)
                    label.innerText = labelText;
                else if($.browser.mozilla)
                    label.innerHTML = labelText;

                link.appendChild(favIcon);
                link.appendChild(label);
                item.appendChild(link);
                frag.appendChild(item);
            }
            $node.empty().append(frag);
        },
        /**
         * Return a function that retrive default fav icon depending on browser
         */
        //XXX awin not sure this is a good idea.  ask aj.
        _getDefaultFavIcon: function () {
            if ($.browser.webkit) {
                return function (url) {
                    return (url ? ('chrome://favicon/' + url) : "");
                };
            }
            if ($.browser.mozilla || navigator.appCodeName == "Envjs") {//Mozilla Firefox
                var faviconService = Components.classes["@mozilla.org/browser/favicon-service;1"]
                                               .getService(Components.interfaces.nsIFaviconService);
                return function () {
                    return faviconService.defaultFavicon.spec;
                };
            }
            return undefined;
        },
        /**
         * Return an array containing the list of the most visited websites.
         */
        _getMostVisited: function (arrHistoryItem) {
            if ($.browser.mozilla || navigator.appCodeName == "Envjs") {//Mozilla Firefox
                return arrHistoryItem;
            }

            var temp = [];
            var nbItem = ATB.CONFIG.NEW_TAB.MOST_VISITED.NB;

            for (var i = 0; i < nbItem; i++) {
                temp.push({
                    visitCount: 0
                });
            }
            //save last postion in the temp array
            nbItem--;

            for (var i = arrHistoryItem.length - 1; i >=0; i--) {
                //we find a item which should be in the most visited list
                var item = arrHistoryItem[i];
                if (item.visitCount > temp[nbItem].visitCount) {
                    //we find his position in the array
                    var j;
                    for (j = 0; j < nbItem; j++) {
                        if (temp[j].visitCount < item.visitCount) {
                            break;
                        }
                    }
                    //we insert it at the right position
                    temp.splice(j, 0, {
                        title: item.title,
                        url: item.url,
                        visitCount: item.visitCount
                    });
                    //we truncate the list to keep the right length
                    temp.length = nbItem + 1;
                }
            }
            return temp;
        }
    };
    return ATB;
}(ATB || {}));
