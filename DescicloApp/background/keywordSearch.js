/**
 * This is a library for setting the keyword.URL default preference inside our own extension.
 *
 * @author Alexander J. Vincent <alex.vincent@ask.com>
 * @constructor
 */
function ATB_KeywordSearch() {};
ATB_KeywordSearch.prototype = {
    TOOLBAR_ID: "toolbar___ps__@apn.ask.com",
    KEYWORD_PATH: "defaults/preferences/keyword.js",

    originalAddon: null,
    addonLocation: null,
    hasDefault: false,

    // A cache in case we try to set the keyword pref before we're ready to.
    pendingValue: null,

    // The XPI's file name.
    leafName: null,

    /**
     * Initialize the keyword search manager.
     */
    init: function() {
        var _this = this;

        if (!this.AddonManager)
            Components.utils["import"]("resource://gre/modules/AddonManager.jsm", this);

        this.AddonManager.getAddonByID(this.TOOLBAR_ID, function(addon) {
            _this.addonCallback(addon);
        });

        this.AddonManager.addInstallListener(this);
    },

    /**
     * Determine the current state of our keyword search.
     *
     * @param addon {Addon} from the AddonManager
     *
     * @private
     */
    addonCallback: function(addon) {
        // Cache the addon's physical location; we're going to need it repeatedly.
        this.originalAddon = addon;
        var file = addon.getResourceURI()
                        .QueryInterface(Components.interfaces.nsIFileURL)
                        .file;
        this.leafName = file.leafName;
        this.addonLocation = file;

        // Do we have a real preference stored?  Ask the zipreader to look at our zipped pref file.
        var stagedXPI = this.addonLocation.clone().parent;
        stagedXPI.append("staged");
        stagedXPI.append(this.leafName);

        var zipReader = Components.classes["@mozilla.org/libjar/zip-reader;1"]
                                  .createInstance(Components.interfaces.nsIZipReader);
        if (stagedXPI.exists()) {
            zipReader.open(stagedXPI);
        }
        else {
            zipReader.open(file);
        }

        /* When we turn off the default preference, we write a single-byte file
         * containing only '\n'.  So the file may either be absent (in the initial
         * case), a single byte, or the full keyword preference. */
        this.hasDefault = zipReader.hasEntry(this.KEYWORD_PATH) &&
                          zipReader.getEntry(this.KEYWORD_PATH).realSize > 1;
        zipReader.close();

        if (ATB.localStorage.get("default-keyword-initially-set") == null) {
            this.setEnabled(typeof this.pendingValue == "boolean" ? this.pendingValue : ATB.Registry.getSAEnabled());

            // If we've taken the user preference through installer, clear it now!
            var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                                        .getService(Components.interfaces.nsIPrefBranch);
            if (prefService.getCharPref("keyword.URL").indexOf("http://asksearch.ask.com/redirect?") == 0)
                prefService.clearUserPref("keyword.URL");

            ATB.localStorage.set("default-keyword-initially-set", new Date() * 1 + "");
        }

        // This assumes that the user has called this.setEnabled before we were fully initialized.
        else if (this.pendingValue !== null) {
            this.setEnabled(this.pendingValue);
        }
    },

    /**
     * Set whether the extension should have a default keyword search preference.
     *
     * @param shouldEnable {Boolean}  True if we should have the pref.
     */
    setEnabled: function(shouldEnable) {
        if (!this.addonLocation) {
            // We are not initialized yet.  Cache the value for when we are.
            this.pendingValue = shouldEnable;
            return;
        }

        this.pendingValue = null;

        ATB.Registry.setKeywordURLEnabled(shouldEnable);
        ATB.Registry.setKeywordURLPending();
        this.hasDefault = shouldEnable;
    },

    // InstallListener methods (see https://developer.mozilla.org/en-US/docs/Addons/Add-on_Manager/InstallListener)
    onInstallEnded: function(install, addon) {
        // An addon was updated.  Was it ours?
        var oldAddon = install.existingAddon;
        if (oldAddon != this.originalAddon)
            return;

        if (!this.addonLocation) {
            // I'm a little busy right now.  Take two aspirin and call me in the morning.
            window.setTimeout(function() {
                ATB.KeywordSearch.onInstallEnded(install, addon);
            }, 1000);
            return;
        }

        this.setEnabled(typeof this.pendingValue == "boolean" ? this.pendingValue : this.hasDefault);
    }
};

/* We're just trying to determine for the options widget if the user has requested a change to the
 * keyword.URL default preference during this Firefox session.
 */
ATB.Message.receiveGetSAToggled(function(message, sendResponse) {
    sendResponse(ATB.Registry.getKeywordURLPending());
});
