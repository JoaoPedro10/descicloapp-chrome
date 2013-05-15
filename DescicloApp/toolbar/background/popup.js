/**
 * popup.js
 *
 * Functions to control and open toolbar popups
 */
var ATB_Popup = function () {
    this.popupStatus = {};
    this.expectNextOpenWinToBePopup = false;
    this.expectNextOpenWinPopupURL = "";
    var that = this;

    ATB.Message.receiveOpenPopup(function (message, sendResponse, sender) {
        that.checkStatus(message, sendResponse, sender);
    });

    chrome.windows.onRemoved.addListener(function (win) {
        that.onWindowClose(win);
    });
    chrome.windows.onCreated.addListener(function (win) {
        that.onWindowOpen(win);
    });
};

ATB_Popup.prototype.checkStatus = function (msg, sendResponse, sender) {
    var id = msg.id + ".popup", win = msg.win, position = msg.position || {x:0, y:0};
    if (this.popupStatus[id]) {
        this.windowChangeFocus(this.popupStatus[id]);
        sendResponse(false);
    } else {
        this.expectNextOpenWinPopupURL = id;
        this.expectNextOpenWinToBePopup = true;
        var tmp = [];
        var url = ATB.Utils.buildURL($.extend(true, { },
                                              win.url,
                                              { params: { "partner_id": ATB.CONSTANT.PID }}),
                                     msg.basepath);
        var pos = calcWindowPosition(win,
                                     { top: position.y,
                                       left: position.x
                                     },
                                     { height: screen.availHeight,
                                       width: screen.availWidth
                                     });
        //adjust width and height for GC and msie
        if ($.browser.webkit) {
            pos.height += 28;
            pos.width += 9;
        }
        else if ($.browser.msie) {
            pos.height += 28;
            pos.width += 7;
        }

        var opts = { resizable: win.resizable || "yes",
                     scrollbars: win.scrollbars || "no",
                     menubar: win.menubar || "no",
                     status: win.status || "no",
                     titlebar: win.titlebar || "yes",
                     toolbar: win.toolbar || "no"
                   };

        if (!$.browser.msie) {
            for (var a in pos) {
                tmp.push(a + "=" + pos[a]);
            }
            for (var a in opts) {
                tmp.push(a + "=" + opts[a]);
            }

            if (!$.browser.mozilla) {
                // Just open a window.
                open(url, id, tmp.join(","));
            }
            else {
                // Open a special XUL window to handle the popup.
                var xulWindow = (/^https?:/.test(url)) ? "widget-hosted.xul" : "widget-bundled.xul";
                tmp.push("chrome");
                window.openDialog(chrome.extension.getURL("toolbar/config/skin/" + xulWindow), id, tmp.join(","), url);
            }
        } else {

          function doOpenDialog(tabid, type, rect, content, style, animation) {
            function str(obj) {
              var s = [];
              for (var key in obj)
                s.push(key +":"+ obj[key]);
              return s.join("|");
            }
            IEShim.dialogs.OpenDialog(tabid, type, str(rect), str(content), str(style), str(animation));
          }
          doOpenDialog(sender.tab.id,
                       "DIALOG_POPUP",
                       {
                           XPosition: pos.left,
                           YPosition: pos.top,
                           Width: pos.width,
                           Height: pos.height
                       },
                       {
                           ContentUrl: url
                       },
                       {
                           Title: win.title
                       },
                       {
                           OpenAnimateType: "ANIMATE_NONE",
                           OpenAnimateDuration: 200,
                           CloseAnimateType: "ANIMATE_NONE",
                           CloseAnimateDuration: 200
                       });
        }
        sendResponse(true);
    }
};

ATB_Popup.prototype.onWindowClose = function (winID) {
    //check if it was a popup windows
    for (var popup in this.popupStatus) {
        if (this.popupStatus[popup] === winID) {
            delete this.popupStatus[popup];
        }
        return;
    }
};

ATB_Popup.prototype.onWindowOpen = function (win) {
    if (win.type != "popup" || !this.expectNextOpenWinToBePopup) {
        return;
    }
    this.expectNextOpenWinToBePopup = false;
    this.popupStatus[this.expectNextOpenWinPopupURL] = win.id;

};

ATB_Popup.prototype.windowChangeFocus = function (winID) {
    chrome.windows.update(winID, {
        focused: true
    });
};
