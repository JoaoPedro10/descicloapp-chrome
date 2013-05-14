function ATB_SideBySide() {
    var toolbars = {},
        positionData = { ourPosition: 0,
                         ourTop: 0,
                         visibleToolbars: 0,
                         bodyTop: ATB.CONFIG.TB.HEIGHT
                       },
        extensionInfo = {};

    chrome.management.get(chrome.i18n.getMessage("@@extension_id"), function (extInfo) {
        extensionInfo = extInfo;
        toolbars[extInfo.id] = getToolbarData();
        sendPings();
    });
    function getToolbarInfo() {
        return {
            isVisible: ATB.Pref.getTbIsVisible().toString(),
            position: positionData.ourPosition,
            height: ATB.CONFIG.TB.HEIGHT + 1
        };
    }

    function getToolbarData() {
        return { extensionInfo: extensionInfo,
                 toolbarInfo: getToolbarInfo()
               };
    }

    function getMessage(name) {
        return { name: name,
                 data: getToolbarData()
               };
    }

    /**
     * Send a message to all extensions (not just Everest toolbars), with some exceptions.
     *
     * @param msg               {Object}   The message to send.
     * @param exclusions        {Array}    A list of extension ID's to not send the message to.
     * @param callbackGenerator {Function} (optional) A function which generates a callback for each extension.
     */
    function _broadcastToExtensions(msg, exclusions, callbackGenerator) {
        chrome.management.getAll(function (arrExtensions) {
            for (var i in arrExtensions) {
                var extension = arrExtensions[i];
                if (!extension.enabled || exclusions.indexOf(extension.id) != -1)
                    continue;
                if (typeof callbackGenerator == "function")
                    chrome.extension.sendRequest(extension.id, msg, callbackGenerator(extension));
                else
                    chrome.extension.sendRequest(extension.id, msg);
            }
        });
    }

    function sendPings(callback) {
        var msg = getMessage(ATB.CONSTANT.TB.POSITION_PING);
        var arrExtensions = {};
        function cbGenerator(ext) {
            arrExtensions[ext.id] = ext;
            ext.pinging = true;
            return function(response) {
                ext.pinging = false;
                if (response && response.name == ATB.CONSTANT.TB.POSITION_ECHO) {
                    toolbars[response.data.extensionInfo.id] = response.data;
                    //console.log('Answer iamalive TB for %s:', response.data.extensionInfo.id, response);
                }
            }
        }

        _broadcastToExtensions(msg, [], cbGenerator);

        // Look through all of the extensions and call the
        // callback once all of them have .pinging=false, or we've
        // tried 3 times
        if ($.isFunction(callback)) {
            var tries = 0;
            var interval = setInterval(function () {
                tries++;
                for (var i in arrExtensions) {
                    if (tries > 3)
                        arrExtensions[i].pinging = false;
                    else if (arrExtensions[i].pinging)
                        return;
                }
                clearInterval(interval);
                callback();
            }, 25);
        }
    }

    ATB.Message.receiveClickOnToolbar(function() {
        var msg = { name: "clickOnAnotherExtension" };
        _broadcastToExtensions(msg, [extensionInfo.id]);
    });

    function findPosition(tbid) {
        var tb = [];
        for (var id in toolbars) {
            // this really is a string containing the word 'true'
            if (toolbars[id].toolbarInfo.isVisible == "true")
                tb.push(id);
        }

        tb.sort();

        var totalHeight = 0;
        tb.forEach(function(id) {
                       var height = toolbars[id].toolbarInfo.height;
                       toolbars[id].toolbarInfo.top = totalHeight;
                       if (!height || typeof height != "number" || isNaN(height))
                       {
                           console.warn("Toolbar %s did not tell us how tall it is; some or all toolbars may be mis-positioned.",
                                        id, toolbars[id]);
                           totalHeight += ATB.CONFIG.TB.HEIGHT;
                       }
                       else
                           totalHeight += height;
                   });

        return { ourPosition: tb.indexOf(tbid),
                 ourTop: toolbars[tbid].toolbarInfo.top,
                 visibleToolbars: tb.length,
                 bodyTop: totalHeight
               };
    }

    ATB.Message.receiveGetSideBySideStatus(function (message, sendResponse) {
        sendPings(function () {
            toolbars[extensionInfo.id] = getToolbarData();
            positionData = findPosition(extensionInfo.id);
            //console.log("new toolbar position is %s (%spx)",
            //            positionData.ourPosition,
            //            positionData.ourTop,
            //            toolbars);
            sendResponse(positionData);
        });
    });

    chrome.extension.onRequestExternal.addListener(function (request, sender, sendResponse) {
        if (request.name == ATB.CONSTANT.TB.POSITION_PING) {
            toolbars[sender.id] = request.data;
            echoToAPN()
        }
        else if (request.name == "clickOnAnotherExtension") {
            // do NOT call echoToAPN()
            ATB.Message.broadcastClickOnAnotherExtension();
            sendResponse();
        }
        else if (!request.name && request.data && request.data.isVisible) {
            toolbars[sender.id].toolbarInfo = request.data;
            echoToAPN();
        }

        function echoToAPN() {
            //console.log('RECEIVE External TB from %s:', sender.id, request);
            positionData = findPosition(extensionInfo.id);

            // this needs to be a broadcast event, when that's merged in
            sendUpdateToolbarPositionToAllTabs(positionData);
        }
    });

    function sendUpdateToolbarPositionToAllTabs(positionData) {
        chrome.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (win) {
                win.tabs.forEach(function (tab) {
                    ATB.Message.sendUpdateToolbarPosition(positionData, null, null, tab.id);
                });
            });
        });
    }

    chrome.management.onDisabled.addListener(function (extInfo) {
        //console.log("extension with id: " + extInfo.id + 'is disabled.');
        toolbars[extInfo.id].toolbarInfo.isVisible = "false";
        sendUpdateToolbarPositionToAllTabs(findPosition(extensionInfo.id));
    });
}
