ATB.localStorage   = new ATB_LocalStorage();
ATB.Pref           = new ATB_Pref();
ATB.Tabs           = new ATB_Tabs();
ATB.BrowserAction  = new ATB_BrowserAction();
ATB.Lifecycle      = new ATB_Lifecycle();
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
                            browser.messageManager.loadFrameScript("chrome://aloogle-"+ ATB.CONSTANT.PID +"-toolbar/content/"+ file, true);
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

ATB.Message.receiveGetToolbarStatus(function (message, sendResponse, sender) {
    chrome.windows.get(sender.tab.windowId, function (win) {
        sendResponse({
            id: ATB.CONSTANT.PID,
            visible: ATB.Pref.getTbIsVisible() && win.type == "normal"
        });
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

// toolbar ressource loaded, tell the world about that !
ATB.BrowserAction.updateIcon();