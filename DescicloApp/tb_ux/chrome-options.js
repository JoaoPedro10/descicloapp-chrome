ATB.Message         = new ATB_Message("background");
ATB.localStorage    = new ATB_LocalStorage();
ATB.Pref            = new ATB_Pref();
ATB.BrowserAction   = new ATB_BrowserAction();

//------------------------------------------------------------------------------
//  EVENT
//------------------------------------------------------------------------------
$("#tb-show").click(toggleTbStatus);
$("#tb-hide").click(toggleTbStatus);
$("#about-link").click(function (e){
    try{
    $('body').animate({
        width: '275px'
    },{
        duration: 500,
        easing: 'swing',
        queue: false
    });
    $('#about').animate({
        height: '60px'
    });
    }catch(e) {alert(e)}

});
//------------------------------------------------------------------------------
//  FUNCTION
//------------------------------------------------------------------------------
/**
 * Change the text of the label of the toggle button to Hide if the TB is ON
 */
function updateTBLabel (isHideTb) {
    if(isHideTb) {
        $("#apn-options-menu #tb-hide").show();
        $("#apn-options-menu #tb-show").hide();
    } else {
        $("#apn-options-menu #tb-show").show();
        $("#apn-options-menu #tb-hide").hide();
    }
}
/**
 * translate UI
 */

function updateUI () {
    //-- toggle show/hide menu option
    updateTBLabel(ATB.localStorage.get(ATB.CONSTANT.PREF.TB_IS_VISIBLE));

    //-- update language
    var curLang =  ATB.localStorage.get(ATB.CONSTANT.PREF.LANG);
    i18n("chrome-options", "", curLang);

    //-- update version
    $("p#v").append('&nbsp;<span id="version"></span>');
    $("#version").text(ATB.localStorage.get(ATB.CONSTANT.PREF.VERSION));

    //-- update uninstall/help link by lang
    var url = "http://apnstatic.ask.com/static/toolbar/everest/documents/faq/{lang}/chrome/index.html";
    url = url.replace("{lang}", curLang);
    $("a#help-link").attr('href', url);
    $("a#uninstall-instruction-link").attr('href', url + "#na4");
}
/**
 * toggle toolbar status
 */
function toggleTbStatus () {
    var tbVisibility = ATB.localStorage.get(ATB.CONSTANT.PREF.TB_IS_VISIBLE);
    ATB.localStorage.set(ATB.CONSTANT.PREF.TB_IS_VISIBLE, !tbVisibility);
    tbVisibility = ATB.localStorage.get(ATB.CONSTANT.PREF.TB_IS_VISIBLE);

    updateTBLabel(tbVisibility);
    ATB.BrowserAction.updateIcon();

    //-- broadcast to other toolbar
    ATB.Message.broadcastToggleToolbar(ATB.localStorage.get("tb"));
}

$(document).ready(function() {
    // disable right click
    $(this).bind("contextmenu", function(ev) {
        ev.preventDefault();
    });
    updateUI();
});
