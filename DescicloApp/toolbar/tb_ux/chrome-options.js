ATB.Message         = new ATB_Message("background");
ATB.localStorage    = new ATB_LocalStorage();
ATB.Pref            = new ATB_Pref();
ATB.BrowserAction   = new ATB_BrowserAction();

$("#tb-show").click(toggleTbStatus);
$("#tb-hide").click(toggleTbStatus);

function updateTBLabel (isHideTb) {
    if(isHideTb) {
        $("#apn-options-menu #tb-hide").show();
        $("#apn-options-menu #tb-show").hide();
    } else {
        $("#apn-options-menu #tb-show").show();
        $("#apn-options-menu #tb-hide").hide();
    }
}

function updateUI () {
    updateTBLabel(ATB.localStorage.get(ATB.CONSTANT.PREF.TB_IS_VISIBLE));
}

function toggleTbStatus () {
    var tbVisibility = ATB.localStorage.get(ATB.CONSTANT.PREF.TB_IS_VISIBLE);
    ATB.localStorage.set(ATB.CONSTANT.PREF.TB_IS_VISIBLE, !tbVisibility);
    tbVisibility = ATB.localStorage.get(ATB.CONSTANT.PREF.TB_IS_VISIBLE);

    updateTBLabel(tbVisibility);
    ATB.BrowserAction.updateIcon();
	
    ATB.Message.broadcastToggleToolbar(ATB.localStorage.get("tb"));
}

$(document).ready(function() {
    updateUI();
});
