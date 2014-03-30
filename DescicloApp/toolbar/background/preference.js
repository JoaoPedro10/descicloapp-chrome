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

    self.getLang = function () {
        return ATB.localStorage.get(p.LANG) || ATB.CONSTANT.DEFAULT_LANG;
    };
};
