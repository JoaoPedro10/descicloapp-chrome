// ATB.Message was already initialized in background.html
ATB.localStorage   = new ATB_LocalStorage();
ATB.Pref           = new ATB_Pref();
ATB.Tabs           = new ATB_Tabs();
ATB.Search         = new ATB_Search();
ATB.BrowserAction  = new ATB_BrowserAction();
ATB.History        = new ATB_History();
ATB.Cookies        = new ATB_Cookies();
if ($.browser.mozilla) {
    ATB.KeywordSearch  = new ATB_KeywordSearch();
}
ATB.Lifecycle      = new ATB_Lifecycle();
ATB.Popup          = new ATB_Popup();
if ($.browser.webkit)
    ATB.SideBySide = new ATB_SideBySide();

var browser = $.browser.msie ? "IE" : ($.browser.webkit ? "CR" : "FF");
function isBrowserSupported(element, index, array) {
    if(element.browsers)
        return element.browsers.indexOf(browser) != -1;
    return true;
}

function isTargetBrowser() {
    try {
        var trgb = ATB.localStorage.get("trgb");
        return ((!trgb) || (trgb.indexOf ($.browser.msie ? "IE" : ($.browser.webkit ? "CR" : "FF")) > -1));
    }
    catch (e) {
        return true;
    }
}

function setupWidget(widget) {
    if(isBrowserSupported(widget)) {
        ATB.CONFIG.widgetsByID[widget.id] = widget;
        if (widget.background) {
            var url = ATB.Utils.buildURL($.extend(true, { },
                                                  widget.background.url,
                                                  { params: { "partner_id": ATB.CONSTANT.PID }}),
                                         widget.basepath);
            if (!$.browser.mozilla) {
                $("<iframe>", { src: url, id: widget.id }).appendTo("body");
            } else {
                var bundled = url.indexOf("http://") == -1;
                var browser = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul","browser");
                browser.setAttribute("id", widget.id);
                if(!bundled)
                    browser.setAttribute("type", "content");
                browser.setAttribute("src", url);
                document.documentElement.appendChild(browser);
                var injected = false;
                function injectFrameScripts(){
                    //Inject FS into http widget background
                    if (!bundled && !injected) {
                        function loadCS(file) {
                            browser.messageManager.loadFrameScript("chrome://apn-"+ ATB.CONSTANT.PID +"-toolbar/content/"+ file, true);
                        }
                        loadCS("toolbar/lib/constant.js");
                        loadCS("toolbar/lib/default-config.js");
                        loadCS("toolbar/lib/protocol.js");
                        loadCS("toolbar/lib/tb-message.js");
                        loadCS("toolbar/lib/widget-messaging.js");
                        loadCS("toolbar/content_script/inline-html.js");
                    }
                    injected = true;
                }
                browser.addEventListener("load", injectFrameScripts, true);
            }
        }
    }
}

function updateLocale(locale) {
    ATB.Pref.setLocale(locale);
    ATB.Message.broadcastUpdateLocale(locale);
}
function updateLang(lang) {
    ATB.Pref.setLang(lang);
    ATB.Message.broadcastUpdateLang(lang);
}

ATB.CONFIG.leftDock.forEach(setupWidget);
ATB.CONFIG.centerDock.forEach(setupWidget);
ATB.CONFIG.rightDock.forEach(setupWidget);

ATB.Feeds          = new ATB_Feeds();

ATB.Message.receiveGetTabId(function (message, sendResponse, sender) {
   // alert("Got the request from tab : " + sender.tab.id);
    sendResponse(sender.tab.id);
});

ATB.Message.receiveGetToolbarStatus(function (message, sendResponse, sender) {
    chrome.windows.get(sender.tab.windowId, function (win) {
        sendResponse({
            id: ATB.CONSTANT.PID,
            visible: ATB.Pref.getTbIsVisible() && win.type == "normal"
        });
    });
});

ATB.Message.receiveAjaxRequest(function (url, sendResponse) {
    $.ajax(url, { dataType: "text",
                  timeout: 5000,
                  error: function (xhr, error_message) {
                             sendResponse({ status: xhr.status });
                         },
                  success: function (data, status_message, xhr) {
                               sendResponse({ status: xhr.status,
                                              content: data
                                            });
                           }
                });
});

// only the background can call getURL
ATB.Message.receiveCheckWidgetURL(function (message, sendResponse) {
    if (!message.url && !message.basepath) //Send fail only if both are not present
        sendResponse();

    // we will pass the default reporting params to every widget
    message.url.params = message.url.params || {};
    $.extend(message.url.params, {reporting: JSON.stringify(UR.reportingParams())});

    sendResponse(ATB.Utils.buildURL(message.url, message.basepath));
});

//This will be called for FF only
ATB.Message.receiveDNSHandlerCheck(function (message, sendResponse) {
                                       sendResponse({ shouldSetDNS: (ATB.Registry.getDefaultSearchPartnerID() == ATB.CONSTANT.PID && ATB.Registry.getSAEnabled() && isTargetBrowser()),
                                                      dnsUrl: ATB.Utils.buildURL(ATB.CONFIG.DNS_URL)
                                                   });
                                   });

ATB.Message.receiveUpdatePrefs(function(prefs_obj, sendResponse){
    if (!prefs_obj[ATB.CONSTANT.PREF.LOCALE] ||
         prefs_obj[ATB.CONSTANT.PREF.LOCALE] !== ATB.Pref.getLocale()) {
        updateLocale(prefs_obj[ATB.CONSTANT.PREF.LOCALE]);
    }
    if (!prefs_obj[ATB.CONSTANT.PREF.LANG] ||
         prefs_obj[ATB.CONSTANT.PREF.LANG] != ATB.Pref.getLang()) {
        updateLang(prefs_obj[ATB.CONSTANT.PREF.LANG]);
    }
    ATB.Pref.setDisplaySearchHistory (prefs_obj[ATB.CONSTANT.PREF.DISPLAY_SEARCH_HISTORY]);
    ATB.Pref.setClearSearchOnClose(prefs_obj[ATB.CONSTANT.PREF.CLEAR_SEARCH_ON_CLOSE]);

    //Set/Reset the SA(kw/dns) in FF/IE if the SA_ENABLED is changed
    var shouldSetSA = prefs_obj[ATB.CONSTANT.PREF.SA_ENABLED];
    if (($.browser.mozilla || $.browser.msie) &&
        (!shouldSetSA || (shouldSetSA !== ATB.Registry.getSAEnabled()))) {
        try {
            ATB.Registry.setSA(shouldSetSA);
        }
        catch (e) {
            console.error(e);
        }
    }

    //set/reset HPG_DISABLE (only for IE)
    var hpgdisable = ATB.Registry.getHpgdisable();
    if (hpgdisable !== null) {
        var newHpgdisable = prefs_obj["hpgdisable"];
        if ( newHpgdisable !== hpgdisable ) {
            ATB.Registry.setHpgdisable(newHpgdisable);
        }
    }

    //set/reset registry for newTab feature
    var ntgdisable = ATB.Registry.getNtgdisable();
    if (ntgdisable !== null) {
        var new_ntgdisable = prefs_obj["ntgdisable"];
        if ( new_ntgdisable !== ntgdisable ) {
            ATB.Registry.setNtgdisable(new_ntgdisable);
        }
    }

    //set/reset registry for default search feature
    var dsgdisable = ATB.Registry.getDsgdisable();
    if (dsgdisable !== null) {
        var new_dsgdisable = prefs_obj["dsgdisable"];
        if ( new_dsgdisable !== dsgdisable ) {
            ATB.Registry.setDsgdisable(new_dsgdisable);
        }
    }
    sendResponse(true);
});

ATB.Message.receiveAreYouStillThere(function (message, sendResponse) {
                                        sendResponse(true);
                                    });

ATB.Message.receiveLaunchApp(function (message, sendResponse) {
    try {
        sendResponse(ATB.Registry.launchApp(message));
    }
    catch (e) {
        console.error(e);
        sendResponse(false);
    }
});

ATB.Message.receiveGetConfigData(function (items, sendResponse, sender, id) {
                                       var data = {};
                                       if (!Array.isArray(items))
                                           items = [items];
                                       var widget = ATB.CONFIG.widgetsByID[id];
                                       items.forEach(function (item) {
                                           if (typeof widget.data != "object") {
                                               data[item] = undefined;
                                           }
                                           else {
                                               data[item] = ATB.CONFIG.widgetsByID[id].data[item];
                                           }
                                       });
                                       sendResponse(data);
                                   });

ATB.Message.receiveSetStoredData(function (object, sendResponse, sender, id) {
    for(key in object) { ATB.localStorage.set(key, object[key]); }
    sendResponse(object);
});

ATB.Message.receiveGetStoredData(function (key, sendResponse, sender, id) {
    sendResponse( ATB.localStorage.get(key) );
});

// reports button clicks
ATB.Message.receiveButtonClick(function(message, sendResponse) {
    if(message.buttonPosition) {
        UR.buttonClick(message.buttonName, message.buttonPosition);
    }
    else {
        ATB.Message.broadcastGetButtonPositionIndex(message.buttonName, function(buttonPosition) {
            UR.buttonClick(message.buttonName, buttonPosition);
        });
    }
});

// toolbar ressource loaded, tell the world about that !
ATB.BrowserAction.updateIcon();

if ($.browser.mozilla)
    ATB.Message.broadcastBGInitialized(null);

//-- google chrome API does not have unload event, thus, using load event
$(window).load(function() {
    if (ATB.Pref.getClearSearchOnClose())
        ATB.Pref.setSearchHistory([]);

    // Phone Home reporting Call
    var phoneHomeTimer = new ATB.Utils.LongTimer("phoneHomeTimeStamp", UR.phoneHome, ATB.Utils.LongTimer.ONE_DAY);
});

ATB.Message.receiveOpenWidget(function (opts, sendResponse, sender) {
    ATB.Message.sendCloseDropdownWidget(null, function() {
        var w;
        if ((w = ATB.CONFIG.widgetsByID[opts.id].windows[opts.win])) {
            // if a state is passed to openWindow, we will serialize it as a query param
            if(opts.state)
                w.url.params = $.extend({}, w.url.params, {state: JSON.stringify(opts.state)});

            if (w.type == "dialog")
                ATB.Message.sendOpenDropdownWidget({ id: opts.id,
                                                     win: w,
                                                     position: null },
                                                   sendResponse, null, sender);
            else
                ATB.Popup.checkStatus({ id: opts.id, // no need to send a message to ourselves
                                        win: w },    // just call the thing directly
                                      sendResponse,
                                      sender);
        }
    }, null, sender);
});
