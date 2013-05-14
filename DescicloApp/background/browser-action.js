/**
 * browser-action.js
 *
 * @fileoverview contain all the code related to the browser_action interaction
 * @see <a href="http://code.google.com/chrome/extensions/browserAction.html">Doc
 * Browser Action</a>
 * @author Thomas Genin <thomas.genin@ask.com>
 * @copyright APN LLC, 2011
 */

/******************************************************************************
 * ATB_BrowserAction
 *
 * interaction with the browser action menu
 * @constructor
 */
var ATB_BrowserAction = function () {};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PUBLIC
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * update the icon based on the enabled/disabled state of the toolbar
 */
ATB_BrowserAction.prototype.updateIcon = function () {
    function path(f) { return { path: '../../' + ATB.CONFIG.TB.PATH_IMG + f }; }
    function icon(i) { chrome.browserAction.setIcon(i); }
    function iconPath(f) { icon(path(f)); }

    if (ATB.Pref.getTbIsVisible()) {
        iconPath('logo/logo_19x.png');
    } else {
        iconPath('logo/logo_19x_grey.png');
    }
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PRIVATE
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
