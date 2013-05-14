/**
 * constant.js
 *
 * @fileoverview Contain the constant / default config of the application
 * @author Thomas Genin <thomas.genin@ask.com>
 * 2011
 */

var ATB = {};

/**
 * Constant
 *
 * @namespace
 */
ATB.CONSTANT = {
    PID: "ATU-SAT",
    TB_NAME: "Ask Shopping Toolbar",
    VERSION: "11.37957",
    PREF: {
        NEW_TAB_IS_ON: "pref_new_tab_on",
        PARTNER_ID: 'tb',
        RECENTLY_CLOSE: 'pref_tab_close',
        REVISION: 'revision',
        SEARCH_HISTORY: 'pref_search_history',
        TB_IS_VISIBLE: 'pref_tb_is_visible',
        TB_IS_INSTALL: 'pref_tb_is_install',
        VERSION: 'version',
        INSTALL_STATE: 'pref_install_state',
        LANG_LOCALE: 'locale',
        LANG: 'pref_lang',
        LANG_639_1: 'pref_lang_639_1',
        LOCALE: 'pref_locale',
        UPDATE_URL: "pref_update_url",
        DISPLAY_SEARCH_HISTORY: "display_search_history",
        CLEAR_SEARCH_ON_CLOSE: "clear_search_on_close",
        SA_ENABLED: "sa_enabled",
        COMPETITOR_AUTOFILL: 'pref_competitor_autofill',
        AUTOFILL_SB_ON_TEXT_HIGHLIGHT: 'pref_AutoFillSBOnTextHighLight'
    },
    TB: {
        CLASS_NAVIGATE: "atb-navigate",
        CLASS_POPUP: "atb-popup",
        CLASS_WIDGET: "atb-widget",
        COOKIE_NAME: 'atb-cookie',
        SEARCH: {
            /**
             * Number of search history we keep in memory
             * @type Number
             */
            HISTORY_STORED: 500
        },
        POSITION_PING: "APNToolbarPing",
        POSITION_ECHO: "APNToolbarEcho"
    },
    WEBSQL: {
        DB_DESCRIPTION: 'Toolbar WebDB',
        DB_NAME: 'askTB',
        DB_SIZE: 2 * 1024 * 1024,
        DB_VERSION: '1.0'
    },
    EXT_CONTAINER_ID: "apn-ATU-SAT-container",
    EXT_PKG_ID: "apn-ATU-SAT-toolbar",
    CS_IFRAME_ID: "apn-ATU-SAT-cs-iframe",
    TB_IFRAME_ID: "apn-ATU-SAT-toolbar-iframe",
    BG_IFRAME_ID: "apn-ATU-SAT-iframe",
    BG_IFRAME_VAR: "bgIframe",
    WID_POPUP_IFRAME_ID: "apn-popup-iframe",
    DEFAULT_FF_KEYWORD_URL: "http://www.google.com/search?ie=UTF-8&oe=UTF-8&sourceid=navclient&gfns=1&q=",
    DEFAULT_LANG: "en",
    DEFAULT_LOCALE: "US",
    FF_ABAR_WAR_REGEX: "conduit.com", //Currently only conduit takes over, so only check for conduit
    COMPETITOR_AUTOFILL_REGEX: ".*www\\.google\\.co.*[&|\\?|#]q=([^&]*)&?.*||.*search\\.yahoo\\.co.*[&|\\?|#]p=([^&]*)&?.*||.*www\\.bing\\.co.*[&|\\?|#]q=([^&]*)&?.*||.*search\\.conduit\\.co.*[&|\\?|#]q=([^&]*)&?.*||.*search\\.aol\\.co.*[&|\\?|#]q=([^&]*)&?.*||.*isearch\\.avg\\.co.*[&|\\?|#]q=([^&]*)&?.*||.*search\\.babylon\\.co.*[&|\\?|#]q=([^&]*)&?.*",
    HPG_DISABLE_PLATFORM: "11.0.0", //platform.major.minor
    NT_DISABLE_PLATFORM: "11.4.0",
    DSG_DISABLE_PLATFORM: "11.4.0"
};
