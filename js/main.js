$(document).on('mobileinit', function()
{
    // inits für JQM
});

/*
 pagebeforeload, pageload and pageloadfailed are fired when an external page is loaded
 pagebeforechange, pagechange and pagechangefailed are page change events. These events are fired when a user is navigating between pages in the applications.
 pagebeforeshow, pagebeforehide, pageshow and pagehide are page transition events. These events are fired before, during and after a transition and are named.
 pagebeforecreate, pagecreate and pageinit are for page initialization.
 pageremove can be fired and then handled when a page is removed from the DOM
*/

// Code wird beim laden der #app-page ausgeführt (1x)
$(document).on('pageinit', '#app-page', function()
{
    var num_frames = 12;
    var normal_speed = 12;
    var high_speed = 24;
    var low_speed = 6;

    // id: CSS id des sprite (mit #)
    function Musician(id, soundfile_mp3, soundfile_ogg)
    {
        this.id = id;
        this.soundfile_mp3 = soundfile_mp3;
        this.soundfile_ogg = soundfile_ogg;
        this.is_playing = false;
        this.speed = normal_speed;
        this.sound = new Howl(
        {
            urls: [this.soundfile_mp3, this.soundfile_ogg]
        });

        /*
            startet Animation
            startet sound
        */
        this.start_playing = function()
        {
            $(id).sprite({ fps: this.speed, no_of_frames: num_frames });
            this.sound.play();
            this.is_playing = true;
        }

        /*
            stoppt animation
            stoppt sound
        */
        this.stop_playing = function()
        {
            $(id).destroy();
            this.sound.stop();
            this.is_playing = false;
        }

        /*
            setzt neue abspielgeschwindigkeit (nur animation)
         */
        this.change_speed = function(speed)
        {
            this.speed = speed;
            $(id).fps(this.speed);
        }
    }

    var geigerin = new Musician('#geigerin', 'sound/violin.mp3','sound/violin.ogg');

    // Callbacks
    function tap_handler(event)
    {
        event.stopPropagation(); // event bubbling stoppen

        var musician = {};
        switch ( $(this).parent()[0].id )
        {
            case 'geigerin': musician = geigerin; break;
            default: break;
        }

        if(musician.is_playing)
        {
            musician.stop_playing();
        }
        else
        {
            musician.start_playing();
        }
    }

    function swipeleft_handler(event)
    {
        event.stopPropagation(); // event bubbling stoppen
        // TODO: grosse switches hier gut?!?

        switch($(this).parent()[0].id)
        {
            case 'geigerin': geigerin.change_speed(low_speed); break;
            default: break;
        }
    }

    function swiperight_handler(event)
    {
        event.stopPropagation(); // event bubbling stoppen

        switch ($(this).parent()[0].id)
        {
            case 'geigerin': geigerin.change_speed(high_speed); break;
            default: break;
        }
    }

    // Bindings
    $('.hitbox').on('tap', tap_handler);
    $('.hitbox').on('swipeleft', swipeleft_handler);
    $('.hitbox').on('swiperight', swiperight_handler);
});


// Nur für die erste Seite relevant!
$(document).ready(function ()
{
    // ist application cache API verfügbar?
    if (window.applicationCache != undefined)
    {
        var cache = window.applicationCache;

        // TODO: anzahl der dateien aus manifest datei extrahieren
        var num_files_total = 35; // Anzahl aller Dateien
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