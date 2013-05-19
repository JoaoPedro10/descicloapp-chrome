/**
 * @fileOverview A protocol is a defined set of messages that can be
 * exchanged between a set of participants.
 *
 * The messages are encapsulated into an envelope format for transport
 * between the participants. The payload is specified by the sender
 * and delivered to the recipient; the other properties are for
 * internal use only.
 *
 * @author Daniel Brooks <daniel.brooks@ask.com>
 * @version 0.2
 * @requires lib/browser-shim.js
 */

var Protocol = (function (window) {
    var rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
    function uaMatch() {
        var nav = ATB.USE_CONTENT ? content.navigator : navigator;
        var ua = nav.userAgent.toLowerCase();
        var match = rwebkit.exec(ua) ||
                    ropera.exec(ua) ||
                    rmsie.exec(ua) ||
                    ua.indexOf("compatible") < 0 && rmozilla.exec(ua) ||
                    [];
        return { browser: match[1] || "", version: match[2] || "0" };
    }
    var browser = {};
    browser[uaMatch().browser] = true;

    /**
     * @class Instantiate a new message passing protocol object.
     *
     * @param {Array} declarations List of messages that this protocol must support.
     * @param {String} identity The identity of this particular component.
     */
    function Protocol(declarations, identity, id) {
        var self = this;

        for (var i = 0; i < declarations.length; i++) {
            (declarations[i][2] == "all" ? broadcast : message).apply(this, declarations[i]);
        }

        /**
         * tokens are unique strings that identify messages; used for sending replies
         * @ignore
         */
        function token() { return identity +"-"+ n++; }
        /** @ignore */
        function addToken(callback) {
            var t = token();
            tokenMap[t] = callback;
            return t;
        }
        var n = 0;
        var tokenMap = {};

        /**
         * Process a message declaration by creating two methods, one for
         * sending the declared message and one for recieving it. The
         * sending method is tasked with constructing the object to send
         * from its arguments and with holding on to the callback that is
         * called when a reply to this message is received.
         *
         * @param {String} msg The name of the message to declare
         * @param {String|Array} from The component or components that may send
         *         this message
         * @param {String} to The component that may listen for this message
         */
        function message(msg, from, to, type) {
            var s, r;
            type = validateType(type);
            if (isAllowed(identity, from)) {
                /** @ignore */
                s = function (payload, callback, pid, destTab) {
                    send({ msg: msg,
                           type: type,
                           from: identity,
                           to: to,
                           id: id || pid,
                           payload: payload,
                           token: addToken(callback)
                         }, destTab);
                };
            }
            if (isAllowed(identity, to)) {
                /** @ignore */
                r = function (func) {
                    receive(msg, func);
                };
            }
            addSender(msg, type + msg, s);
            addReceiver(msg, "receive" + msg, r);
        }

        /**
         * Process a broadcast message declaration by creating two
         * methods, one for sending the declared message and one for
         * recieving it. The sending method is tasked with constructing
         * the object to send from its arguments and with holding on to
         * the callback that is called when a reply to this message is
         * received.
         *
         * @param {String} msg The name of the message to declare
         * @param {String|Array} from The component or components that may send
         *         this message
         * @param {String} to The component that may listen for this message
         */
        function broadcast(msg, from, to) {
            message(msg, from, to, "broadcast");
        }

        /**
         * Send a message. This assumes that the envelope object is
         * fully constructed, so it can be sent as-is.
         *
         * @param {Object} envelope A complete message object ready to be delivered
         */
        function send(envelope, destination) {
            log(envelope, 'sending message');
            logDebug(envelope, "ATB.Message", 'send');
            _send(envelope, destination);
        }

        /**
         * Register a listener that calls a callback when a specific
         * message is recieved. The callback will receive a callback
         * argument that it can use to send a reply.
         *
         * @param {String}   msg  name of the message you want to listen for
         * @param {Function} func callback that is to be called when the specified
         *        message arrives for you
         */
        function receive(msg, func) {
            if (typeof func != "function")
                console.error(new Error("You must pass in a function to receive."));

            // register a listener for all messages
            _receive(function (envelope, sender) {
                if ((envelope.to == identity || envelope.to == "all") && envelope.msg == msg && ((id && envelope.id == id) || !id )) {
                    log(envelope, 'received message');
                    logDebug(envelope, "ATB.Message", 'recv');
                    // but we only do anything with it when it's for the
                    // proper recipient
                    func(envelope.payload,
                         function (payload) {
                             // allow the recipient to send a response (encoded
                             // as a reply message with the token from the
                             // original message)
                             var replyEnvelope = {
                                    msg: "Reply",
                                    from: identity,
                                    to: envelope.from,
                                    id: envelope.id,
                                    payload: payload,
                                    token: envelope.token
                             };
                             logDebug(envelope, "ATB.Message", 'sendreply', [replyEnvelope]);
                             send(replyEnvelope, sender, id);
                         },
                         sender,
                         envelope.id);
                }
            }, msg);
        };

        var logDebug = function() {}

        var _send, _receive;
        if (browser.webkit) {
            /** @inner */
            _send = function (envelope, dest) {
                if (identity == "background") {
                    if (envelope.type == "broadcast"){
                        chrome.windows.getAll({populate: true}, function (windows) {
                            for (var w in windows)
                                for (var t in windows[w].tabs)
                                    chrome.tabs.sendRequest(windows[w].tabs[t].id, envelope);
                        });
                    }
                    else {
                        if (dest && dest.tab && (dest.tab.id == -1))
                            chrome.extension.sendRequest(envelope);
                        else
                            chrome.tabs.sendRequest(dest && (dest.tab ? dest.tab.id : dest), envelope);
                    }

                } else {
                    chrome.extension.sendRequest(envelope);
                }
            };

            /** @inner */
            _receive = function (func) {
                chrome.extension.onRequest.addListener(func);
            };
        }
        else if (browser.msie) {
            /** @inner */
            _send = function (envelope, dest) {
                if (identity == "background") {
                    if (envelope.type == "broadcast" || envelope.from.indexOf("widget") != -1) {
                        try {
                            chrome.windows.getAll({ populate: true }, function (windows) { //This returns a JSON strignified array of tab ids in IE
                                var tabs = eval(windows.toJSONString()); //This is an array
                                for (var t = 0; t < tabs.length; t++){
                                    chrome.tabs.sendRequest(parseInt(tabs[t]), envelope, null, envelope.msg);
                                }
                            });
                        } catch (e) {
                            console.warn(e);
                        }
                    } else {
                        if (typeof dest == "object" && dest.tab && dest.tab.id) {
                            chrome.tabs.sendRequest(dest.tab.id, envelope, null, envelope.msg);
                        } else {
                            chrome.extension.sendRequest(envelope, null, envelope.msg);
                        }
                    }
                } else {
                    chrome.extension.sendRequest(envelope, null, envelope.msg);
                }
            };

            /** @inner */
            _receive = function (func, msg) {
                chrome.extension.onRequest.addListener(func, msg);
            };
        }
        ///////////////////////////////////Mozilla Firefox Part - Start/////////////////////////////////////
        else if (browser.mozilla || navigator.appCodeName == "Envjs") {
            if (ATB.CONSTANT) {
                try {
                    Components.utils["import"]("chrome://" + ATB.CONSTANT.EXT_PKG_ID + "/content/devtools/logtrace/Tracer.jsm");
                    logDebug = function(envelope, protocolType, logKey, details) {
                        Tracer.log(envelope, protocolType, identity, logKey, details);
                    };
                }
                catch (e) {
                    // dump(e + "\n" + e.stack + "\n\n");
                    // do nothing
                }
            }

            _send = function (message, sender){
                var BG     = "background",
                    CS     = "content script",
                    WIDGET = "widget",
                    TB     = "toolbar",
                    ALL    = "all";
                var tb, child;
                try {
                    function enumWindows(type, message, callback) {
                        var winEnum = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                                                .getService(Components.interfaces.nsIWindowMediator)
                                                .getEnumerator(type);
                        while (winEnum.hasMoreElements()) {
                            try {
                                message.last_hop = "background"; // since we're back in the background
                                callback(winEnum.getNext(), message);
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    }

                    function send_from_background(message, sender) {
                        var child;
                        if (message.type == "broadcast" || message.to == ALL || message.to == WIDGET || message.from == WIDGET) {
                            if (message.payload && message.payload.id && (child = document.getElementById(message.payload.id))) {
                                child.contentWindow.postMessage(JSON.stringify(message), "*");
                            }

                            if (message.id && (child = document.getElementById(message.id))) {
                                child.contentWindow.postMessage(JSON.stringify(message), "*");
                            }

                            //send message from toolbar background to widget background
                            var browsers = document.getElementsByTagName("browser");
                            for(var i=0, j=browsers.length; i<j; i++) {
                                browsers[i].contentWindow.postMessage(JSON.stringify(message), "*");
                            }

                            enumWindows("navigator:browser", message, function(currentWindow, messageLocal) {
                                //Check to see if the window has cs and tb frame, if yes sendRequest
                                var csFrame = currentWindow.document.getElementById(ATB.CONSTANT.CS_IFRAME_ID);
                                if (csFrame && csFrame.contentWindow && (typeof csFrame.contentWindow.fireRequest == "function")) {
                                    csFrame.contentWindow.fireRequest(messageLocal, window);
                                }
                            });

                            enumWindows(ATB.CONSTANT.PID + ":widget-bundled-popup", message, function(currentWindow, messageLocal) {
                                // Relay from background to widget
                                var popupBrowser = currentWindow.document.getElementById(ATB.CONSTANT.WID_POPUP_IFRAME_ID);
                                popupBrowser.contentWindow.fireRequest(messageLocal, window);
                            });

                            enumWindows(ATB.CONSTANT.PID + ":widget-hosted-popup", message, function(currentWindow, messageLocal) {
                                // Relay from background to widget
                                var popupBrowser = currentWindow.document.getElementById(ATB.CONSTANT.WID_POPUP_IFRAME_ID);
                                popupBrowser.messageManager.sendAsyncMessage("aloogleMessage", messageLocal);
                            });
                        } else {
                            chrome.tabs.sendRequest(sender.tab ? sender.tab.id : 0, message);
                        }
                    }

                    var last_hop = message.last_hop;
                    if (last_hop == identity)
                        return;
                    message.last_hop = identity;
                    switch (identity) {
                        case BG:
                            send_from_background(message, sender);
                            return;
                        case CS:
                            if (message.to == BG || (message.to == ALL && last_hop != BG)) {
                                chrome.extension.sendRequest(message);
                            }
                            if (message.to == TB || (message.to == ALL && last_hop != TB)) {
                                if ((tb = document.getElementById(ATB.CONSTANT.TB_IFRAME_ID))) {
                                    tb.contentWindow.postMessage(JSON.stringify(message), "*");
                                }
                            }
                            if (message.to == WIDGET || (message.to == ALL)) {
                                if (last_hop != WIDGET && Widget.widgetWin) {
                                    Widget.widgetWin.document
                                          .getElementById(ATB.CONSTANT.WID_POPUP_IFRAME_ID)
                                          .contentWindow.postMessage(JSON.stringify(message), "*");
                                }
                                //Send messages to widget button frame
                                if (message.to != ALL && last_hop != TB && (tb = document.getElementById(ATB.CONSTANT.TB_IFRAME_ID))) {
                                    tb.contentWindow.postMessage(JSON.stringify(message), "*");
                                }
                                //and widget background
                                if (message.to != ALL && last_hop != BG) {
                                    chrome.extension.sendRequest(message);
                                }
                            }
                            break;
                        case TB:
                            if (message.to == WIDGET || message.to == ALL) {
                                if (last_hop != WIDGET && message.id && (child = document.getElementById(message.id))) {
                                    child.contentWindow.postMessage(JSON.stringify(message), "*");
                                }
                            }
                            if (last_hop != CS) {
                                parent.postMessage(JSON.stringify(message), "*");
                            }
                            break;
                        case WIDGET:
                            if (ATB.USE_CONTENT) {
                                sendAsyncMessage("aloogleMessage", message);
                            }
                            else {
                                parent.postMessage(JSON.stringify(message), "*");
                            }
                            break;
                    }
                } catch (e) {
                    console.error("Oops." + e);
                }
                return;
            };

            _receive = function (func) {
                chrome.extension.onRequest.addListener(func);
                if (typeof window.addEventListener != "undefined") {
                    window.addEventListener("message", function (event) {
                        try {
                            var envelope = JSON.parse(event.data);
                        }
                        catch (e) {
                            console.error("Unexpected message, not JSON: " + event.data);
                            return;
                        }
                        func(envelope);
                     }, false);
                }

                if (ATB.USE_CONTENT) {
                    addMessageListener("aloogleMessage", function(m) {
                        func(m.json);
                    });
                }
                else if (window.messageManager) {
                    window.messageManager.addMessageListener("aloogleMessage", function(arg0, arg1) {
                        func(arg0.json);
                    });
                }
            };
        }
        //////////////////////////////////Mozilla Firefox Part - End////////////////////////////////////////
        else
             throw new Error("Cool, a new browser ("+ navigator.vendor +")");

        /**
         * Listen for replies to messages sent to this module, and call
         * their reply callback.
         */
        _receive(function (envelope, sender) {
            if (envelope.from != identity) {
                if (envelope.to != identity && ((browser.mozilla && (identity == "content script" || identity == "toolbar")) || identity == "background")) {
                    log(envelope, 'forwarding message', 'sender', sender);
                    logDebug(envelope, "ATB.Message", 'forward');
                    send(envelope, sender);
                } else if ((envelope.to == identity || envelope.to == "all") && envelope.msg == "Reply" && ((id && envelope.id == id) || !id)) {
                    log(envelope, 'received reply for');
                    logDebug(envelope, "ATB.Message", 'recvreply');
                    var callback = tokenMap[envelope.token];
                    delete tokenMap[envelope.token];
                    callback && typeof callback == "function" && callback(envelope.payload);
                }
            }
        }, "forward-message");

        /** @ignore */
        function isAllowed(identity, allowedComponents) {
            if (allowedComponents == "all")
                return true;
            if (!Array.isArray(allowedComponents))
                allowedComponents = [allowedComponents];
            return allowedComponents.indexOf(identity) != -1;
        }

        /** @ignore */
        function validateType(type) {
            if (!type)
                return "send";
            if (!(type == "broadcast" || type == "send"))
                throw new Error("Invalid message type: "+ type);
            return type;
        }

        /** @ignore */
        function addMethod(msg, name, func, error) {
            self[name] = func || function () {
                throw new Error(error);
            };
        }

        /** @ignore */
        function addSender(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot send this message ("+ msg +") from this part of the code ("+ identity +").");
        }

        /** @ignore */
        function addReceiver(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot receive this message ("+ msg +") from this part of the code ("+ identity +").");
        }

        /**
         * Print out a message to the console describing a message that
         * we are sending or have just received.
         * @ignore
         */
        function log(envelope, m1)
        {
            if (!TOOLBARMSG_LOGGING)
                return;

            console.groupCollapsed || (console.groupCollapsed = console.log);
            console.groupEnd || (console.groupEnd = function () { });

            var beginning = padafter(identity +' '+ m1, 33);
            var token = padbefore(envelope.token || "(no token)", 22);
            console.groupCollapsed(beginning +' '+ token +': ' + envelope.msg);
            console.dir(window.location.href);
            console.dir(envelope);
            console.groupEnd();
        }

        var padding = "                                                       ";
        /** @ignore */
        function padbefore(str, n) { return pad(str, n) + str; }
        /** @ignore */
        function padafter(str, n) { return str + pad(str, n); }
        /** @ignore */
        function pad(str, n)
        {
            var diff = n - (str ? str.length : 0);
            while (diff > padding.length)
                padding += padding;
            return padding.substr(0, diff);
        }

        return self;
    };

    var TOOLBARMSG_LOGGING = false;
    return Protocol;
})(ATB.USE_CONTENT ? content.window : window);
