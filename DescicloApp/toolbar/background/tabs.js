var ATB_Tabs = function () {
    chrome.tabs.onUpdated.addListener();
    ATB.Message.receiveNavigate(this._navigate);
    var self = this;
    ATB.Message.receiveNavigateCurrentTab(function (url, sendResponse, sender) {
        self._navigate({ url: url }, sendResponse, sender);
    });
};

ATB_Tabs.prototype._navigate = function (message, sendResponse, sender) {
    var url = (typeof message.url == "object") ? ATB.Utils.buildURL(message.url,
                                                                    message.basepath)
                                               : message.url;
        chrome.tabs.update(sender.tab.id, { url: url });
    sendResponse();
};
