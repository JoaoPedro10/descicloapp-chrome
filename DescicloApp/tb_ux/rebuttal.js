//****************IE Rebuttal Stuff****************************************//
var rebuttalWin = null;

ATB.Message.receiveRebuttalClick(function (tabID) {
    function doOpenDialog(tabID, type, rect, content, style, animation) {
        function str(obj) {
            var s = [];
            for(var key in obj)
            s.push(key + ":" + obj[key]);
            return s.join("|");
        }
        return IEShim.dialogs.OpenDialog(tabID, type, str(rect), str(content), str(style), str(animation));
    }

    rebuttalWin = doOpenDialog(tabID, "DIALOG_POPUP",   {
                                                        XPosition: 0,
                                                        YPosition: 0,
                                                        Width: 400,
                                                        Height: 200
                                                    },
                                                    {
                                                        ContentUrl: chrome.extension.getURL("/widgets/rebuttal/rebuttal.html") + "?tabid=" + tabID + '&pref_lang=' +  ATB.Pref.getLang()
                                                    },
                                                    {
                                                        Title: ATB.CONFIG.LANGS["rebuttal_title"][ATB.Pref.getLang()].title || "Disable Addon", //Translate to lang
                                                        FocusState: "TRUE",
                                                        ModalType: "MODAL"
                                                    },
                                                    {
                                                        OpenAnimateType: "ANIMATE_NONE",
                                                        OpenAnimateDuration: 400,
                                                        CloseAnimateType: "ANIMATE_NONE",
                                                        CloseAnimateDuration: 200
                                                    });
});

ATB.Message.receiveCallDisableToolbar(function(msg){
    try {
        window.external.GetObject("toolbar").disable(parseFloat(msg.tabID), msg.disableForCurrentWindow);
        IEShim.dialogs.CloseDialog("DIALOG_POPUP", rebuttalWin);
    } catch(e) {
        console.error(e);
    }

});

ATB.Message.receiveCloseRebuttal(function(msg){
    IEShim.dialogs.CloseDialog("DIALOG_POPUP", rebuttalWin);
});