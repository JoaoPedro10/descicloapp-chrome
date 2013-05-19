var ATB_Lifecycle = function () {

    function setPrefDefaults() {
        ATB.Pref.setTbIsVisible(true);
    }

    var states = { uninitialized: { install: function() {
                                                 setPrefDefaults();
                                                 return ATB.Pref.setInstallState("installed");
                                             },
                                  },
                   installed: { timer: function() {},
                                startup: function () {}
                              },
                 };

    var machine = new StateMachine("lifecycle",
                                   ATB.Pref.getInstallState() || "uninitialized",
                                   states);

    if (!ATB.Pref.getInstallState()) {
            machine.install();
    } else {
        machine.startup();
    }
};
