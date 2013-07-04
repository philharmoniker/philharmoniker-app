/*==============================================================================
 Author:         Georgios Panayiotou
 Created:        2013-06-10
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
 * @fileOverview RequireJS Konfiguration und Startmodul (=mainfunction)
 * TODO: Es wurde kein JQuery-shim verwendet.
 */

require.config({
  baseUrl: 'js',
  paths: {
    jquery: 'libs/jquery-1.10.2',
    jqm: 'libs/jquery.mobile-1.3.1',
    spritely: 'libs/jquery.spritely',
    Howler: 'libs/howler',
    config: 'config',
    gestures: 'gestures',
    helper: 'helper',
    intro: 'intro',
    musician: 'musician',
    oc: 'orchestra_control',
    plugins: 'plugins',
    app: 'app',
    info: 'info',
    gui: 'gui'
  },
  shim: {
    plugins: ['jquery'],
    jqm: ['jquery'],
    musician: ['Howler'],
    intro: ['Howler']
  }
});

require(['intro', 'jquery', 'jqm', 'plugins',
    'config', 'orchestra', 'gui', 'app', 'info'],
function(intro, $, jqm, plugins, config, orchestra, gui, app, info) {
  'use strict';

  /**
   * Code wird beim anzeigen der #app-page ausgeführt
   * (letztes Event in der chain)
   */
  $(document).on('pageshow', '#app-page', function() {
    /**
     * Im Portrait Format Fehler anzeigen
     *
     * 0 = Portrait orientation. This is the default value
     * -90 = Landscape orientation with the screen turned clockwise
     * 90 = Landscape orientation with the screen turned counterclockwise
     * 180 = Portrait orientation with the screen turned upside down
     */
      //    $(document).on('orientationchange', function()
      //    {
      //        switch(window.orientation)
      //        {
      //            case 0:
      //                $('orientation-message').removeClass('hidden');
      //                break;
      //            case 180:
      //                $('orientation-message').removeClass('hidden');
      //                break;
      //            case -90:
      //                $('orientation-message').addClass('hidden');
      //                break;
      //            case 90:
      //                $('orientation-message').addClass('hidden');
      //                break;
      //            default:
      //                break;
      //        }
      //    });

    // Podium Doppel-Tap für Spielstart
    $('#podium-right').doubleTap(function()
    {
      if (config.gameIsRunning)
      {
        app.stop_game();
      } else
      {
        app.init_game();
      }
    });

    // Infosystem an Musiker anhängen
    $('.hitbox').on('taphold', info.musician_taphold_handler);
    // Infosystem an Stimmung anhängen
    //$('#mood-one').on('taphold', info.mood_taphold_handler);

    //nachrichten-box handler anhängen
    $('#message-box').on('tap', gui.messagebox_tap_handler);

    /**
     *  Pult-Menü Größe anpassen (geht nicht in CSS wg. position: absolute)
     */
    $('#full-podium').on({
      popupbeforeposition: function() {
        var h = $(window).height();
        $('#full-podium').css('height', h );
      }
    });

    $(window).on('resize', function()
    {
      config.windowWidth = $(window).width();
    });

    intro.playIntro();
  });
});
