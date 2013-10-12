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

define(['Howler', 'config'], function(howler, config) {
  'use strict';

  return {
    /**
   * Die Musician Klasse repräsentiert einen Musiker im App.
   * @param {string} element_id CSS id des Musiker-DIVs (mit '#')
   * @param {string} soundfile hauptteil der verschiedenen sound-datei-namen. Es werden die drei Varianten daraus generiert
   * @constructor
   */
    Musician: function(element_id, soundfile) {
      var num_frames = 24,
          normal_speed = 12,
          high_speed = 24,
          low_speed = 6,
          is_playing = false,
          DEFAULT_VOLUME = 0.2,
          soundfile_normal = 'sound/' + soundfile + '_normal.mp3',
          soundfile_slow = 'sound/' + soundfile + '_langsam.mp3',
          soundfile_fast = 'sound/' + soundfile + '_schnell.mp3',
          sound_normal = new howler.Howl({
              urls: [soundfile_normal],
              loop: true,
              buffer: config.soundBuffer,
              volume: DEFAULT_VOLUME
          }),
          sound_slow = new howler.Howl({
              urls: [soundfile_slow],
              loop: true,
              buffer: config.soundBuffer,
              volume: DEFAULT_VOLUME
          }),
          sound_fast = new howler.Howl({
              urls: [soundfile_fast],
              loop: true,
              buffer: config.soundBuffer,
              volume: DEFAULT_VOLUME
          }),
          graphics = element_id;

      // public
      this.id = element_id;

      /**
       * Starte Sound und Animation
       * @private
       */
      function start_playing() {
        $(graphics).sprite({ fps: normal_speed, no_of_frames: num_frames });
        sound_normal.play();
        is_playing = true;
      }

      /**
       * Breche Abspielen ab und setze alles auf 0
       * @private
       */
      function stop_playing() {
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
      function pause_playing() {
        $(graphics).destroy();
        sound_slow.pause();
        sound_normal.pause();
        sound_fast.pause();
        is_playing = false;
      }

      /**
       * Toggle abspielen von animation/sound
       */
      this.toggle_playing = function() {
        if (is_playing) { stop_playing(); }
        else { start_playing(); }
      };

      /**
       * Setzt die Animationsgeschwindigkeit.
       * @param {number} new_speed Die neuen FPS der Animation
       * @private
       */
      function change_anim_speed(new_speed) {
        $(graphics).fps(new_speed);
      }

      /**
       * Wechsle zu langsamer Tonspur und Animation
       */
      this.play_slower = function() {
        change_anim_speed(low_speed);

        sound_normal.stop();
        sound_fast.stop();

        sound_slow.play();
      };

      /**
       * Wechsle zu schneller Tonspur und Animation
       */
      this.play_faster = function() {
        change_anim_speed(high_speed);

        sound_normal.stop();
        sound_slow.stop();

        sound_fast.play();
      };
    }
  };
});
