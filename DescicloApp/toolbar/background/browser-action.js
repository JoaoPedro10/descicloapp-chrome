var ATB_BrowserAction = function () {};
ATB_BrowserAction.prototype.updateIcon = function () {
    function path(f) { return { path: '../../' + f }; }
    function icon(i) { chrome.browserAction.setIcon(i); }
    function iconPath(f) { icon(path(f)); }

    if (ATB.Pref.getTbIsVisible()) {
        iconPath('icons/icon.png');
    } else {
        iconPath('icons/iconpb.png');
    }
};