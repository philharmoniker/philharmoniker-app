$(document).ready(function()
{
    // ist application cache API verfügbar?
    if (window.applicationCache != undefined)
    {
        // Überprüfe auf neue Version im netz
        applicationCache.addEventListener('checking', function()
        {
            $('#status').html('<img src="../css/images/ajax-loader.gif"></img>');
        });

        // update vorhanden
        applicationCache.addEventListener('updateready', function()
        {
            if (confirm("Eine neue Version ist verfügbar. Möchten Sie diese installieren?"))
            {
                history.reload();
            }
        });

        // Download läuft
        applicationCache.addEventListener('downloading', function()
        {
            $('#status').html('<progress id="progress" value="0" max="100"></progress>');
        });

        // Variable für progress bar
        var progress = 0;

        // listener für progress bar, 1x fire -> +1, dann den balken updaten
        applicationCache.addEventListener('progress', function()
        {
            progress++;
            $('#progress').attr('value',progress);
        });



    }
});