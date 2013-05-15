if (CS_SHOULD_RUN && (typeof window != "object" || !window.attachEvent)) {
    /**
     * Bridge the widget message passing protocol with the internal
     * protocol. Most but not all of the widget messages correspond
     * one-to-one with internal messages.
     */

    // to the internal messaging protocol we represent the widget
    var internal = new ATB_Message("widget");
    // to the external messaging protocol we represent the toolbar
    var widget;
    if (ATB.USE_CONTENT) {
        widget = new content.Toolbar_Messaging("toolbar");
    }
    else {
        widget = new Toolbar_Messaging("toolbar");
    }

    // handle intrawidget messages
    widget.receiveIntrawidgetMessage(internal.broadcastCustomCommand);
    internal.receiveCustomCommand(widget.broadcastIntrawidgetMessage);

    // handle the widget api
    widget.receiveAddContentScript(internal.sendAddContentScript);
    widget.receiveGetConfigData(internal.sendGetConfigData);
    widget.receiveGetStoredData(internal.sendGetStoredData);
    widget.receiveSetStoredData(internal.sendSetStoredData);
    widget.receiveLaunchApp(internal.sendLaunchApp);
    widget.receiveAjaxRequest(internal.sendAjaxRequest);
    widget.receiveLogError(internal.sendLogError);
    
    // navigate messages
    widget.receiveNavigate(internal.sendNavigate);
    widget.receiveNavigateCurrentTab(internal.sendNavigateCurrentTab);
    widget.receiveNavigateNewTab(internal.sendNavigateNewTab);
    widget.receiveNavigateNewWindow(internal.sendNavigateNewWindow);    

    // widget window messages
    widget.receiveOpenWidget(internal.sendOpenWidget);
    widget.receiveCloseDropdownWidget(internal.sendCloseDropdownWidget);
    widget.receiveResizeDropdownWidget(internal.sendResizeDropdownWidget);
    internal.receiveNavigated(widget.sendNavigated);
    widget.receiveButtonClick(internal.sendButtonClick);
    widget.receiveGetCurrentUrl(internal.sendGetCurrentUrl);
}
