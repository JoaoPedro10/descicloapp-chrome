function ATB_SideBySide() {
    var toolbars = {},
        positionData = { ourPosition: 0,
                         ourTop: 0,
                         visibleToolbars: 0,
                         bodyTop: ATB.CONFIG.TB.HEIGHT
                       },
        extensionInfo = {};

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

    function getMessage(name) {}

    function _broadcastToExtensions(msg, exclusions, callbackGenerator) {}

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

    ATB.Message.receiveClickOnToolbar();

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

    function sendUpdateToolbarPositionToAllTabs() {}
}