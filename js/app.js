$(document).ready(function()
{
    $('#bird').sprite({fps: 12, no_of_frames: 3}).isDraggable();
    $('#bird').sprite({fps: 12, no_of_frames: 3}).activeOnClick().active();
    $('body').flyToTap(true);
});