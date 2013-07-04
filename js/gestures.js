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
 * Namespace
 * @type {*|{}}
 */
var EDUPHIL = EDUPHIL || {};

//erstellt ein neues Gesten-Objekt
EDUPHIL.current_gesture = {
  name:'',
  start_x:0,
  start_y:0,
  color:'rgb(255,215,0)'
};

EDUPHIL.ongoingTouches = {};

/**
 * Aktiviert das Gesten-Canvas für Gesteningabe
 * @param event
 */
EDUPHIL.gestures_init = function(){
  'use strict';
  $('<canvas id="gestures" class="hidden" width="1000" height="750"></canvas>').appendTo('#app-content');
  $('#gestures').removeClass('hidden'); // canvas anzeigen
  console.log("canvas -> gestures shown !");
  console.log("doc",document);



  EDUPHIL.canvas = document.getElementById('gestures');
  EDUPHIL.ctx = EDUPHIL.canvas.getContext('2d');
  // Touch events
  /*
   * why 3 times ? i don't get it ?!
   *
   $('#gestures').on('touchstart', EDUPHIL.gesture_started).on('touchmove', EDUPHIL.capture_gesture).on('touchend', EDUPHIL.gesture_finished);
   $('#gestures').on('touchstart', EDUPHIL.gesture_started).on('touchmove', EDUPHIL.capture_gesture).on('touchend', EDUPHIL.gesture_finished);
   $('#gestures').on('touchstart', EDUPHIL.gesture_started).on('touchmove', EDUPHIL.capture_gesture).on('touchend', EDUPHIL.gesture_finished);
   */

  $('#gestures').on('touchstart', EDUPHIL.gesture_started);
  $('#gestures').on('touchmove', EDUPHIL.gesture_capture);
  $('#gestures').on('touchend', EDUPHIL.gesture_finished);
};

/**
 * Beginn einer neuen Geste
 * @param event
 */
EDUPHIL.gesture_started = function(event){
  'use strict';
  event.preventDefault();
  console.log("-> gestures_started");


  // setzt die Startwerte
  EDUPHIL.current_gesture.start_x = event.originalEvent.changedTouches[0].pageX;
  EDUPHIL.current_gesture.start_y = event.originalEvent.changedTouches[0].pageY;
  EDUPHIL.current_gesture.name = '';
  EDUPHIL.current_gesture.succeeded = false;
  console.log("current_gesture",EDUPHIL.current_gesture);

  var touches = event.originalEvent.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var x = touch.pageX;
    var y = touch.pageY;
    EDUPHIL.ongoingTouches[touch.identifier] = {x: x, y: y};
    EDUPHIL.ctx.fillStyle = EDUPHIL.current_gesture.color;
    EDUPHIL.ctx.fillRect(x, y, 10, 10);
  }

  /*
   * Trail Fader Code
   *
   if (event.originalEvent.touches.length === 1) {
   event.originalEvent.preventDefault();
   EDUPHIL.mouseX = event.originalEvent.touches[0].pageX;
   EDUPHIL.mouseY = event.originalEvent.touches[0].pageY;
   console.log("_mouseX:",EDUPHIL.mouseX);
   console.log("_mouseY:",EDUPHIL.mouseY);
   }*/
};

/**
 * Fängt informationen über die Geste beim Bewegen des Fingers ein
 * @param event
 */
EDUPHIL.gesture_capture = function(event){
  'use strict';
  event.preventDefault();
  console.log("-> capture_gesture");

  var touches = event.originalEvent.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var previousTouch = EDUPHIL.ongoingTouches[touch.identifier];
    EDUPHIL.ctx.strokeStyle = EDUPHIL.current_gesture.color;
    EDUPHIL.ctx.lineWidth = 20;
    EDUPHIL.ctx.beginPath();
    EDUPHIL.ctx.moveTo(previousTouch.x, previousTouch.y);
    EDUPHIL.ctx.lineTo(touch.pageX, touch.pageY);
    EDUPHIL.ctx.stroke();
    EDUPHIL.ongoingTouches[touch.identifier].x = touch.pageX;
    EDUPHIL.ongoingTouches[touch.identifier].y = touch.pageY;
  }


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

  /*
   * Trail Faider Code
   *
   if (event.originalEvent.touches.length === 1) {
   event.originalEvent.preventDefault();
   EDUPHIL.mouseX = event.originalEvent.touches[0].pageX;
   EDUPHIL.mouseY = event.originalEvent.touches[0].pageY;
   }*/
};

/**
 * Wird am Ende einer Geste ausgeführt, startet die Gesten-auswertung
 * @param event
 */
EDUPHIL.gesture_finished = function(event){
  'use strict';
  event.preventDefault();
  console.log("-> gesture_finished");

  var touches = event.originalEvent.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    delete EDUPHIL.ongoingTouches[touch.identifier];
  }

  if (EDUPHIL.current_gesture.succeeded){
    switch (EDUPHIL.current_gesture.name){
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
  $('#gestures').remove();
  // Alles abhängen
  $('#gestures').off('touchstart').off('touchmove').off('touchend');
};
