(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function textOf(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setupMenus() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");

    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var q = input ? input.value.trim() : "";
        var target = form.getAttribute("action") || "./search.html";
        window.location.href = q ? target + "?q=" + encodeURIComponent(q) : target;
      });
    });
  }

  function applyFilters(panel) {
    var textInput = panel.querySelector("[data-filter-text]");
    var regionInput = panel.querySelector("[data-filter-region]");
    var typeInput = panel.querySelector("[data-filter-type]");
    var yearInput = panel.querySelector("[data-filter-year]");
    var q = textOf(textInput && textInput.value);
    var region = textOf(regionInput && regionInput.value);
    var type = textOf(typeInput && typeInput.value);
    var year = textOf(yearInput && yearInput.value);
    var cards = document.querySelectorAll("[data-movie-card]");
    var visible = 0;

    cards.forEach(function (card) {
      var keywords = textOf(card.getAttribute("data-keywords"));
      var cardRegion = textOf(card.getAttribute("data-region"));
      var cardType = textOf(card.getAttribute("data-type"));
      var cardYear = textOf(card.getAttribute("data-year"));
      var ok = true;

      if (q && keywords.indexOf(q) === -1) {
        ok = false;
      }

      if (region && cardRegion !== region) {
        ok = false;
      }

      if (type && cardType !== type) {
        ok = false;
      }

      if (year && cardYear !== year) {
        ok = false;
      }

      card.hidden = !ok;

      if (ok) {
        visible += 1;
      }
    });

    document.querySelectorAll("[data-empty-state]").forEach(function (node) {
      node.classList.toggle("is-visible", visible === 0);
    });
  }

  function setupFilters() {
    document.querySelectorAll("[data-movie-filter]").forEach(function (panel) {
      panel.querySelectorAll("input, select").forEach(function (input) {
        input.addEventListener("input", function () {
          applyFilters(panel);
        });
        input.addEventListener("change", function () {
          applyFilters(panel);
        });
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      var textInput = panel.querySelector("[data-filter-text]");

      if (q && textInput) {
        textInput.value = q;
      }

      applyFilters(panel);
    });
  }

  function setupHero() {
    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer = null;

      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }

      function start() {
        if (slides.length < 2) {
          return;
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5600);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          show(i);
          start();
        });
      });

      show(0);
      start();
    });
  }

  window.setupMoviePlayer = function (source) {
    ready(function () {
      var video = document.getElementById("movie-player");
      var layer = document.getElementById("play-layer");
      var message = document.getElementById("player-message");
      var hls = null;
      var loaded = false;

      if (!video || !source) {
        return;
      }

      function loadSource() {
        if (loaded) {
          return;
        }

        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.load();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          return;
        }

        video.src = source;
        video.load();
      }

      function playVideo() {
        loadSource();

        if (layer) {
          layer.classList.add("is-hidden");
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            if (layer) {
              layer.classList.remove("is-hidden");
            }
          });
        }
      }

      if (layer) {
        layer.addEventListener("click", playVideo);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", function () {
        if (layer) {
          layer.classList.add("is-hidden");
        }
      });

      video.addEventListener("error", function () {
        if (message) {
          message.hidden = false;
        }
      });

      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  };

  ready(function () {
    setupMenus();
    setupSearchForms();
    setupFilters();
    setupHero();
  });
})();
