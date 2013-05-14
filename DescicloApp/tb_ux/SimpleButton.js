/**
 * @param {Object} config the configuration parameters for this button's widget
 */
function SimpleButton(config) {
    this.config = config;

    var self = this,
        style = config.button && config.button.style,
        title = (typeof style.title == "object") ? style.title.text
                                                 : style.title;

    var img = $("<img>", { src: style.icon, alt: title }),
        icon = $("<div>", { "class": "button-icon" }).append(img),
        label = $("<div>", { "class": "button-label", text: style.label }).addClass(style.label ? null : "empty"),
        content = $("<div>", { "class": "button-content clearfix" }).append(icon, label);

    this.$el = $("<div>", { "class": "apn-toolbar-item button simple-button clickable",
                            id: config.id +"-button",
                            title: title
                          }).append(content);

    if (config.button.onclick) {
        var $clicker = this.$el.hasClass("clickable") ? this.$el
                                                      : this.$el.children(".clickable");
        // open a window
        switch (config.button.onclick.action) {
          case "open":
          case "load":
          case "loadPage":
            if (config.windows[config.button.onclick.window].type == "dialog")
                content.addClass("dropdown");

            $clicker.on("click",
                        function (event) {
                            if ($.browser.msie) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            ATB.UX.openWindow(self,
                                              { x: event.screenX, y: event.screenY },
                                              function () {
                                                  ATB.UX.reportButtonClick(self);
                                                  self.addHighlight();
                                              });
                        });
            break;
          case "launchApp":
            // launch an app
            $clicker.on("click",
                        function (event) {
                            ATB.Message.sendLaunchApp(config.button.onclick.app,
                                                      function(succeeded) {
                                                          ATB.UX.reportButtonClick(self);
                                                          if (!succeeded) {
                                                              ATB.Message.sendNavigate({ url: config.button.onclick.app.failureurl });
                                                          }
                                                      });
                        });
        }
    }

    if (config.button.type == "dynamic") {
        function updateButton(props) {
            if (props.icon) {
                img.attr("src", props.icon);
            }
            if (typeof props.label == "string") {
                label.text(props.label);
                if (props.label == "")
                    label.addClass("empty");
                else
                    label.removeClass("empty");
            }
            if (props.title) {
                self.$el.attr("title", props.title);
            }
            // we must reinitialize the carousel when buttons are changed
            ATB.UX.carousel.init();
        }
        function getBadgePattern(val) {
            if (typeof val == "number") {
                return (Math.abs(val) > 10 ? "10plus" : val);
            } else {
                return "exclaim";
            }
        }
        function updateBadge(props) {
             icon.find("div[class^=badge]").remove();
            if (props && props.text) {
                var badge = $('<div/>', {
                    "class": "badge"
                });
                var img = $('<img/>', {
                    src: "images/vanilla/badge_"+getBadgePattern(props.text)+".png"
                });
                icon.append(badge.hide().append(img));
                badge.css("left", icon.position().left + icon.outerWidth() - 6).fadeIn();
            }
        }
        var messaging = new DynamicButtonProtocol("widget button", config.id);
        messaging.sendGetButtonState(undefined, updateButton);
        messaging.receiveSetButtonState(updateButton);
        messaging.receiveSetButtonIcon(function (message) {
                                           updateButton({ icon:message });
                                       });
        messaging.receiveSetButtonLabel(function (message) {
                                            updateButton({ label:message });
                                            ATB.UX.carousel.init();
                                        });
       messaging.receiveSetBadge(function (message, sendResponse) {
                                     updateBadge({ text:message });
                                     if (typeof sendResponse == "function")
                                         sendResponse(true);
                                 });
    }

    ATB.Message.receiveGetButtonPosition(function (id, sendResponse) {
                                             (id == config.id) && sendResponse({ x: self.$el.offset().left });
                                         });

    this.addHighlight = function () {
                            self.$el.addClass('sticky-button');
                        };
    this.removeHighlight = function () {
                               self.$el.removeClass('sticky-button');
                           };
    return this;
}
