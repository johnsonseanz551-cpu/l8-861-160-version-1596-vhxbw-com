(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    if (menuButton) {
      menuButton.addEventListener("click", function () {
        document.body.classList.toggle("menu-open");
      });
    }

    document.querySelectorAll("form.header-search, form.large-search").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var thumbs = Array.prototype.slice.call(hero.querySelectorAll(".hero-thumb"));
      var current = 0;

      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
        thumbs.forEach(function (thumb, thumbIndex) {
          thumb.classList.toggle("active", thumbIndex === current);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-slide")) || 0);
        });
      });

      thumbs.forEach(function (thumb) {
        thumb.addEventListener("mouseenter", function () {
          showSlide(Number(thumb.getAttribute("data-slide")) || 0);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          showSlide(current + 1);
        }, 5600);
      }
    }

    document.querySelectorAll("[data-filter-area]").forEach(function (area) {
      var input = area.querySelector("[data-filter-input]");
      var cards = Array.prototype.slice.call(area.querySelectorAll(".movie-card"));
      var chips = Array.prototype.slice.call(area.querySelectorAll("[data-filter-chip]"));

      function applyFilter(value) {
        var query = String(value || "").trim().toLowerCase();
        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region")
          ].join(" ").toLowerCase();
          card.hidden = query && text.indexOf(query) === -1;
        });
      }

      if (input) {
        input.addEventListener("input", function () {
          applyFilter(input.value);
        });
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var value = chip.getAttribute("data-filter-chip") || "";
          if (input) {
            input.value = value;
          }
          applyFilter(value);
        });
      });
    });
  });
})();
