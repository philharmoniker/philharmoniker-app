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

define(['jquery', 'orchestra'], function($, orch) {
  'use strict';

  return {
    //erstellt ein neues Gesten-Objekt
    current_gesture: {
      name: '',
      start_x: 0,
      start_y: 0,
      color: 'rgb(255,215,0)'
    },

    ongoingTouches: {},
    canvas: {},
    ctx: {},
    /**
     * Aktiviert das Gesten-Canvas für Gesteningabe
     * @param event
     */
    gestures_init: function() {
      $('<canvas id="gestures" class="hidden" width="1000" height="750"></canvas>').
        appendTo('#app-content');
      $('#gestures').removeClass('hidden'); // canvas anzeigen
      console.log('canvas -> gestures shown !');
      console.log('doc', document);

      this.canvas = document.getElementById('gestures');
      this.ctx = this.canvas.getContext('2d');

      $('#gestures').on('touchstart', this.gesture_started).
        on('touchmove', this.gesture_capture).
        on('touchend', this.gesture_finished);
    },

    /**
     * Beginn einer neuen Geste
     * @param event
     */
    gesture_started: function(event) {
      event.preventDefault();
      console.log('-> gestures_started');

      // setzt die Startwerte
      this.current_gesture.start_x = event.originalEvent.changedTouches[0].pageX;
      this.current_gesture.start_y = event.originalEvent.changedTouches[0].pageY;
      this.current_gesture.name = '';
      this.current_gesture.succeeded = false;
      console.log('current_gesture', this.current_gesture);

      var touches = event.originalEvent.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var x = touch.pageX;
        var y = touch.pageY;
        this.ongoingTouches[touch.identifier] = {x: x, y: y};
        this.ctx.fillStyle = this.current_gesture.color;
        this.ctx.fillRect(x, y, 10, 10);
      }
    },

    /**
     * Fängt informationen über die Geste beim Bewegen des Fingers ein
     * @param event
     */
    gesture_capture: function(event) {
      event.preventDefault();
      console.log('-> capture_gesture');

      var touches = event.originalEvent.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var previousTouch = this.ongoingTouches[touch.identifier];
        this.ctx.strokeStyle = this.current_gesture.color;
        this.ctx.lineWidth = 20;
        this.ctx.beginPath();
        this.ctx.moveTo(previousTouch.x, previousTouch.y);
        this.ctx.lineTo(touch.pageX, touch.pageY);
        this.ctx.stroke();
        this.ongoingTouches[touch.identifier].x = touch.pageX;
        this.ongoingTouches[touch.identifier].y = touch.pageY;
      }


      var MAX_TOLERANCE = 20,
          REQUIRED_DISTANCE = 50,
          x = event.originalEvent.changedTouches[0].pageX,
          y = event.originalEvent.changedTouches[0].pageY,
          delta_x, delta_y;

      delta_x = Math.abs(x - this.current_gesture.start_x);
      delta_y = Math.abs(y - this.current_gesture.start_y);

      if (!this.current_gesture.succeeded)
      {
        if (delta_x >= REQUIRED_DISTANCE && delta_y < MAX_TOLERANCE)
        {
          this.current_gesture.name = 'play_slower';
          this.current_gesture.succeeded = true;
        }
        else if (delta_y >= REQUIRED_DISTANCE && delta_x < MAX_TOLERANCE)
        {
          this.current_gesture.name = 'start_playing';
          this.current_gesture.succeeded = true;
        }
      }
    },

    /**
     * Wird am Ende einer Geste ausgeführt, startet die Gesten-auswertung
     * @param event
     */
    gesture_finished: function(event) {
      event.preventDefault();
      console.log('-> gesture_finished');

      var touches = event.originalEvent.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        delete this.ongoingTouches[touch.identifier];
      }

      if (this.current_gesture.succeeded) {
        switch (this.current_gesture.name) {
          case 'play_slower':
            orch.all_play_slower();
            break;
          case 'start_playing':
            orch.all_toggle_playing();
            break;
          default:
            break;
        }
      }

      // touch ende -> canvas wieder verstecken
      $('#gestures').addClass('hidden');
      $('#gestures').remove();
      // Alles abhängen
      $('#gestures').off('touchstart').off('touchmove').off('touchend');
    }
  };
});
