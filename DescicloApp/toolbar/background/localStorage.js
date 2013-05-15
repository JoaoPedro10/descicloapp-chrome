function ATB_LocalStorage() {
}


ATB_LocalStorage.prototype.set = function (key, value) {
    var str = JSON.stringify(value);
    if ($.browser.webkit)
        localStorage.setItem(key, str);
    return value;
};

ATB_LocalStorage.prototype.get = function (key) {
    try {
        var str;
        ($.browser.webkit)
            str = localStorage.getItem(key);
        if ((str === undefined) || (str === null))
            return null;
        return JSON.parse(str);
    } catch (e) {
        console.error("Error while getting from localStorage" + e);
        return null;
    }
};