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

define(['config', 'gui', 'Howler', 'jquery'],
function(config, gui, howler, $) {
  'use strict';

  return {
    tuningSound: new howler.Howl({
      urls: ['sound/tuning.mp3'],
      autoplay: false,
      buffer: config.soundBuffer,
      loop: true,
      volume: 0.1
    }),

    /**
     * Intro-Animation des Apps (Silhouette)
     */
    playIntro: function() {
      this.tuningSound.play();

      /**
       * nach kurzer Zeit:
       * Silhouette ausblenden
       * skalieren
       * Hintergrund einblenden
       */
      window.setTimeout(function()
      {
        $('#silhouette').addClass('js-ani-pullout').fadeOut(2000,
          function() { $('#silhouette').remove(); });
      }, 4000);

      window.setTimeout(function()
      {
        $('#app-page').removeClass('js-blur').addClass('js-ani-play-blur-rev');
        gui.showMarker( $('#geigerin') );
      }, 5000);
    }
  };
});



