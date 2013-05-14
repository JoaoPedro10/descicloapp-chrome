/**
 *
 * localStorage.js
 *
 * @fileOverview Class localStorage : abstract the localStorage manipulation
 * @copyright APN LLC 2011
 * @author Thomas Genin <thomas.genin@ask.com>
 *
 */

/******************************************************************************
 * localStorage
 * @constructor
 */
function ATB_LocalStorage() {
    if ($.browser.mozilla) {
        var prefService = Components.classes
                                    ["@mozilla.org/preferences-service;1"]
                                    .getService(Components.interfaces
                                                          .nsIPrefService);
        this._prefBranch = prefService.getBranch("extensions." + ATB.CONSTANT.PID + ".");
    }
}

/**-------------------------------------------------------------------------
 * set a value in the localStorage
 *
 * @param key {String} Name of the key to set
 * @param value {Object} Value to store
 */
ATB_LocalStorage.prototype.set = function (key, value) {
    var str = JSON.stringify(value);
    if ($.browser.webkit)
        localStorage.setItem(key, str);
    else if ($.browser.msie)
        ieLocalStorage.setItem(key, str);
    else if ($.browser.mozilla)
        this._prefBranch.setCharPref(key, str);
    return value;
};

/**-------------------------------------------------------------------------
 * get the value of a key in the localStorage
 *
 * @param key {String} Key to retrieve
 */
ATB_LocalStorage.prototype.get = function (key) {
    try {
        var str;
        if ($.browser.webkit)
            str = localStorage.getItem(key);
        else if ($.browser.msie)
            str = ieLocalStorage.getItem(key);
        else if ($.browser.mozilla)
            str = this._prefBranch.getCharPref(key);
        if ((str === undefined) || (str === null))
            return null;
        return JSON.parse(str);
    } catch (e) {
        console.error("Error while getting from localStorage" + e);
        return null;
    }
};

/**-------------------------------------------------------------------------
 * Destroy a key from the localStorage
 *
 * @param key {String} The key to remove
 */
ATB_LocalStorage.prototype.remove = function (key) {
    if ($.browser.webkit)
        localStorage.removeItem(key);
    else if ($.browser.msie)
        ieLocalStorage.removeItem(key);
    else if ($.browser.mozilla)
        this._prefBranch.clearUserPref(key);
};

/**-------------------------------------------------------------------------
 * Clean the whole localStorage for the extension
 */
ATB_LocalStorage.prototype.clear = function () {
    if ($.browser.webkit)
        localStorage.clear();
    else if ($.browser.msie)
        ieLocalStorage.clear();
    else if ($.browser.mozilla)
        this._prefBranch.deleteBranch();
};
