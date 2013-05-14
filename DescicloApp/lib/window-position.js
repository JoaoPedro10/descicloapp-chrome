/**
 * given a widget window definition, a button position and a boundary
 * rect, compute the correct place to position the widget window
 *
 * XXX ajvincent This needs some serious documentation to define what is "the
 * correct place"!  Why are these calculations correct?
 */
function calcWindowPosition(win, buttonPos, bounds) {
    var pos = {};
    if ("width" in win)
        pos.width = win.width;
    if ("height" in win)
        pos.height = win.height;
    if ("bottom" in win) {
        if ("top" in win) {
            pos.top = win.top;
            pos.height = win.bottom - win.top;
        } else {
            pos.top = win.bottom - win.height;
            pos.height = win.height;
        }
    } else if ("top" in win) {
        pos.top = win.top;
    } else {
        pos.top = 0;
    }
    if ("right" in win) {
        if ("left" in win) {
            pos.left = win.left;
            pos.width = win.right - win.left;
        } else {
            pos.left = win.right - win.width;
            pos.width = win.width;
        }
    } else if ("left" in win) {
        pos.left = win.left;
    } else {
        pos.left = 0;
    }

    // ignoring all of the others for the moment
    if (win.anchor == "button" || !win.anchor) {
        pos.top += buttonPos.top;
        pos.left += buttonPos.left;
    }

    if (win.center == "horizontal" || win.center == "both") {
        pos.left += (bounds.width / 2) - (pos.width / 2);
    }
    if (win.center == "vertical" || win.center == "both") {
        pos.top += (bounds.height / 2) - (pos.height / 2);
    }

    // case when too much on right
    pos.left -= Math.max(pos.left + pos.width - bounds.width + ATB.CONFIG.WIDGET.MARGIN_RIGHT,
                         0);
    // don't let it extend under the top of the window either
    pos.top = Math.max(pos.top, 0);

    return pos;
}
