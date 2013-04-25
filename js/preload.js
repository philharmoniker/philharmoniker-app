$(document).bind('mobileinit', function()
{

});

$(document).ready(function ()
{
    var cache = window.applicationCache;
    // ist application cache API verfügbar?
    if (cache != undefined)
    {
        // TODO: anzahl der dateien aus manifest datei extrahieren
        var num_files_total = 27;
        var num_files_cached = 0;

        var $progress_bar = TolitoProgressBar('progressbar')
        .setOuterTheme('b')
        .setInnerTheme('b')
        .isMini(true)
        .setMax(num_files_total)
        .setInterval(50)
        .setStartFrom(num_files_cached)
        .showCounter(true)
        .build();

        $(document).on('complete', '#progressbar', function ()
        {
            //$('#progressbar-button').text('Starte App');
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').text('Starte App');
            $('#progressbar-button').attr('href', "app.html");
        });

        // Überprüfe auf neue Version im Netz
        cache.addEventListener('checking', function()
        {
            $('#status-message').text('Überprüfe Version...');
        });

        // Version ist aktuell
        cache.addEventListener('noupdate', function()
        {
            $('#status-message').text('Neueste Version vorhanden.');
            $progress_bar.setValue(num_files_total);
            $('#progressbar-button').parent().find('.ui-btn-inner .ui-btn-text').text('Starte App');
            $('#progressbar-button').attr('href', "app.html");
        });

        // Download startet
        cache.addEventListener('downloading', function()
        {
            $('#status-message').text('Lade App...');
            $progress_bar.run();
        });

        // listener für progress bar, 1x fire -> +1, dann den balken updaten
        cache.addEventListener('progress', function()
        {
            num_files_cached++;
            $progress_bar.setValue(num_files_cached);
        });

        // update wurde heruntergeladen, installieren?
        cache.addEventListener('updateready', function()
        {
            cache.update();
        });

        // Update abgeschlossen
        cache.addEventListener('cached', function()
        {
            $('#status-message').text('Sie verwenden die neueste Version.');
            $progress_bar.setValue(num_files_total);
        });

        // Fehler!
        cache.addEventListener('error', function()
        {
            $('#status-message').text("Fehler beim laden.");
        });
    }
    else
    {
        $('#status-message').text('Fehler: App Installation scheint deaktiviert zu sein.');
    }
});