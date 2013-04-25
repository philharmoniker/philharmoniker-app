$(document).bind('mobileinit', function()
{
    // JQuery Mobile defaults etc. hier
});

$(document).ready(function ()
{
    var cache = window.applicationCache;
    // ist application cache API verfügbar?
    if (cache != undefined)
    {
        // TODO: anzahl der dateien in manifest datei extrahieren
        var num_files_total = 22;
        var num_files_cached = 0;
        var $progress_bar = document.createElement('progress');
        $progress_bar.value = num_files_cached;
        $progress_bar.max = num_files_total;
        $progress_bar.id = 'eduphil-preloadbar';

        // Überprüfe auf neue Version im Netz
        cache.addEventListener('checking', function()
        {
            $('#status').html('<h2>Überprüfe auf neue Version...</h2>');
        });

        // Version ist aktuell
        cache.addEventListener('noupdate', function()
        {
            $('#status').html('<h2>Sie verwenden die neueste Version.</h2>');
            var $start_app_link = document.createElement('a');
            $start_app_link.href = "app.html";
            $start_app_link.textContent = "App starten";
            $('#status').append($start_app_link);
        });

        // Download startet
        cache.addEventListener('downloading', function()
        {
            $('#status').html('<h2>Neueste Version wird heruntergeladen...</h2>')
            $('#status').append($progress_bar);
        });

        // listener für progress bar, 1x fire -> +1, dann den balken updaten
        cache.addEventListener('progress', function()
        {
            num_files_cached++;
            $('#eduphil-preloadbar').attr('value', num_files_cached);
        });

        // update wurde heruntergeladen, installieren?
        cache.addEventListener('updateready', function()
        {
            $.mobile.changePage("#eduphil-dialog-update", { role: "dialog" });
        });

        // Update abgeschlossen
        cache.addEventListener('cached', function()
        {
            $('#status').append('Fertig!');
        });

        // Fehler!
        cache.addEventListener('error', function()
        {
            $('#status').html('<p>Fehler!</p>');
        });

        /* callbacks für die dialoge */

        $('#eduphil-dialog-button-yes').onClick = function()
        {
            $("#eduphil-dialog-update").dialog("close"); //dialog schliessen
            cache.update(); // neuen cache verwenden
        };

        $('#eduphil-dialog-button-no').onClick = function()
        {
            $("#eduphil-dialog-update").dialog("close");  //dialog schliessen
            var $start_app_link = document.createElement('a');
            $start_app_link.href = "app.html";
            $start_app_link.textContent = "App starten";
            $start_app_link.id = 'startbutton';
            $('#startbutton').attr('data-role','button');
            $('#status').append($start_app_link);
        };
    }
    else
    {
        $('#status').html('<p>Fehler: App Installation scheint deaktiviert zu sein (Application cache error).</p>');
    }
});