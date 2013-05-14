/**
    @namespace Unified Reporting (UT) Module
*/
var UR = (function(window, $, UR, undefined) {

    /*
        Reporting Constants
    */
    UR.PHONE_HOME_PIXEL = "http://phn.apnanalytics.com/tr.gif?";
    UR.TRACKING_PIXEL = "http://anx.apnanalytics.com/tr.gif?";

    /*
        Determines Scope of this file
    */
    var inChromeScope = window.location.href.indexOf("http://") === -1;

    /*
        These variables will be passed on all reporting calls
    */
    var defaults = {

        /* code versioning */
        anxtv: "",                  // platform version
        anxv: "",                   // setting to the same as anxtv for backwards compatability
        crxv: "",                   // CRX version
        
        /* toolbar and partner */
        anxt: "",                   // guid
        tpid: "",                   // partner id
        anxp: "",                   // cobrand id + track id (cbid + dtid)
        o: "",                      // o code

        /* client tracking */
        apn_dbr: "",                // default browser on install
        locale: "",                 // client locale
        
        /* reporting event */
        anxa: "",                   // the application that is logging the entry, for example "APNToolbar"
        anxe: "",                   // the type of event that caused the log entry, refer to the value defined in each payload table
        
        /* cache busting */
        anxr: (new Date()).getTime()

    };

    /*
        Fills out reporting variables from localstorage (v6 core)
    */
	function reloadReportingParams() {
		if( ATB && ATB.localStorage && ATB.Registry ) {
			defaults.anxtv = ATB.Registry.getPlatformVersion() || "";
			defaults.anxv = defaults.anxtv;
			defaults.crxv = ATB.localStorage.get("version") || "";

			defaults.anxt = ATB.localStorage.get("guid") || "";
			defaults.tpid = ATB.localStorage.get("tb") || "";
			defaults.anxp = ATB.localStorage.get("p2") || (ATB.localStorage.get("cbid") + ATB.localStorage.get("dtid")) || "";
			defaults.o = ATB.localStorage.get("o") || "";

			defaults.apn_dbr = ATB.localStorage.get("dbr") || "";
			defaults.locale = ATB.localStorage.get("locale") || "";
		}
	}
	reloadReportingParams();

    /*
        Gets any reporting parameters passed as query parameters
        This is used when this script is included in widgets and
        inline-html buttons
    */
    var query = decodeURI(window.location.search.substr(1)).split('&');
    for(var i=0; i<query.length; i++) {
        var p = query[i].split("=");
        if (p.length != 2) continue;
        if(p[0] in defaults)
            defaults[p[0]] = decodeURIComponent( p[1].replace(/\+/g, " ") );
    }

    /*
        Cross domain AJAX requests aren't allowed when running
        outside of chrome scope so we will use traditional pixel
        reporting by setting the source of an image.
    */
    if(!inChromeScope) {
        var pixelId = "unified-tracker",
            pixel = document.getElementById(pixelId),
            parent = document.body;

        if (!pixel) {
            pixel = document.createElement("img");
            pixel.setAttribute("id", pixelId);
            pixel.setAttribute("style", "display: none;");
            parent.appendChild(pixel);
        }
    }

    /**
        @private
        Builds a query string from an object of key/value pairs
    */
    function queryString(params) {
        var tmp = [];
        for (var a in params) { tmp.push(a + "=" + encodeURIComponent(params[a])); }
        return tmp.join("&");
    }

    /**
        @private
        Executes a reporting call

        @param {Object} params
        @param {String} params.pixelurl
        @param {Object} params.params
        @param {Function} [params.success]
        @param {Function} [params.error]
    */
    function report(params) {
	    params.params.anxr = (new Date()).getTime();
        var url = params.pixelurl + queryString(params.params);
        if(inChromeScope) {
            $.ajax({
                url: url,
                type: 'GET',
                success: function() { typeof params.success == "function" && params.success.call() },
                error: function() { typeof params.error == "function" && params.error.call() }
            });
        }
        else {
            pixel.src = url;
        }
    }

    /**
        Returns the default reporting paramaters

        @returns {Obect} defaults
    */
    UR.reportingParams = function() {
        return defaults;
    }

    /**
        Called once a day from every toolbar

        Set fparam...please refer APNVSIX-1371
    */
    UR.phoneHome = function() {
        var self = this, fparam = "";

        if($.browser.mozilla)
            fparam += "05000090";
        else if($.browser.webkit)
            fparam += "04000000";
        else if($.browser.msie) {
            if($.browser.version >= 9)
                fparam += "00000060";
            else if($.browser.version >= 8)
                fparam += "00000050";
            else if($.browser.version >= 7)
                fparam += "00000030";
        }

        var params = $.extend({}, defaults, {
            anxa: "APNToolbar",
            anxe: "PhoneHome",
            fparam: fparam
        });
        report({
            pixelurl: UR.PHONE_HOME_PIXEL,
            params: params,
            success: function() { console.log("Phone home successful at :" + new Date().getTime(), params) },
            error: function() { window.setTimeout(self, 1000 * 60 * 5) }
        });
    }

    /**
        Tracks the clicks of buttons in the toolbar

        @param {String} buttonName
        @param {Number} buttonPosition
    */
    UR.buttonClick = function(buttonName, buttonPosition) {
	    reloadReportingParams();
        var params = $.extend({}, defaults, {
            anxa: "APNButtons",
            anxe: "ButtonClick",
            buttonName: buttonName,
            buttonPosition: buttonPosition
        });
        report({pixelurl: UR.TRACKING_PIXEL, params: params});
    }

    /**
        Tracks the clicks of menu buttons in the toolbar
        Requires the following parameters:

        @param {String} buttonName
        @param {Number} buttonPosition any positive integer
        @param {String} menuName
        @param {Number} menuPosition any positive integer
    */
    UR.menuItemClick = function(buttonName, buttonPosition, menuName, menuPosition) {
        var params = $.extend({}, defaults, {
            anxa: "APNButtons",
            anxe: "MenuItemClick",
            buttonName: buttonName,
            buttonPosition: buttonPosition,
            menuName: menuName,
            menuPosition: menuPosition
        });
        report({pixelurl: UR.TRACKING_PIXEL, params: params});
    }

    /**
        Enables the reporting of user interaction events in widgets.

        @param {String} key
        @param {String} value
    */
    UR.track = function(key, value) {
        var params = $.extend({}, defaults, {
            anxa: "APNButtons",

            // a generic event type?
            anxe: "",

            // these parameters are not finalized
            buttonKey: key,
            buttonValue: value
        });
        // report({pixelurl: UR.TRACKING_PIXEL, params: params});
        console.log("UR.track is not yet implemented");
    }

    return UR;
}(window, jQuery, UR || {}));
