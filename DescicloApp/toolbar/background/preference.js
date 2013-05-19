/**
 * preference.js
 *
 * @fileOverview File to store all the code related the preferences
 *      interaction and abstraction
 * @author Thomas Genin <thomas.genin@ask.com>
 * @copyright aloogle LLC, 2011
 */

/**
 * ATB_Pref
 *
 * Class which manage all the interaction with the preference system
 * @constructor
 */
var ATB_Pref = function() {
    var p = ATB.CONSTANT.PREF, self = this;

    function get(key, def) {
        var val = ATB.localStorage.get(key);
        return (typeof val === "undefined") ? def
                                            : val;
    }

    function set(key, val, def) {
        return ATB.localStorage.set(key,
                                    (typeof val === "undefined") ? def
                                                                 : val);
    }

    function add(name, key, def) {
        self["get" + name] = function() {
            return get(key, def);
        };
        self["set" + name] = function(value) {
            return set(key, value, def);
        };
    }

    add("TbIsVisible", p.TB_IS_VISIBLE);
    add("TbIsInstall", p.TB_IS_INSTALL);
    add("InstallState", p.INSTALL_STATE);

    // these two prefs must be kept in sync with each other and the combined form
    self.getLang = function () {
        return ATB.localStorage.get(p.LANG) || ATB.CONSTANT.DEFAULT_LANG;
    };
};
