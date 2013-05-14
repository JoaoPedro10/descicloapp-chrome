if (!ATB.Utils) {
    /**
     * Contain all the utility functions for the TB
     * @namespace
     */
    ATB.Utils = {};
}

/**
 * Contain all the utility functions related to Array
 * @namespace
 */
ATB.Utils.Arr = {
    /**
     * Remove the value from an Array
     * @param arr {Array} The array where to remove the value
     * @param value {Mix} The value you want to remove
     */
    removeValue: function (arr, value) {
        var i = arr.indexOf(value);
        if (i != -1) {
            arr = arr.splice(i, 1);
        }
    }
};

/**
 * utility function for file interaction
 * @namespace
 */
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
        ATB.Utils.File.readJSONFile('config/build.json', callback);
    },
    readManifestJson: function (callback) {
        if($.browser.mozilla) {
            var version;
            var extId = "toolbar_" + ATB.CONSTANT.PID + "@apn.ask.com";
            try {
                // Firefox 4 and later; Mozilla 2 and later
                Components.utils["import"]("resource://gre/modules/AddonManager.jsm");
                AddonManager.getAddonByID(extId, function(addon) {
                    console.log("My extension's" +addon + "version is " + addon.version);
                    version = addon.version;
                    callback({"version": version, "update_url": ""});
                });
            }
            catch (e) {
                // Firefox 3.6 and before; Mozilla 1.9.2 and before
                var em = Components.classes["@mozilla.org/extensions/manager;1"]
                         .getService(Components.interfaces.nsIExtensionManager);
                var addon = em.getItemForID(extId);
                console.log("My extension's version is " + addon.version);
                version = addon.version;
                callback({"version": version, "update_url": ""});
            }
             //Update url not available in FF;
        } else
            ATB.Utils.File.readJSONFile('manifest.json', callback);
    }
};

/**
 * Contain all utility functions for Macro
 * @namespace
 */
ATB.Utils.Macro = {
    /**
     * Find if a string contain macro and return their names if it found some
     *
     * @param {String} inputString The string to test
     * @return Array
     */
    find: function (inputString) {
        return inputString.match(/{(.*?)}/g);
    },
    /**
     * Replace all the macro of a string
     *
     * @param {String} inputString
     * @return {String} The input string with the macro replace by their value
     */
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
    /**
     * Replace one specific macro by it value
     *
     * @param {String} inputString
     * @param {String} macro The name of the macro to search
     * @param {Object} value The value to replace the macro
     * @return {String} The string with macro repalced
     */
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

/**
 * Set up a long-term timer
 * @param {String}   name      name of the timer, for persisting the state
 * between sessions
 * @param {Function} callback  call this function when the timer fires
 * @param {Number}   duration  wait this long (seconds) between calls to the callback
 * @param {Boolean}  [oneshot] true for a one-shot timer
 */
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

    //console.log("%s: initializing timer %s with duration %s", name, name,
    // duration);

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
        var now = new Date().getTime();
        //console.log("%s: timer last fired at %s", name, new Date(lastTime));

        var nextCall = 0;

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
                           //console.log("%s: firing timer", name);
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
        //console.log("%s: timer will next fire in %s seconds at %s", name,
        // nextCall, new Date(now + nextCall));
        timerid = setTimeout(machine.timer, nextCall * 1000);
        return "waiting";
    }

    function done() { return "done"; }
    function cancel() { clearTimeout(timerid); return "cancelled"; }
    this.cancel = function() { machine.cancel(); };

    // the delay is a random time between 5 and 15 seconds
    setTimeout(machine.timer, 5000 + Math.floor(Math.random() * 10001));
};

ATB.Utils.LongTimer.ONE_MINUTE = 60;
ATB.Utils.LongTimer.ONE_DAY = 24 * 60 * 60;

/**
 * Accepts a url object {path, params, basepath (Optional)}, and returns a macro replaced url
 * @param  {Object} urlObj      The url object with {path, params}
 * @param  {String} basepath    url to resolve relative urls against
 * @return {String}             The macro-replaced url constructed from the path/params
 */
ATB.Utils.buildURL = function (urlObj, basepath) {
    var tmp = [],
        url = (typeof urlObj.path == "string") ? urlObj.path
                                               : urlObj.path[ATB.Pref.getLocale()],
        params = urlObj.params;
    if (!/^(https?|chrome):\/\//.test(url))
    {
        //if path is relative
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
