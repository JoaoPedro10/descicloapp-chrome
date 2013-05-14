/**
 *  Feeds
 *
 * @fileOverview Function to cache/store RSS feeds in json format, for the urls
 * that were configured in tb-config.js
 * @author Tanmay Shrivastava <tanmay.shrivastava@ask.com>
 */
var ATB_Feeds = function () {
    var self = this;
    ATB.Message.receiveGetFeedData(function (message, sendResponse, sender) {
        sendResponse(ATB.localStorage.get(getDataPrefName(message)));
    });
    var widgets = ATB.CONFIG.widgetsByID;
    // Check if any of the feeds needs to be cached
    for (var id in widgets) {
        var widget = widgets[id];
        if (widget.template == "SimpleFeedWidget" ||
            ("protocols" in widget && widget.protocols.feed)) {
            setTimer(id);
        }
    }

    function setTimer(id)
    {
        var widget = ATB.CONFIG.widgetsByID[id];
        var url;
        if (widget.template == "SimpleFeedWidget")
            url = widget.data;
        else if (widget.protocols.feed)
            url = widget.protocols.feed.data;
        url = ATB.Utils.buildURL({ path: url.path,
                                   params: url.params },
                                 widget.basepath);

        ATB.Utils.LongTimer(getTimestampPrefName(id),
                            function() {
                                self.cacheFeed(getDataPrefName(id),url);
                            },
                            ATB.Utils.LongTimer.ONE_DAY);
    }

    function getDataPrefName(id) {
        return "feed-" + id + "-data";
    }

    function getTimestampPrefName(id) {
        return "feed-" + id + "-lastTS";
    }

};

/**
 *  A method to grab the contents of the feed and store them in the cache as json
 *
 *  @param feedId  The storage key
 *  @param feedUrl The feed Url
 */
ATB_Feeds.prototype.cacheFeed = function (feedId, feedUrl) {
    var urlMacroReplaced = ATB.Utils.Macro.replace(feedUrl);
    console.warn('Feed url to call :', urlMacroReplaced);
    $.ajax({
        url: urlMacroReplaced,
        cache: true,
        timeout: 5000,
        type: 'GET',
        dataType: "xml",
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Reporting - cacheFeed call failed : ', textStatus, errorThrown);
        },
        success: function (xmlResponse) {
            var feedItems = [];
            $(xmlResponse).find("item").each(function () {
                var feedItem = {
                    title: $(this).find("title").text(),
                    link: $(this).find("link").text(),
                    reportUrl: $(this).attr('reportURL'),
                    description: $(this).find("description").text(),
                    imgUrl: $(this).find("url").text()
                };
                feedItems.push(feedItem);
            });
            ATB.localStorage.set(feedId, JSON.stringify(feedItems));
        }
    });
};
