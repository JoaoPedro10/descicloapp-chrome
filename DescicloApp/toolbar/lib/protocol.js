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
    function Protocol(declarations, identity, id) {
        var self = this;

        for (var i = 0; i < declarations.length; i++) {
            (declarations[i][2] == "all" ? broadcast : message).apply(this, declarations[i]);
        }
        function token() { return identity +"-"+ n++; }
        function addToken(callback) {
            var t = token();
            tokenMap[t] = callback;
            return t;
        }
        var n = 0;
        var tokenMap = {};
        function message(msg, from, to, type) {
            var s, r;
            type = validateType(type);
            if (isAllowed(identity, from)) {
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
                r = function (func) {
                    receive(msg, func);
                };
            }
            addSender(msg, type + msg, s);
            addReceiver(msg, "receive" + msg, r);
        }
        function broadcast(msg, from, to) {
            message(msg, from, to, "broadcast");
        }
        function send(envelope, destination) {
            _send(envelope, destination);
        }
        function receive(msg, func) {
            _receive(function (envelope, sender) {
                if ((envelope.to == identity || envelope.to == "all") && envelope.msg == msg && ((id && envelope.id == id) || !id )) {
                    log(envelope, 'received message');
                    logDebug(envelope, "ATB.Message", 'recv');
                    func(envelope.payload,
                         function (payload) {
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
            _receive = function (func) {
                chrome.extension.onRequest.addListener(func);
            };
        }
        else if (browser.msie) {}
        else if (browser.mozilla) {}
        else
             throw new Error("Cool, a new browser ("+ navigator.vendor +")");
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
        function isAllowed(identity, allowedComponents) {
            if (allowedComponents == "all")
                return true;
            if (!Array.isArray(allowedComponents))
                allowedComponents = [allowedComponents];
            return allowedComponents.indexOf(identity) != -1;
        }
        function validateType(type) {
            if (!type)
                return "send";
            if (!(type == "broadcast" || type == "send"))
                throw new Error("Invalid message type: "+ type);
            return type;
        }
        function addMethod(msg, name, func, error) {
            self[name] = func || function () {
                throw new Error(error);
            };
        }
        function addSender(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot send this message ("+ msg +") from this part of the code ("+ identity +").");
        }
        function addReceiver(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot receive this message ("+ msg +") from this part of the code ("+ identity +").");
        }
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
        function pad(str, n)
        {}

        return self;
    };

    var TOOLBARMSG_LOGGING = false;
    return Protocol;
})(ATB.USE_CONTENT ? content.window : window);
