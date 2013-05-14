"use strict";
/**
 * Class for handling all interactions with the windows registry (or
 * platform equivalent)
 *
 * The goal here is to have a series of public methods which
 * manipulate the registry, and which do so by calling the private
 * methods. The private methods are specialized to work differently on
 * different platforms, while the public methods then work on any
 * platform.
 *
 * Note also that the registry key and value names are hard-coded here
 * rather than put in constants.js. This is simply because the extra
 * complexity of splitting the information across multiple files has
 * no benefit; no other file will ever refer to these strings
 * directly.
 *
 * TODO: the private methods should be true private functions
 */
(function(ATB, $) {
    ATB.Registry = {

        /**
         * This function extracts the PID of the toolbar which was last installed on FF with "SA" turned on.
         * We need to go through each toolbar in the list of toolbars installed on the machine and check the "trgb"
         * key, to see if the toolbar was installed on the current browser or not. By checking the above and iterating
         * through the list we can determine which toolbar which was last installed on FF with "SA" turned on.
         * XXX awin: concatenating partner id for registry key is required because the regisry is organized as
         * HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\AskPartnerNetwork\Toolbar\partner_id\macro\trgb.
         * This pattern of orgnization of the registry key is fixed and can not be changed.
         */
        getDefaultSearchPartnerID: function() {
             // Get the list of all toolbars installed on the machine in an array
            var br = $.browser.msie ? "IE" : ($.browser.webkit ? "CR" : "FF");
            var tbs = BrowserRegistry.get("HKLM",
                                          "Software\\AskPartnerNetwork\\Toolbar\\shared",
                                          "tbsinstalled");
            var tbsArr = tbs.split(",").reverse();

            // Iterate through the list of tbs installed, to find out which toolbar was last installed on this browser
            // with SA turned on
            for(var i = 0; i < tbsArr.length; i++) {
                try {
                    var currTrgb = BrowserRegistry.get("HKLM",
                                                       "Software\\AskPartnerNetwork\\Toolbar\\" + tbsArr[i] + "\\Macro",
                                                       "trgb");
                } catch (e) {
                    return tbsArr[i];
                }
                if (!currTrgb || (currTrgb.indexOf(br) > -1)) {
                    return tbsArr[i];
                }
            }
            return "";
        },

        getHpgdisable: function() {
            try {
                return BrowserRegistry.get("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\Updater", "hpgdisable");
            }
            catch (e) {
                console.log ('error getHpgdisable: ' + e.toString());
                return null; // xxx awin: returning null instead of undefined because Google Chrome plugin return null if registry key does not exist instead of throwing exception
            }
        },

        setHpgdisable: function(newHpgdisable) {
            try {
                BrowserRegistry.set("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\Updater", "hpgdisable", parseInt(newHpgdisable, 10));
            }
            catch (e) {
                console.log ('error setHpgdisable: ' + e.toString());
            }
        },

        getNtgdisable: function() {
            try {
                return BrowserRegistry.get("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\Updater", "ntgdisable");
            }
            catch (e) {
                console.log ('error getNtgdisable: ' + e.toString());
                return null; // xxx awin: returning null instead of undefined because Google Chrome plugin return null if registry key does not exist instead of throwing exception
            }
        },

        setNtgdisable: function(new_ntgdisable) {
            try {
                BrowserRegistry.set("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\Updater", "ntgdisable", parseInt(new_ntgdisable, 10));
            }
            catch (e) {
                console.log ('error setNtgdisable: ' + e.toString());
            }
        },

        getDsgdisable: function() {
            try {
                return BrowserRegistry.get("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\Updater", "dsgdisable");
            }
            catch (e) {
                console.log ('error getDsgdisable: ' + e.toString());
                return null; // xxx awin: returning null instead of undefined because Google Chrome plugin return null if registry key does not exist instead of throwing exception
            }
        },

        setDsgdisable: function(new_dsgdisable) {
            try {
                BrowserRegistry.set("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\Updater", "dsgdisable", parseInt(new_dsgdisable, 10));
            }
            catch (e) {
                console.log ('error setDsgdisable: ' + e.toString());
                console.log (e);
            }
        },

        launchApp: function(message) {
            return BrowserRegistry.launchApp(message);
        },

        getPostInstallMacroList: function() {
            return BrowserRegistry.getList("HKLM", "Software\\AskPartnerNetwork\\Toolbar\\" + ATB.CONSTANT.PID + "\\Macro");
        },

        getPostInstallInfoList: function() {
            return BrowserRegistry.getList("HKLM", "Software\\AskPartnerNetwork\\Toolbar\\" + ATB.CONSTANT.PID + "\\Info");
        },

        getPlatformVersion: function() {
            return BrowserRegistry.get("HKLM", "Software\\AskPartnerNetwork\\Toolbar", "PlatformVersion");
        },

        getNewTabPID: function() {
            return BrowserRegistry.get("HKLM", "Software\\AskPartnerNetwork\\Toolbar\\shared", "tbsinstalled");
        },

        getSAEnabled: function() {
            return BrowserRegistry.getSAEnabled();
        },

        setSA: function(val) {
            return BrowserRegistry.setSA(val);
        },

        // FF only, see keywordSearch.js
        getKeywordURLPending: function() {
            return BrowserRegistry.get("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\shared\\ff", "update_kw") === "1";
        },

        // FF only, see keywordSearch.js
        setKeywordURLPending: function() {
            BrowserRegistry.set("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\shared\\ff", "update_kw", 1);
        },

        // FF only, see keywordSearch.js
        setKeywordURLEnabled: function(val) {
            BrowserRegistry.set("HKCU", "Software\\AskPartnerNetwork\\Toolbar\\shared\\ff", "kw_enabled", val ? 1 : 0);
        }
    };

    function NOT_IMPLEMENTED() {
        throw new Error("Not implemented!");
    }

    // Stub implementation, in case $.browser's properties haven't been established yet.
    // We'll replace this with a browser-specific implementation in the call to this.checkSelf().
    var BrowserRegistry = {
        /**
         * Get a registry key.
         *
         * @param {String}  hive   The registry hive.
         * @param {String}  path   The path to the registry key
         * @param {String}  subkey The actual key's leaf name.
         *
         * @see REGPATHS for supported registry keys
         *
         * @returns The registry value matching the key.
         */
        get: NOT_IMPLEMENTED,

        /**
         * Set a registry key's value.
         *
         * @param {String}  hive   The registry hive.
         * @param {String}  path   The path to the registry key
         * @param {String}  subkey The actual key's leaf name.
         * @param {Variant} value  The value to set.
         *
         * @see REGPATHS for supported registry keys
         */
        set: NOT_IMPLEMENTED,

        /**
         * Get a mapping of registry keys.
         *
         * @param {String}  hive   The registry hive.
         * @param {String}  path   The path to the registry key
         * @param {String}  subkey The actual key's leaf name.
         *
         * @returns {Object} with named properties reflecting the existing entries.
         */
        getList: NOT_IMPLEMENTED,

        /**
         * Create a registry key path.
         *
         * @param {String}  hive   The registry hive.
         * @param {String}  path   The path to the registry key
         * @param {String}  subkey The actual key's leaf name.
         *
         * @note This is not implemented for Mozilla Firefox.
         */
        create: NOT_IMPLEMENTED,

        /**
         * Remove a registry entry.
         *
         * @param {String}  hive   The registry hive.
         * @param {String}  path   The path to the registry key
         * @param {String}  subkey The actual key's leaf name.
         *
         * @note This is not implemented for Google Chrome or Internet Explorer.
         */
        remove: NOT_IMPLEMENTED,

        /**
         * Launch an application!
         *
         * @param {Object} message Instructions on what to launch.
         *
         * The message must have either a path or a regkey object with hive,
         * subpath and valuename properties to look up the path and args in the
         * registry.
         *
         * The message should also have an args property (indicating
         * arguments) as an array.
         */
        launchApp: NOT_IMPLEMENTED,

        /**
         * Determine if Search Assist feature is enabled.
         *
         * @returns {Boolean} True if it is.  False if it isn't.
         */
        getSAEnabled: NOT_IMPLEMENTED,

        /**
         * Set whether Search Assist is enabled or not.
         *
         * @param val {Boolean} True if it should be enabled.  False if it should not.
         *
         * @note This is not implemented for Google Chrome.
         */
        setSA: NOT_IMPLEMENTED
    };

    /**
     * Get the path and argument string to launch an application with.
     *
     * @param browserReg {Object}  Either WebkitRegistry, MSIERegistry, or MozillaRegistry.
     * @param message    {Message} The instructions for how to find the application.
     *
     * @returns {
     *   path: The application's location.
     *   argString: The concatenated list of arguments, processed for macros.
     * }
     */
    function getPathAndArgString(browserReg, message) {
        var path, args, finalArgs, rv;
        if (message.path) {
            path = message.path;
            args = message.args || [];
        }
        else {
            // We should have a regkey property.  Look up the registry data from there.
            try {
                path = browserReg.get(
                    message.regkey.hive,
                    message.regkey.subpath,
                    message.regkey.valuename
                );
            }
            catch (e) {
                console.error(e);
            }

            if (message.leafname) {
                path += "\\" + message.leafname;
            }
            args = message.args;
        }

        if (!path)
            throw new Error("undefined argument to launchApp");

        var l = args.length;
        finalArgs = [];

        for (var i = 0; i < l; i++) {
            finalArgs.push(ATB.Utils.Macro.replace(args[i]));
        }

        return {
            path: path,
            args: finalArgs
        };
    };

    function executeWK(methodName, args) {
        var id = "apn-" + ATB.CONSTANT.PID + "-chrome-util-plugin";
        var WKPlugin = document.getElementById(id);
        var found = Boolean(WKPlugin);
        if (!found) {
            WKPlugin = document.createElement("embed");
            WKPlugin.setAttribute("id", id);
            WKPlugin.setAttribute("type", "application/x-ask-chromeutil-for-" + ATB.CONSTANT.PID);
            document.documentElement.appendChild(WKPlugin);
        }

        var rv = null;
        try {
            rv = WKPlugin[methodName].apply(WKPlugin, args);
        }
        catch (e) {
            console.error(e);
        }

        if (!found)
            document.documentElement.removeChild(WKPlugin);
        return rv;
    };

    var WebkitRegistry = {
        get: function(hive, path, subkey) {
            return executeWK("GetRegValue", arguments);
        },

        set: function(hive, path, subkey, value) {
            return executeWK("SetRegValue", arguments);
        },

        getList: function(hive, path) {
            return executeWK("GetRegValueList", arguments);
        },

        create: function(hive, path, subkey) {
            return executeWK("CreateRegKey", [hive, path]);
        },

        remove: NOT_IMPLEMENTED,

        launchApp: function(message) {
            var launchObj = getPathAndArgString(WebkitRegistry, message);
            return executeWK("LaunchApp", [launchObj.path, launchObj.args.join(" ")]);
        },

        getSAEnabled: function() {
            return true;
        },

        setSA: NOT_IMPLEMENTED
    };

    var IERegistryHelper = {
        registry: null,
        getRegistry: function() {
            if (!this.registry) {
                this.registry = window.external.GetObject("registry");
            }
            return this.registry;
        },

        process: null,
        getProcess: function() {
            if (!this.process) {
                this.process = window.external.GetObject("process");
            }
            return this.process;
        },

        toolbar: null,
        getToolbar: function() {
            if (!this.toolbar) {
                this.toolbar = window.external.GetObject("toolbar");
            }
            return this.toolbar;
        }
    };

    var MSIERegistry = {
        get: function(hive, path, subkey) {
            return IERegistryHelper.getRegistry().GetRegValue(hive, path, subkey);
        },

        set: function(hive, path, subkey, value) {
            return IERegistryHelper.getRegistry().SetRegValue(hive, path, subkey, value);
        },

        getList: function(hive, path) {
            return IERegistryHelper.getRegistry().GetRegValueList(hive, path);
        },

        create: function(hive, path) {
            return IERegistryHelper.getRegistry().CreateRegKey(hive, path);
        },

        remove: NOT_IMPLEMENTED,

        launchApp: function(message) {
            var launchObj = getPathAndArgString(MSIERegistry, message);

            try {
                var args = launchObj.args.join(" ");
                IERegistryHelper.getProcess().shellExecute(launchObj.path, args);
                return true;
            }
            catch (e) {
                console.warn("application launch failed for " + path + ", " + e);
                return false;
            }
        },

        getSAEnabled: function() {
            try {
                return IERegistryHelper.getToolbar().enableSA;
            }
            catch (e) {
                return true;
            }
        },

        setSA: function(val) {
            IERegistryHelper.getToolbar().enableSA = val;
        }
    };

    var MozRegistry = null;
    var ffKeyMap = {
        HKLM: "ROOT_KEY_LOCAL_MACHINE",
        HKCU: "ROOT_KEY_CURRENT_USER",
        HKCR: "ROOT_KEY_CLASSES_ROOT"
    };
    var MozRegistryHelper = {
        initRegistry: function() {
            if (!MozRegistry)
                MozRegistry = Components.classes["@mozilla.org/windows-registry-key;1"]
                                        .createInstance(Components.interfaces.nsIWindowsRegKey);
        },

        initServices: function() {
            if (typeof Services != "object")
                Components.utils["import"]("resource://gre/modules/Services.jsm");
        }
    };

    var MozillaRegistry = {
        get: function(hive, path, subkey) {
            MozRegistryHelper.initRegistry();
            try {
                MozRegistry.open(MozRegistry[ffKeyMap[hive]], path, MozRegistry.ACCESS_READ);
                var regValue = MozRegistry.readStringValue(subkey);
                MozRegistry.close();

                return regValue;
            }
            catch (e) {
                return "";
            }
        },

        set: function(hive, path, subkey, value) {
            MozRegistryHelper.initRegistry();
            try {
                MozRegistry.open(MozRegistry[ffKeyMap[hive]], path, MozRegistry.ACCESS_WRITE);
            } catch(e) {
                MozRegistry.create(MozRegistry[ffKeyMap[hive]], path, MozRegistry.ACCESS_ALL);
            }
            var regValue = MozRegistry.writeStringValue(subkey, value);
            MozRegistry.close();
            return true;
        },

        getList: function(hive, path) {
            MozRegistryHelper.initRegistry();
            var regMap = {};
            MozRegistry.open(MozRegistry[ffKeyMap[hive]], path, MozRegistry.ACCESS_READ);
            var count = MozRegistry.valueCount;
            for (var i = 0; i < count; ++i) {
                var vn = MozRegistry.getValueName(i);
                if (MozRegistry.getValueType(vn) == MozRegistry.TYPE_STRING) {
                    regMap[vn] = MozRegistry.readStringValue(vn);
                }
            }

            MozRegistry.close();
            return regMap;
        },

        create: function(hive, path) {
            MozRegistryHelper.initRegistry();
            MozRegistryHelper.create(MozRegistry[ffKeyMap[hive]], path, MozRegistry.ACCESS_ALL);
            MozRegistry.close();
            return true;
        },

        remove: function(hive, path, subkey) {
            MozRegistryHelper.initRegistry();

            MozRegistry.open(MozRegistry[ffKeyMap[hive]], path, MozRegistry.ACCESS_READ);
            var regValue = MozRegistry.removeValue(subkey);
            MozRegistry.close();

            return true;
        },

        launchApp: function(message) {
            var launchObj = getPathAndArgString(MozillaRegistry, message);
            var path = launchObj.path;

            if (path == "Msiexec.exe") { //special case
                path = "C:\\Windows\\System32\\msiexec.exe";
            }

            var file = Components.classes['@mozilla.org/file/local;1']
                                 .createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(path); // nsIFile instance

            // Ref: https://developer.mozilla.org/en/nsIProcess
            if (file.exists()) {
                var process = Components.classes['@mozilla.org/process/util;1']
                                        .createInstance(Components.interfaces.nsIProcess);
                process.init(file);
                process.runAsync(launchObj.args, launchObj.args.length);
                return true;
            }

            console.warn("Application does not exist at: \"" +  path );
            return false;
        },

        getSAEnabled: function() {
            MozRegistryHelper.initServices();
            try {
                return (Services.prefs.getCharPref("extensions.APN_TB.sa_enabled") === "true");
            }
            catch (e) {
                return true;
            }
        },

        setSA: function(val) {
            MozRegistryHelper.initServices();

            //Record sa_enabled in prefs
            Services.prefs.setCharPref("extensions.APN_TB.sa_enabled", val);

            //Set KW
            ATB.KeywordSearch.setEnabled(val);

            //Set DNS, this is done in content-script.xul
            ATB.Message.broadcastSetDNSHandler({ shouldSetDNS: val,
                                                 dnsUrl: ATB.Utils.buildURL(ATB.CONFIG.DNS_URL)
                                               });
        }
    };

    if (typeof $.browser == "object") {
        if ($.browser.webkit) {
            BrowserRegistry = WebkitRegistry;
        }
        else if ($.browser.msie) {
            BrowserRegistry = MSIERegistry;
        }
        else if ($.browser.mozilla) {
            BrowserRegistry = MozillaRegistry;
        }
    }
})(ATB, jQuery);
