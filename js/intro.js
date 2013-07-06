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

define(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ['config', 'gui', 'Howler', 'jquery'],
function(config, gui, howler, $) {
  'use strict';

  return {
    /**
     * Anfangssound-Objekt
     */
    tuningSound: new howler.Howl({
      urls: ['sound/tuning.mp3'],
      autoplay: false,
      buffer: config.soundBuffer,
      loop: true,
      volume: 0.1
    }),
    /**
     * Verzögerungszeit
     * {number}
     */
    delay: 5000,

    /**
     * Intro-Animation des Apps (Dirigenten-Silhouette fade) + Sound abspielen
     */
    playIntro: function() {
      this.tuningSound.play();

      /**
       * nach kurzer Zeit:
       * Silhouette ausblenden
       * skalieren
       * Hintergrund einblenden
       */
      window.setTimeout(function() {
        // Animations-CSS anhängen, nach kurzer Zeit fade+Node löschen
        $('#silhouette').addClass('js-ani-pullout').fadeOut(2000,
          function() { $('#silhouette').remove(); });
      }, this.delay);

      // Blur-Effekt des Hintergrundes entfernen
      window.setTimeout(function() {
        $('#app-page').removeClass('js-blur').addClass('js-ani-play-blur-rev');
      }, this.delay);
    }
  };
});



