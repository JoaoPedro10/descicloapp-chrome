/**
 * cookies.js
 *
 * @fileOverview
 * @author Thomas Genin <thomas.genin@ask.com>
 * @copyright APN LLC, 2011
 */

/**
 * ATB_Cookies
 *
 * @constructor
 */
var ATB_Cookies = function() {};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PUBLIC
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * get
 *
 * Return the value of a cookie
 * @param name {String} Name of the cookie to read
 * @return String
 */
ATB_Cookies.prototype.get = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while(c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
};

/**
 * set
 *
 * Set the value of a cookie
 * @param name {String} Name of the cookie
 * @param value{String} Value of the cookie
 */
ATB_Cookies.prototype.set = function (name, value) {
    var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  PRIVATE
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
