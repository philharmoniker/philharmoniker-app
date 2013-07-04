(function(document) {
  'use strict';

  window.MBP = window.MBP || {};

  /**
   * Fix for iPhone viewport scale bug
   * http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
   */
  MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
  MBP.ua = navigator.userAgent;

  MBP.scaleFix = function() {
      if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
          MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
          document.addEventListener('gesturestart', MBP.gestureStart, false);
      }
  };

  MBP.gestureStart = function() {
      MBP.viewportmeta.content =
        'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
  };

  // This bug only affects touch Android 2.3 devices, but a simple ontouchstart test creates a false positive on
  // some Blackberry devices. https://github.com/Modernizr/Modernizr/issues/372
  // The browser sniffing is to avoid the Blackberry case. Bah
  MBP.dodgyAndroid = ('ontouchstart' in window) && (navigator.userAgent.indexOf('Android 2.3') != -1);

  MBP.listenForGhostClicks = (function() {
      var alreadyRan = false;

      return function() {
          if(alreadyRan) {
              return;
          }

          if (document.addEventListener) {
              document.addEventListener('click', MBP.ghostClickHandler, true);
          }
          addEvt(document.documentElement, 'touchstart', function() {
              MBP.hadTouchEvent = true;
          }, false);

          alreadyRan = true;
      };
  })();

  MBP.coords = [];

  // fn arg can be an object or a function, thanks to handleEvent
  // read more about the explanation at: http://www.thecssninja.com/javascript/handleevent
  function addEvt(el, evt, fn, bubble) {
      if ('addEventListener' in el) {
          // BBOS6 doesn't support handleEvent, catch and polyfill
          try {
              el.addEventListener(evt, fn, bubble);
          } catch(e) {
              if (typeof fn == 'object' && fn.handleEvent) {
                  el.addEventListener(evt, function(e){
                      // Bind fn as this and set first arg as event object
                      fn.handleEvent.call(fn,e);
                  }, bubble);
              } else {
                  throw e;
              }
          }
      } else if ('attachEvent' in el) {
          // check if the callback is an object and contains handleEvent
          if (typeof fn == 'object' && fn.handleEvent) {
              el.attachEvent('on' + evt, function(){
                  // Bind fn as this
                  fn.handleEvent.call(fn);
              });
          } else {
              el.attachEvent('on' + evt, fn);
          }
      }
  }

  function rmEvt(el, evt, fn, bubble) {
      if ('removeEventListener' in el) {
          // BBOS6 doesn't support handleEvent, catch and polyfill
          try {
              el.removeEventListener(evt, fn, bubble);
          } catch(e) {
              if (typeof fn == 'object' && fn.handleEvent) {
                  el.removeEventListener(evt, function(e){
                      // Bind fn as this and set first arg as event object
                      fn.handleEvent.call(fn,e);
                  }, bubble);
              } else {
                  throw e;
              }
          }
      } else if ('detachEvent' in el) {
          // check if the callback is an object and contains handleEvent
          if (typeof fn == 'object' && fn.handleEvent) {
              el.detachEvent("on" + evt, function() {
                  // Bind fn as this
                  fn.handleEvent.call(fn);
              });
          } else {
              el.detachEvent('on' + evt, fn);
          }
      }
  }

  /**
   * Enable CSS active pseudo styles in Mobile Safari
   * http://alxgbsn.co.uk/2011/10/17/enable-css-active-pseudo-styles-in-mobile-safari/
   */

  MBP.enableActive = function() {
      document.addEventListener('touchstart', function() {}, false);
  };

  /**
   * Prevent default scrolling on document window
   */

  MBP.preventScrolling = function() {
      document.addEventListener('touchmove', function(e) {
          if (e.target.type === 'range') { return; }
          e.preventDefault();
      }, false);
  };

  /**
   * Prevent iOS from zooming onfocus
   * https://github.com/h5bp/mobile-boilerplate/pull/108
   * Adapted from original jQuery code here: http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
   */

  MBP.preventZoom = function() {
      var formFields = document.querySelectorAll('input, select, textarea');
      var contentString = 'width=device-width,initial-scale=1,maximum-scale=';
      var i = 0;
      var fieldLength = formFields.length;

      var setViewportOnFocus = function() {
          MBP.viewportmeta.content = contentString + '1';
      };

      var setViewportOnBlur = function() {
          MBP.viewportmeta.content = contentString + '10';
      };

      for (; i < fieldLength; i++) {
          formFields[i].onfocus = setViewportOnFocus;
          formFields[i].onblur = setViewportOnBlur;
      }
  };

  /**
   * iOS Startup Image helper
   */

  MBP.startupImage = function() {
      var portrait;
      var landscape;
      var pixelRatio;
      var head;
      var link1;
      var link2;

      pixelRatio = window.devicePixelRatio;
      head = document.getElementsByTagName('head')[0];

      if (navigator.platform === 'iPad') {
          portrait = pixelRatio === 2 ? 'img/startup/startup-tablet-portrait-retina.png' : 'img/startup/startup-tablet-portrait.png';
          landscape = pixelRatio === 2 ? 'img/startup/startup-tablet-landscape-retina.png' : 'img/startup/startup-tablet-landscape.png';

          link1 = document.createElement('link');
          link1.setAttribute('rel', 'apple-touch-startup-image');
          link1.setAttribute('media', 'screen and (orientation: portrait)');
          link1.setAttribute('href', portrait);
          head.appendChild(link1);

          link2 = document.createElement('link');
          link2.setAttribute('rel', 'apple-touch-startup-image');
          link2.setAttribute('media', 'screen and (orientation: landscape)');
          link2.setAttribute('href', landscape);
          head.appendChild(link2);
      } else {
          portrait = pixelRatio === 2 ? "img/startup/startup-retina.png" : "img/startup/startup.png";
          portrait = screen.height === 568 ? "img/startup/startup-retina-4in.png" : portrait;
          link1 = document.createElement('link');
          link1.setAttribute('rel', 'apple-touch-startup-image');
          link1.setAttribute('href', portrait);
          head.appendChild(link1);
      }

      //hack to fix letterboxed full screen web apps on 4" iPhone / iPod
      if ((navigator.platform === 'iPhone' || 'iPod') && (screen.height === 568)) {
          if (MBP.viewportmeta) {
              MBP.viewportmeta.content = MBP.viewportmeta.content
                  .replace(/\bwidth\s*=\s*320\b/, 'width=320.1')
                  .replace(/\bwidth\s*=\s*device-width\b/, '');
          }
      }
  };

})(document);
