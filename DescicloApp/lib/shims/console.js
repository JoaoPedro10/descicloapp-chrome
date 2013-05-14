/**
    This shim is responsible for ensuring that the console
    object has all of the methods that we expect it to have.
*/
(function(window) {
    
    var _console = window.console || {},
        
    /*
        Nice little browser detector borrowed from jQuery
    */
    browser = (function() {
        var browser = {webkit: false, opera: false, msie: false, mozilla: false},
        rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
        ua = window.navigator.userAgent.toLowerCase(),
        match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) ||
                ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
        browser[match[1]] = true;
        return browser;
    })(),
     
     
     /*
        Turns any number of arguments into a single string
     */
     stringify = function() {
        var string = "";
        for(var i=0, j=arguments.length; i<j; i++) {
            if(i > 0)
                string += ", ";
            if(typeof arguments[i] == "string")
                string += arguments[i];
            else if(window.JSON)
                string += window.JSON.stringify(arguments[i]);
            else if(typeof arguments[i].toSource == "function")
                string += arguments[i].toSource();
            else if(typeof arguments[i].toString == "function")
                string += arguments[i].toString();
            else
                string += "[unstringifyable argument]";
         }
         return string + "\n";
     },
     
     
     /*
         Our private alert function that ensures the real alert
         is only ever called with one argument, which is stringified
     */
     doAlert = function() {
         window.alert(stringify(arguments));
     },
     
     
     /*
        Why even ask.
     */
     afunc = function() {};
    
    
    /*
        IE SHIM: uses window.external to get the logger object
    */
    if(browser.msie && typeof window.external != "undefined") {
        var ieshim = window.external.GetObject("logger");
        if(typeof ieshim == "object") {
            _console.log = function() { ieshim.log.call(this, stringify(arguments)) };
            _console.error = function() { ieshim.error.call(this, stringify(arguments)) };
            _console.info = function() { ieshim.info.call(this, stringify(arguments)) };
            _console.warn = function() { ieshim.warn.call(this, stringify(arguments)) };
            _console.dir = function() { ieshim.dir.call(this, stringify(arguments)) };
            _console.debug = function() { ieshim.debug.call(this, stringify(arguments)) };
            _console.group = function() { ieshim.group.call(this, stringify(arguments)) };
            _console.groupCollapsed = function() { ieshim.groupCollapsed.call(this, stringify(arguments)) };
            _console.groupEnd = function() { ieshim.groupEnd.call(this) };;
        }
    }
    
    /*
        FF SHIM
    */
    if(browser.mozilla) {
        if (typeof window.console == "undefined") {
            _console.log = function () { dump("##Log##    " + stringify(arguments)); };
            _console.error = function () { dump("**Error** " + stringify(arguments)); };
            _console.info = function () { dump("^^Info^^     " + stringify(arguments)); };
            _console.warn = function () { dump("@@Warn@@     " + stringify(arguments)); };
            _console.dir = function () { dump("##Dir##     " + stringify(arguments)); };
            _console.debug = function () { dump("##Debug##    " + stringify(arguments)); };
            _console.groupCollapsed = function () { dump("++Group Start+++++++\n" + stringify(arguments)); };
            _console.groupEnd = function () { dump("++Group End+++++++++\n"); };
        }
    }
    
    /*
        LAST RESORT: for all console functions we absolutely need
    */
    _console.log = _console.log || doAlert;
    _console.error = _console.error || doAlert;
    _console.info = _console.info || afunc;
    _console.warn = _console.warn || afunc;
    _console.dir = _console.dir || _console.log;
    _console.debug = _console.debug || afunc;
    _console.group = _console.group || afunc;
    _console.groupCollapsed = _console.groupCollapsed || afunc;
    _console.groupEnd = _console.groupEnd || afunc;
    
    // assign local _console back to window
    window.console = _console;
    
})(window || content.window);
