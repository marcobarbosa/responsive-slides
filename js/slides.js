/**
 *
 * Responsive Slides
 *
 * @author Marco Barbosa
 *
 */

var SLIDE = SLIDE || {};

var SLIDES = (function(window, document){

    // Objects.
    var api = {};
    // Cache the elements of this component.
    var elements = {
        context : document.getElementById('viewport'),
        progressBar : document.querySelector('#progress-bar div')
    };
    // All the slides in tihs context.
    var slides = elements.context.querySelectorAll('#viewport section');
    // Touch event handlers.
    var touch = {
        fingerCount: 0,
        moved : false,
        startX : 0,
        startY : 0,
        curX : 0,
        curY: 0,
        deltaX: 0,
        deltaY: 0,
        horzDiff: 0,
        vertDiff: 0,
        minLength: 72,
        swipeLength: 0,
        swipeAngle: null,
        swipeDirection: null

    };
    // Animation boolean.
    var isAnimating = false;
    // Slides numbers
    var NUM_TOTAL_SLIDES = slides.length;
    var nCurrentSlide = 0;

    /**
     *
     * Events callbacks
     *
     */

    /**
     * Handles the keydown press on the keyboard
     *
     * Event codes:
     * ---------------
     * 8  = Backspace
     * 13 = Enter
     * 32 = Space
     * 33 = Page Up
     * 34 = Page Down
     * 37 = Left arrow
     *
     * @param  {Object} event [The event objec.t]
     */
    var onKeyDown = function(event) {

        var rightActions = [13, 32, 34, 39];
        var leftActions = [8, 33, 37];

        event.preventDefault();

        if (rightActions.indexOf(event.keyCode) > -1) {
            api.doSlide(1);
        }

        if (leftActions.indexOf(event.keyCode) > -1) {
            api.doSlide(-1);
        }

    };
    
    /**
     * ---------------------------------------------------------
     * Swipe events
     * Courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM
     * ---------------------------------------------------------
     */
    
    /**
     * When the touch is stopped by the user.
     * @param  {Object} event [The event object.]
     */
    var onTouchCancel = function(event) {
        // reset the variables back to default values
        touch.fingerCount = 0;
        touch.startX = 0;
        touch.startY = 0;
        touch.curX = 0;
        touch.curY = 0;
        touch.deltaX = 0;
        touch.deltaY = 0;
        touch.horzDiff = 0;
        touch.vertDiff = 0;
        touch.swipeLength = 0;
        touch.swipeAngle = null;
        touch.swipeDirection = null;
    };

    /**
     * Saves the reference of where the touch started
     * to calculate if it's enough for a swipe later on.
     * @param  {Object} event The event object.
     */
    var onTouchStart = function(event) {
        touch.fingerCount = event.touches.length;

        // since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
        // check that only one finger was used
        if ( touch.fingerCount === 1 ) {
            // get the coordinates of the touch
            touch.startX = event.touches[0].pageX;
            touch.startY = event.touches[0].pageY;
        } else {
            // more than one finger touched so cancel
            onTouchCancel(event);
        }
    };

    /**
     * When the swipe is happening (touch must be moving)
     * @param  {Object} event [The event object.]
     */
    var onTouchMove = function(event) {

        // Prevent scrolling.
        event.preventDefault();

        if ( event.touches.length === 1 ) {
            touch.curX = event.touches[0].pageX;
            touch.curY = event.touches[0].pageY;
        } else {
            onTouchCancel(event);
        }

    };

    /**
     * Math calculates to get the angle in degrees.
     */
    var calculateAngle = function() {
        var X = touch.startX - touch.curX;
        var Y = touch.curY - touch.startY;
        var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
        var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
        touch.swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
        if ( touch.swipeAngle < 0 ) { touch.swipeAngle =  360 - Math.abs(touch.swipeAngle); }
    };

    /**
     * Finds out what angle is being done with the swiping.
     */
    var determineSwipeDirection = function() {
        if ( (touch.swipeAngle <= 45) && (touch.swipeAngle >= 0) ) {
            touch.swipeDirection = 1;
        } else if ( (touch.swipeAngle <= 360) && (touch.swipeAngle >= 315) ) {
            touch.swipeDirection = 1;
        } else if ( (touch.swipeAngle >= 135) && (touch.swipeAngle <= 225) ) {
            touch.swipeDirection = -1;
        } /*else if ( (touch.swipeAngle > 45) && (touch.swipeAngle < 135) ) {
            touch.swipeDirection = -1;
        } else {
            touch.swipeDirection = 1;
        }*/
    };

    /**
     * Events that is triggered when the touch ends.
     * @param  {Object} event [The event object.]
     */
    var onTouchEnd = function(event) {
        
        event.preventDefault();

        // check to see if more than one finger was used and that there is an ending coordinate
        if ( touch.fingerCount === 1 && touch.curX !== 0 ) {
            // use the Distance Formula to determine the length of the swipe
            touch.swipeLength = Math.round(Math.sqrt(Math.pow(touch.curX - touch.startX,2) + Math.pow(touch.curY - touch.startY,2)));
            // if the user swiped more than the minimum length, perform the appropriate action
            if ( touch.swipeLength >= touch.minLength ) {
                calculateAngle();
                determineSwipeDirection();
                // processingRoutine();
                api.doSlide(touch.swipeDirection);
                onTouchCancel(event); // reset the variables
            } else {
                onTouchCancel(event);
            }
        } else {
            onTouchCancel(event);
        }
    };


    /**
     * ---------------------------------------------------------
     * Hash functions kindly based on the Google html5 slides.
     * URL: http://code.google.com/p/html5slides/
     * ---------------------------------------------------------
     */
    
    /**
     * Gets the number from the hash URL
     * and tries to slide to the specified number.
     */
    var getSlideNumFromHash = function() {
        // Get the hash number.
        var nHashSlide = parseInt(location.hash.substr(1), 10);
        // Default direction.
        var _direction = 1;

        // Set the direction based on the specified number.
        if (nCurrentSlide - nHashSlide < 0) {
            _direction = 1;
        } else {
            _direction = -1;
        }

        // Do the sliding.
        api.doSlide(_direction, nHashSlide);
    };

    /**
     * Updates the Hash in the URL to the current slide number.
     */
    var setSlideNumHash = function() {
        location.replace('#' + nCurrentSlide);
    };

    // ---------------------------------------------------------

    /**
     * Makes the slide transition to a specific direction.
     *
     * The direction can be -1 for left and +1 for right.
     *
     * @param  {Integer} direction [The direction of the sliding.]
     * @param {Integer} jumpToSlide [Slide to jump to - optional.]
     * @return {[type]}
     */
    api.doSlide = function(direction, jumpToSlide) {

        var nTargetSlide = null;
        var nextSlide = null;
        var previousSlide = null;
        var newSlideClass = (direction > 0) ? 'right' : 'left';

        if (jumpToSlide) {
            nTargetSlide = jumpToSlide;
        } else {
            nTargetSlide = nCurrentSlide + direction;
        }

        // If we can't slide, get out.
        if (!direction || nTargetSlide < 0 || nTargetSlide > (NUM_TOTAL_SLIDES - 1) || isAnimating) {
            return;
        }

        // Get the target slide element.
        nextSlide = slides[nTargetSlide];

        // Get the previous one.
        previousSlide = slides[nCurrentSlide];

        // We're animating right now!
        isAnimating = true;

        // Previous slide should fade out.
        previousSlide.classList.add('previous');

        // Next slide should slide in.
        nextSlide.classList.add(newSlideClass);
        nextSlide.classList.add('current');

        // The animation takes 500 ms
        // Schedule this to run after it's done (+100 ms to be safe).
        setTimeout(function() {
            // Reset previous slides classes.
            api.resetSlide();
            // Update the current slide index.
            nCurrentSlide = nTargetSlide;
            // Allow further animations.
            isAnimating = false;
            // Update the progress bar on the top.
            api.updateProgressBar();
            // Update the URL.
            setSlideNumHash();
        }, 400);

    };

    /**
     * Increases the width of the progress bar.
     */
    api.updateProgressBar = function() {
        // Resizes the width.
        // The transition effect is handled by CSS.
        elements.progressBar.style.width = Math.floor(((nCurrentSlide + 1) / NUM_TOTAL_SLIDES) * 100) + '%';
    };

    /**
     * Resets the current slide from any previous classes.
     */
    api.resetSlide = function() {

        // Slide classes that we are using.
        var slideClasses = ['current', 'left', 'right', 'previous'];

        // Clean any previous class the previous slide may have.
        for (var i = 0, len = slideClasses.length; i < len; i++) {
            slides[nCurrentSlide].classList.remove(slideClasses[i]);
        }

    };

    /**
     * Add callbacks to the events listeners.
     */
    var addEventListeners = function() {
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('touchstart', onTouchStart, true);
        document.addEventListener('touchmove', onTouchMove, true);
        document.addEventListener('touchend', onTouchEnd, true);
        document.addEventListener('touchcancel', onTouchCancel, true);
    };

    var onFullscreen = function() {
        elements.context.webkitRequestFullScreen();
    };

    /**
     * Constructor.
     */
    api.init = function() {
        // http://remysharp.com/2010/08/05/doing-it-right-skipping-the-iphone-url-bar/
       // /mobile/i.test(navigator.userAgent) && !location.hash && setTimeout(function () {
       //     window.scrollTo(0, 1);
       // }, 1000);​
        // trigger the full screen API.
        // $context.webkitRequestFullScreen();
        // $context.mozRequestFullScreen();
        getSlideNumFromHash();
        addEventListeners();
        document.body.classList.add('ready');
    };

    window.onload = function() {
        api.init();
    };

    // Make the api public.
    return api;

})(window, document);