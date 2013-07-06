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
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

define('orchestra', ['musician', 'jquery'], function(musician, $) {
  'use strict';

  return {
    // Musiker-Objekte
    geigerin: new musician.Musician('#geigerin', 'geige'),
    floetistin: new musician.Musician('#floetistin', 'floete'),
    cellist: new musician.Musician('#cellist', 'harfe'),

    /**
     * Alle Musiker beginnen zu spielen
     */
    all_toggle_playing: function() {
      this.floetistin.toggle_playing();
      this.cellist.toggle_playing();
      this.geigerin.toggle_playing();
    },

    /**
     * Alle Musiker spielen langsamer
     */
    all_play_slower: function() {
      this.geigerin.play_slower();
      this.floetistin.play_slower();
      this.cellist.play_slower();
    },

    /**
     * Tap-Handler für Musiker-Objekte (Einsatz)
     * @param event
     */
    musician_tap_handler: function(event) {
      event.stopPropagation(); // event bubbling stoppen

      switch ($(this).parent()[0].id) // id des angeklickten divs
      {
        case 'geigerin':
          this.geigerin.toggle_playing();
          break;
        case 'floetistin':
          this.floetistin.toggle_playing();
          break;
        case 'cellist':
          this.cellist.toggle_playing();
          break;
        default:
          break;
      }
    },

    /**
     * Drag-Handler für die Stimmungs-Icons
     * @param event
     */
    icon_drag_handler: function(event) {
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
      function drag_move_handler( event ) {
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
      function drag_end_Handler( event ) {
        $(this).removeAttr('style');
        $(this).detach();
        $(this).appendTo($('#mood-container'));

        var x = event.originalEvent.changedTouches[0].pageX;
        var y = event.originalEvent.changedTouches[0].pageY;
        var element = document.elementFromPoint(x, y);
        /* TODO: closure für this->parent */
        switch (element)
        {
          case $('#geigerin').children('.hitbox').get(0):
            this.geigerin.play_faster();
            break;
          case $('#floetistin').children('.hitbox').get(0):
            this.floetistin.play_faster();
            break;
          case $('#cellist').find('.hitbox').get(0):
            this.cellist.play_faster();
            break;
          default:
            break;
        }

        $(this).off('touchmove'); // Move Handler entfernen
      }

      $(this).on('touchend', drag_end_Handler); // Drop-Handler anhängen
    }
  };
});
