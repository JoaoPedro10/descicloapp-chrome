var ATB = ( function(ATB) {
    ATB.Rebuttal = {
        // Messaging API
        Message: new ATB_Message("widget"),

        params: (function() {
            var query = decodeURI(window.location.search.substr(1)).split('&'), params = {};
            for(var i = 0; i < query.length; i++) {
                var p = query[i].split("=");
                if(p.length != 2)
                    continue;
                params[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return params;
        })(),
        callDisableToolbar: function(tabID, disable) {
            //window.external.GetObject("toolbar").disable(tabID,
            // bDisableForCurrentWindow);
            ATB.Rebuttal.Message.sendCallDisableToolbar({
                tabID: tabID,
                disableForCurrentWindow: disable
            });
        },
        processOk: function() {
            var tabID = ATB.Rebuttal.params.tabid;
            var disableRadioBtn = document.getElementsByName("disable option");
            var len = disableRadioBtn.length;
            for( i = 0; i < len; i++) {
                if(disableRadioBtn[i].checked) {
                    var chosenValue = disableRadioBtn[i].value;
                    if(chosenValue == "currentWindow") {
                        ATB.Rebuttal.callDisableToolbar(tabID, true);
                    } else if(chosenValue == "permanent") {
                        ATB.Rebuttal.callDisableToolbar(tabID, false);
                    } else {
                        ATB.Rebuttal.processCancel();
                    }
                }
            }
        },
        processCancel: function() {
            ATB.Rebuttal.Message.sendCloseRebuttal();
        },
        init: function() {
            i18n("rebuttal", "", (ATB.Rebuttal.params.pref_lang || "en"),
                "TOOLBAR_COBRAND_NAME", ATB.CONSTANT.TB_NAME);
        }
    };
    return ATB;
}(ATB || {}));
