$(document).on('mobileinit', function()
{
    // inits für JQM (wird ausgeführt nachdem JQM geladen wurde)
});

$(document).on('pageload', function(event)
{
    // Code wird ausgeführt für die App-Seite

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

$(document).ready(function ()
{
    var cache = window.applicationCache;

    // ist application cache API verfügbar?
    if (cache != undefined)
    {
        // TODO: anzahl der dateien aus manifest datei extrahieren
        var num_files_total = 32; // Anzahl aller Dateien
        var num_files_cached = 0; // Anzahl Datien die bereits geladen sind

        var $progress_bar = TolitoProgressBar('progressbar')
            .setOuterTheme('e')
            .setInnerTheme('e')
            .isMini(true)
            .setMax(num_files_total)
            .setStartFrom(num_files_cached)
            .showCounter(true)
            .build();

        // Überprüfe auf neue Version auf dem Server: CHECKING
        cache.addEventListener('checking', function(event)
        {
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').attr('href', "#");
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').text('Überprüfe...');
        });

        // Version ist aktuell: NOUPDATE
        cache.addEventListener('noupdate', function(event)
        {
            $progress_bar.setValue(num_files_total);
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').attr('href', "app.html");
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').text('Starte App');
        });

        // App das erste mal gecached: CACHED
        cache.addEventListener('cached', function(event)
        {
            $progress_bar.setValue(num_files_total);
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').attr('href', "app.html");
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').text('Starte App');
        });

        // Download startet: DOWNLOADING
        cache.addEventListener('downloading', function(event)
        {
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').attr('href', "#");
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').text('Lade App...');
        });

        // listener für progress bar, 1x fire -> +1, dann den balken updaten: PROGRESS
        cache.addEventListener('progress', function(event)
        {
            num_files_cached++;
            $progress_bar.setValue(num_files_cached);
        });

        // update wurde heruntergeladen, verwenden?: UPDATEREADY
        // TODO: Evtl. nur ein silent update durchführen, ohne popup. Führt aber dazu, dass das App "immer komisch neu lädt"
        cache.addEventListener('updateready', function(event)
        {
            cache.swapCache(); // neuen cache benutzen
            $.mobile.changePage("refresh.html", { transition: "slidedown" }); // Seite neu laden
        });

        // Fehler: ERROR
        cache.addEventListener('error', function(event)
        {
            $.mobile.changePage("error-preload.html", { transition: "slidedown" });
        });
    }
    else
    {
        $.mobile.changePage("error-nocache.html", { transition: "slidedown" });
    }
});