var UR = (function(window, $, UR, undefined) {

    var defaults = {};

	function reloadReportingParams() {}

    var query = decodeURI(window.location.search.substr(1)).split('&');

    UR.reportingParams = function() {
        return defaults;
    }

    return UR;
}(window, jQuery, UR || {}));