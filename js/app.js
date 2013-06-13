/*==============================================================================
 Author:         Georgios Panayiotou
 Created:        2013-04-10
 URL:            https://github.com/gpanayiotou
 URL:            https://github.com/philharmoniker/philharmoniker-app
 Institution:    HAW Hamburg
 Faculty:        Design, Medien und Information
 Department:     Medientechnik
 Project:        Berliner Philharmoniker Projekt, Dirigenten App

 Copyright (C) 2013  Georgios Panayiotou

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 =============================================================================*/

/**
 * @author Georgios Panayiotou
 * @fileoverview Haupt-JavaScript Datei des Apps
 */

/* namespace */
var EDUPHIL = {
    QUANTITY: 1,
    canvas:null,
    context:null,
    particles:null,
    mouseX:0,
    mouseY:0
};

EDUPHIL.info_texts = [];
EDUPHIL.info_texts.MOOD_ONE = 'Unter Stimmung versteht man die theoretische und praktische Festlegung der Tonhöhen (Frequenzen) von Schallquellen, insbesondere von Musikinstrumenten. In der Praxis genügt hierzu oft (etwa bei einigen Blasinstrumenten) die Festlegung der absoluten Tonhöhe durch Abgleich mit einer Normfrequenz (Kammerton a1 = 440 Hz oder einer anderen für den Einzelfall vereinbarten Frequenz). Vor allem bei Saiten- und Tasteninstrumenten ist zusätzlich eine relative Festlegung der den Saiten oder Tasten zugeordneten Frequenzen erforderlich. Während Streichinstrumente auch nach der Einstimmung ihrer Saiten jeden Ton (evtl. durch Lagenspiel) rein intonieren können, müssen bei Tasteninstrumenten die zwölf Halbtöne pro Oktave fest eingestimmt werden.';
EDUPHIL.info_texts.GEIGERIN = 'Einige Geiger waren auch bekannte Komponisten. Dazu zählen im Frühbarock in Italien Arcangelo Corelli und in Deutschland Heinrich Ignaz Franz Biber, im Hochbarock Antonio Vivaldi, Giuseppe Tartini oder Pietro Locatelli.    Dem galanten Stil kann man Johann Stamitz, Carl Stamitz, Gaetano Pugnani, Christian Cannabich und Pietro Nardini zuordnen. Den Übergang von der Klassik zur Frühromantik ebneten Giovanni Battista Viotti, Louis Spohr und Rodolphe Kreutzer. Im frühen 19. Jahrhundert entwickelte Niccolò Paganini eine brillante Spieltechnik, er erregte zu seiner Zeit Aufsehen durch sein Doppelflageolett und seine gewagten Pizzicati.';
EDUPHIL.game_is_running = false;
EDUPHIL.sound_buffer = false;

/**
 * Die Musician Klasse repräsentiert einen Musiker im App.
 * @param {string} element_id CSS id des Musiker-DIVs (mit '#')
 * @param {string} soundfile hauptteil der verschiedenen sound-datei-namen. Es werden die drei Varianten daraus generiert
 * @constructor
 */
EDUPHIL.Musician = function( element_id, soundfile )
{
    'use strict';

    var num_frames = 24,
        normal_speed = 12,
        high_speed = 24,
        low_speed = 6,
        is_playing = false,
        fast_is_playing = false,
        slow_is_playing = false,
        DEFAULT_VOLUME = 0.2,
        soundfile_normal = 'sound/' + soundfile + '_normal.mp3',
        soundfile_slow = 'sound/' + soundfile + '_langsam.mp3',
        soundfile_fast = 'sound/' + soundfile + '_schnell.mp3',
        sound_normal = new Howl(
            {
                urls: [soundfile_normal],
                loop: true,
                buffer: EDUPHIL.sound_buffer,
                volume: DEFAULT_VOLUME
            }),
        sound_slow = new Howl(
            {
                urls: [soundfile_slow],
                loop: true,
                buffer: EDUPHIL.sound_buffer,
                volume: DEFAULT_VOLUME
            }),
        sound_fast = new Howl(
            {
                urls: [soundfile_fast],
                loop: true,
                buffer: EDUPHIL.sound_buffer,
                volume: DEFAULT_VOLUME
            }),
        graphics = element_id;

    // public
    this.id = element_id;

    /**
     * Starte Sound und Animation
     * @private
     */
    function start_playing()
    {
        $(graphics).sprite({ fps: normal_speed, no_of_frames: num_frames });
        sound_normal.play();
        is_playing = true;
    }

    /**
     * Breche Abspielen ab und setze alles auf 0
     * @private
     */
    function stop_playing()
    {
        $(graphics).destroy();
        sound_slow.stop();
        sound_normal.stop();
        sound_fast.stop();
        is_playing = false;
    }

    /**
     * Pausiert Abspielen
     * @private
     */
    function pause_playing()
    {
        $(graphics).destroy();
        sound_slow.pause();
        sound_normal.pause();
        sound_fast.pause();
        is_playing = false;
    }

    /**
     * Toggle abspielen von animation/sound
     */
    this.toggle_playing = function()
    {
        if ( is_playing ) { stop_playing(); }
        else { start_playing(); }
    };

    /**
     * Setzt die Animationsgeschwindigkeit.
     * @param new_speed Die neuen FPS der Animation. Verwende normal_speed, low_speed oder high_speed
     * @private
     */
    function change_anim_speed( new_speed )
    {
        $(graphics).fps(new_speed);
    }

    /**
     * Wechsle zu langsamer Tonspur und Animation
     */
    this.play_slower = function ()
    {
        change_anim_speed(low_speed);

        // aktuelle Position holen TODO: position sollte global verarbeitet werden für ALLE tonspuren
        var position = 5000;
        sound_normal.stop();
        sound_fast.stop();

        // alte position in neuer tonspur setzen
        sound_slow.play();
        //sound_slow.pos(position);
    };

    /**
     * Wechsle zu schneller Tonspur und Animation
     */
    this.play_faster = function ()
    {
        change_anim_speed(high_speed);

        // aktuelle Position holen TODO: position sollte global verarbeitet werden für ALLE tonspuren
        var position = 5000;
        sound_normal.stop();
        sound_slow.stop();

        sound_fast.play();
        //sound_fast.pos(position);
    };
};

/**
 * Alle Musiker beginnen zu spielen
 */
EDUPHIL.all_toggle_playing = function()
{
    'use strict';

    // Iterate over orchestra
    for (var i = 0; i < EDUPHIL.orchestra.length; i++)
    {
        EDUPHIL.orchestra[i].toggle_playing();
    }
};

/**
 * Alle Musiker spielen langsamer
 */
EDUPHIL.all_play_slower = function()
{
    'use strict';

    // Iterate over orchestra
    for (var i = 0; i < EDUPHIL.orchestra.length; i++)
    {
        EDUPHIL.orchestra[i].play_slower();
    }
};

/**
 * Intro-Animation des Apps (Silhouette)
 */
EDUPHIL.app_intro = function()
{
    'use strict';

    EDUPHIL.tuning_sound.play();

    /* nach kurzer Zeit:
     * Silhouette ausblenden
     * Hintergrund einblenden
     */
    window.setTimeout(function()
    {
        $('#silhouette').fadeOut(2000, function() { $('#silhouette').remove(); });
    }, 5000);

    window.setTimeout(function()
    {
        $('#app-page').removeClass('js-blur').addClass('js-ani-play-blur-rev');
    }, 6000);
};

/**
 * Tap-Handler für Musiker-Objekte (Einsatz)
 * @param event
 */
EDUPHIL.musician_tap_handler = function( event )
{
    'use strict';

    event.stopPropagation(); // event bubbling stoppen

    switch ($(this).parent()[0].id) // id des angeklickten divs
    {
        case 'geigerin':
            EDUPHIL.geigerin.toggle_playing();
            break;
        case 'floetistin':
            EDUPHIL.floetistin.toggle_playing();
            break;
        case 'harfenspieler':
            EDUPHIL.harfenspieler.toggle_playing();
            break;
        default:
            break;
    }
};

/**
 * Taphold-Handler für Musiker
 * @param event
 */
EDUPHIL.musician_taphold_handler = function( event )
{
    'use strict';

    // info text anpassen
    switch ( $(this).attr('id') )
    {
        case 'geigerin':
            $('#info-title').text('Geigerin gewählt');
            $('#info-text').text(EDUPHIL.info_texts.GEIGERIN);
            break;
        default:
            break;
    }

    $('#info-panel').panel('open');
};

/**
 * Taphold-Handler für Musiker
 * @param event
 */
EDUPHIL.mood_taphold_handler = function( event )
{
    'use strict';

    // info text anpassen
    switch ( $(this).attr('id') )
    {
        case 'mood-one':
            $('#info-title').text('Stimmung Eins gewählt');
            $('#info-text').text(EDUPHIL.info_texts.MOOD_ONE);
            break;
        default:
            break;
    }

    $('#info-panel').panel('open');
};

/**
 * Drag-Handler für die Stimmungs-Icons
 * @param event
 */
EDUPHIL.icon_drag_handler = function( event )
{
    'use strict';

    var x = event.originalEvent.changedTouches[0].pageX,
        y = event.originalEvent.changedTouches[0].pageY,
        offset_x = x - $(this).offset().left,
        offset_y = y - $(this).offset().top;

    $(this).detach();
    $(this).appendTo($('body'));
    $(this).css('position', 'fixed');
    $(this).css('left', x - offset_x);
    $(this).css('top', y - offset_y);

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
        $(this).detach();
        $(this).appendTo($('#mood-container'));

        var x = event.originalEvent.changedTouches[0].pageX;
        var y = event.originalEvent.changedTouches[0].pageY;
        var element = document.elementFromPoint(x, y);

        switch (element)
        {
            case $('#geigerin').children('.hitbox').get(0):
                EDUPHIL.geigerin.play_faster();
                break;
            case $('#floetistin').children('.hitbox').get(0):
                EDUPHIL.floetistin.play_faster();
                break;
            case $('#harfenspieler').find('.hitbox').get(0):
                EDUPHIL.harfenspieler.play_faster();
                break;
            default:
                break;
        }

        $(this).off('touchmove'); // Move Handler entfernen
    }

    $(this).on('touchend', drag_end_Handler); // Drop-Handler anhängen
};

/**
 * Aktiviert das Gesten-Canvas für Gesteningabe
 * @param event
 */
EDUPHIL.init_gestures = function()
{
    'use strict';
    console.log(1);
    $('#gestures').removeClass('hidden'); // canvas anzeigen
    $('#app-page').removeClass('js-ani-play-blur-rev').addClass('js-ani-play-blur'); // Hintergrund weichzeichnen
    
    // ist mir immer noch nicht klar warum hier 3x #gesture eventlistener gechained bekommt.
    // Touch events
    $('#gestures').on('touchstart', EDUPHIL.gesture_started).on('touchmove', EDUPHIL.capture_gesture).on('touchend', EDUPHIL.gesture_finished);
    // Touch events
    $('#gestures').on('touchstart', EDUPHIL.gesture_started).on('touchmove', EDUPHIL.capture_gesture).on('touchend', EDUPHIL.gesture_finished);
    // Touch events
    $('#gestures').on('touchstart', EDUPHIL.gesture_started).on('touchmove', EDUPHIL.capture_gesture).on('touchend', EDUPHIL.gesture_finished);
};

/**
 * Beginn einer neuen Geste
 * @param event
 */
EDUPHIL.gesture_started = function( event )
{
    'use strict';

    //erstellt ein neues Gesten-Objekt
    EDUPHIL.current_gesture = {};
    // setzt die Startwerte
    EDUPHIL.current_gesture.start_x = event.originalEvent.changedTouches[0].pageX;
    EDUPHIL.current_gesture.start_y = event.originalEvent.changedTouches[0].pageY;
    EDUPHIL.current_gesture.name = '';
    EDUPHIL.current_gesture.succeeded = false;

//    if (event.originalEvent.touches.length === 1) {
//        event.originalEvent.preventDefault();
//        mouseX = event.originalEvent.touches[0].pageX;
//        mouseY = event.originalEvent.touches[0].pageY;
//        console.log(1);
//    }
};

/**
 * Fängt informationen über die Geste beim Bewegen des Fingers ein
 * @param event
 */
EDUPHIL.capture_gesture = function( event )
{
    console.log("-->>captureing gesture");
    'use strict';
    event.preventDefault();

    var MAX_TOLERANCE = 20,
        REQUIRED_DISTANCE = 50,
        x = event.originalEvent.changedTouches[0].pageX,
        y = event.originalEvent.changedTouches[0].pageY,
        delta_x, delta_y;

    delta_x = Math.abs(x - EDUPHIL.current_gesture.start_x);
    delta_y = Math.abs(y - EDUPHIL.current_gesture.start_y);

    if (!EDUPHIL.current_gesture.succeeded)
    {
        if (delta_x >= REQUIRED_DISTANCE && delta_y < MAX_TOLERANCE)
        {
            EDUPHIL.current_gesture.name = 'play_slower';
            EDUPHIL.current_gesture.succeeded = true;
        }
        else if (delta_y >= REQUIRED_DISTANCE && delta_x < MAX_TOLERANCE)
        {
            EDUPHIL.current_gesture.name = 'start_playing';
            EDUPHIL.current_gesture.succeeded = true;
        }
    }

    if (event.originalEvent.touches.length === 1) {
        event.originalEvent.preventDefault();
        mouseX = event.originalEvent.touches[0].pageX;
        mouseY = event.originalEvent.touches[0].pageY;
    }
};

/**
 * Wird am Ende einer Geste ausgeführt, startet die Gesten-auswertung
 * @param event
 */
EDUPHIL.gesture_finished = function( event )
{
    'use strict';

    if (EDUPHIL.current_gesture.succeeded)
    {
        switch (EDUPHIL.current_gesture.name)
        {
            case 'play_slower':
                EDUPHIL.all_play_slower();
                break;
            case 'start_playing':
                EDUPHIL.all_toggle_playing();
                break;
            default:
                break;
        }
    }

    // touch ende -> canvas wieder verstecken
    $('#gestures').addClass('hidden');
    $('#app-page').removeClass('js-ani-play-blur').addClass('js-ani-play-blur-rev');

    // Alles abhängen
    $('#gestures').off('touchstart').off('touchmove').off('touchend');
};

EDUPHIL.createParticle = function()
{
    'use strict';

    particles = [];

    for (var i = 0; i < QUANTITY; i++) {
        var particle = {
            size: 40,
            position: {x: mouseX, y: mouseY},
            offset: {x: 0, y: 0},
            shift: {x: mouseX, y: mouseY},
            speed: .75,
            targetSize: 40,
            fillColor: '#' + (0xfb0).toString(16)
        };
        particles.push(particle);
    }
};

EDUPHIL.loop = function()
{
    'use strict';

    context.fillStyle = 'rgba(0,0,0,0.05)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    for (var i = 0, len = particles.length; i < len; i++) {
        var particle = particles[i];

        var lp = {x: particle.position.x, y: particle.position.y};

        // Follow mouse with some lag
        particle.shift.x += (EDUPHIL.mouseX - particle.shift.x);
        particle.shift.y += (EDUPHIL.mouseY - particle.shift.y);

        // Apply position
        particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x);
        particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y);

        context.beginPath();
        context.fillStyle = particle.fillColor;
        context.strokeStyle = particle.fillColor;
        context.lineWidth = particle.size;
        context.moveTo(lp.x, lp.y);
        context.lineTo(particle.position.x, particle.position.y);
        context.stroke();
        context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
        context.fill();
    }
};

/**
 * Init Funktion für eine Spielrunde, setzt Listener und Variablen
 */
EDUPHIL.init_game = function()
{
    'use strict';

    EDUPHIL.game_is_running = true;

    // Intro-loop sound aus!
    EDUPHIL.tuning_sound.fadeOut(0, 2000);

    // Musiker Steuerung anhängen, Info abhängen
    $('.hitbox').on('tap', EDUPHIL.musician_tap_handler).off('taphold');

    // Mood Icons Events anhängen
    $('.mood-icon').on('touchstart', EDUPHIL.icon_drag_handler).off('taphold');

    // Aktiviere den Gesten Canvas
    $('#knight5').on('tap', EDUPHIL.init_gestures);

    //canvas = document.getElementById('world');
    //context = canvas.getContext('2d');

    //document.addEventListener('touchstart', documentTouchStartHandler, false);
    //document.addEventListener('touchmove', documentTouchMoveHandler, false);

    //EDUPHIL.createParticle();
    //setInterval(EDUPHIL.loop, 1000 / 60);
};

/**
 * Stop Funktion für eine Spielrunde, entfernt Listener und resettet
 */
EDUPHIL.stop_game = function()
{
    'use strict';

    EDUPHIL.game_is_running = false;

    // Intro-loop sound aus!
    EDUPHIL.tuning_sound.fadeIn(0, 2000);

    // Musiker Steuerung anhängen, Info abhängen
    $('.hitbox').off('tap').on('taphold');

    // Mood Icons Events anhängen
    $('.mood-icon').off('touchstart');

    // Aktiviere den Gesten Canvas
    $('#knight5').off('tap');
};

/**
 * Code hier wird nur beim laden der ersten Page (preload) ausgeführt!
 * */
$(document).ready(function()
{
    'use strict';
});

/**
 * Code wird beim anzeigen der #app-page ausgeführt (letztes Event)
 * Muss über document geladen werden, da die referenzierten HTML Elemente
 * in einer anderen Datei stehen.
 */
$(document).on('pageshow', '#app-page', function()
{
    'use strict';

    // Musiker-Objekte
    // so etwas sollte in eine init funktion !
    EDUPHIL.geigerin = new EDUPHIL.Musician('#geigerin', 'geige');
    EDUPHIL.floetistin = new EDUPHIL.Musician('#floetistin', 'floete');
    EDUPHIL.harfenspieler = new EDUPHIL.Musician('#harfenspieler', 'harfe');

    // alle in ein Array packen zum iterieren
    EDUPHIL.orchestra = [];
    EDUPHIL.orchestra.push(EDUPHIL.geigerin);
    EDUPHIL.orchestra.push(EDUPHIL.floetistin);
    EDUPHIL.orchestra.push(EDUPHIL.harfenspieler);

    EDUPHIL.tuning_sound = new Howl(
        {
            urls: ['sound/tuning.mp3'],
            autoplay: false,
            buffer: EDUPHIL.sound_buffer,
            loop: true,
            volume: 0.1
        });

    // Podium Doppel-Tap für Spielstart
    $("#podium-right").append('<p>test</p>');
    $('#podium-right').doubleTap(function()
    {
        if (EDUPHIL.game_is_running)
        {
            EDUPHIL.stop_game();
        } else
        {
            EDUPHIL.init_game();
        }
    });

    // Infosystem an Musiker anhängen
    $('#geigerin').on('taphold', EDUPHIL.musician_taphold_handler);
    // Infosystem an Stimmung anhängen
    $('#mood-one').on('taphold', EDUPHIL.mood_taphold_handler);

    // Intro abspielen
    EDUPHIL.app_intro();
});