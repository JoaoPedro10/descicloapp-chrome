/**
 * i18n, is a lazy loader for updating the dom with localized text
 *
 * i18n(element[, dictionaryName[, langCode]]);
 * @author Ann E. Win, APN
 */

/**
 * main constructor
 * @constructor
 * @param {String} dictionaryName
 * @param element (optional)
 * @param {String} langCode (optional)
 */
var i18n = function(dictionaryName, element, langCode, macroKey, macroVal) {
    element = $(element || document);
    langCode = $.trim(langCode || i18n.GetLangFromQuery() || ATB.CONFIG.DEFAULT_LANG);
    $(document.documentElement).attr('lang', langCode);
    var dictionary = ATB.CONFIG.LANGS[dictionaryName][langCode];
    for(var k in dictionary) {
        var dictVal = dictionary[k];
        if (macroKey && macroVal) {
            dictVal = ATB.Utils.Macro.replaceSpecificMacro (dictVal, macroKey, macroVal);
        }
        m = k.match(/(.+?)\[(.*?)\]/);
        if (m) {
            element.find(m[1]).attr(m[2], dictVal);
        }
        else {
            element.find(k).text(dictVal);
        };
    }
};

/**
 * try to get locale code from query string
 */
i18n.GetLangFromQuery = function() {
    var lang = (/\blang\w*=([a-z][a-z](?:_[A-Z][A-Z])?)/).exec(window.location.search);
    if(lang && lang.length) {
        // found locale code based on get query string
        return lang[1];
    }
    return null;
};
