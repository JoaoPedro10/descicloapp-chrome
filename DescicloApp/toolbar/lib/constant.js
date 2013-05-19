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
    PID: "DescicloToolbar",
    TB_NAME: "DescicloToolbar",
    VERSION: "5.0",
    PREF: {
        TB_IS_VISIBLE: 'pref_tb_is_visible',
        TB_IS_INSTALL: 'pref_tb_is_install',
        VERSION: 'version',
        INSTALL_STATE: 'pref_install_state',
        SA_ENABLED: "sa_enabled",
        COMPETITOR_AUTOFILL: 'pref_competitor_autofill',
        AUTOFILL_SB_ON_TEXT_HIGHLIGHT: 'pref_AutoFillSBOnTextHighLight'
    },
    TB: {
        CLASS_NAVIGATE: "dp-navigate",
        CLASS_POPUP: "dp-popup",
        CLASS_WIDGET: "dp-widget",
        SEARCH: {
            /**
             * Number of search history we keep in memory
             * @type Number
             */
            HISTORY_STORED: 500
        },
        POSITION_PING: "DPToolbarPing",
        POSITION_ECHO: "DPToolbarEcho"
    },
    WEBSQL: {
        DB_DESCRIPTION: 'Toolbar WebDB',
        DB_NAME: 'dpTB',
        DB_SIZE: 2 * 1024 * 1024,
        DB_VERSION: '1.0'
    },
    EXT_CONTAINER_ID: "aloogle-DescicloToolbar-container",
    EXT_PKG_ID: "aloogle-DescicloToolbar-toolbar",
    CS_IFRAME_ID: "aloogle-DescicloToolbar-cs-iframe",
    TB_IFRAME_ID: "aloogle-DescicloToolbar-toolbar-iframe",
    BG_IFRAME_ID: "aloogle-DescicloToolbar-iframe"
};
