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

    this.start_playing = function ()
    {
        if ( ! this.is_playing ) // spielen wir schon?
        {
            $(id).sprite({ fps: this.speed, no_of_frames: num_frames });
            this.sound_normal.play();
            this.is_playing = true;
        }
    };

    this.toggle_playing = function ()
    {
        if ( this.is_playing )
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

    this.stop_playing = function ()
    {
        $(id).destroy();
        this.sound_normal.stop();
        this.is_playing = false;
    };

    function change_anim_speed( speed )
    {
        self.speed = speed;
        $(id).fps(self.speed);
    }

    this.slower = function ()
    {
        change_anim_speed(low_speed);
        var position = this.sound_normal.pos();
        this.sound_normal.stop();

        this.sound_slow.play();
        this.sound_slow.pos(position);
    };

    this.faster = function ()
    {
        change_anim_speed(high_speed);

        var position = this.sound_normal.pos();
        this.sound_normal.stop();

        this.sound_fast.play();
        this.sound_fast.pos(position);
    };
}

function generate_gesture( gesture )
{
    // generiere irgendwie Gestendaten
    // schreibe sie in das Gestenobjekt
    gesture.works = true;
}

/**
 * Verarbeitet eine erhaltene Geste und bestimmt, was im Spiel als nächste s geschieht
 * @param gesture Irgendein tolles Gestenobjekt
 */
function process_gesture( gesture )
{
    // TODO: gestenobjekt erhalten und dann tolle Sachen damit machen
    var gesture_type = 0;
    switch ( gesture_type )
    {
        case 0:
            // Geste 0 erkannt! mach was!
            break;
        case 1:
            break;
        default:
            break;
    }
    //TODO: debug
    alert('Geste!');
}

/**
 * Code wird beim laden der #app-page ausgeführt (einmalig)
 */
$(document).on('pageinit', '#app-page', function ()
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
    function tap_handler( event )
    {
        event.stopPropagation(); // event bubbling stoppen

        var musician;
        switch ($(this).parent()[0].id) // id des angeklickten divs
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
     * Drag Handler für die Stimmungs-Icons
     * @param event
     */
    function icon_drag_handler( event )
    {
        // set position absolute
        $(this).addClass('js-dragging');
        var x = event.originalEvent.changedTouches[0].pageX;
        var y = event.originalEvent.changedTouches[0].pageY;
        var offset_x = x - $(this).offset().left;
        var offset_y = y - $(this).offset().top;

        // Handler für den Bewegungsteil des Drags
        function drag_move_handler( event )
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
        function drag_end_Handler( event )
        {
            $(this).removeAttr('style');
            $(this).removeClass('js-dragging');

            var x = event.originalEvent.changedTouches[0].pageX;
            var y = event.originalEvent.changedTouches[0].pageY;
            var element = document.elementFromPoint(x, y);

            switch (element)
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
    $('.hitbox').on('tap', tap_handler);

    // Mood Icons an Events hängen
    $('.mood-icon').on('touchstart', icon_drag_handler);

    // Podium Doppel-Tap für Spielstart
    $('#podium-right').doubleTap(function ()
    {
        alert('double tap');
        /*
         TODO: Spiel start!
         */
    });

    // Aktiviere den Gesten Canvas
    $('#knight5').on('tap',function( event )
    {
        // Toggle den canvas
        if ( $('#gestures').hasClass('hidden') )
        {
            $('#gestures').removeClass('hidden');
        }
        else
        {
            $('#gestures').addClass('hidden');
        }
    });

    var gesture = {};
    gesture.works = false;

    // Touch events auf dem Gesten Canvas
    $('#gestures').on('touchend',function( event )
    {
        // touch ende -> canvas wieder verstecken und geste auswerten
        $('#gestures').addClass('hidden');

        // Geste auswerten...
        generate_gesture(gesture);
        process_gesture(gesture);
    });
});

// Code hier wird nur beim laden der ersten Page (preload) ausgeführt!
$(document).ready(function ()
{
    'use strict';

    // Ist application cache API verfügbar?
    if ( window.applicationCache !== undefined )
    {
        var cache = window.applicationCache;

        // TODO: anzahl der dateien aus manifest datei extrahieren
        var num_files_total = 38, // Anzahl aller Dateien
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

        // Überprüfe auf neue Version auf dem Server:               CHECKING
        cache.addEventListener('checking', function ( event )
        {
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#').text('Überprüfe...');
        });

        // Version ist aktuell:                                     NOUPDATE
        cache.addEventListener('noupdate', function ( event )
        {
            $progress_bar.setValue(num_files_total);
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#app-page').text('Starte App');
        });

        // App das erste mal gecached:                              CACHED
        cache.addEventListener('cached', function ( event )
        {
            $progress_bar.setValue(num_files_total);
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#app-page').text('Starte App');
        });

        // Download startet:                                        DOWNLOADING
        cache.addEventListener('downloading', function ( event )
        {
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#').text('Lade App...');
        });

        // listener für progress bar, 1x fire -> +1, dann den balken updaten: PROGRESS
        cache.addEventListener('progress', function ( event )
        {
            num_files_cached ++;
            $progress_bar.setValue(num_files_cached);
        });

        // update wurde heruntergeladen, verwenden?: UPDATEREADY
        // TODO: Evtl. nur ein silent update durchführen, ohne popup. Führt aber dazu, dass das App "immer komisch neu lädt"
        cache.addEventListener('updateready', function ( event )
        {
            cache.swapCache(); // neuen cache benutzen
            $.mobile.changePage('update.html', { transition: 'slidedown' });
        });

        // Fehler: ERROR
        cache.addEventListener('error', function ( event )
        {
            $.mobile.changePage('error-dl.html', { transition: 'slidedown' });
        });
    }
    else
    {
        // gar nix geht
        $.mobile.changePage('error-cache.html', { transition: 'slidedown' });
    }
});
