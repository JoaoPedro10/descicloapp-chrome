var CS_SHOULD_RUN = ATB.USE_CONTENT ||
                    location.protocol == "chrome-extension:" ||
                    location.protocol == "chrome:" ||
                    location.protocol == "file:" ||
                    (location.hostname in ATB.CONFIG.AUTHORIZED_DOMAIN &&
                     /(?:&|\?)partner_id=ATU-SAT(?:&|\?|$)/.test(location.search));
if (CS_SHOULD_RUN) {
/**
* @fileOverview Defines a message passing protocol for use between
* widgets and the toolbar, including handling of intrawidget
* messages. This class exports two functions for each defined
* message, one for the sender to call and the other for the receiver.
*
* @author Daniel Brooks <daniel.brooks@ask.com>
* @version 0.3
*/

(function (window) {
    var document = window.document;
    function ensureFrame(id) {
        var frame = document.getElementById(id);
        if (!frame) {
            frame = document.createElement("iframe");
            frame.setAttribute("id", id);
            frame.setAttribute("style", "display: none;");
            if (document.body)
                document.body.appendChild(frame);
            else
                document.documentElement.appendChild(frame);
        }
    }
    ensureFrame("toWidget");
    ensureFrame("toToolbar");

    var logDebug = function() {};
    (function() {
		// This should only be executed for FF
		if(ATB.USE_CONTENT) {
			try {
				Components.utils["import"]("chrome://" + ATB.CONSTANT.EXT_PKG_ID + "/content/devtools/logtrace/Tracer.jsm");
				logDebug = function(envelope, protocolType, identity, logKey, details) {
					Tracer.log(envelope, protocolType, identity, logKey, details);
				};
			} catch (e) {
            // do nothing
			}
		}
    })();

    /**
    * @class Protocol declaring all the messages that any of the widget
    * components can send to the toolbar, or that the toolbar can send to
    * the widget components.
    * @extends Protocol
    *
    * @param {String} identity Must be either "toolbar" or "widget", depending on
    *        which part of the system you are writing.
    */
    window.Toolbar_Messaging = function Toolbar_Messaging(identity, widget) {
        var WIDGET = "widget",
            TB = "toolbar",
            ALL = "all";

        var decls = [
            /**
            * (WIDGET → TB) Change the location of the current tab to a new url.
            *
            * @name sendNavigateCurrentTab
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} url
            */
            ["Navigate", WIDGET, TB],
        
            /**
            * (WIDGET → TB) Change the location of the current tab to a new url.
            *
            * @name sendNavigateCurrentTab
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} url
            */
            ["NavigateCurrentTab", WIDGET, TB],

            /**
            * (WIDGET → TB) open a new tab and browse to the url in it.
            *
            * @name sendNavigateNewTab
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} url
            */
            ["NavigateNewTab", WIDGET, TB],

            /**
            * (WIDGET → TB) open a new window and browse to the url in it.
            *
            * @name sendNavigateNewWindow
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} url
            */
            ["NavigateNewWindow", WIDGET, TB],

            /**
            * (WIDGET → TB) Retrieve the value of one or more config
            * variables. Replies back to the sender with an object
            * mapping the requested keys to the configured values.
            *
            * @name sendGetConfigData
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String|Array} variables Either a string or an array of
            *        strings containing the names of the variables to retrieve.
            * @param {Function} callback
            * @return {Object} An object mapping variable names to
            *         variable values.
            */
            ["GetConfigData", WIDGET, TB],

            /**
            * (WIDGET → TB) Retrieve the value of one or more stored
            * variables. Replies back to the sender with an object
            * mapping the requested keys to the stored values.
            *
            * @name sendGetStoredData
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String|Array} variable(s) Either a string or an array of
            *        strings containing the names of the variables to retrieve.
            * @param {Function} callback
            * @return {Object} An object mapping variable names to
            *         variable values.
            */
            ["GetStoredData", WIDGET, TB],

            /**
            * (WIDGET → TB) Set the value of one or more variables in a persistent store.
            *
            * @name sendSetStoredVariable
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {Object} variables An object whose properties are the names
            *        of the variables to store and whose values are the values of
            *        those variables.
            */
            ["SetStoredData", WIDGET, TB],

            /**
            * (WIDGET → TB) Load a resource from the web. No restrictions
            * are placed on the url scheme, port, host or path of the url
            * but neither are there any requirements either. The
            * expectation is that it will support whatever types of
            * remote urls the host browser supports, which at present are
            * http, https and ftp. The load must not be subject to any
            * cross-origin checks.
            *
            * Replies back to the sender with an object containing
            * 'status' and 'content' properties. The 'status' property
            * should contain HTTP result codes or undefined if there was
            * some other error (a timeout, fo rexample). The 'content'
            * property should hold a string containing the content of the
            * response.
            *
            * @name sendAjaxRequest
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} url An absolute url specifying the resource
            *        to load.
            * @param {Function} callback
            * @return {String} A string containing the body of the
            *         HTTP response document.
            */
            ["AjaxRequest", WIDGET, TB],

            /**
            * (WIDGET → TB) Resize the widget window to the specified width and height.
            *
            * @name sendSetWidgetWindowSize
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {Object} size An object with width and height properties
            *        whose values are numbers in css pixels.
            */
            ["SetWidgetWindowSize", WIDGET, TB],
            
            ["ResizeDropdownWidget", WIDGET, TB],

            /**
            * (WIDGET → TB) Request that the toolbar open the widget window.
            *
            * @name sendOpenWidgetWindow
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {Object} params ...
            */
            ["OpenWidgetWindow", WIDGET, TB],
            ["OpenWidget", WIDGET, TB],

            /**
            * (WIDGET → TB) Request that the toolbar close the widget window.
            *
            * @name sendCloseWidgetWindow
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} name
            */
            ["CloseWidgetWindow", WIDGET, TB],
            ["CloseDropdownWidget", WIDGET, TB],

            /**
            * (WIDGET → TB) Log an error condition or message in a way
            * that is visible to widget and toolbar developers.
            *
            * @name sendLogError
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {Object} message
            */
            ["LogError", WIDGET, TB],

            /**
            * (WIDGET → TB) Launch a native application.
            *
            * @name sendLaunchApp
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} pathname
            * @param {Function} callback
            * @return {Number} Exit status of the application.
            */
            ["LaunchApp", WIDGET, TB],

            /**
            * (WIDGET → TB) Register a content script to be run in the
            * context of the page in the current tab.
            *
            * @name sendAddContentScript
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {String} url
            */
            ["AddContentScript", WIDGET, TB],

            /**
            * (TB → WIDGET) Tell the widget that the user navigated to a
            * new page in the current tab.
            *
            * @name receiveNavigated
            * @memberof Toolbar_Messaging#
            * @function
            * @public
            * @param {Function} callback
            * @return {String} The url loaded. Without query parameters?
            */
            ["Navigated", TB, WIDGET],
            ["ActiveTabChanged", TB, WIDGET],

            ["IntrawidgetMessage", ALL, ALL],

            ["ButtonClick", WIDGET, TB],
            ["GetCurrentUrl", WIDGET, TB]
        ];

        return new window.WidgetProtocol(decls, identity, widget);
    };

    /**
    * @class Protocol declaring all the messages that may be sent and
    * received by the various components of a single widget.
    * @extends IntrawidgetProtocol
    *
    * @param {String} component Must be either "widget window", "widget
    *        background", "widget content script" or "widget button",
    *        depending on which widget component you are writing.
    */
    window.DynamicButtonProtocol = function DynamicButtonProtocol(component, widget) {
        // the different widget components that can send and receive messages
        var WINDOW = "widget window",
            BACKGROUND = "widget background",
            CONTENTSCRIPT = "widget content script",
            BUTTON = "widget button",
            ALL = "all";

        var decls = [
       /**
        * ([WINDOW, BACKGROUND] → BUTTON) Augment the
        * widget button displays. A small badge icons will
        * be added to the upper right hand corner of the button
        * with the string provided via the parmeter..
        *
        * @name SetBage
        * @memberof DynamicButtonProtocol#
        * @function
        * @public
        * @param {String} text to be displayed in the form of a Badge, or removed if text is undefined
        */
            ["SetBadge", [WINDOW, BACKGROUND], BUTTON],
        /**
        * ([WINDOW, CONTENTSCRIPT, BACKGROUND] → BUTTON) Change the
        * icon that the widget button displays. If the url argument
        * is relative, it is interpreted as relative to the base path
        * specified in the widget configuration.
        *
        * @name sendSetButtonIcon
        * @memberof DynamicButtonProtocol#
        * @function
        * @public
        * @param {String} url Url of the image to load
        */
            ["SetButtonIcon", [WINDOW, CONTENTSCRIPT, BACKGROUND], BUTTON],

        /**
        * ([WINDOW, CONTENTSCRIPT, BACKGROUND] → BUTTON) Change the
        * text label that the widget button displays
        *
        * @name sendSetButtonLabel
        * @memberof DynamicButtonProtocol#
        * @function
        * @public
        * @param {String} label
        */
            ["SetButtonLabel", [WINDOW, CONTENTSCRIPT, BACKGROUND], BUTTON],
            ["ButtonClicked", BUTTON, [WINDOW, CONTENTSCRIPT, BACKGROUND]],
        // more messages here…

        /**
        * ([WINDOW, CONTENTSCRIPT, BACKGROUND] → BUTTON) Change any of
        * the button properties defined in the config file.
        *
        * @name sendSetButtonState
        * @memberof DynamicButtonProtocol#
        * @function
        * @public
        * @param {Object} params
        */
            ["SetButtonState", [WINDOW, CONTENTSCRIPT, BACKGROUND], BUTTON],

        /**
        * (BUTTON → BACKGROUND) Called by the button before it renders
        * itself to see if the widget background wants to override any of
        * the button properties defined in the config file.
        *
        * @name sendGetButtonUiState
        * @memberof DynamicButtonProtocol#
        * @function
        * @public
        * @param {Function} callback
        */
            ["GetButtonState", BUTTON, BACKGROUND]

        ];
        return window.attachEvent ? new Protocol(decls, component, widget) : new window.IntrawidgetProtocol(decls, component, widget);
    };

    /**
    * @class Instantiate a new message passing protocol object
    * specifically for messages passed between the widget and the
    * toolbar. Differs from {@link Protocol} only in that messages are
    * passed via iframes rather than internal browser apis. The message
    * is first wrapped in an envelope addressed to another widget
    * component, and that is then wrapped in another envelope which is
    * addressed to be delivered by the toolbar to all components of this
    * widget.
    * @extends Protocol
    *
    * @param {Array} declarations List of messages that this protocol must support.
    * @param {String} identity The identity of this particular component.
    */
    window.WidgetProtocol = function WidgetProtocol(declarations, identity, widget) {
        var self = this;

        for (var i = 0; i < declarations.length; i++) {
            (declarations[i][2] == "all" ? broadcast : message).apply(this, declarations[i]);
        }

        /**
        * tokens are unique strings that identify messages; used for sending replies
        * @ignore
        */
        function token() {
            return identity + "-" + n++;
        }

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
                s = function (payload, callback, destTab) {
                    if (typeof payload == "function" && (callback && typeof callback == "number")) {
                        destTab = callback;
                        callback = payload;
                    }
                    send({ msg: msg,
                        type: type,
                        from: identity,
                        to: to,
                        id: widget,
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
        function send(envelope) {
            log(identity, envelope, 'sending message');
            logDebug(envelope, "WidgetProtocol", identity, 'send');
            _send(envelope);
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
            _receive(function (envelope) {
                if ((envelope.to == identity || envelope.to == "all") && envelope.msg == msg) {
                    // but we only do anything with it when it's for the
                    // proper recipient
                    log(identity, envelope, 'received message');
                    logDebug(envelope, "WidgetProtocol", identity, 'recv');
                    func(envelope.payload,
                         function (payload) {
                             var replyEnvelope = {
                                 msg: "Reply",
                                 from: identity,
                                 to: envelope.from,
                                 payload: payload,
                                 token: envelope.token
                             };
                             logDebug(envelope, "WidgetProtocol", identity, 'sendreply', [replyEnvelope]);
                             // allow the recipient to send a response (encoded
                             // as a reply message with the token from the
                             // original message)
                             send(replyEnvelope);
                         },
                         envelope.id);
                }
            });
        };

        var _send, _receive;

        var sendFrame = document.getElementById(identity == "toolbar" ? "toWidget" : "toToolbar"),
            receiveFrame = document.getElementById(identity == "toolbar" ? "toToolbar" : "toWidget");

        /** @inner */
        _send = function (envelope) {
            // convert an envelope into a url
            var params = [];
            for (var p in envelope) {
                var v = (p == "payload") ? JSON.stringify(envelope[p]) : envelope[p];
                params.push(p + "=" + encodeURIComponent(v));
            }
            var url = params.join("&");
            window.setTimeout(function () {
                logDebug(envelope, "WidgetProtocol", identity, 'sendTimeout');
                if ("fireEvent" in sendFrame)
                    sendFrame.src = "about:blank?" + url;
                else {
                    sendFrame.setAttribute("envelope", url);
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("load", false, true);
                    sendFrame.dispatchEvent(evt);
                }
            }, 0);
        };
        /** @inner */
        _receive = function (func) {
            function frameListener(event) {
                // convert the url back into an envelope
                var url;
                try {
                    url = this.getAttribute("envelope");
                } catch (x) {
                    if (!url && "srcElement" in event)
                        url = event.srcElement.src.split("?")[1];
                }
                if (!url) return false;
                var params = url.split('&'), envelope = {};
                params.forEach(function (param) {
                    var t = param.split('='),
                        v = decodeURIComponent(t[1]);
                    envelope[t[0]] = (t[0] == "payload") ? (v == "undefined" ? undefined
                                                                             : JSON.parse(v))
                                                         : v;
                });
                func(envelope);
                return false;
            }
            return receiveFrame.attachEvent ? receiveFrame.attachEvent("onload", frameListener, true)
                                            : receiveFrame.addEventListener("load", frameListener, true);
        };

        /**
        * Listen for replies to messages sent to this module, and call
        * their reply callback.
        */
        _receive(function (envelope) {
            if ((envelope.to == identity || envelope.to == "all") && envelope.msg == "Reply") {
                log(identity, envelope, 'received reply for');
                logDebug(envelope, "WidgetProtocol", identity, 'recvreply');
                var callback = tokenMap[envelope.token];
                delete tokenMap[envelope.token];
                callback && typeof callback == "function" && callback(envelope.payload);
            }
        });

        /** @ignore */
        function addMethod(msg, name, func, error) {
            self[name] = func || function () {
                throw new Error(error);
            };
        }

        /** @ignore */
        function addSender(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot send this message (" + msg + ") from this part of the code (" + identity + ").");
        }

        /** @ignore */
        function addReceiver(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot receive this message (" + msg + ") from this part of the code (" + identity + ").");
        }

        return self;
    };

    /**
    * @class Instantiate a new message passing protocol object
    * specifically for messages passed between different components of a
    * single widget. Differs from {@link WidgetProtocol} only in that
    * messages are double-encapsulated. The message is first wrapped in
    * an envelope addressed to another widget component, and that is then
    * wrapped in another envelope which is addressed to be delivered by
    * the toolbar to all components of this widget.
    * @extends WidgetProtocol
    *
    * @param {Array} declarations List of messages that this protocol must support.
    * @param {String} identity The identity of this particular component.
    */
    window.IntrawidgetProtocol = function IntrawidgetProtocol(declarations, identity, widget) {
        var self = this;

        for (var i = 0; i < declarations.length; i++) {
            (declarations[i][2] == "all" ? broadcast : message).apply(this, declarations[i]);
        }

        /**
        * tokens are unique strings that identify messages; used for sending replies
        * @ignore
        */
        function token() {
            return identity + "-" + n++;
        }

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
                s = function (payload, callback, destTab) {
                    send({ msg: "IntrawidgetMessage",
                        from: "widget",
                        to: "toolbar",
                        id: widget,
                        payload: { msg: msg,
                            type: type,
                            from: identity,
                            to: to,
                            id: widget,
                            payload: payload,
                            token: addToken(callback)
                        }
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
        function send(envelope) {
            log(identity, envelope, 'sending message');
            logDebug(envelope, "IntrawidgetProtocol", identity, 'send');
            _send(envelope);
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
                throw new Error("You must pass in a function to receive.");

            // register a listener for all messages
            _receive(function (envelope) {
                if ((envelope.to == "widget" || envelope.to == "all") && envelope.msg == "IntrawidgetMessage") {
                    var inner = envelope.payload;
                    if ((inner.to == identity || inner.to == "all") && inner.msg == msg && inner.id == widget) {
                        // but we only do anything with it when it's for the
                        // proper recipient
                        log(identity, inner, 'received message');
                        logDebug(envelope, "IntrawidgetProtocol", identity, 'recv');
                        func(inner.payload,
                             function (payload) {
                                 // allow the recipient to send a response (encoded
                                 // as a reply message with the token from the
                                 // original message)
                                 var replyEnvelope = { msg: "IntrawidgetMessage",
                                     from: "widget",
                                     to: "toolbar",
                                     id: widget,
                                     payload: { msg: "Reply",
                                         from: identity,
                                         to: inner.from,
                                         id: widget,
                                         payload: payload,
                                         token: inner.token
                                     }
                                 };
                                 logDebug(envelope, "IntrawidgetProtocol", identity, 'sendreply', [replyEnvelope]);
                                 send(replyEnvelope);
                             },
                             envelope.id);
                    }
                }
            });
        };

        var sendFrame = document.getElementById("toToolbar"),
            receiveFrame = document.getElementById("toWidget");
        var urlbase = "about:blank";

        /** @inner */
        var _send = function (envelope) {
            // convert an envelope into a url
            var params = [];
            for (var p in envelope) {
                var v = (p == "payload") ? JSON.stringify(envelope[p]) : envelope[p];
                params.push(p + "=" + encodeURIComponent(v));
            }
            var url = params.join("&");

            window.setTimeout(function () {
                logDebug(envelope, "IntrawidgetProtocol", identity, 'sendTimeout');
                if ("fireEvent" in sendFrame)
                    sendFrame.src = "about:blank?" + url;
                else {
                    sendFrame.setAttribute("envelope", url);
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("load", false, true);
                    sendFrame.dispatchEvent(evt);
                }
            }, 0);
        };
        /** @inner */
        var _receive = function (func) {
            function frameListener(event) {
                // convert the url back into an envelope
                var url;
                try {
                    url = this.getAttribute("envelope");
                } catch (x) {
                    if (!url && "srcElement" in event)
                        url = event.srcElement.src.split("?")[1];
                }
                if (!url) return false;
                var params = url.split('&'), envelope = {};
                params.forEach(function (param) {
                    var t = param.split('='),
                        v = decodeURIComponent(t[1]);
                    envelope[t[0]] = (t[0] == "payload") ? (v == "undefined" ? undefined
                                                                             : JSON.parse(v))
                                                         : v;
                });
                func(envelope);
                return false;
            }
            return receiveFrame.attachEvent ? receiveFrame.attachEvent("onload", frameListener, true)
                                            : receiveFrame.addEventListener("load", frameListener, true);
        };

        /**
        * Listen for replies to messages sent to this module, and call
        * their reply callback.
        */
        _receive(function (envelope) {
            if ((envelope.to == "widget" || envelope.to == "all") && envelope.msg == "IntrawidgetMessage") {
                var inner = envelope.payload;
                if ((inner.to == identity || inner.to == "all") && inner.msg == "Reply" && inner.id == widget) {
                    log(identity, inner, 'received reply for');
                    logDebug(envelope, "IntrawidgetProtocol", identity, 'recvreply');
                    var callback = tokenMap[inner.token];
                    delete tokenMap[inner.token];
                    callback && typeof callback == "function" && callback(inner.payload);
                }
            }
        });

        /** @ignore */
        function addMethod(msg, name, func, error) {
            self[name] = func || function () {
                throw new Error(error);
            };
        }

        /** @ignore */
        function addSender(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot send this message (" + msg + ") from this part of the code (" + identity + ").");
        }

        /** @ignore */
        function addReceiver(msg, name, func) {
            addMethod(msg, name, func,
                      "You cannot receive this message (" + msg + ") from this part of the code (" + identity + ").");
        }

        return self;
    };

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
            throw new Error("Invalid message type: " + type);
        return type;
    }

    /**
    * Print out a message to the console describing a message that
    * we are sending or have just received.
    * @ignore
    */
    function log(identity, envelope, m1) {
        if (!WIDGETMSG_LOGGING)
            return;

        console.groupCollapsed || (console.groupCollapsed = console.log);
        console.groupEnd || (console.groupEnd = function () { });
        var beginning = padafter(identity + ' ' + m1, 33);
        var token = padbefore(envelope.token || "(no token)", 22);
        console.groupCollapsed(beginning + ' ' + token + ': ' + envelope.msg);
        console.dir(window.location.href);
        console.dir(envelope);
        console.groupEnd();
    }

    /** @ignore */
function padbefore(str, n) {
    return pad(str, n) + str;
}

    /** @ignore */
function padafter(str, n) {
    return str + pad(str, n);
}

    /** @ignore */
    function pad(str, n) {
    var diff = n - (str ? str.length : 0), pad = "";
    while(diff > 0) {
        pad = pad + ' ';
        diff--;
    }
    return pad;
    }

    var WIDGETMSG_LOGGING = false;
})(ATB.USE_CONTENT ? content.window : window);
}
