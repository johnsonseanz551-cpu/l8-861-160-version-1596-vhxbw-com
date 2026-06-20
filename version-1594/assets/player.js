import { H as Hls } from './hls-vendor.js';

var players = document.querySelectorAll('[data-player]');

players.forEach(function (player) {
  var video = player.querySelector('video');
  var button = player.querySelector('[data-play-button]');
  var message = player.querySelector('[data-player-message]');
  var hls = null;
  var prepared = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text || '';
    }
  }

  function prepare(stream) {
    if (prepared || !video || !stream) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          setMessage('播放连接正在重试');
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        }
      });
      return;
    }

    video.src = stream;
  }

  function start() {
    if (!button || !video) {
      return;
    }

    var stream = button.getAttribute('data-stream');
    prepare(stream);
    button.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    video.play().catch(function () {
      setMessage('点击视频区域继续播放');
    });
  }

  if (button) {
    button.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!prepared) {
        start();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
