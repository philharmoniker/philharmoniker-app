/**
 * @fileoverview Tutorial und Gamemode-Funktionen.
 */

define('app', ['jquery', 'config','intro', 'orchestra', 'gui', 'gestures'],
function($, config, intro, orch, gui, gest) {
  'use strict';

  return {
    /**
     * Init Funktion für eine Spielrunde, setzt Listener und Variablen
     */
    init_game: function() {
      config.game_is_running = true;

      // Intro-loop sound aus!
      intro.tuningSound.fadeOut(0, 2000);

      // Musiker Steuerung anhängen, Info abhängen
      $('.hitbox').off('taphold').on('tap', orch.musician_tap_handler);

      // Mood Icons Events anhängen
      $('.mood-icon').on('touchstart', gui.icon_drag_handler);

      // Aktiviere den Gesten Canvas
      $('#fagott').on('tap', gest.gestures_init);

      // Markierungen entfernen
      $('#marker').remove();
    },

    /**
     * Stop Funktion für eine Spielrunde, entfernt Listener und resettet
     */
    stop_game: function() {
      config.game_is_running = false;

      // Intro-loop sound aus!
      intro.tuningSound.fadeIn(0, 2000);

      // Musiker Steuerung anhängen, Info abhängen
      $('.hitbox').off('tap').on('taphold', orch.musician_taphold_handler);

      // Mood Icons Events anhängen
      $('.mood-icon').off('touchstart');

      // Aktiviere den Gesten Canvas
      $('#fagott').off('tap');
    }
  };
});
