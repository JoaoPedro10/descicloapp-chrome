/**
 *
 * toolbar.js
 *
 * @fileoverview Contain the content script responsible to display and hide the
 * toolbar
 * @author Thomas Genin <thomas.genin@ask.com>
 */

ATB.Message = new ATB_Message("content script");

/**
 * Contain the content script responsible to display and hide the
 * toolbar
 * @namespace
 */
var Toolbar = {
    positionData: {},

    /**
     * Inject the toolbar in the page
     *
     * @param {String} tbid the partner id of the current toolbar
     */
    inject: function (tbid) {
        var configTB = ATB.CONFIG.TB;

        // would like to use the normal macro replacement, but we
        // don't have direct access to the localstorage/prefs
        if (!this.id)
            this.id = "aloogle-" + (tbid || "null") + "-toolbar";
        if (!this.styleid)
            this.styleid = "aloogle-" + (tbid || "null") + "-stylesheet";

        var doc = $(document.documentElement), toolbar, link;

        // Look for a PDF, and if we find it, force display: block on it!
        var body, embed;
        if ((body = document.documentElement.firstChild) instanceof HTMLBodyElement &&
            (body.childNodes.length == 1) &&
            ((embed = body.firstChild) instanceof HTMLEmbedElement) &&
            (embed.type == "application/pdf"))
        {
            embed.style.display = "block";
        }

        // We're not using a content script here because chrome has
        // some bugs. Instead we add our stylesheet to the dom
        // directly
        if ($("#"+ this.styleid).length == 0)
            doc.append($("<link>",
                         { id: this.styleid,
                           rel: "stylesheet",
                           href: chrome.extension.getURL('toolbar/config/skin/css/containers.css')
                         }));
        if ($("#"+ this.id).length == 0)
            doc.append($('<iframe>',
                         { id: this.id,
                           src: chrome.extension.getURL('toolbar/config/skin/toolbar.html'),
                           "class": "aloogle-toolbar SkipThisFixedPosition",
                           style: "top: " + (this.positionData.ourTop || 0) + "px;"
                         }));

        $().ready(function () {
            Toolbar._postLoad();
        });
    },
    /**
     * Remove the iframe which host the toolbar from the DOM
     */
    destroy: function () {
        var self = this;
        $("#" + self.id).slideUp(ATB.CONFIG.TB.ANIM_CLOSE_DURATION, function () {
            //remove tb
            $("#" + self.id).remove();
            $("#" + self.styleid).remove();
        });
        $("#" + ATB.CONFIG.TB.STYLE_ID).remove();
        var newTop = this.positionData.bodyTop || 0;
        if (newTop > 0) {
            var style = $("<style>",
                          { id: ATB.CONFIG.TB.STYLE_ID });
            style.text("html {" +
                       "    padding-top: "+ newTop +"px ! important;" +
                       "    border-top: 1px solid transparent;" +
                       "}");
            // append the stylesheet to the end of the document to
            // improve the specificity of the rules
            $(document.documentElement).append(style);
        }

        $('[aloogle-was-fixed-top]').each(function (index, element) {
            var e = $(this);
            e.css("position", "fixed");
            e.css("top", e.attr("aloogle-was-fixed-top"));
        });
        $('[aloogle-was-fixed-bottom]').each(function (index, element) {
            var e = $(this);
            e.css("bottom", e.attr("aloogle-was-fixed-bottom"));
        });

    },
    exists: function (tbid) {
        // would like to use the normal macro replacement, but we
        // don't have direct access to the localstorage/prefs
        if (!this.id)
            this.id = "aloogle-" + (tbid || "null") + "-toolbar";

        return document.getElementById(this.id);
    },
    /**
     * Change the position of this toolbar, as some other toolbar has
     * appeared or dissappeared
     * @param {Object} positionData
     */
    update: function (positionData) {
        this.positionData = positionData;
        $("#" + this.id).css("top", (this.positionData.ourTop || 0) + "px");
    },
    /**
     * Hack to really correct the positionning of the toolbar
     */
    _postLoad: function () {
        var style = $("<style>", {
            id: ATB.CONFIG.TB.STYLE_ID
        });
        var newTop = this.positionData.bodyTop || ATB.CONFIG.TB.HEIGHT;
        var toolbarHeight = ATB.CONFIG.TB.HEIGHT;
        var toolbarCount = this.positionData.visibleToolbars;

        style.text("html {"+
                   "    padding-top: "+ newTop +"px ! important; " +
                   "    border-top: 1px solid transparent; "+
                   "}");
        // what if we just offset the body position with the newTop???

        
        $("#"+ ATB.CONFIG.TB.STYLE_ID).remove();
        // append the stylesheet to the end of the document to
        // improve the specificity of the rules
        $(document.documentElement).append(style);

        /*
        JavaDoc here
        */
        function fixedDOMElementsAdjuster($DOMCollection,toolbarPixelOffset,pageInitBool){
            var toolbarOffset = toolbarPixelOffset || 0 + newTop;

            if(toolbarPixelOffset){
                toolbarOffset = toolbarOffset*toolbarCount;
            }

            $DOMCollection.each(function (index, element) {
                var $elem = $(element),
                    $elePos = $elem.css("position"),
                    newCssPosValueStr; 

                if(element.getAttribute("data-aloogle-toolbar-adjusted")){
                    if(pageInitBool && $elePos === "absolute"){
                        console.log(parseInt($elem.css("top"),10),newTop,pageInitBool,toolbarHeight,this);
                        //console.log(toolbarHeight,element);

                        newCssPosValueStr = ( parseInt($elem.css("top"),10) + newTop )+"px";
                        element.style.top = element.getAttribute("data-aloogle-toolbar-adjusted");
                        element.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set","top");
                        element.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_top",element.getAttribute("data-aloogle-toolbar-adjusted"));
                        return;
                    } else if(/*toolbarPixelOffset && */$elePos === "fixed"){
                        element.style.top = element.getAttribute("data-aloogle-toolbar-adjusted");
                        element.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set","top");
                        element.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_top",newCssPosValueStr);
                        return;
                    }
                }



                if(!!element.getAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set")){
                    /*
                    if(element.getAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set") === "top"){
                        //console.log("setting",element);
                        element.style.top = element.getAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_top");
                    } else if(element.getAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set") === "bottom"){
                        //element.style.bottom = element.getAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_bottom");
                    }
                    */
                    //actually this can basically check if the set pixel count is equal to what it should be
                    //Let me think about this...compare bing versus honestlywtf
                    return;
                }


                if($elePos === "absolute" || $elePos === "fixed"){

                    var pixelTopBool = parseInt($elem.css("top"),10) <= toolbarOffset,
                        pixelTopOverlapped = parseInt($elem.css("bottom"),10) <= toolbarOffset,
                        pixelBottomBool = parseInt($elem.css("bottom"),10) <= toolbarOffset,
                        styleTopDoesntContainPercentage = !$elem.css("top").match("%"),
                        styleBottomDoesntContainPercentage = !$elem.css("bottom").match("%"),
                        elemOffsetParent = element.offsetParent;

                    if( $elePos === "fixed" ){
                        /*
                            fixed and absolute may be consolidated into one
                            damn thats alot of code savings

                            remember fixed to the bottom needs no change... yahoo mail shows you this
                        */
                        if(pixelTopBool && styleTopDoesntContainPercentage){
                            newCssPosValueStr = (parseInt($elem.css("top"),10) + toolbarOffset)+"px";
                            this.style.top = newCssPosValueStr;
                            this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set","top");
                            this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_top",newCssPosValueStr);
                            /*
                        } else if(pixelBottomBool && styleBottomDoesntContainPercentage) {
                            */
                            this.setAttribute("data-aloogle-toolbar-adjusted",newCssPosValueStr);

                        }
                    } else if($elePos === "absolute") {
                        if(elemOffsetParent == document.body){
                            //if(/*pixelTopBool && */styleTopDoesntContainPercentage){
                            if(styleTopDoesntContainPercentage){
                                if(pixelTopBool){
                                    if(this.offsetParent == document.body){
                                        //if(pageInitBool && parseInt($elem.css("top"),10) !== 0){
                                        if(pageInitBool){
                                            //console.log(parseInt($elem.css("top"),10), this, this.offsetParent, toolbarOffset, pageInitBool)
                                            if(parseInt($elem.css("top"),10) === 0){
                                                newCssPosValueStr = parseInt($elem.css("top"),10 + toolbarOffset)+"px";
                                            } else {
                                                /*
                                                bing serp and google serp are caught up here
                                                newCssPosValueStr = ( parseInt($elem.css("top"),10) + toolbarOffset)+"px";
                                                */
                                                //newCssPosValueStr = (parseInt($elem.css("top"),10) + toolbarOffset)+"px";

                                                if( ( (parseInt($elem.css("top"),10)*toolbarCount) + (4*toolbarCount) ) > toolbarOffset){
                                                    //console.log("google")
                                                    newCssPosValueStr =  parseInt($elem.css("top"),10)+"px";
                                                } else {
                                                    //console.log("bing")
                                                    newCssPosValueStr = ( parseInt($elem.css("top"),10) + toolbarOffset)+"px";
                                                }

                                            }

                                        } else {
                                            if(toolbarCount === 1){
                                                newCssPosValueStr = ( parseInt($elem.css("top"),10) + toolbarOffset - newTop)+"px";
                                            } else {
                                                newCssPosValueStr = ( parseInt($elem.css("top"),10) + toolbarOffset)+"px";
                                            }
                                            //console.log("got caught here yahoo.com",this);
                                            //newCssPosValueStr = ( parseInt($elem.css("top"),10) + toolbarOffset - newTop)+"px";
                                        }
                                    } else {
                                        // if the document body is not the offset Parent dont do anything yet...
                                        newCssPosValueStr = (parseInt($elem.css("top"),10) + (toolbarOffset*toolbarCount) )+"px";
                                    }
                                    /*  google main page for example and the bing serp page pertain to this */
                                } else {
                                    newCssPosValueStr = (parseInt($elem.css("top"),10) + toolbarOffset)+"px";
                                    console.log("yahoo got caught here..",this)
                                    /*  yahoo mail page for example  */
                                }

                                this.style.top = newCssPosValueStr;
                                this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set","top");
                                this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_top",newCssPosValueStr);
                            } else if(pixelBottomBool && styleBottomDoesntContainPercentage) {
                                newCssPosValueStr = (parseInt($elem.css("bottom"),10) + toolbarOffset)+"px";
                                this.style.bottom = newCssPosValueStr;
                                this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set","bottom");
                                this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_bottom",newCssPosValueStr);
                            }

                            this.setAttribute("data-aloogle-toolbar-adjusted",newCssPosValueStr);

                        } else {
                            /*
                            have to contain the first problem... the sites with a top then will appraoch the ones with a bottom set
                            */
                            if(pixelBottomBool && styleBottomDoesntContainPercentage) {
                                /*
                                var elemToFix;
                                while(element.offsetParent != document.body){
                                    elemToFix = element.offsetParent
                                }

                                newCssPosValueStr = toolbarOffset+"px";
                                this.style.bottom = newCssPosValueStr;
                                this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set","bottom");
                                this.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_bottom",newCssPosValueStr);
                                */
                            } else if (pixelTopBool){
                                /*
                                newCssPosValueStr = toolbarOffset+"px";
                                elemToFix.style.top = newCssPosValueStr;
                                elemToFix.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set","top");
                                elemToFix.setAttribute("data-"+ATB.CONSTANT.EXT_PKG_ID+"_set_top",newCssPosValueStr);
                                if(element.className === "AD"){
                                    console.log(element,element.offsetParent,element.offsetParent.offsetParent,element.offsetParent.offsetParent.offsetParent);
                                    console.log($elem.parents());
                                }
                                
                                */
                            }

                        }


                    }

                } else if ($elePos === "relative"){
                    //  console.log(element,"relative is not cool")
                }

            });
        }


        /*
            what is this??? will turtles mutate into teenage mutant ninjas???
            sadly no, it basically is a observer for changes in DOM elements in
            the body... below is a good link to look up

            https://developer.mozilla.org/en-US/docs/DOM/MutationObserver

            if the browser s not capable of both the other choice would be to fire
            the 'witchhunt' on scroll but that is unoptimal considering... 
        */

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        if(typeof MutationObserver === "function"){
            var target = document.body,
                testTop = /\btop:/,
                observer;

            observer = new MutationObserver(function(mutationEv) {
                /*
                hmmm I remember i read something on filter and foreach vs just simple for...
                http://jsperf.com/map-filter-vs-foreach

                a normal forloop is 3 to 30 times faster depending on browser then map and foreach
                */

                var i = mutationEv.length-1;

                for(;i >= 0;i--){
                    var muEventType = mutationEv[i].type,
                        muEventAttName = mutationEv[i].attributeName;

                    if(muEventType === "attributes"){
                        var $muEventTarget = $(mutationEv[i].target),
                            targetPosCss = $muEventTarget.css("position");

                        if (!$muEventTarget.hasClass("aloogle-toolbar") || 
                                $muEventTarget.hasClass("aloogle-widget") || 
                                $muEventTarget.hasClass("SkipThisFixedPosition") 
                            ) {
                            /* 
                            realize that the hosted versus bundled fire an incredible different of changes...

                            a hosted will only change the iframe src..
                            a bundled will change the iframe src AND change the style attribute 6!!! times...
                            */
                            return;
                        }

                        if(muEventAttName === "style"){
                            if(testTop.test(mutationEv.oldValue) && $muEventTarget.offset().top <= 0){
                                fixedDOMElementsAdjuster($muEventTarget);
                            } else if ( targetPosCss === "fixed" || targetPosCss === "absolute" ){
                                fixedDOMElementsAdjuster($muEventTarget);
                            }
                        } else if(muEventAttName === "class"){
                            fixedDOMElementsAdjuster($muEventTarget.find("*"),newTop);
                        }
                    }
                }
            });

            observer.observe(target, { 
                attributes: true,
                attributeOldValue: true,
                subtree:true
            });
        }

        fixedDOMElementsAdjuster($("body *"),null,true);

        // AutofillTextHighlight feature
        window.addEventListener("mouseup", function() {
            try {
                var activeDoc = document.activeElement;
                if (activeDoc) {
                    var activeTagName = document.activeElement.tagName.toLowerCase();
                    switch (activeTagName) {
                        case "textarea":
                        case "select":
                        case "input":
                            return;
                    }
                }
                var textSelection = window.getSelection().toString();
                if((document.location.protocol == "http:") && textSelection) { // for http protocol only--for security reason
                    ATB.Message.sendSetSearchBoxValue(textSelection);
                }
            }
            catch (e) {
                console.log ("Error occured during autoFillSBOnTextHighLight" + e);
            }
        }, false);

        setTimeout(Toolbar._unstyle, 50);
    },
    _unstyle: function () {
        if ($("#aloogle-toolbar").attr("style")) {
            $("#aloogle-toolbar").attr("style", null);
        } else {
            setTimeout(Toolbar._unstyle, 50);
        }
    }
};
