/**
 * Avoid `console` errors in browsers that lack a console.
 */
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any helper plugins in here.
MBP.startupImage();
MBP.preventScrolling();
MBP.preventZoom();

/**
 * TODO: doubletap plugin, nicht sonderlich gut,mal sehen obs hält
  */
(function($)
{
    $.fn.doubleTap = function(doubleTapCallback)
    {
        return this.each(function()
        {
            var elm = this;
            var lastTap = 0;
            $(elm).bind('vmousedown', function (event)
            {
                var now = (new Date()).valueOf();
                var diff = (now - lastTap);
                lastTap = now ;
                if (diff < 250) // TODO: magic number in ms, richtigen wert finden
                {
                    if($.isFunction( doubleTapCallback ))
                    {
                        doubleTapCallback.call(elm);
                    }
                }
            });
        });
    };
})(jQuery);
