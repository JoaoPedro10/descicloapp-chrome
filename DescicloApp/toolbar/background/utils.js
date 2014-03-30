if (!ATB.Utils) {
    ATB.Utils = {};
}

ATB.Utils.Arr = {
    removeValue: function (arr, value) {
        var i = arr.indexOf(value);
        if (i != -1) {
            arr = arr.splice(i, 1);
        }
    }
};

ATB.Utils.File = {
    readJSONFile: function (fileRelativePath, callback) {
       $.get(chrome.extension.getURL(fileRelativePath), function (json) {
            json = JSON.parse(json);
            if ( typeof callback == "function") {
                callback(json);
            }
        });
    },
    readBuildJson: function (callback) {
        ATB.Utils.File.readJSONFile('toolbar/config/build.json', callback);
    },
    readManifestJson: function (callback) {
            ATB.Utils.File.readJSONFile('manifest.json', callback);
	}
};

ATB.Utils.Macro = {
    find: function (inputString) {
        return inputString.match(/{(.*?)}/g);
    },
    replace: function (inputString) {
        var out = "";
        if (typeof inputString == "number")
            inputString = inputString.toString();
        if (typeof inputString != "string" || inputString.length == 0) {
            return out;
        }
        out = inputString.replace(/{browser-lang}/i, navigator.language);
        out = out.replace(/{random}/i, "" + Math.random() * 1000000000);
        out = out.replace(/{platformversion}/i, "" + ATB.Registry.getPlatformVersion());
        out = out.replace(/{sa_enabled}/i, "" + ATB.Registry.getSAEnabled());
        out = out.replace(/{hpgdisable}/i, "" + ATB.Registry.getHpgdisable());
        out = out.replace(/{ntgdisable}/i, "" + ATB.Registry.getNtgdisable());
        out = out.replace(/{dsgdisable}/i, "" + ATB.Registry.getDsgdisable());

        var macros = ATB.Utils.Macro.find(out), macroName = "", macroStr = "";
        if (macros) {
            for (var i = 0; i < macros.length; i++) {
                macroStr = macros[i];
                if (macroStr == "{query}" || macroStr == "{searchTerms}") {
                    continue;
                }
                macroName = macroStr.substr(1, macroStr.length - 2);
                var macroValue = ATB.localStorage.get(macroName);
                if (typeof macroValue !== "undefined" &&  macroValue !== null) {
                    if (macroName == "o" && $.browser.webkit) // ugh
                        macroValue += "cr";
                    out = out.replace(macroStr, macroValue);
                }
            }
        }
        return out;
    },
    replaceSpecificMacro: function (inputString, macro, value) {
        return inputString.replace("{" + macro + "}", value);
    }
};

ATB.Utils.Misc = {
    copyJsonToPref: function (json) {
        if (!json) {
            return;
        }
        for (var elem in json) {
            ATB.localStorage.set(elem, json[elem]);
        }
    }
};
ATB.Utils.LongTimer = function LongTimer(name, callback, duration, oneshot) {
    if (!name) {
        console.error("LongTimer requires a name");
    }
    if (!callback) {
        console.error("LongTimer requires a callback");
    }
    if (!duration) {
        console.error("LongTimer duration cannot be zero");
    }
    var timerid;
    var machine = new StateMachine(name,
                                   "delay",
                                   { delay: { timer: check,
                                              cancel: cancel
                                            },
                                     waiting: { timer: fire,
                                                cancel: cancel
                                              },
                                     firing: { repeat: function(event, state, now, duration) { return repeat(now, duration); },
                                               done: done,
                                               cancel: cancel
                                             },
                                     done: { },
                                     cancelled: { }
                                   });

    function check() {
        var lastTime = ATB.localStorage.get(name) || 0;
        var now = new Date().getTime();        var nextCall = 0;
        if (now < (lastTime + duration)) {
            nextCall = lastTime + duration - now;
        }

        return repeat(now, nextCall);
    }

    function fire() {
        var now = new Date().getTime();
        ATB.localStorage.set(name, now);
        setTimeout(function() {
                       try {
                           callback();
                       } catch (x) {
                           console.warn("%s: LongTimer callback threw an exception:", name, x);
                       } finally {
                           oneshot ? machine.done()
                                   : machine.repeat(now, duration);
                       }
                   });
        return "firing";
    }

    function repeat(now, nextCall) {
        timerid = setTimeout(machine.timer, nextCall * 1000);
        return "waiting";
    }

    function done() { return "done"; }
    function cancel() { clearTimeout(timerid); return "cancelled"; }
    this.cancel = function() { machine.cancel(); };

    setTimeout(machine.timer, 5000 + Math.floor(Math.random() * 10001));
};

ATB.Utils.LongTimer.ONE_MINUTE = 60;
ATB.Utils.LongTimer.ONE_DAY = 24 * 60 * 60;

ATB.Utils.buildURL = function (urlObj, basepath) {
    var tmp = [],
        url = (typeof urlObj.path == "string") ? urlObj.path
                                               : urlObj.path[ATB.Pref.getLocale()],
        params = urlObj.params;
    if (!/^(https?|chrome):\/\//.test(url))
    {
        url = basepath ? (basepath + url)
                       : chrome.extension.getURL(url);
    }
    url = ATB.Utils.Macro.replace(url);

    if (params) {
        for (var a in params) {
            var param = params[a];
            tmp.push(a + "=" + encodeURIComponent(typeof param == "string" ? ATB.Utils.Macro.replace(param)
                                                                           : JSON.stringify(param)));
        }
        url += (-1 == url.indexOf("?")) ? "?" : "&";
        url += tmp.join("&");
    }
    return url;
};
