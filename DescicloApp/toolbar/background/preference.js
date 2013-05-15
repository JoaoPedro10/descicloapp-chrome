/**
 * preference.js
 *
 * @fileOverview File to store all the code related the preferences
 *      interaction and abstraction
 * @author Thomas Genin <thomas.genin@ask.com>
 * @copyright APN LLC, 2011
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

    /**
     * define the prefs that we know of ahead of time
     */
    add("NewTabIsOn", p.NEW_TAB_IS_ON);
    add("PartnerID", p.PARTNER_ID);
    add("Revision", p.REVISION);
    add("SearchHistory", p.SEARCH_HISTORY);
    add("TabRecentClosed", p.RECENTLY_CLOSE);
    add("TbIsVisible", p.TB_IS_VISIBLE);
    add("TbIsInstall", p.TB_IS_INSTALL);
    add("Version", p.VERSION);
    add("InstallState", p.INSTALL_STATE);
    add("UpdateURL", p.UPDATE_URL);
    add("LangLocale", p.LANG_LOCALE, "en_US");
    add("DisplaySearchHistory", p.DISPLAY_SEARCH_HISTORY);
    add("ClearSearchOnClose", p.CLEAR_SEARCH_ON_CLOSE);
    add("SAEnabled", p.SA_ENABLED);
    add("CompetitorAutofill", p.COMPETITOR_AUTOFILL);
    add("AutoFillSBOnTextHighLight", p.AUTOFILL_SB_ON_TEXT_HIGHLIGHT);

    // these two prefs must be kept in sync with each other and the combined form
    self.getLang = function () {
        return ATB.localStorage.get(p.LANG) || ATB.CONSTANT.DEFAULT_LANG;
    };
    self.setLang = function (value) {
        ATB.localStorage.set(p.LANG, value || ATB.CONSTANT.DEFAULT_LANG);
        self.setLangLocale(value +'_'+ self.getLocale());
        return value;
    };
    self.getLocale = function () {
        return ATB.localStorage.get(p.LOCALE) || ATB.CONSTANT.DEFAULT_LOCALE;
    };
    self.setLocale = function (value) {
        ATB.localStorage.set(p.LOCALE, value || ATB.CONSTANT.DEFAULT_LOCALE);
        self.setLangLocale(self.getLang() +'_'+ value);
        return value;
    };
};
