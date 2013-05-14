function getWidgetWindow(config, name) {
    if (typeof name == "string")
        return config.windows[name];
    return name;
}

/**
 * @param {Object} config              the configuration parameters for this
 * button's widget
 * @param {jQuery|HTMLElement} parent  the parent element where this button lives
 */
function SearchBox(config) {
    $(document).ready(function(){
        ATB.Message.sendGetCurrentUrl (null, function (url) {
            handleCompetitorAutofill (url);
        });
    });

    this.$el = $($("#search-template").html()).remove();

    var self = this,
        input = this.$el.find("#toolbar-search-input"),
        submit = this.$el.find("#toolbar-search-submit"),
        userInputVal = "";
    
    // themes are added via a class on the button
    if(config.button.theme)
        this.$el.removeClass("default-theme").addClass(config.button.theme);

    var machine = new StateMachine("toolbar-searchbox",
                                   "closed",
                                   { closed: { type: oninput,
                                               success: displaySuggestions,
                                               search: doSearch,
                                               escape: closeSuggestions,
                                               arrow: ignore,
                                               pageload: ignore,
                                               focus: ignore,
                                               closed: ignore
                                             },
                                     displayed: { type: oninput,
                                                  success: updateSuggestions,
                                                  search: doSearch,
                                                  escape: closeSuggestions,
                                                  arrow: moveHighlight,
                                                  pageload: ignore,
                                                  focus: refocusSearch,
                                                  closed: resetMachine
                                                },
                                     searching: { type: ignore,
                                                  success: ignore,
                                                  search: ignore,
                                                  escape: ignore,
                                                  arrow: ignore,
                                                  pageload: resetMachine,
                                                  focus: refocusSearch,
                                                  closed: ignore
                                                }
                                   });

    // transition functions

    function doSearch(event, state) {
        var urlObj = getWidgetWindow(config, "nav").url,
            params = urlObj.params;
        params.q = input.val();
        ATB.Message.sendAddSearchHistory(input.val());
        ATB.Message.sendNavigate({ url: { path: urlObj.path,
                                          params: params
                                        },
                                   basepath: config.basepath
                                 });
        return closeSuggestions();
    }

    function ignore(event, state) { return state; }

    function oninput(event, state) {
        var val = input.val();
        userInputVal = input.val();
        if (val.length >= ATB.CONFIG.SEARCH.SUGGESTION_TRIGGER) {
            ATB.Message.sendGetSearchSuggestions(val, function (ssData) {
                state = machine.success (ssData);
            });
            return state;
        } else {
            return closeSuggestions();
        }
    }

    function displaySuggestions(event, state, data) {
      if ((data.history.length > 0 || data.suggestion.length > 0) && input.val().length > 0) {
          var searchWin = getWidgetWindow(config, "suggest");
          $.extend(searchWin.url, { params: { lang: ATB.Pref.getLang(),
                                              locale: ATB.Pref.getLocale(),
                                              data: data
                                            }
                                  });
          
          ATB.UX.openDialog(config, searchWin, {x: self.$el.offset().left});
          return "displayed";
      }
      return closeSuggestions();
    }

    function updateSuggestions(event, state, data) {
        if ((data.history.length > 0 || data.suggestion.length > 0) && input.val().length > 0) {
            ATB.Message.sendSearchSuggestions(data, function(response) {
                self.$el.addClass('focused');
            });
            return "displayed";
        }
        return closeSuggestions();
    }

    function closeSuggestions(event, state) {
        ATB.Message.sendCloseDropdownWidget();
        return "closed";
    }

    function moveHighlight(event, state, keyCode) {
        ATB.Message.sendKeyPress({ key: keyCode }, function (str) {
            input.val(str);
        });
        return state;
    }

    function refocusSearch(event, state) { input.focus(); return state; }
    function resetMachine(event, state) { return "closed";}

    function keydownHandler(event) {
        if (event.target.id != input.attr('id')) {
            return false;
        }
        if (event.keyCode == 9) {
            machine.escape();
        }
    }

    function keyupHandler(event) {
        if (event.target.id != input.attr('id')) {
            return false;
        }
        switch (event.keyCode) {
            case 13: // enter keystroke
                machine.search();
                break;
            case 38: // up keystroke
            case 40: // down keystroke
                machine.arrow(event.keyCode);
                break;
            // esc keystroke
            case 27:
                userInputVal = $.trim(userInputVal);
                if (userInputVal) {
                    input.val(userInputVal);
                }
                machine.escape();
                break;
            default:
                //IE 7/8 dont support oninput, so call machine.type() in keyuphandler itself
                if($.browser.msie)
                    machine.type();
        }
    }

    function inputHandler(event) {
        if (event.target.id != input.attr('id')) {
            return false;
        }
        machine.type();
    }

    submit.on("click", machine.search);

    // event listeners
    ATB.Message.receiveWidgetClosed(function (id) { if (id == config.id) { machine.closed(); }});
    ATB.Message.receiveNavigated(handleCompetitorAutofill);
    ATB.Message.receiveSetSearchBoxValue(handleAutoFillSBOnTextHighLight);

    function handleAutoFillSBOnTextHighLight(value, tabid) {
        if (ATB.Pref.getAutoFillSBOnTextHighLight()) {
            input.val($.trim(value).substr(0, ATB.CONFIG.SEARCH.TEXT_HIGHLIGHT_N_CHARS_ALLOWED));
        }
    }
    function handleCompetitorAutofill(url) {
        if (ATB.Pref.getCompetitorAutofill()) {
            var autoFillCompetitorRegexArr = ATB.CONSTANT.COMPETITOR_AUTOFILL_REGEX.split('||');
            for (var i = 0; i < autoFillCompetitorRegexArr.length; i++) {
                var regexMatchArr = url.match(autoFillCompetitorRegexArr[i]);
                if(regexMatchArr && regexMatchArr[1]) {
                    var searchTerm = regexMatchArr[1];
                    setTimeout(function() {
                        input.val(decodeURIComponent(searchTerm.replace(/\+/g, " ")));
                    }, 1);
                }
            }
        }
        machine.pageload();
    }
    ATB.Message.receiveUpdateSearchSuggestionInput(function (ss) {
        input.val(ss);
    });
    ATB.Message.receiveSuggestionClicked(function (suggestion) {
         input.val(suggestion);
         machine.search();
    });


    input.focus(function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        self.$el.addClass('focused');

        var inputEvents = input.data("events");
        if (!inputEvents.keyup)
            input.bind('keyup', keyupHandler);
        if (!inputEvents.keydown)
            input.bind('keydown', keydownHandler);

        if (!inputEvents.input && !$.browser.msie)
            input.bind('input', inputHandler);

        try {
//            window.external.GetObject("toolbar").notifyFocusChange(tabId, true);
        } catch (x) {
            console.error(x);
        }

    }).blur(function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        self.$el.removeClass('focused');

        if (window.getSelection && window.getSelection().removeAllRanges)
            window.getSelection().removeAllRanges();

        var inputEvents = input.data("events");
        if (inputEvents.keyup)
            input.unbind('keyup', keyupHandler);

        if (!inputEvents.keydown)
            input.unbind('keydown', keydownHandler);

        if (!inputEvents.input)
            input.unbind('input', inputHandler);

        if ($.browser.msie) {
            ATB.Message.sendSearchSuggestionWidgetStatus({}, function(response) {
                if (!response) {
                    machine.escape();
                }
            });
        }
        try {
//            window.external.GetObject("toolbar").notifyFocusChange(tabId, false);
        } catch (x) {
            console.error(x);
        }
    });

    this.addHighlight = function() { };
    this.removeHighlight = function() { };

    return this;
}
