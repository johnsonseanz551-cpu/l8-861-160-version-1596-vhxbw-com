(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initSearchRedirect() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        if (query) {
          window.location.href = './search.html?q=' + encodeURIComponent(query);
        } else {
          window.location.href = './search.html';
        }
      });
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('is-active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(idx);
        start();
      });
    });

    start();
  }

  function initFilters() {
    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-local-search]');
      var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var empty = scope.querySelector('[data-empty-state]');
      var activeFilter = 'all';

      if (scope.hasAttribute('data-search-page')) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        if (input && initialQuery) {
          input.value = initialQuery;
        }
      }

      function apply() {
        var query = normalize(input ? input.value : '');
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-text'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region')
          ].join(' '));
          var filterOk = activeFilter === 'all' || text.indexOf(normalize(activeFilter)) !== -1;
          var queryOk = !query || text.indexOf(query) !== -1;
          var show = filterOk && queryOk;
          card.classList.toggle('is-hidden', !show);
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          buttons.forEach(function (item) {
            item.classList.remove('is-active');
          });
          button.classList.add('is-active');
          activeFilter = button.getAttribute('data-filter') || 'all';
          apply();
        });
      });
      apply();
    });
  }

  function initPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (box) {
      var video = box.querySelector('video');
      var overlay = box.querySelector('.player-overlay');
      var button = box.querySelector('.play-button');
      var url = box.getAttribute('data-src');
      var loaded = false;
      var hlsInstance = null;

      function attach() {
        if (!video || !url || loaded) {
          return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
        } else {
          video.src = url;
        }
        loaded = true;
      }

      function play() {
        attach();
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        if (video) {
          video.setAttribute('controls', 'controls');
          var promise = video.play();
          if (promise && promise.catch) {
            promise.catch(function () {});
          }
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }
      if (overlay) {
        overlay.addEventListener('click', function (event) {
          if (event.target === overlay) {
            play();
          }
        });
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!loaded) {
            play();
          }
        });
        window.addEventListener('beforeunload', function () {
          if (hlsInstance) {
            hlsInstance.destroy();
          }
        });
      }
    });
  }

  ready(function () {
    initMenu();
    initSearchRedirect();
    initHero();
    initFilters();
    initPlayers();
  });
})();
