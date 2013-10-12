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
 * @fileoverview Info-Modus-Modul, lädt/tauscht Info Texte/Container
 */

define(['config', 'app', 'gui', 'jquery', 'jquerymobile'], function(config, app, gui, $, jqm) {
  'use strict';

  return {
    /**
     * Taphold-Handler für Musiker
     * @param event
     */
    musician_taphold_handler: function(event) {
      // info text anpassen
      switch ( $(this).parent().attr('id') ) {
        case 'geigerin':
          $('#full-podium').popup('open', {transition: 'fade', positionTo: 'window'});
          break;
        default:
          break;
      }
    },

    /**
     * Taphold-Handler für Musiker
     * @param event
     */
    mood_taphold_handler: function(event) {
      // info text anpassen
      switch ( $(this).attr('id') )
      {
        case 'mood-one':
          break;
        default:
          break;
      }
    },

    /**
     * Initialisiert die Info-Phase des Apps
     * Optionale Verzögerungszeit (ms)
     */
    initInfo: function() {
      var delay = 0;

      if (arguments[0]!==null && typeof arguments[0]==='number') {
        delay = arguments[0];
      }

      var parent = this;

      window.setTimeout(function() {
        // Podium Doppel-Tap für Spielstart
        $('#podium-right').doubleTap(function() {
          if (config.gameIsRunning) { app.stop_game(); }
          else { app.init_game(); }
        });

        // Infosystem an Musiker anhängen
        $('.hitbox').on('taphold', parent.musician_taphold_handler);

        //nachrichten-box handler anhängen
        $('#message-box').on('tap', gui.messagebox_tap_handler);

        // Gelbe Markierungen anhängen
        gui.showMarker( $('#geigerin') );
      }, delay);
    }
  };
});
