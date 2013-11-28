/**
 * @see https://developers.google.com/youtube/js_api_reference
 */
function onYouTubePlayerReady(player){
    // The onYouTubePlayerReady() is called twice. During first call the 'player'
    // parameter equals to player ID string. On the second call it equals to
    // the player object. Make sure we respond to the second call only.
    if (player && typeof player === "object") {
        // We need to be little bit stubborn about playback quality setting, because:
        // a) getAvailableQualityLevels() sometimes returns empty array
        // b) YouTube website is forcing default quality between 0 - 3000 ms of
        //    playback (I didn't observe this with embedded video though)
        var intervalId = window.setInterval(function() {
            var highestQuality = player.getAvailableQualityLevels()[0] || "highres";
            if (player.getPlaybackQuality() === highestQuality) {
                window.clearInterval(intervalId);
            } else {
                player.setPlaybackQuality(highestQuality);
            }
        }, 100);
    }
}
