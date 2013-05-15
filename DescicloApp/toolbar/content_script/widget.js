/*
    This is included here because this code needs to execute
    in every browser and widget.js is the only content_script file
    that gets included in every browser.
*/
($.browser.msie ? new ATB_Message("content script") : ATB.Message).receiveGetCurrentUrl(function (message, sendResponse, sender) {
    var curUrl = '';
        curUrl = document.location.toString();
    sendResponse(curUrl);
});


/**
 * @author GeninT
 */
function WidgetConstructor () {
    var $iframe = null,
        widgetWin = null,
        widgetId = null,
        self = this,
        pos = null,
        WidgetMsgProtocol = $.browser.msie ? new ATB_Message("content script")
                                           : ATB.Message,
        animationStates = { stableState: { startEvent: animate,
                                           finishEvent: ignore,
                                           cancelEvent: ignore
                                         },
                            animatingState: { startEvent: ignore,
                                              finishEvent: animationDone,
                                              cancelEvent: stopAnimation
                                            }
                          };
    var DELAY_1ST_WINDOW = 300;
    var animationMachine = new StateMachine('animationStateMachine', 'stableState', animationStates);
    function animate () {
        return "animatingState";
    }
    function animationDone () {
        WidgetMsgProtocol.sendAnimationFinished();
        return "stableState";
    }
    function ignore (event, state) {
        return state;
    }
    function stopAnimation () {
        return "stableState";
    }
    /**
     * onResize event the widget should be close
     */
    var onResize = function (ev) {
        self.close();
    };
    this.init = function () {

        if ($.browser.mozilla || $.browser.msie) {
            // attach a click handler to close the widget in case of click
            $("body").live('click', function () {
                // Remove widget contents
                self.close();
            });
            WidgetMsgProtocol.receiveOpenDropdownWidget(function (message, sendResponse, sender) {
                                                            self.open(message.id, message.win, message.position, sender);
                                                            sendResponse();
                                                        });

            WidgetMsgProtocol.receiveCloseDropdownWidget(function (message, sendResponse) {
                                                             self.close();
                                                             sendResponse();
                                                         });

            WidgetMsgProtocol.receiveResizeDropdownWidget(function (message) {
                                                              self.resize(message);
                                                          });
            }
    };
    function doCreateWidget (url, id, sender) {
        if ($.browser.webkit) {
            // check if iframe exist and if source is the same => don't do anything
            // usefull for search suggestion and by security
            if (self.$iframe != null) {
                var wUrl = _getWidgetURL(Widget.$iframe.attr('src'));
                var inUrl = _getWidgetURL(url);
                if (inUrl == wUrl) {
                    return;
                }
            }
            //create object
            var $widget = $("<iframe>", { id: ATB.CONFIG.WIDGET.IFRAME_ID,
                                          "class": "apn-widget"
                                        }).data("widgetID", id);
            // Don't bubble clicks on the widget
            $widget.click (function (event) {
                event.stopPropagation();
            });
            //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
            // CSS
            //position right <-> left
            $widget.css({ left: self.pos.left,
                          top: self.pos.top
                        });
            //overwrite height and width to 0 for the animation
            //@todo create a configuration layer for the animation;
            $widget.css({ height: self.pos.height + 'px',
                          width: self.pos.width +'px'
                        });
            // attach a click handler to close the widget in case of click
            window.addEventListener('click', widgetState.hide, false);
            window.addEventListener('mousedown', widgetState.hide, false);
            // move the widget around in order to keep it inside the
            // window when the window changes size
            $(window).bind('resize', Widget.onResize);
            //-+-+-+-+-+-+-+-+-+-+-+-+-+
            // Empty and append
            animationMachine.startEvent ();
            $('body').append($widget);
            self.$iframe = $widget;
            self.widgetId = id;
            $widget.attr("src", url);
            /*self.resize({
                          width: self.pos.width,
                          height: self.pos.height
                        });*/
            animationMachine.finishEvent ();
        }
        else if ($.browser.mozilla) {
            var pos = self.pos;
            var xul = chrome.extension.getURL("toolbar/config/skin/widget-");
            xul += (/^http/.test(url)) ? "hosted.xul" : "bundled.xul";
            var params = 'chrome=yes,titlebar=no,dependent=yes,alwaysRaised=yes,scrollbars=no,height=' + pos.height + ',width=' + pos.width + ',left=' + pos.left + ',top=' + pos.top;
            if(!self.widgetWin) {
                animationMachine.startEvent ();
                self.widgetWin = window.openDialog(xul, "windowName", params, url, true);
                //XXX: Hack to fix FF painting issue with 4px white border around dialogs
                setTimeout(function() {self.widgetWin.resizeTo(pos.width+5, pos.height+5)}, 10);
                setTimeout(function() {self.widgetWin.resizeTo(pos.width-5, pos.height-5)}, 100);
                self.widgetId = id;
                //to ensure that the widget is ready the very first time
                setTimeout (function() {
                    animationMachine.finishEvent ();
                }, DELAY_1ST_WINDOW);
                window.parent.focus();
            }
            window.parent.addEventListener("resize", onResize, false);
        }
        else if ($.browser.msie) {
            if (self.widgetWin == null) {
                animationMachine.startEvent ();
                self.widgetWin = _doOpenDialog(sender.tab.id,
                                "DIALOG_DROPDOWN",
                                { XPosition: self.pos.left,
                                  YPosition: self.pos.top,
                                  Width: self.pos.width,
                                  Height: self.pos.height
                                },
                                { ContentUrl: url },
                                { Title: "Ask.com", FocusState: (url.indexOf("search-suggestion") != -1) ? "FALSE" : "TRUE" },
                                { OpenAnimateType: "ANIMATE_NONE",
                                  OpenAnimateDuration: 400,
                                  CloseAnimateType: "ANIMATE_NONE",
                                  CloseAnimateDuration: 200
                                });
                self.widgetId = id;
                //to ensure that the widget is ready the very first time
                setTimeout (function() {
                    animationMachine.finishEvent();
                }, DELAY_1ST_WINDOW);
            }
        }
    }
    //--------------------------------------------------------------------------
    /**
     *  open a widget.
     *
     * @param id {String} widget id
     * @param basepath {String} widget base path
     * @param win {Object} widget window to open
     * @param position {Object} position objects contain x/y coordinate properties
     */
    this.open = function (id, win, position, sender) {
        if ($.browser.webkit) {
            self.close();
        }

        var config = ATB.CONFIG.widgetsByID[id];
        if (typeof win == "string") {
            win = config.windows[win];
        }

        WidgetMsgProtocol.sendCheckWidgetURL({ url: { path: win.url.path,
                                                      params: $.extend(true, { },
                                                                       win.url.params,
                                                                       { widgetID: id,
                                                                         partner_id: ATB.CONSTANT.PID })
                                                    },
                                               basepath: config.basepath
                                             },
                                             function (url) {
                                                 function doTheStuff(position) {
                                                     self.pos = _getPos(win, position.x);
                                                     doCreateWidget(url, id, sender);
                                                 }
                                                 if (typeof position == "undefined" || position === null) {
                                                     WidgetMsgProtocol.sendGetButtonPosition(id, doTheStuff);
                                                 } else {
                                                     doTheStuff(position);
                                                 }
                                             });
    };
    /**
     * Resize a widget with a nice animation
     * @param r {Request} Chrome Message
     */
    this.resize = function (css) {
        
        // default to existing sizes if they aren't passed
        css.height = css.height || self.$iframe.height();
        css.width = css.width || self.$iframe.width();
        
        if ($.browser.webkit) {
            if (self.$iframe) {
                animationMachine.startEvent();
                self.$iframe.animate(css,
                                     0,
                                     ATB.CONFIG.WIDGET.RESIZE_ANIMATION_TYPE,
                                     function() {
                                         animationMachine.finishEvent();
                                     });
            }
        }
        else if ($.browser.mozilla) {
            if (self.widgetWin) {
                animationMachine.startEvent ();
                self.widgetWin.resizeTo(parseInt(css.width), parseInt(css.height));
                animationMachine.finishEvent ();
                window.parent.focus();
            }
        }
        else if ($.browser.msie) {
            if (self.widgetWin) {
                animationMachine.startEvent ();
                var newDim = { XPosition: self.pos.left,
                               YPosition: self.pos.top,
                               Width: parseInt(css.width),
                               Height: parseInt(css.height)
                             };
                IEShim.dialogs.ResizeDialog("DIALOG_DROPDOWN",
                                            _buildArgStr(newDim));
                animationMachine.finishEvent ();
            }
        }
    };
    /**
     * Close any widget
     */
    this.close = function (e) {
        animationMachine.cancelEvent ();
        var id = self.widgetId;
        if (!id)
            return;
        if ($.browser.webkit) {
            if (self.$iframe) {
                self.$iframe.stop();
                self.$iframe.remove();
                self.$iframe = null;
                self.widgetId = null;
                $("body").unbind('click', self.close);
                $(window).unbind('resize', self.onResize);
            }
        }
        else if ($.browser.mozilla) {
            if (self.widgetWin) {
                if (e && e.target.id == ATB.CONSTANT.SS_INPUT_ID) return;
                self.widgetWin.close();
                self.widgetWin = null;
                self.widgetId = null;
            }
        }
        else if ($.browser.msie) {
            if (self.widgetWin) {
                IEShim.dialogs.CloseDialog("DIALOG_DROPDOWN");
                self.widgetWin = null;
                self.widgetId = null;
            }
        }
        WidgetMsgProtocol.sendWidgetClosed(id);
    }
    /**
     * return the url of the widget without the cache busrting thing
     * @param url {String} The url to format
     * @return String url without the cache bursting componenet
     */
    var _getWidgetURL = function (url) {
        return url.substr(0, url.indexOf('_s='));
    };
    this.getStatus = function () {
        if (self.$iframe)
            return self.$iframe.data("widgetID");
        return undefined;
    };
    /**
     * return the string representing the arguments to be passed to IE dialogs API
     * @param obj {Object} window dimension
     * @return string representing the args passed to the IE dialog API
     */
    function _buildArgStr (obj) {
        var str = [];
        for (var key in obj)
            str.push(key +":"+ obj[key]);
        return str.join("|");
    };
    /**
     * make open widget API call
     * @param obj {} object containing window dimension
     * @param tabid
     * @param type
     * @param rect
     * @param content
     * @param style
     * @param animation
     * @return window handle returned by window API
     */
    function _doOpenDialog (tabid, type, rect, content, style, animation) {
        return IEShim.dialogs.OpenDialog(tabid, type,
                                         _buildArgStr(rect),
                                         _buildArgStr(content),
                                         _buildArgStr(style),
                                         _buildArgStr(animation));
    }
    /**
     * return widget window dimension
     * @param obj {} widget dimension
     */
    function _getPos (win, buttonLeft) {
        if ($.browser.webkit) {
            return calcWindowPosition(win,
                                      { top: Toolbar.positionData.ourTop + ATB.CONFIG.TB.HEIGHT + ATB.CONFIG.WIDGET.MARGIN_TOP,
                                        left: buttonLeft
                                      },
                                      { width: $(window).width(),
                                        height: $(window).height()
                                      });
        }
        if ($.browser.mozilla) {
            var pos = calcWindowPosition(win,
                                         { top: document.getElementById(ATB.CONSTANT.TB_IFRAME_ID)
                                                        .boxObject
                                                        .screenY +
                                                ATB.CONFIG.TB.HEIGHT +
                                                ATB.CONFIG.WIDGET.MARGIN_TOP,
                                           left: window.screenX+ buttonLeft + 8
                                         },
                                         { width: screen.width,
                                           height: screen.height
                                         });
            // Adjust FF Delta, for proper positioning of the widget dialogs
            pos.height += 5;
            pos.width += 5;
            if (navigator.userAgent.indexOf("Windows NT 5") != -1) { //for xp
                pos.left += -3;
            }
            return pos;
        }
        if ($.browser.msie) {
            var pos = calcWindowPosition(win,
                                         { top: 0,
                                           left: buttonLeft
                                         },
                                         { width: $(window).width(),
                                           height: $(window).height()
                                         });
            pos.top -= 2;
            return pos;
        }
        // XXX ajvincent We should never get here!
        return undefined;
    }
    if ($.browser.msie) {
        this.init();
    }

    var browser = $.browser.msie ? "IE" : ($.browser.webkit ? "CR" : "FF");
    function isBrowserSupported(element, index, array) {
        if(element.browsers)
            return element.browsers.indexOf(browser) != -1;
        return true;
    }


    function setupWidget(widget) {
        if(isBrowserSupported(widget))
            ATB.CONFIG.widgetsByID[widget.id] = widget;
    }

    ATB.CONFIG.leftDock.forEach(setupWidget);
    ATB.CONFIG.centerDock.forEach(setupWidget);
    ATB.CONFIG.rightDock.forEach(setupWidget);
}

if (!($.browser.webkit && location.scheme == "chrome-extension"))
    var Widget = new WidgetConstructor();
