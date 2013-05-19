/*
    Copyright (C) 2010-2012 aloogle, LLC. All rights reserved
    Ask.com
*/

            function _getService(contractID, iface) {
                return Components.classes[contractID].getService(Components.interfaces[iface]);
            }

            ATB.Message = new ATB_Message("content script");
            ATB.webProgressListener = {
                QueryInterface: function(aIID)
                {
                    if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
                        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
                        aIID.equals(Components.interfaces.nsISupports))
                        return this;
                    throw Components.results.NS_NOINTERFACE;
                },
                onStateChange: function() { /* do nothing */ },
                onProgressChange: function() { /* do nothing */ },
                onStatusChange: function() { /* do nothing */ },
                onSecurityChange: function() { /* do nothing */ },
                //xxx awin we need dummy because we are listening to all tabs
                onLocationChange: function(dummy, aWebProgress, aRequest, aURI) {
                    ATB.Message.broadcastNavigated(aURI.spec); // for handleCompetitorAutofill
                    ATB.Message.sendSetSearchBoxValue(''); // for handleAutoFillSBOnTextHighLight
                }
            };

            /**
             * return V6 new tab feature should be turned on
             * V6 new tab feature should only turn on
             *    1) this toolbar is last one installed (last installed toolbar is save as registry key, last one being added to comma deliminated string
             *    2) pref_new_tab_on is true for this toolbar
             */
            function shouldSetNewTab () {
                try {
                    var PID = bgIframe.contentWindow.ATB.Registry.getNewTabPID();
                    if (!PID)
                        return false;
                    var newTabPIDs = PID.split(','); // tabPIDs are saved in registry as comma deliminated string
                    var lastTbInstalled = $.trim(newTabPIDs[newTabPIDs.length-1]);
                    var isNewTabOn = bgIframe.contentWindow.ATB.Pref.getNewTabIsOn();
                    return(lastTbInstalled && isNewTabOn);
                }
                catch (e) {
                    console.log (e.toString());
                    return false;
                }
            }

            //Called when we confirm that BG has initialized
            //loads the toolbar frame and checks if DNSHandler for this window should be set/unset
            function init() {
                document.getElementById('aloogle-' + ATB.CONSTANT.PID + '-toolbar-iframe')
                        .setAttribute("src", "chrome://aloogle-" + ATB.CONSTANT.PID + "-toolbar/toolbar/content/config/skin/toolbar.html");

                //add newTab oncommand attribute here to make sure that preferences are set
                var newTabCmd = parent.document.getElementById("cmd_newNavigatorTab");
                if (newTabCmd) {
                    if (shouldSetNewTab ()) {
                        newTabCmd.setAttribute("oncommand", "ATB_onNewTab()");
                    }
                }

                //Check to see if DNS Handler should be enabled for this window
                ATB.Message.sendDNSHandlerCheck(null, setDNSHandler);
            }

            ATB.Message.receiveUpdateLocale(function () {
                ATB.Message.sendDNSHandlerCheck(null, setDNSHandler);
            });
            ATB.Message.receiveUpdateLang(function () {
                ATB.Message.sendDNSHandlerCheck(null, setDNSHandler);
            });

            var msg = null;

            function setDNSHandler(message) {
                msg = message;
            }

            function _DNSHandler(urlBar, origHandleCommand, event) {
                var domain = parent.document.getElementById("urlbar").value;
                var redirectFunc = function() {
                    parent.window.content.document.location.href = msg.dnsUrl + encodeURIComponent(domain);
                }
                if(domain && domain.length > 0 && domain.indexOf("\\") == -1 && domain.indexOf(".") > 0 && domain.indexOf("/") == -1) {

                    var listener = {
                        onLookupComplete: function(request, dnsRecord, status) {
                            if (dnsRecord) {
                                origHandleCommand.apply(urlBar, [event]);
                            }
                            else {
                                setTimeout(redirectFunc, 100);
                            }
                        }
                    };

                    var threadManager = _getService("@mozilla.org/thread-manager;1", "nsIThreadManager");
                    var mainThread = threadManager.currentThread;
                    var dnsService = _getService("@mozilla.org/network/dns-service;1", "nsIDNSService");
                    try {
                        dnsService.asyncResolve(domain, 0, listener, mainThread);
                    } catch (e) {
                        console.log (e);
                        redirectFunc();
                    }
                } else {
                    console.warn("Domain resolve skipped since it does not meet the prerequisite conditions. Domain: " + domain);
                    origHandleCommand.apply(urlBar, [event]);
                }
            }

            //Assign a receiver to enable/disable DNSHandler when user toggles it via options widget
            ATB.Message.receiveSetDNSHandler(setDNSHandler);

            //Load background page in hidden window if it hasnt been done before for this extension
            try {
                //Create the Background frame if its not already present(1st window) or just set a reference to it
                var bgWin = _getService("@mozilla.org/appshell/appShellService;1", "nsIAppShellService").hiddenDOMWindow;
                var bgDoc = bgWin.document;
                var bgIframe = null;

                //Load the toolbar iframe if bg is already present, otherwise create BG Iframe first
                if ( bgDoc.getElementById("aloogle-" + ATB.CONSTANT.PID + "-iframe") ) {
                    init();
                } else {
                    var xulBrowser = bgDoc.createElement( "iframe");
                    xulBrowser.setAttribute("id", "aloogle-" + ATB.CONSTANT.PID + "-iframe"); //For our window to have access to chrome
                    xulBrowser.setAttribute("type", "chrome"); //For our window to have access to chrome
                    xulBrowser.setAttribute("src", "chrome://aloogle-" + ATB.CONSTANT.PID + "-toolbar/toolbar/content/background/background.html");
                    bgDoc.documentElement.appendChild(xulBrowser);
                    console.log("\nSuccessfuly added the iframe to hidden window.\n");

                    //Load toolbar iframe src only when BG has finished initializing
                    ATB.Message.receiveBGInitialized(init);
                }

                //Set a reference to the bgIframe
                bgIframe = bgDoc.getElementById("aloogle-" + ATB.CONSTANT.PID + "-iframe");
                window.addEventListener("load", function () {
                    try {
                        top.gBrowser.addTabsProgressListener(ATB.webProgressListener, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
                    }
                    catch (e) {
                        console.log('adding TabsProgressListener: ' + e);
                    }
                    Widget.init();
                },false);
                window.addEventListener("unload", function() {
                    try {
                        top.gBrowser.removeTabsProgressListener(ATB.webProgressListener);
                    }
                    catch (e) {
                        console.log('removing TabsProgressListener: ' + e);
                    }
                }, false);
                window.parent.addEventListener("click", function(evt) {Widget.close(evt);},false);
                window.parent.addEventListener("mouseup", handleMouseUp, false);
            } catch(e) {
                console.error("Error in CS: " + e);
            }

            // Copied from Firefox. Apparently they never got around to
            // refactoring this into the <browser> binding.
            /**
             * Content area tooltip.
             * XXX - this must move into XBL binding/equiv! Do not want to pollute
             *       browser.js with functionality that can be encapsulated into
             *       browser widget. TEMPORARY!
             *
             * NOTE: Any changes to this routine need to be mirrored in DefaultTooltipTextProvider::GetNodeText()
             *       (located in mozilla/embedding/browser/webBrowser/nsDocShellTreeOwner.cpp)
             *       which performs the same function, but for embedded clients that
             *       don't use a XUL/JS layer. It is important that the logic of
             *       these two routines be kept more or less in sync.
             *       (pinkerton)
             **/
            function FillInHTMLTooltip(tipElement)
            {
              var retVal = false;
              // Don't show the tooltip if the tooltip node is a XUL element, a document or is disconnected.
              if (tipElement.namespaceURI == "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" ||
                  !tipElement.ownerDocument ||
                  (tipElement.ownerDocument.compareDocumentPosition(tipElement) & document.DOCUMENT_POSITION_DISCONNECTED))
                return retVal;

              const XLinkNS = "http://www.w3.org/1999/xlink";


              var titleText = null;
              var XLinkTitleText = null;
              var SVGTitleText = null;
              var lookingForSVGTitle = true;
              var direction = tipElement.ownerDocument.dir;

              // If the element is invalid per HTML5 Forms specifications and has no title,
              // show the constraint validation error message.
              if ((tipElement instanceof HTMLInputElement ||
                   tipElement instanceof HTMLTextAreaElement ||
                   tipElement instanceof HTMLSelectElement ||
                   tipElement instanceof HTMLButtonElement) &&
                  !tipElement.hasAttribute('title') &&
                  (!tipElement.form || !tipElement.form.noValidate)) {
                // If the element is barred from constraint validation or valid,
                // the validation message will be the empty string.
                titleText = tipElement.validationMessage;
              }

              while (!titleText && !XLinkTitleText && !SVGTitleText && tipElement) {
                if (tipElement.nodeType == Node.ELEMENT_NODE) {
                  titleText = tipElement.getAttribute("title");
                  if ((tipElement instanceof HTMLAnchorElement ||
                       tipElement instanceof HTMLAreaElement ||
                       tipElement instanceof HTMLLinkElement ||
                       tipElement instanceof SVGAElement) && tipElement.href) {
                    XLinkTitleText = tipElement.getAttributeNS(XLinkNS, "title");
                  }
                  if (lookingForSVGTitle &&
                      (!(tipElement instanceof SVGElement) ||
                       tipElement.parentNode.nodeType == Node.DOCUMENT_NODE)) {
                    lookingForSVGTitle = false;
                  }
                  if (lookingForSVGTitle) {
                    let length = tipElement.childNodes.length;
                    for (let i = 0; i < length; i++) {
                      let childNode = tipElement.childNodes[i];
                      if (childNode instanceof SVGTitleElement) {
                        SVGTitleText = childNode.textContent;
                        break;
                      }
                    }
                  }
                  var defView = tipElement.ownerDocument.defaultView;
                  // XXX Work around bug 350679:
                  // "Tooltips can be fired in documents with no view".
                  if (!defView)
                    return retVal;
                  direction = defView.getComputedStyle(tipElement, "")
                    .getPropertyValue("direction");
                }
                tipElement = tipElement.parentNode;
              }

              var tipNode = document.getElementById("aloogle-toolbar-tooltip");
              tipNode.style.direction = direction;

              [titleText, XLinkTitleText, SVGTitleText].forEach(function (t) {
                if (t && /\S/.test(t)) {
                  // Make CRLF and CR render one line break each.
                  t = t.replace(/\r\n?/g, '\n');

                  tipNode.setAttribute("label", t);
                  retVal = true;
                }
              });
              return retVal;
            }
            /**
                autofillintexthighlight feature
             **/
            function handleMouseUp (event) {
                var textSelection = top.gBrowser.contentWindow.getSelection().toString();
                if ((top.gBrowser.contentDocument.location.protocol == "http:") && // for http protocol only--for security reason
                    textSelection) {
                    ATB.Message.sendSetSearchBoxValue (textSelection);
                }
            }

            // replacing urlbar's handlerCommand method from urlbarBindings.xml, so we can re-direct to ask.com if DNS fail
            var urlBar = parent.document.getElementById("urlbar");
            if (urlBar && (typeof urlBar.handleCommand == "function")) {
                var oldHandleCommand = urlBar.handleCommand;
                urlBar.handleCommand = function (event) {
                    if (msg.shouldSetDNS) {
                        _DNSHandler (this, oldHandleCommand, event);
                    }
                    else {
                        oldHandleCommand.apply(this, [event]);
                    }
                }
            }
