/**
 * @see https://developers.google.com/youtube/js_api_reference
 */
function onYouTubePlayerReady(player){
    var YT_PLAYERSTATE_UNSTARTED = -1;
    var setHighestQuality = function(player) {
        // We need to be little bit stubborn about setting playback quality, because:
        // a) half the time between onYouTubePlayerReady call and actual playback
        // the quality can't be changed. And there is no event that would guarantee
        // it to be ready before playback starts. Setting quality during playback
        // won't prevent player to buffer low quality video at the beginning.
        // b) video ads block the settings too.
        // c) changing video may result in video ad (see b).
        var intervalId = window.setInterval(function() {
            var highestQuality = player.getAvailableQualityLevels()[0] || "highres";
            player.setPlaybackQuality(highestQuality);
            if (player.getPlaybackQuality() === highestQuality) {
                window.clearInterval(intervalId);
            }
        }, 100);
    };

    // The onYouTubePlayerReady() is called twice. During first call the 'player'
    // parameter equals to player ID string. On the second call it equals to
    // the player object. Make sure we respond to the second call only.
    if (player && typeof player === "object") {
        setHighestQuality(player);
        player.addEventListener("onStateChange", function(event) {
            if (event === YT_PLAYERSTATE_UNSTARTED) {
                // Player has changed the video (without page reload).
                setHighestQuality(player);
            }
        });
    }
}
