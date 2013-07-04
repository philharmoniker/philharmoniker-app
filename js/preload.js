/*==============================================================================
 Author:         Georgios Panayiotou, Daniel Tinney
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

/* namespace */
var EDUPHIL = EDUPHIL || {};

/**
 * Anzahl aller Dateien im Appcache
 * @type {number}
 */
EDUPHIL.num_files_total = 57;

/**
 * Preloader Code
 * */
$(document).ready(function()
{
    'use strict';

    // Fix für iOS "no AJAX in app-mode"-bug
    // funzzt nicht :(
//    if (window.navigator.standalone)
//    {
//        jQuery.ajaxSetup( {isLocal: true} );
//    }

    /**
     * Anzahl Datein die bereits geladen wurden
     * @type {number}
     */
    var num_files_cached = 0;

    // Progress-Balken
    var $progress_bar = TolitoProgressBar('progressbar')
        .setOuterTheme('e')
        .setInnerTheme('e')
        .isMini(true)
        .setMax(EDUPHIL.num_files_total)
        .setStartFrom(num_files_cached)
        .showCounter(true)
        .build();

    // Ist application cache API verfügbar?
    if ( window.applicationCache !== undefined )
    {
        var cache = window.applicationCache;

        // Überprüfe auf neue Version auf dem Server:               CHECKING
        cache.addEventListener('checking', function(event)
        {
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#').text('Überprüfe...');
        });

        // Version ist aktuell:                                     NOUPDATE
        cache.addEventListener('noupdate', function ( event )
        {
            $progress_bar.setValue(EDUPHIL.num_files_total);
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#app-page').text('Starte App');
        });

        // App das erste mal gecached:                              CACHED
        cache.addEventListener('cached', function ( event )
        {
            $progress_bar.setValue(EDUPHIL.num_files_total);
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#app-page').text('Starte App');
        });

        // Download startet:                                        DOWNLOADING
        cache.addEventListener('downloading', function ( event )
        {
            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#').text('Lade App...');
        });

        // listener für progress bar, 1x fire -> +1, dann den balken updaten: PROGRESS
        cache.addEventListener('progress', function ( event )
        {
            num_files_cached++;
            $progress_bar.setValue(num_files_cached);
        });

        // update wurde heruntergeladen, verwenden?: UPDATEREADY
        // TODO: Evtl. nur ein silent update durchführen, ohne popup. Führt aber dazu, dass das App "immer komisch neu lädt"
        cache.addEventListener('updateready', function(event)
        {
            cache.swapCache(); // neuen cache benutzen
            $.mobile.changePage('update.html', { transition: 'slidedown' });
        });

        // Fehler: ERROR
        cache.addEventListener('error', function(event)
        {
//            $.mobile.changePage('error-dl.html', { transition: 'slidedown' });
//            $progress_bar.setValue(EDUPHIL.num_files_total);
//            $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#app-page').text('Starte App');
//            EDUPHIL.remind_to_bookmark();
            console.log('appcache fehler (datei gelöscht?)');
        });
    }
    else
    {
//        // Kein Appcache möglich
//        $.mobile.changePage('error-cache.html', { transition: 'slidedown' });
//        $progress_bar.setValue(EDUPHIL.num_files_total);
//        $('#progressbar-btn').parent().find('.ui-btn-inner .ui-btn-text').attr('href', '#app-page').text('Starte App');
//        EDUPHIL.remind_to_bookmark();
        console.log('appcache geht nich');
    }
});
