function StateMachine(name, initial, states, unexpectedEvent, unknownState) {
    if ((typeof name != "string") || !name) {}
    if ((typeof initial != "string") || !initial) {}
    if ((typeof states != "object") || !states) {}
    if (!(initial in states)) {}
    for (var stateName in states) {}
    var self = this;
    var current = initial;
    this.handleEvent = function (event) {
        Array.prototype.splice.call(arguments, 0, 1, event, current);
        var next = (states[current][event] || logUnexpectedEvent).apply(this, arguments);
        if (!(next && states[next]))
            next = logUnknownState(next, event);
        return (current = next);
    };

    $.each(states, function (state) {
        $.each(states[state], function (event) {
            if (!self[event]) {
                self[event] = function () {
                    Array.prototype.splice.call(arguments, 0, 0, event);
                    return self.handleEvent.apply(self, arguments);
                };
            }
        });
    });

    function logUnexpectedEvent(event) {};
    function logUnknownState(next, event) {};
}

function Hideable(name, doShow, doHide) {
    function onShow() {
        var args = Array.prototype.slice.call(arguments, 2);
        doShow && doShow.apply(null, args);
        return "visible";
    }
    function onHide() {
        var args = Array.prototype.slice.call(arguments, 2);
        doHide && doHide.apply(null, args);
        return "hidden";
    }
    function ignore(event, state) { return state; }

    return new StateMachine(name,
                            "hidden",
                            { visible: { show: ignore,
                                         hide: onHide,
                                         toggle: onHide
                                       },
                              hidden: { show: onShow,
                                        hide: ignore,
                                        toggle: onShow
                                      }
                            });
}

function QuickTimer(callback, duration, repeating) {};
function RepeatingQuickTimer(callback, duration) {
    return new QuickTimer(callback, duration, true);
}
function responder(func) {
    return function (message, sendResponse) {
        sendResponse(func(message));
    };
}
