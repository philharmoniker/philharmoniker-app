$(document).bind('mobileinit', function()
{
       // JQM starteinstellungen
});

$(document).ready(function ()
{
    var cache = window.applicationCache;
    // ist application cache API verfügbar?
    if (cache != undefined)
    {
        // TODO: anzahl der dateien aus manifest datei extrahieren
        var num_files_total = 25;
        var num_files_cached = 0;
        var $progress_bar = document.createElement('progress');
        $progress_bar.value = num_files_cached;
        $progress_bar.max = num_files_total;
        $progress_bar.id = 'eduphil-preloadbar';

        function add_app_link()
        {
            var $start_app_link = document.createElement('a');
            $start_app_link.href = "app.html";
            $start_app_link.textContent = "App Starten";
            $start_app_link.id = "startbutton";

            $('#content').append($start_app_link);
            $('#startbutton').buttonMarkup({ theme: "a" }); // aus link einen button machen
        }

        // Überprüfe auf neue Version im Netz
        cache.addEventListener('checking', function()
        {
            $('#content').empty();
            var html = '<h2>Überprüfe Version... (Checking)</h2>';
            $('#content').append(html);
        });

        // Version ist aktuell
        cache.addEventListener('noupdate', function()
        {
            $('#content').empty();
            var html = '<h2>Sie verwenden die neueste Version. (noupdate)</h2>';
            $('#content').append(html);
            add_app_link();
        });

        // Download startet
        cache.addEventListener('downloading', function()
        {
            $('#content').empty();
            var html = '<h2>Herunterladen... (downloading)</h2>';
            $('#content').append(html);
            $('#content').append($progress_bar);
        });

        // listener für progress bar, 1x fire -> +1, dann den balken updaten
        cache.addEventListener('progress', function()
        {
            num_files_cached++;
            $progress_bar.value = num_files_cached;
        });

        // update wurde heruntergeladen, installieren?
        cache.addEventListener('updateready', function()
        {
            $.mobile.changePage("#eduphil-dialog-update", {transition: "slidedown"});
        });

        // Update abgeschlossen
        cache.addEventListener('cached', function()
        {
            $('#content').empty();
            var html = '<h2>Sie verwenden die neueste Version. (cached)</h2>';
            $('#content').append(html);
            add_app_link();
        });

        // Fehler!
        cache.addEventListener('error', function()
        {
            $.mobile.changePage("#eduphil-dialog-error", {transition: "slidedown"}); //dialog schliessen
        });

        // Callbacks für die Dialoge
        $("#eduphil-dialog-button-yes").bind("click", function (event)
        {
            $.mobile.changePage("#eduphil-preload", {transition: "pop"}); //dialog schliessen
            cache.update(); // neuen cache verwenden
        });

        $('#eduphil-dialog-button-no').bind("click", function(event)
        {
            $.mobile.changePage("#eduphil-preload", {transition: "pop"}); //dialog schliessen
            $('#content').empty();
            var html = '<li data-role="list-divider">Starte App</li>';
            $('#content').append(html);
            add_app_link();
        });
    }
    else
    {
        $('#content').html('<p>Fehler: App Installation scheint deaktiviert zu sein (Application cache error).</p>');
    }
});