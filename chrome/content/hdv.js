/**
 * @see https://developers.google.com/youtube/js_api_reference
 */
function onYouTubePlayerReady(player){
    // The player argument may be the player object or player ID.
    if (player && typeof player === "string") player = document.getElementById(player);
    if (!player) return;

    var YT_PLAYERSTATE_UNSTARTED = -1;
    var pixelsToQuality = {
        // Used in portrait mode.
        "width": [
            // Following values are computed from height array below in 16:10 ratio,
            // which will work perfectly for 16:10 and 16:9, but could result in
            // smaller than optimum quality for 4:3 screens. This trade off prevents
            // selecting higher than optimum quality on 16:10 and 16:9 screens.
            [384, "small"],
            [576, "medium"],
            [768, "large"],
            [1152, "hd720"],
            [1728, "hd1080"],
            [Number.POSITIVE_INFINITY, "highres"]
        ],
        // Used in landscape mode.
        "height": [
            [240, "small"],
            [360, "medium"],
            [480, "large"],
            [720, "hd720"],
            [1080, "hd1080"],
            [Number.POSITIVE_INFINITY, "highres"]
        ]
    };

    /**
     * Returns optimum quality, which is the smallest video resolution that overflows
     * the screen resolution at least on one axis (the shorter axis here). This will
     * result in downscaling even in fullscreen mode and thus highest quality on given
     * screen.
     * Note: screen.height and screen.width properties return incorrect values for
     * zoomed and unzoomed pages.
     */
    var getOptimumQuality = function() {
        // Detect portrait/landscape mode.
        var axis = screen.height <= screen.width ? "height" : "width";
        for (var i = 0; i < pixelsToQuality[axis].length; i++) {
            if (screen[axis] <= pixelsToQuality[axis][i][0])
                return pixelsToQuality[axis][i][1];
        }
    };

    var setHighestQuality = function(player) {
        // We need to be little bit stubborn about setting playback quality, because:
        // a) half the time between onYouTubePlayerReady call and actual playback
        // the quality can't be changed. And there is no event that would guarantee
        // it to be ready before playback starts. Setting quality during playback
        // won't prevent player to buffer low quality video at the beginning.
        // b) video ads block the settings too.
        // c) changing video may result in video ad (see b).
        var intervalId = window.setInterval(function() {
            try {
                var quality = getOptimumQuality();
                player.setPlaybackQuality(quality);
                if (player.getPlaybackQuality() === quality) {
                    window.clearInterval(intervalId);
                }
            } catch(e) {
                // Make sure interval isn't lingering after player is destroyed.
                window.clearInterval(intervalId);
            }
        }, 100);
    };

    setHighestQuality(player);
    player.addEventListener("onStateChange", function(event) {
        if (event === YT_PLAYERSTATE_UNSTARTED) {
            // Player has changed the video (without page reload).
            setHighestQuality(player);
        }
    });
}
