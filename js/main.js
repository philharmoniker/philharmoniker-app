/**
 * Die Musician Klasse repräsentiert einen Musiker im App.
 * @param id CSS id des Musiker-DIVs (mit '#')
 * @param soundfile hauptteil der verschiedenen sound-datei-namen. Es werden die drei Varianten daraus generiert
 * @constructor
 */
function Musician( id, soundfile )
{
    'use strict';

    var self = this, // this referenz für closures
        num_frames = 12,
        normal_speed = 12,
        high_speed = 24,
        low_speed = 6;

    this.id = id;
    this.soundfile_normal = 'sound/' + soundfile + '_normal.mp3';
    this.soundfile_slow = 'sound/' + soundfile + '_langsam.mp3';
    this.soundfile_fast = 'sound/' + soundfile + '_schnell.mp3';

    this.is_playing = false;
    this.speed = normal_speed;

    this.sound_normal = new Howl(
        {
            urls: [this.soundfile_normal]
        });

    this.sound_slow = new Howl(
        {
            urls: [this.soundfile_slow]
        });

    this.sound_fast = new Howl(
        {
            urls: [this.soundfile_fast]
        });

    this.start_playing = function()
    {
        if(!this.is_playing) // spielen wir schon?
        {
            $(id).sprite({ fps: this.speed, no_of_frames: num_frames });
            this.sound_normal.play();
            this.is_playing = true;
        }
    };

    this.toggle_playing = function()
    {
        if(this.is_playing)
        {
            $(id).destroy();
            this.sound_slow.stop();
            this.sound_normal.stop();
            this.sound_fast.stop();
            this.is_playing = false;
        }
        else
        {
            $(id).sprite({ fps: this.speed, no_of_frames: num_frames });
            this.sound_normal.play();
            this.is_playing = true;
        }
    };

    this.stop_playing = function()
    {
        $(id).destroy();
        this.sound_normal.stop();
        this.is_playing = false;
    };

    function change_anim_speed(speed)
    {
        self.speed = speed;
        $(id).fps(self.speed);
    }

    this.slower = function()
    {
        change_anim_speed(low_speed);
        var position = this.sound_normal.pos();
        this.sound_normal.stop();

        this.sound_slow.play();
        this.sound_slow.pos(position);
    };

    this.faster = function()
    {
        change_anim_speed(high_speed);

        var position = this.sound_normal.pos();
        this.sound_normal.stop();

        this.sound_fast.play();
        this.sound_fast.pos(position);
    };
}

/**
 * Code wird beim laden der #app-page ausgeführt (einmalig)
 */
$(document).on('pageinit', '#app-page', function()
{
    'use strict';

    // Musiker-Objekte
    var geigerin = new Musician('#geigerin', 'geige'),
        floetistin = new Musician('#floetistin', 'floete'),
        harfenspieler = new Musician('#harfenspieler', 'harfe');

    /**
     * Musiker Tap-Eventhandler
     * @param event
     */
    function tap_handler(event)
    {
        event.stopPropagation(); // event bubbling stoppen

        var musician;
        switch ( $(this).parent()[0].id ) // id des angeklickten divs
        {
            case 'geigerin':
                musician = geigerin;
                break;
            case 'floetistin':
                musician = floetistin;
                break;
            case 'harfenspieler':
                musician = harfenspieler;
                break;
            default:
                break;
        }

        musician.toggle_playing();
    }

    /**
     * Musiker Wisch-Handler
     * TODO: Musiker muss nicht mehr gewischt werden
     * @param event
     */
    function swipeleft_handler(event)
    {
        event.stopPropagation(); // event bubbling stoppen

        switch($(this).parent()[0].id)
        {
            case 'geigerin': geigerin.slower(); break;
            case 'floetistin': floetistin.slower(); break;
            case 'harfenspieler': harfenspieler.slower(); break;
            default: break;
        }
    }

    /**
     * Musiker Wisch-Event
     * TODO: kein wischen mehr
     * @param event
     */
    function swiperight_handler(event)
    {
        event.stopPropagation(); // event bubbling stoppen

        switch ( $(this).parent()[0].id )
        {
            case 'geigerin': geigerin.faster(); break;
            case 'floetistin': floetistin.faster(); break;
            case 'harfenspieler': harfenspieler.faster(); break;
            default: break;
        }
    }

    /**
     * Drag Handler für die Stimmungs-Icons
     * @param event
     */
    function icon_drag_handler(event)
    {
        // set position absolute
        $(this).addClass('js-dragging');
        var x = event.originalEvent.changedTouches[0].pageX;
        var y = event.originalEvent.changedTouches[0].pageY;
        var offset_x = x - $(this).offset().left;
        var offset_y = y - $(this).offset().top;

        // Handler für den Bewegungsteil des Drags
        function drag_move_handler(event)
        {
            event.preventDefault();
            var x = event.originalEvent.changedTouches[0].pageX;
            var y = event.originalEvent.changedTouches[0].pageY;
            $(this).css('left', x - offset_x);
            $(this).css('top', y - offset_y);
        }
        $(this).on('touchmove', drag_move_handler);

        /**
         * Drop-Handler für die Stimmungs-Icons
         * @param event
         */
        function drag_end_Handler(event)
        {
            $(this).removeAttr('style');
            $(this).removeClass('js-dragging');

            var x = event.originalEvent.changedTouches[0].pageX;
            var y = event.originalEvent.changedTouches[0].pageY;
            var element = document.elementFromPoint(x, y);

            switch(element)
            {
                case $('#geigerin .hitbox').get(0):
                    geigerin.slower();
                    break;
                case $('#floetistin .hitbox').get(0):
                    floetistin.faster();
                    break;
                case $('#harfenspieler .hitbox').get(0):
                    harfenspieler.slower();
                    break;
                default:
                    break;
            }

           // TODO: weitere musiker

            $(this).off('touchmove'); // Move Handler entfernen
        }
        $(this).on('touchend', drag_end_Handler); // Drop-Handler anhängen
    }

    // Musiker an Events hängen
    $('.hitbox').on('tap', tap_handler).on('swipeleft', swipeleft_handler).on('swiperight', swiperight_handler);

    // Mood Icons an Events hängen
    $('.mood-icon').on('touchstart', icon_drag_handler);

    // Podium Doppel-Tap für Spielstart
    $("#podium-right").doubleTap(function()
    {
        alert('double tap');
        /*
            TODO: Spiel start!
         */
    });
});

// Code hier wird nur beim laden der ersten Page (preload) ausgeführt!
$(document).ready(function ()
{
    "use strict";

    // Ist application cache API verfügbar?
    if (window.applicationCache !== undefined)
    {
        var cache = window.applicationCache;

        // TODO: anzahl der dateien aus manifest datei extrahieren
        var num_files_total = 41, // Anzahl aller Dateien
            num_files_cached = 0; // Anzahl Datein die bereits geladen wurden

        // Progress-Balken
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
        // gar nix geht
        $.mobile.changePage("error-nocache.html", { transition: "slidedown" });
    }
});
