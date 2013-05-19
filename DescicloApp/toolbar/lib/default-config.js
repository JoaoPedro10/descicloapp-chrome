/*
 * default-config.js
 *
 * @fileoverview Contain all the parameters that can affect the behavior of the
 * toolbar
 *
 * @author Thomas Genin <thomas.genin@ask.com>
 * 2011
 */

var ATB = ATB || {};

ATB.USE_CONTENT = (function() {})();

ATB.CONFIG = ATB.CONFIG || {};

/**
 * List of domain that can run custom commands
 * Use window.location.hostname to write the value
 * @default {}
 * @type Object ( map)
 */
ATB.CONFIG.AUTHORIZED_DOMAIN = {};

ATB.CONFIG.BLACK_LIST_DOMAIN = { };



//------------------------------------------------------------------------------
/**
 * Toolbar config constant
 * @namespace
 */
ATB.CONFIG.TB = {
    /**
     * Duration of the closing animation of the toolbar in MS
     * @type Number
     * @default 500
     */
    ANIM_CLOSE_DURATION: 500,

    /**
     * Height of the toolbar in pixel
     * @type Number
     * @default 30
     */
    HEIGHT: 30,

    /**
     * Size of the icon inside the toolbar in pixel
     * @type Number
     * @default
     */
    REEL_HEIGHT: 26,

    /**
     * Path to images, inside the CRX
     * @type String
     * @default config/skin/images/
     */
    PATH_IMG: 'toolbar/config/skin/images/',

    /**
     * ID of the extra style tage insert in the page
     * @type String
     * @default style-atb
     */
    STYLE_ID: 'aloogle-body-style',

    DEFAULT_THEME: 'vanilla'
};

//------------------------------------------------------------------------------
/**
 * Configuratin layer for Widgets
 * @namespace
 */
ATB.CONFIG.WIDGET = {
    /**
     * Name of the css class hosting widgets
     * @type String
     * @default atb-widget
     */
    CLASS: 'atb-widget',

    /**
     * Extra css properties to add to the widget container
     * @type Object
     * @TODO remove this
     */
    CONTAINER_CSS: {
        position: 'fixed',
        'background-color': 'white'
    },

    /**
     * ID of the iframe hosting the widget
     * @type String
     * @default atb-v6-widget-iframe
     */
    IFRAME_ID: 'atb-v6-widget-iframe',

    /**
     * Margin on the right of the screen to position the widget in case of an
     * overflow
     * @type Number
     * @default 10
     * @TODO search if can't move that to CSS with CSS3 maths feature
     */
    MARGIN_RIGHT: 10,

    /**
     * margin with the toolbar
     * @type Number
     * @default 5
     * @deprecated
     * @todo make it static in the css
     */
    MARGIN_TOP: 1,

    /**
     * Time use by the opening animation
     * @type Number
     * @default 500
     */
    OPEN_ANIMATION_DURATION: 500,

    /**
     * Kind of jquery animation use to open the widget
     * @type String
     * @default swing
     */
    OPEN_ANIMATION_TYPE: 'swing',

    /**
     * offsets popup widgets away from the mouse cursor when they open
     * overflow
     * @type Number
     * @default 10
     */
    POPUP_OFFSET: 10,

    /**
     * Time use by the opening animation
     * @type Number
     * @default 500
     */
    RESIZE_ANIMATION_DURATION: 500,

    /**
     * Kind of jquery animation use to open the widget
     * @type String
     * @default swing
     */
    RESIZE_ANIMATION_TYPE: 'swing'
};
//------------------------------------------------------------------------------

/**
 * Store the config informations for each widget of the toolbar.
 * Must be defined in tb-config
 * @type Object
 * @default {}
 */
ATB.CONFIG.leftDock = ATB.CONFIG.leftDock || [];
ATB.CONFIG.centerDock = ATB.CONFIG.centerDock || [];
ATB.CONFIG.rightDock = ATB.CONFIG.rightDock || [];
ATB.CONFIG.widgetsByID = ATB.CONFIG.widgetsByID || { };
