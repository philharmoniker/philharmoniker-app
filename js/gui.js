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
 * @fileOverview GUI-Funktionen, Anzeige von Texten, Einbindung
 * von Eingabe-Events
 */

define(['jquery', 'jquerymobile'], function($, jqm) {
  'use strict';

  return {
    // Trail Faider Code
    QUANTITY: 1,
    //canvas;
    //context;
    //particles;
    mouseX: 0,
    mouseY: 0,

    /**
     * Tap-Handler für Nachrichten-Box
     * @param event
     */
    messagebox_tap_handler: function(event) {
      event.stopPropagation(); // event bubbling stoppen

      $('#message-box').hide();
    },

    /**
     * Setzt die markierungsgrafik an der Position (x,y)
     * @param element Element bei dem der Marker gezeigt werden soll
     */
    showMarker: function(element) {
      var marker = $('<div id="marker"></div>');
      var image = $('<img src="img/marker.png" />');
      image.appendTo(marker);

      marker.css('position', 'absolute');
      marker.css('left', '30px');
      marker.css('top', '0px');

      marker.appendTo(element);
    },

    /**
     * Was wohl...
     */
    remove_marker: function() {
      $('#marker').remove();
    }
  };
});
