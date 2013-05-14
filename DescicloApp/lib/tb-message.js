    /**
     *   Handles message passing for all the different parts of the
     * toolbar code.  This class exports two functions for each defined
     * message, one for the sender to call and the other for the
     * receiver. Components that can't communicate directly will have
     * their messages automatically forwarded via the content script.
     *
     * { id, from, to, payload, response }
     *
     * BUG: Due to a Chrome bug, all uses of postMessage have been replaced
     * with the chrome.extension.sendRequest API. Thus at present only
     * widgets, inline html and background widgets that are hosted from
     * inside the extension can send messages.
     */
var ATB_Message = (function() {
        // the different components that can send and receive messages
        var BG     = "background",
            CS     = "content script",
            WIDGET = "widget",
            TB     = "toolbar",
            ALL    = "all";
        var self   = this;

        var decls = [["GetToolbarStatus", CS, BG],
                     ["BGInitialized", BG, ALL],
                     ["GetSideBySideStatus", CS, BG],
                     ["GetTabId", TB, BG],
                     ["OpenToolbar", BG, ALL],
                     ["CloseToolbar", BG, ALL],
                     ["ToggleToolbar", BG, ALL],
                     ["Navigate", [TB, WIDGET, CS], BG],
                     ["NavigateCurrentTab", [TB, WIDGET, CS], BG],
                     ["NavigateNewTab", [TB, WIDGET, CS], BG],
                     ["NavigateNewWindow", [TB, WIDGET, CS], BG],
                     ["Search", [TB, WIDGET], BG],
                     ["AddSearchHistory", [TB, WIDGET], BG],
                     ["GetSearchSuggestions", TB, BG],
                     ["SearchSuggestions", TB, WIDGET],
                     ["SuggestionClicked", WIDGET, TB],
                     ["UpdateSearchSuggestionInput", WIDGET, TB],
                     ["SearchSuggestionWidgetStatus", TB, WIDGET],
                     ["GetSAToggled", WIDGET, BG],
                     ["AnimationFinished", CS, WIDGET],
                     ["ClearSearchHistory", WIDGET, BG],
                     ["CheckWidgetURL", [CS, WIDGET, TB], BG],

                     /**
                        TODO: this function should be able to open arbitrary windows, not just
                              ones defined in the widgets config file.

                        @param {String} id          The id of the widget as defined in the config
                        @param {String} win         A window object, as defined in the config
                        @param {Object} [state]     An optional argument to pass state to the window
                     */
                     ["OpenWidget", [TB, WIDGET], BG],
                     ["GetDropdownWidgetStatus", TB, CS],
                     ["OpenDropdownWidget", [TB, BG], CS],
                     ["CloseDropdownWidget", [TB, WIDGET, BG], CS],
                     ["ResizeDropdownWidget", WIDGET, CS],
                     ["OpenPopup", [TB, WIDGET], BG],
                     ["ClickOnToolbar", [TB, CS], BG],
                     ["ButtonClick", [TB, CS, WIDGET], BG],
                     ["ClickOnAnotherExtension", BG, ALL],
                     ["KeyPress", TB, WIDGET],
                     ["WidgetReady", WIDGET, TB],
                     ["GetFeedData", WIDGET, BG],
                     ["WidgetClosed", CS, TB],
                     ["UpdateToolbarPosition", BG, CS],
                     ["CustomCommand", WIDGET, ALL],
                     ["AjaxRequest", WIDGET, BG],
                     ["Navigated", [BG, CS], ALL],
                     ["AddContentScript", WIDGET, BG],
                     ["GetConfigData", WIDGET, BG],
                     ["GetStoredData", WIDGET, BG],
                     ["SetStoredData", WIDGET, BG],
                     ["LaunchApp", [TB, WIDGET], BG],
                     ["LogError", WIDGET, BG],
                     ["SetDNSHandler", BG, ALL],
                     ["DNSHandlerCheck", CS, BG],
                     ["LocaleIsChanged", WIDGET, BG],
                     ["LangIsChanged", WIDGET, BG],
                     ["UpdateLocale", BG, ALL],
                     ["UpdateLang", BG, ALL],
                     ["SetSearchBoxValue",[BG, CS], TB],
                     ["AreYouStillThere", CS, BG],
                     ["RebuttalClick", BG, TB],
                     ["CallDisableToolbar", WIDGET, BG],
                     ["CloseRebuttal", WIDGET, BG],
                     ["UpdatePrefs", WIDGET, BG],
                     ["GetButtonPosition", CS, TB],
                     ["GetButtonState", TB, WIDGET],
                     ["SetButtonState", WIDGET, TB],
                     ["GetButtonPositionIndex", BG, ALL],
                     ["GetCurrentUrl", [TB, WIDGET], CS]];

        return function ATB_Message(identity, widget) {
                return new Protocol(decls, identity, widget);
        };
})();
