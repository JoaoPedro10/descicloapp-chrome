if ($.browser.mozilla) {
    var theCSSprop = window.getComputedStyle(parent.parent
                                                   .document
                                                   .getElementById("nav-bar"),
                                             null)
                           .getPropertyValue("background-color");
    document.body.style.backgroundColor = theCSSprop;
}

// disable right click
$(this).bind("contextmenu",
             function (ev) {
                 if (ev.target.id != "toolbar-search-input")
                     ev.preventDefault();
             });

$(document).ready(function(){
                      setTimeout(ATB.UX.init, 100);
                  });
