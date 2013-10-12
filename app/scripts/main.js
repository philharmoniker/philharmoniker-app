/**
 * @fileOverview RequireJS Konfiguration und Startmodul (=mainfunction)
 */

/*
 * requirejs tipps:
 * <ul>
 *   <li>Dateiname = Modulname, für einfacheres refactoring:
 *     anonyme Version verwenden</li>
 * </ul>
 */

require.config({
  baseUrl: 'scripts',
  paths: {
    // vendor
    jquery: 'vendor/jquery',
    jquerymobile: 'vendor/jquery.mobile',
    spritely: 'vendor/jquery.spritely',
    Howler: 'vendor/howler',

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
