(function () {
  function attach(box) {
    var video = box.querySelector("video");
    var button = box.querySelector(".play-overlay");
    if (!video || !button) {
      return;
    }

    function prepare() {
      var url = video.getAttribute("data-play-url");
      if (!url || video.getAttribute("data-ready") === "true") {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          maxBufferLength: 60,
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        video._hls = hls;
      } else {
        video.src = url;
      }

      video.setAttribute("data-ready", "true");
    }

    function play() {
      prepare();
      button.hidden = true;
      video.controls = true;
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          button.hidden = false;
        });
      }
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.getAttribute("data-ready") !== "true") {
        play();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-player]").forEach(attach);
  });
})();
