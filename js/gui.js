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

define(['jquery', 'jqm'], function($, jqm) {
  'use strict';

  return {
    // Trail Faider Code
    //QUANTITY = 1;
    //canvas;
    //context;
    //particles;
    //mouseX = 0;
    //mouseY = 0;

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
     * @param x x Koordiante des Markers
     * @param y y Koordinate des Markers
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
    },

    /**
     * Trail Faider Code
     * @returns {undefined}
     */
    createParticle: function() {
      var particles = [];

      for (var i = 0; i < QUANTITY; i++) {
        var particle = {
          size: 40,
          position: {x: mouseX, y: mouseY},
          offset: {x: 0, y: 0},
          shift: {x: mouseX, y: mouseY},
          speed: 0.75,
          targetSize: 40,
          fillColor: '#' + (0xfb0).toString(16)
        };
        particles.push(particle);
      }
    },

    /**
     * Trail Faider Code
     * @returns {undefined}
     */
    loop: function() {
      context.fillStyle = 'rgba(0,0,0,0.05)';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);

      for (var i = 0, len = particles.length; i < len; i++) {
        var particle = particles[i];

        var lp = {x: particle.position.x, y: particle.position.y};

        // Follow mouse with some lag
        particle.shift.x += (mouseX - particle.shift.x);
        particle.shift.y += (mouseY - particle.shift.y);

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
    }
  }
});
