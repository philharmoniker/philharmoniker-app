$(document).bind('mobileinit', function()
{
    // inits für JQM (wird ausgeführt nachdem JQM geladen wurde)
});

$(document).ready(function()
{
    // Sprites beim start anzeigen: IDLE
    $('#knight1').sprite({ fps: 6, no_of_frames: 6 });
    $('#knight2').sprite({ fps: 6, no_of_frames: 6 });
    $('#knight3').sprite({ fps: 6, no_of_frames: 6 });
    $('#knight4').sprite({ fps: 6, no_of_frames: 6 });
    $('#knight5').sprite({ fps: 6, no_of_frames: 6 });

    // Callbacks
    function tapHandler(event)
    {
        $('#knight3').fps(24);
    }

    function swipeHandlerStop(event)
    {
        $('#knight3').destroy();
    }

    function swipeHandlerStart(event)
    {
        $('#knight3').sprite({ fps: 6, no_of_frames: 6 });
    }

    // Bindings
    $('#knight3').on('tap', tapHandler);
    $('#knight3').on('swipeleft', swipeHandlerStop);
    $('#knight3').on('swiperight', swipeHandlerStart);
    $('#podium').show("slide", { direction: top }, 2000);

});