/**
 * @param {Object} config              the configuration parameters for this button's widget
 */
function IFrameButton(config) {
    this.config = config;
    var inlineHtmlButton = new Array();

    /*
        TODO: using partner_id and widgetID is inconsistent variable naming.
              One of these should be updated as a query parameter.
    */
    var self = this,
        style = config.button && config.button.style,
        url = config.button && $.extend(true,
                                        { },
                                        config.button.url,
                                        { params: { partner_id: ATB.CONSTANT.PID, widgetID: config.id } });

    var $content, content;
    if ($.browser.mozilla) {
        /* Mozilla Firefox requires special handling for remote widgets.  Remote widgets live in a
         * sandbox, without access to the privileged code bundled widgets get for free.  For the
         * widget to talk with our privileged code, we need event listeners which run in a
         * privileged scope.  We do this by creating a XUL browser element and specifying
         * type="content".  Then we can use Mozilla's "Message Manager" API to load privileged
         * scripts which establish the connections.
         *
         * This is all based on https://developer.mozilla.org/en-US/docs/The_message_manager .
         */


        /* A bundled widget has a final URL not beginning in "http".  url.path is the first criteria,
         * but if it's a relative URL, it won't begin with "http".  So we check the config.basepath
         * as well.
         */
        var bundled = !(/^https?:\/\//.test(url.path)) &&
                      (typeof config.basepath == "string") &&
                      !(/^chrome:\/\//).test(url.path) &&
                      !(/^https?:\/\//.test(config.basepath));

        var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        var content = document.createElementNS(XUL_NS, "xul:browser");
        content.setAttribute("class", "button-iframe");
        content.setAttribute("style", "width: " + (style.width || "300") + "px" + "; height: 24px;");
        content.setAttribute("id", config.id);
        if (!bundled)
            content.setAttribute("type", "content"); //XXX: This assumes that the url will always be absolute if its hosted
        $content = $(content);
    }
    else {
        $content = $("<iframe>",
                     { "class": "button-iframe",
                       height: "24px",
                       width: style.width,
                       id: config.id });
        content = $content.get(0);
    }
	
    this.$el = $("<div>",
                 { "class": "apn-toolbar-item html-button",
                   id: config.id +"-button",
                   title: config.button.style.label
                 }).append($content);
    inlineHtmlButton[config.id] = this.$el;

    var urlMessage = { url: url, basepath: config.basepath };

    if ($.browser.mozilla) {
        var MM;
        function loadCS(path) {
            MM.loadFrameScript("chrome://apn-" + ATB.CONSTANT.PID + "-toolbar/content/" + path, true);
        }

        var injected = false;
        function injectFrameScripts(evt) {
            var doc = evt.target;
            if ((doc != content.contentDocument) || (doc.location.href == "about:blank")) {
                return;
            }
            if(doc.location.href.indexOf("http://") != -1 && !injected) {
                MM = content.messageManager;
                loadCS("toolbar/lib/default-config.js");
                loadCS("toolbar/lib/browser-shim.js");
                loadCS("toolbar/lib/protocol.js");
                loadCS("toolbar/lib/tb-message.js");
                loadCS("toolbar/lib/widget-messaging.js");
                loadCS("toolbar/content_script/inline-html.js");
            }
            injected = true;
        }
        content.addEventListener("load", injectFrameScripts, true);
    }

    ATB.Message.sendCheckWidgetURL(urlMessage,
                                   function (url) {
                                       // XXX ajvincent We pull this out because content is a XUL browser.  We don't know
                                       // how jQuery will react to that.  We don't want to take chances.
                                       content.setAttribute("src", url);
                                   });
    ATB.Message.receiveGetButtonPosition(function (id, sendResponse) {
                                             if (id == config.id) {
											     if(inlineHtmlButton[id].offset().left != 0)
                                                 sendResponse({ x: inlineHtmlButton[id].offset().left });
											 }
                                         });

    this.addHighlight = function () {
                            self.$el.addClass('sticky-button');
                        };
    this.removeHighlight = function () {
                               self.$el.removeClass('sticky-button');
                           };
    return self;
}