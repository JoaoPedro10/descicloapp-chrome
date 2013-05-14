/**
    Widget Carousel
    Author: Abe Coffman

    The carousel class assumes the following markup structure:

        #center-dock
            #carousel
                (widget buttons here)

    The carousel enables sliding the widget reel left and
    right when it's wider than the center dock. The carousel
    is reinitialized each time the browser window is resized
    and is optimized so that it will always be able to show
    the largest item in the widget reel.

    In cases where the center dock becomes so small that it
    couldn't fit the largest item in the widget reel, the
    carousel is hidden.
*/
function Carousel() {
    // carousel markup
    this.$viewingWindow = $("#center-dock");
    this.$carousel = $("#carousel");

    this.$nav = $(".carousel-nav");
    this.$left = $("#carousel-nav-left");
    this.$right = $("#carousel-nav-right");

    // width constants
    this.PADDING_OFFSET = parseInt( this.$viewingWindow.css("padding-left"), 10 );
    this.NAV_ARROW_OFFSET = this.$left.outerWidth();
}

/**
    The init function can be called more than once. It is called
    whenever the toolbar is redrawn, or the ui of one of the
    buttons in the carousel is changed.
*/
Carousel.prototype.init = function() {
    
    // variable widths
    this.viewingWindowWidth = this.$viewingWindow.innerWidth();
    this.carouselWidth = 0;
    this.itemWidths = [/* numbers */];
    
    var that = this, widestItem = 0;
    this.$carousel.children("*").each(function(i, el) {
        var itemWidth = $(el).outerWidth(true) +
                         parseInt( $(el).css("margin-left"), 10 ) +
                         parseInt( $(el).css("margin-right"), 10 );
        that.itemWidths.push(itemWidth);
        that.carouselWidth += itemWidth;
        widestItem = Math.max(widestItem, itemWidth);
    });
    this.minCarouselWidth = widestItem + (2 * (this.PADDING_OFFSET + this.NAV_ARROW_OFFSET) );

    // need to set the carousel width explicitly
    this.$carousel.css("width", this.carouselWidth);

    // we only init the the carousel if its long enough
    if( this.viewingWindowWidth > this.minCarouselWidth ) {

        // build the carousel viewing windows
        this.currentIndex = 0;
        this.viewingWindows = this._initPanes();

        // init the reel
        this.$carousel.show();
        this._showOrHideNav();
        this.$carousel.animate({ left: this.viewingWindows[this.currentIndex] }, 1000);

        this.animating = false;
        var that = this;
        this.$left.unbind().on("click", function(e) {
            e.preventDefault();
            if( !that.animating ) {
                that.animating = true;
                that.$nav.addClass("disabled");
                that.$right.removeClass("hidden");
                that.$carousel.animate({ left: that.viewingWindows[--that.currentIndex] }, 1000, function() {
                    that.$nav.removeClass("disabled");
                    that._showOrHideNav();
                    that.animating = false;
                });
            }
        });

        this.$right.unbind().on("click", function(e) {
            e.preventDefault();
            if( !that.animating ) {
                that.animating = true;
                that.$nav.addClass("disabled");
                that.$left.removeClass("hidden");
                that.$carousel.animate({ left: that.viewingWindows[++that.currentIndex] }, 1000, function() {
                    that.$nav.removeClass("disabled");
                    that._showOrHideNav();
                    that.animating = false;
                });
            }
        });
    }
    else {
        this.$carousel.hide();
        this._showOrHideNav();
    }
}

Carousel.prototype._initPanes = function() {

    var coords = [this.PADDING_OFFSET],
        runningWindowWidth = this.PADDING_OFFSET * 2,
        runningTotalWidth = 0;

    for( var i=0, j=this.itemWidths.length; i<j; i++ ) {

        // the end condition
        if( this._remainingWidth(i) < this.viewingWindowWidth ) {
            coords.push( 0 - (this.carouselWidth - this.viewingWindowWidth + this.PADDING_OFFSET) );
            break;
        }

        var navOffset = (coords.length == 1) ? 0 : this.NAV_ARROW_OFFSET;

        runningTotalWidth += this.itemWidths[i];
        runningWindowWidth += this.itemWidths[i] + navOffset;

        if( runningWindowWidth > this.viewingWindowWidth ) {
            // we have to adjust the widths back if we go over
            runningTotalWidth -= this.itemWidths[i];
            runningWindowWidth -= (this.itemWidths[i] + navOffset);
            i--;

            coords.push( 0 - runningTotalWidth + this.NAV_ARROW_OFFSET );
            runningWindowWidth = this.PADDING_OFFSET * 2;
        }
    }
    return coords;
}

Carousel.prototype._remainingWidth = function(index) {
    var remaining = this.PADDING_OFFSET + this.NAV_ARROW_OFFSET;
    for( var i=index, j=this.itemWidths.length; i<j; i++ ) { remaining += this.itemWidths[i]; }
    return remaining;
}

Carousel.prototype._showOrHideNav = function() {
    if( this.viewingWindowWidth < this.carouselWidth && this.$carousel.is(":visible") ) {
        if( this.currentIndex == (this.viewingWindows.length - 1) ) {
            this.$left.removeClass("hidden");
            this.$right.addClass("hidden");
        }
        else if( this.currentIndex == 0 ) {
            this.$right.removeClass("hidden");
            this.$left.addClass("hidden");
        }
        else {
            this.$left.removeClass("hidden");
            this.$right.removeClass("hidden");
        }
    }
    else {
        this.$left.addClass("hidden");
        this.$right.addClass("hidden");
    }
}
