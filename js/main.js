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

/*
 * requirejs tipps:
 * <ul>
 *   <li>Dateiname = Modulname, für einfacheres refactoring:
 *     anonyme Version verwenden</li>
 * </ul>
 */

require.config({
  baseUrl: 'js',
  paths: {
    // libs
    jquery: 'libs/jquery-1.10.2',
    jquerymobile: 'libs/jquery.mobile-1.3.1',
    spritely: 'libs/jquery.spritely',
    Howler: 'libs/howler',

    //boilerplate
    plugins: 'plugins',
    helper: 'helper',

    // my modules
    config: 'config',
    gestures: 'gestures',
    intro: 'intro',
    musician: 'musician',
    app: 'app',
    info: 'info',
    gui: 'gui',
    orchestra: 'orchestra'
  },
  shim: {
    jquerymobile: {
      exports: '$.mobile',
      deps: ['jquery']
    },
    plugins: ['jquery', 'helper']
  }
});

require(['intro', 'jquerymobile', 'plugins',
    'config', 'info', 'jquery'],
function(intro, jqm, plugins, config, info, $) {
  'use strict';

  // TODO: in GUI einfügen als init
  // Pult-Menü Höhe anpassen
  $('#full-podium').on({
    popupbeforeposition: function() {
      var h = $(window).height();
      $('#full-podium').css('height', h );
    }
  });

  $(window).on('resize', function() {
    config.windowWidth = $(window).width();
  });

  // Intro-Animation abspielen
  intro.playIntro();

  //Info-Phase einleiten zum Start
  info.initInfo(intro.delay+1000);
});
