/**
    The UX Module has the following dependencies:

        - ATB.CONFIG
        - ATB_LocalStorage
        - ATB_Pref
        - ATB_Message

    It also assumes that all button classes are available

        - IFrameButton
        - SimpleButton

    And that the template classes are available

        - SearchBox
*/

var ATB = (function(ATB) {
    /**
        Instantiate messaging protocols
    */
    ATB.localStorage   = new ATB_LocalStorage();
    ATB.Pref           = new ATB_Pref();
    ATB.Message        = new ATB_Message("toolbar");

    /**
        @module Toolbar UX
    */
    var UX = {},

    /*
        config mappings
    */
    mappings = {
        /*
            The following object maps config declarations to
            button constructors. The config declarations can
            come from either the button.type property or the
            button.template property.
        */
        buttons: {
            simple: SimpleButton,
            dynamic: SimpleButton,
            html: IFrameButton,
            SearchBox: SearchBox
        },
        windows: {
            menu: "widgets/templates/menu.html",
            feed: "widgets/templates/feed.html"
        }
    },

    /**
        Stores a reference to all of the buttons
    */
    buttons = {};

    /**
        Stores a reference to the toolbars carousel object
    */
    UX.carousel = new Carousel();

    /**
        Override theme when necessary
        TODO: Build better logic for themeing
    */
    (function() {
        var theme = ATB.CONFIG.TB.DEFAULT_THEME;
        $("link#theme").detach();
        if (theme != "vanilla")
        {
            $("<link>", {
                id: "theme",
                rel: "stylesheet",
                type: "text/css",
                href: "css/"+ theme +".css"
            }).appendTo($("head"));
        }
    })();


    /**
        Init

        This function sets up the UI of the toolbar and all of its
        associated functionality.  It is called when the toolbar loads
        and when the locale is changed from the options widget.
    */
    UX.init = function() {
        // We will always reset the toolbar on init
        $('#left-dock > div, #carousel > div, #right-dock > div').remove();

        /*
            We need to build the left and right docks first because their
            widths are used to build the center dock
        */
        ATB.CONFIG.leftDock.filter(isLocale).filter(isBrowserSupported).forEach(function (config) { makeButton($('#left-dock'), config); });
        ATB.CONFIG.rightDock.filter(isLocale).filter(isBrowserSupported).forEach(function (config) { makeButton($('#right-dock'), config); });

        // update the language
        i18n("toolbar", null, ATB.Pref.getLang());

        //
        initCenterDock();

        // tell other toolbars to close their widgets when we get a click
        $("body").bind("click", function(event) {
            ATB.Message.sendClickOnToolbar();
        });
    };

    /**
     * Replace some macros now, while we have access to the correct values.
     *
     * @param {Object|String} url config object describing a url
     * @param {Object} map of macro keys and values
     */
    UX.replaceMacros = function(url, macros) {
        if(!url) {
            console.error("unknown url!");
            return url;
        }
        /**
        * macro substitution for cruft-free url["path"]
        */
        $.each(macros, function (mkey, mvalue) {
            /**
             * replace macro variables in path with mvalue
             */
            if (typeof url == "string")
                url = url.replace(mkey, mvalue);
            else if (typeof url.path == "string")
                url.path = url.path.replace(mkey, mvalue);
            else if (typeof url.path == "object") {
                var locale = ATB.Pref.getLocale() || ATB.CONSTANT.DEFAULT_LOCALE;
                url.path[locale] = url.path[locale].replace(mkey, mvalue);
            }
        });

        /**
         * macro substitution for params key-value pairs
         */
        if (url.params) {
            for(var key in url.params) {
                if(macros[url.params[key]])
                    url.params[key] = macros[url.params[key]];
            }
        }
        return url;
    };


    /**
        openWindow

        A generic function for opening windows when clicking on tooolbar
        buttons. Ultimately calls the more speficic window opening functions.

        @param {Button} caller          the button instance that is triggering this call
        @param {Event} position         A position object (has x and y coordinate properties)
        @param {Function} callback      callback function
    */
    UX.openWindow = function(caller, position, callback) {
        var config = caller.config,
            win = config.windows[config.button.onclick.window];
        if (!win.url && win.template)
            win.url = { path: mappings.windows[win.template] };
        UX.removeAllHighlights(config.id);

        ATB.Message.sendGetCurrentUrl(null, function (url) {
            var win_copy = $.extend(true, {}, win);
            var params = {"{currentUrl}": url,
                          "{query}": $("#toolbar-search-input").val()};
            win_copy.url = UX.replaceMacros(win_copy.url, params);

            switch (win_copy.type) {
                case "dialog":
                    UX.openDialog(config, win_copy, {x: caller.$el.offset().left, y: position.y}, callback);
                    break;
                case "popup":
                    UX.openPopup(config, win_copy, position, callback);
                    break;
                case "currentTab":
                case "newTab":
                case "newWindow":
                    UX.navigate(config, win_copy, callback);
                    break;
                default:
                    console.log("unknown window type");
            }
        });

    };

    /**
        openDialog

        @param {Object} config      A widget configuration object
        @param {Object} win         A window object from a widget configuration
        @param {Object} position    A position object (has x and y coordinate properties)
        @param {Function} callback  A callback function that will be called after window opens
    */
    UX.openDialog = function(config, win, position, callback) {
        UX.closeWindows(function() {
            $('body').bind('click', UX.closeWindows);
            ATB.Message.sendOpenDropdownWidget({ id: config.id,
                                                 basepath: config.basepath,
                                                 win: win,
                                                 position: position
                                               },
                                               callback);
        });
    };

    /**
        openPopup

        @param {Object} config      A widget configuration object
        @param {Object} win         A window object from a widget configuration
        @param {Object} position    A position object (has x and y coordinate properties)
        @param {Function} callback  A callback function that will be called after window opens
    */
    UX.openPopup = function(config, win, position, callback) {
        ATB.Message.sendOpenPopup({ id: config.id,
                                    basepath: config.basepath,
                                    win: win,
                                    position: position
                                  },
                                  callback);
    };

    /**
        navigate

        @param {Object} config      A widget configuration object
        @param {Object} win         A window object from a widget configuration
        @param {Function} callback  A callback function that will be called after window opens
    */
    UX.navigate = function(config, win, callback) {
        ATB.Message.sendNavigate({ url: win.url,
                                   basepath: config.basepath
                                 },
                                 callback);
    };

    /**

    */
    UX.closeWindows = function(callback) {
        try {
            $('body').unbind('click', UX.closeWindows);
        } catch (x) {
            ; // do nothing
        }

        UX.removeAllHighlights();
        ATB.Message.sendCloseDropdownWidget(null, callback);
    };

    /**
        Responsible for launching an App
    */
    UX.launchApp = function(app) {
        ATB.Message.sendLaunchApp(app);
    };

    /**

    */
    UX.getButtonPositionIndex = function(id) {
        var index;
        $(".aloogle-toolbar-item").each(function(i, el) {
            if( $(el).attr("id") == (id + "-button") ) {
                index = i;
                return;
            }
        });
        return index;
    }

    /**
        reportButtonClick

        Sends a message to the background to report when a button is clicked. The
        reporting requires the buttonName and buttonPosition. The buttonPosition is
        0 indexed, starting with the searchbox and moving left to right.

        @param {Button} button  Expects an instance of a button
    */
    UX.reportButtonClick = function(button) {
        ATB.Message.sendButtonClick({
            buttonName: button.config.id,
            buttonPosition: UX.getButtonPositionIndex(button.config.id)
        });
    };

    /**
        removeAllHighlights

        @param {string} except  The id of a button to exclude
    */
    UX.removeAllHighlights = function(except) {
        for (var id in buttons) {
            var widget = buttons[id];
            if (widget.name != except)
                widget.removeHighlight();
        }
    };



    /**
        initCenterDock

        The center dock has a variable width that must be set explicitly
        once the widths of the right and left dock have been determined.
        However these widths aren't known until all images in these docks
        have been loaded.

        In addition the widget carousel can't be initialized until all
        of the images in the reel have loaded
    */
    function initCenterDock() {
        var $toolbarCenter = $("#toolbar-center"),
            $carousel = $("#carousel");
        var win = $(window);

        whenWindowWidth(function () {
            onAllImagesLoaded($("#left-dock img, #right-dock img"), function() {
                $toolbarCenter.css({ left: $("#toolbar-left").outerWidth(true), width: toolbarCenterWidth() });
                bgImgAdj();
                ATB.CONFIG.centerDock.filter(isLocale).filter(isBrowserSupported).forEach(function (w) { makeButton($carousel, w); });
                onAllImagesLoaded($carousel.find("img"), function() {
                    ATB.UX.carousel.init();
                });
            });
        });

        // attach to resize
        $(window).unbind("debouncedresize").on("debouncedresize", function(event) {
            $toolbarCenter.width( toolbarCenterWidth() );
            ATB.UX.carousel.init();
            bgImgAdj();
        });

        function toolbarCenterWidth() {
            var ww = win.width(),
                ldw = $("#toolbar-left").outerWidth(true),
                rdw = $("#toolbar-right").outerWidth(true);
            return ww - ldw - rdw;
        }

        // seriously, we often get called before the html element has
        // any width at all
        function whenWindowWidth(callback) {
            ww = win.width();
            if (!ww)
                setTimeout(function () { whenWindowWidth(callback); }, 16);
            else
                callback && callback();
        }

        function onAllImagesLoaded($images, callback) {
            var num = $images.length, loaded = 0, done;
            var timeout = setTimeout(callback, 1000);
            $images.one('load', function () {
                if (done || $(this).width() <= 0 || $(this).height() <= 0)
                    return;
                if (++loaded == num) {
                    callback();
                    clearTimeout(timeout);
                    done = true;
                }
            }).each(function() {
                if(this.complete) $(this).trigger('load');
            });
        }

        /**
            Adjusts the background position for the center and right docks
            so that the horizonal gradient in IE looks correct.
        */
        function bgImgAdj() {
            var $c = $("#toolbar-center"), $r = $("#toolbar-right");
            $c.css("background-position", (0 - $c.position().left) + "px 0px");
            $r.css("background-position", (0 - $r.position().left) + "px 0px");
        }
    }

	var index = 0;
    function makeButton(elem, config) {
        try {
            var button;
            if (config.button.template)
                button = new mappings.buttons[config.button.template](config, elem);
            else if (config.button.type)
                button = new mappings.buttons[config.button.type](config, elem);
            else
                console.log("unknown button type");
            buttons[config.id] = button;
            elem.append(button.$el);
        }
        catch (e) {
            try {
                console.error("Error creating widget: " + config.id + ", " + e);
            }
            catch (f) {
                // XXX ajvincent Commence swearing.
            }
        }
    }

    /**
        isLocale

        Filter function for showing/hiding buttons
    */
    function isLocale(element, index, array) {
        if (element.locales)
            return element.locales.indexOf(ATB.Pref.getLocale() || ATB.CONSTANT.DEFAULT_LOCALE) != -1;
        return true;
    }

    /**
        isBrowserSupported

        Filter function for showing/hiding buttons
    */
    var browser = $.browser.msie ? "IE" : ($.browser.webkit ? "CR" : "FF");
    function isBrowserSupported(element, index, array) {
        if (element.browsers)
            return element.browsers.indexOf(browser) != -1;
        return true;
    }

    // assign the module to the global namespace
    ATB.UX = UX;
    return ATB;
})(ATB);

ATB.Message.receiveWidgetClosed(ATB.UX.removeAllHighlights);
ATB.Message.receiveUpdateLocale(ATB.UX.init);
ATB.Message.receiveUpdateLang(ATB.UX.init);
ATB.Message.receiveGetButtonPositionIndex(function(id, sendResponse, sender) {
    sendResponse( ATB.UX.getButtonPositionIndex(id) );
});

/*
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
(function ($) {

var $event = $.event,
    $special,
    resizeTimeout;

$special = $event.special.debouncedresize = {
    setup: function() {
        $( this ).on( "resize", $special.handler );
    },
    teardown: function() {
        $( this ).off( "resize", $special.handler );
    },
    handler: function( event, execAsap ) {
        // Save the context
        var context = this,
            args = arguments,
            dispatch = function() {
                // set correct event type
                event.type = "debouncedresize";
                $event.dispatch.apply( context, args );
            };

        if ( resizeTimeout ) {
            clearTimeout( resizeTimeout );
        }

        execAsap ?
            dispatch() :
            resizeTimeout = setTimeout( dispatch, $special.threshold );
    },
    threshold: 150
};

})(jQuery);
