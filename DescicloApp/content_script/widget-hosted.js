/**
 * 
 * @fileOverview This connects widgets living remotely (and sandboxed) to the privileged toolbar code, by
 * injecting "frame scripts" into Mozilla's XUL browser.  The browser has type="content".  Frame scripts
 * run privileged (so it's like a bundled widget with regards to protocols).
 * 
 * @requires lib/constant.js
 */
function handleLoad() {
    browser.addEventListener("DOMContentLoaded", injectFrameScripts, true);
    browser.setAttribute('src', window.arguments[0]);
    window.blur();
}

if (window.arguments[1]) {
    document.documentElement.setAttribute("hidechrome", true);
}

function injectFrameScripts(evt) {
    /* We add this because sometimes the window loads a new document, which has the side effect of
     * destroying frame scripts we've already injected.  So we have to inject them again. */
    if (evt.target == browser.contentDocument) {
        MM.addMessageListener("APNMessage", function(arg0, arg1) {
            parent.opener.postMessage(JSON.stringify(arg0.json), "*");
        });

        loadCS("lib/constant.js");
        loadCS("lib/default-config.js");
        loadCS("lib/browser-shim.js");
        loadCS("lib/protocol.js");
        loadCS("lib/tb-message.js");
        loadCS("lib/widget-messaging.js");
        loadCS("content_script/inline-html.js");
    }
}

var browser = document.getElementById("apn-popup-iframe");
var MM = browser.messageManager;
function loadCS(path) {
    MM.loadFrameScript("chrome://apn-" + ATB.CONSTANT.PID + "-toolbar/content/" + path, true);
}

addEventListener("message", function (event) {
    var child = browser.contentWindow;
    if (JSON.parse(event.data).from == "widget")
        parent.opener.postMessage(event.data, "*");
    else
        child.postMessage(event.data, "*")
}, false);
