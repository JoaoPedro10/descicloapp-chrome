/**
 * Class managing the install/update operation for the core
 * @constructor
 */

var ATB_Lifecycle = function () {
    if ($.browser.mozilla) {
        var PrefsService = Components.classes
                                     ["@mozilla.org/preferences-service;1"]
                                     .getService(Components.interfaces.nsIPrefService);
    }

    function ignore(event, state) { return state; }

    // initialize all prefs to default values
    function setPrefDefaults() {
        ATB.Pref.setNewTabIsOn(true);
        ATB.Pref.setTbIsVisible(true);
        ATB.Pref.setTabRecentClosed([]);
        ATB.Pref.setSearchHistory([]);
        ATB.Pref.setPartnerID(ATB.CONSTANT.PID);
        ATB.Pref.setDisplaySearchHistory(true);
        ATB.Pref.setClearSearchOnClose(false);
        ATB.Pref.setSAEnabled(true);
        ATB.Pref.setCompetitorAutofill(true);
        ATB.Pref.setAutoFillSBOnTextHighLight(true);
    }

    // read toolbar settings (macros) from the registry
    function doRegistryStuff() {
        function copy(values) {
            //XXX: IE returns a string instead of an object
            if (typeof values == "string") {
                values = JSON.parse(values);
            }
            for (var name in values) {
                var value = values[name];
                ATB.localStorage.set(name, value);
            }
        }

        try {
            var args;

            copy(ATB.Registry.getPostInstallMacroList());
            copy(ATB.Registry.getPostInstallInfoList());

            //Also copy the initial platform version to localStorage and record doi from timeinstalled
            ATB.localStorage.set("itbv", ATB.Registry.getPlatformVersion());
            ATB.localStorage.set("doi", ATB.localStorage.get("timeinstalled").substring(0,10));
        } catch(e) {
            console.error('failed to read registry', e);
        }
    }

    // split language and locale string which are saved in registry in one key in the following format : <language>_<locale>
    function setPrefLocaleLanguage() {
        var langLocaleString = ATB.Pref.getLangLocale();
        if (langLocaleString) {
            var langLocale = langLocaleString.split('_');
            ATB.Pref.setLang(langLocale[0]);
            ATB.Pref.setLocale(langLocale[1]);
        }
    }

    // update our stored version number from the one in our manifest
    function readManifestFile() {
        ATB.localStorage.set(ATB.CONSTANT.PREF.VERSION, ATB.CONSTANT.VERSION);
        ATB.Utils.File.readManifestJson(function (manifest) {
            ATB.localStorage.set(ATB.CONSTANT.PREF.UPDATE_URL, manifest.update_url);
        });
    }

    // copy toolbar settings from build.json
    // includes our revision number
    function copyConfigPrefs() {
        // copy the content of the build.json into the pref
        ATB.Utils.File.readBuildJson(function (build) {
            ATB.Utils.Misc.copyJsonToPref(build);
        });
    }

    // duplicate in background.js
    function isTargetBrowser() {
        try {
            var trgb = ATB.localStorage.get("trgb");
            return ((!trgb) || (trgb.indexOf ($.browser.msie ? "IE" : ($.browser.webkit ? "CR" : "FF")) > -1));
        }
        catch (e) {
            return true;
        }
    }

    // set nthp compliance
    function setPrefCompliance() {
        if (ATB.localStorage.get("nthp") != "1" || !isTargetBrowser() || !ATB.localStorage.get("hpr")) {
            ATB.Pref.setNewTabIsOn(false);
        }
    }

    // if V5 is installed and has SA then disable it, so that V6 can easily take over DNS/KW/SearchPlugin
    function disableFFV5SearchAssist() {
        try {
            var v5br = PrefsService.getBranch("extensions.asktb.");
            if (ATB.Registry.getDefaultSearchPartnerID() == ATB.CONSTANT.PID &&
                v5br.getCharPref("sa-enabled") == "true")
            {
                v5br.setCharPref("sa-enabled", "false");
            }
        } catch(e) {
            // Do nothing
        }

    }

    // send an update.xml check request to the server, for IE
    function queryUpdateServer() {
        console.log("Checking update.xml for updates at:" + ATB.localStorage.get(ATB.CONSTANT.PREF.UPDATE_URL));
        $.ajax({ url: (ATB.localStorage.get(ATB.CONSTANT.PREF.UPDATE_URL)).replace("update.xml", "ie-update.xml") + "?&r=" + Math.random(),
                 dataType: 'text',
                 cache: true,
                 timeout: 5000,
                 type: 'GET',
                 error: machine.error,
                 success: machine.success
               });
    }

    // compare the version number and revision sent by the server to
    // the ones stored in our localstorage and calls installCRX if needed for IE.
    function compareVersionNumbers(response) {
        /**
         * Compare two complex version numbers of any length.
         * @param v1 and v2 are arrays of integers created by splitting the
         * version number.
         * @param v2
         * @return -1, 0 or 1
         */
        function ver_cmp(v1, v2) {
            var a = v1.shift(),
                b = v2.shift();

            if (typeof a == "undefined" && typeof b == "undefined")
                return 0;
            if (typeof b == "undefined")
                return -1;
            if (typeof a == "undefined")
                return 1;
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return ver_cmp(v1, v2);
        }
        function toint(s) { return parseInt(s, 10); }

        var xml = $.parseXML(response);
        var $updatecheckTag = $(xml).find('updatecheck'),
            $appTag = $(xml).find('app'),
            crxPath = $updatecheckTag.attr('codebase'),
            crxVersion = $updatecheckTag.attr('version'),
            minPlatformVersion = $updatecheckTag.attr('minplatform'),
            crxKeyHash = $appTag.attr('appid'),
            crxVersionArr = crxVersion.split(".").map(toint),
            ourVersionArr = ATB.localStorage.get("version").split(".").map(toint);
        if (ver_cmp(crxVersionArr, ourVersionArr)) {
            console.log("Calling Update with path:" + crxPath);
            try {
                window.external.GetObject("toolbar").installCRX(crxPath, crxVersion, crxKeyHash, minPlatformVersion); //TODO; change the 3rd param to reflect platform version
            } catch (x) {
                console.warn(x);
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    // This sets the client property in localStorage to the appropriate browser,
    // which is used by some of the url macros {client} to indicate which browser triggered the call
    function setBrowserClient() {
        var browser;
        if ($.browser.mozilla) {
            browser = "ff";
        } else if ($.browser.msie) {
            browser = "ie";
        } else if ($.browser.webkit) {
            browser = "cr";
        }
        ATB.localStorage.set("client", browser);
    }

    var states = { uninitialized: { install: function() {
                                                 setBrowserClient();
                                                 if ($.browser.mozilla) {
                                                     disableFFV5SearchAssist();
                                                 }
                                                 setPrefDefaults();
                                                 doRegistryStuff();
                                                 setPrefLocaleLanguage();
                                                 readManifestFile();
                                                 copyConfigPrefs();
                                                 setPrefCompliance();
                                                 return ATB.Pref.setInstallState("installed");
                                             },
                                    updateFromV5: function() {
                                                readManifestFile();
                                                copyConfigPrefs();
                                                setPrefCompliance();
                                                return ATB.Pref.setInstallState("installed");
                                            }
                                  },
                   installed: { timer: function() {
                                           queryUpdateServer();
                                           return "updateCheck";
                                       },
                                startup: function () {
                                             readManifestFile();
                                             copyConfigPrefs();
                                             setPrefCompliance();
                                             return "installed";
                                         }
                              },
                   updateCheck: { success: function(event, state, response) {
                                               if (compareVersionNumbers(response)) {
                                                   return "updating";
                                               }
                                               return "installed";
                                           },
                                  error: function(event, state, xhr, textStatus, errorThrown) {
                                             console.error('Reporting - updateAPI call failed: ', textStatus, errorThrown);
                                             return "installed";
                                         }
                                },
                   updating: { timer: ignore }
                 };

    var machine = new StateMachine("lifecycle",
                                   ATB.Pref.getInstallState() || "uninitialized",
                                   states);

    // handle the old boolean install pref
    if (!ATB.Pref.getInstallState()) {
        if (ATB.Pref.getTbIsInstall())
            machine.updateFromV5();
        else {
            machine.install();
        }
    } else {
        machine.startup();
    }

    // we must check for updates every 24 hours, but only if we are in IE.
    if ($.browser.msie)
        var timer = new ATB.Utils.LongTimer("updateAPICallLastTimestamp", machine.timer, ATB.Utils.LongTimer.ONE_DAY);

    // Set the default keyword.URL preference in our own addon.
    if ($.browser.mozilla && isTargetBrowser ()) {
        ATB.KeywordSearch.init();
    }
};
