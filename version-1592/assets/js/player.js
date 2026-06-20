
(function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

  shells.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.player-start');
    var stream = shell.getAttribute('data-stream');
    var prepared = false;
    var hlsInstance = null;

    function prepareVideo() {
      if (!video || !stream || prepared) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }

      prepared = true;
    }

    function startVideo() {
      prepareVideo();
      if (button) {
        button.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (button && video) {
      button.addEventListener('click', startVideo);
      shell.addEventListener('click', function (event) {
        if (event.target === video || event.target === shell) {
          startVideo();
        }
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  });
})();
