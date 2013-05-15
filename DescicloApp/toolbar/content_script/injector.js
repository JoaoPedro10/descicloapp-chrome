/*****************************************************************************
 **
 ** INJECTOR
 **
 ** Inject the toolbar in the web page
 **
 *****************************************************************************/
/**
 * Content script responsible for injection toolbar and handling background
 * events.
 * @namespace
 */
var widgetState = null;
(function Injector() {
    var toolbarState = null;


    /**
     * Initialize Injector module (currently designed to be called
     * synchronously).
     */
    var self = this;
    if (!ATB.CONFIG.BLACK_LIST_DOMAIN[window.location.hostname]) {
        // check if it has to inject the TB or not do it asap
        toolbarState = new Hideable("injector:toolbar",
                                    function (tbid) {
                                        Toolbar.inject(tbid);
                                    },
                                    function () {
                                        Widget.close();
                                        Toolbar.destroy();
                                    });
        ATB.Message.receiveOpenToolbar(responder(toolbarState.show));
        ATB.Message.receiveCloseToolbar(responder(toolbarState.hide));
        ATB.Message.receiveToggleToolbar(responder(toolbarState.toggle));
        ATB.Message.receiveUpdateToolbarPosition(function (data) {
                                                     Toolbar.update(data); // must be a method call
                                                 });
        ATB.Message.receiveClickOnAnotherExtension(function () {
                                                       Widget.close();
                                                   });
        ATB.Message.sendGetToolbarStatus(null,
                                         function (status) {
                                             if (status.visible) {
                                                 ATB.Message.sendGetSideBySideStatus({}, function (data) {
                                                     Toolbar.positionData = data;
                                                     toolbarState.show(status.id);
                                                 });
                                             }
                                         });

        // now handle the widget initializaiton/injection
        widgetState = new Hideable("injector:widget",
                                   function (config) {
                                       Widget.open(config.id, config.win, config.position);
                                   },
                                   function () {
                                       Widget.close();
                                   });
        ATB.Message.receiveOpenDropdownWidget(responder(widgetState.show));
        ATB.Message.receiveCloseDropdownWidget(responder(widgetState.hide));
        ATB.Message.receiveGetDropdownWidgetStatus(responder(Widget.getStatus));
        ATB.Message.receiveResizeDropdownWidget(Widget.resize);

        // We have to poll to see if the background is still there,
        // because if the user disables the extension then it will get
        // removed without warning.
        //var travesty = RepeatingQuickTimer(function () {
        //                                       var hack = new QuickTimer(function () {
        //                                           Toolbar.positionData.bodyTop -= ATB.CONFIG.TB.HEIGHT;
        //                                           Toolbar.positionData.ourTop -= ATB.CONFIG.TB.HEIGHT;
        //                                           Toolbar.positionData.visibleToolbars -= 1;
        //                                           toolbarState.hide();
        //                                           widgetState.hide();
        //                                           travesty.cancel();
        //                                       }, QuickTimer.ONE_SECOND);
        //                                       ATB.Message.sendAreYouStillThere(null, hack.cancel);
        //                                   },
        //                                   2 * QuickTimer.ONE_SECOND);
    }
})();
