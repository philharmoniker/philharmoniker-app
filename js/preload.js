$(document).ready(function ()
{
    // ist application cache API verfügbar?
    if (window.applicationCache != undefined)
    {

        // Überprüfe auf neue Version im Netz
        window.applicationCache.addEventListener('checking', function()
        {
            $('#status').html('<img src="../css/images/ajax-loader.gif" />');
            alert("checking");
        });

        // Version ist aktuell
        window.applicationCache.addEventListener('noupdate', function()
        {
            $('#status').html('<p>Sie verwenden die neueste Version.</p>');
        });

        // update vorhanden
        window.applicationCache.addEventListener('updateready', function()
        {
            if (confirm("Eine neue Version ist verfügbar. Möchten Sie diese installieren?"))
            {
                history.reload();
                alert("updateready");
            }
        });

        // Download startet
        var num_files_total = 10;
        var $progress_bar = document.createElement('progress');
        $progress_bar.attr('value', '0');
        $progress_bar.attr('max', '100');
        $progress_bar.attr('id', 'progress_bar');
        window.applicationCache.addEventListener('downloading', function()
        {
            $('#status').append($progress_bar);
        });

        // Variablen für progress bar
        var progress = 0;
        // listener für progress bar, 1x fire -> +1, dann den balken updaten
        window.applicationCache.addEventListener('progress', function()
        {
            progress++;
            $('#progress').attr('value', progress);
        });

        // Update abgeschlossen
        window.applicationCache.addEventListener('cached', function()
        {
            $('#status').html('<p>Fertig!</p>');
        });

        // Fehler!
        window.applicationCache.addEventListener('error', function()
        {
            $('#status').html('<p>Fehler!</p>');
        });

    }
    else
    {
        $('#status').html('<p>Kein Cache</p>');
        alert("kein cache");
    }
});