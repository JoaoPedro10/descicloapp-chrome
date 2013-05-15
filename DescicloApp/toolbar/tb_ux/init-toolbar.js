$(this).bind("contextmenu",
             function (ev) {
                 if (ev.target.id != "toolbar-search-input")
                     ev.preventDefault();
             });

$(document).ready(function(){
                      setTimeout(ATB.UX.init, 100);
                  });