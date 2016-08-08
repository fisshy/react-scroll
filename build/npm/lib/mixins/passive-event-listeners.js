/*
 * Tell the browser that the event listener won't prevent a scroll.
 * Allowing the browser to continue scrolling without having to
 * to wait for the listener to return.
 */
var addPassiveEventListener = function(target, eventName, listener) {
    var supportsPassiveOption = (function(){
        var supportsPassiveOption = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassiveOption = true;
                }
            });
            window.addEventListener('test', null, opts);
        } catch (e) {}
        return supportsPassiveOption;
    })();

    target.addEventListener(eventName, listener, supportsPassiveOption ? {passive: true} : false);
};

module.exports = addPassiveEventListener;
