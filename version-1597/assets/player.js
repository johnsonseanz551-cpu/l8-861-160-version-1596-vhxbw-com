function initPlayer(mediaUrl) {
    var video = document.getElementById("movie-player");
    var overlay = document.getElementById("play-overlay");
    var hls = null;
    var ready = false;

    if (!video || !mediaUrl) {
        return;
    }

    function attachMedia() {
        if (ready) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = mediaUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(mediaUrl);
            hls.attachMedia(video);
        } else {
            video.src = mediaUrl;
        }

        ready = true;
    }

    function start() {
        attachMedia();

        if (overlay) {
            overlay.classList.add("is-hidden");
        }

        video.controls = true;
        var playTask = video.play();

        if (playTask && typeof playTask.catch === "function") {
            playTask.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
        if (!ready || video.paused) {
            start();
        }
    });

    window.addEventListener("beforeunload", function () {
        if (hls) {
            hls.destroy();
        }
    });
}
