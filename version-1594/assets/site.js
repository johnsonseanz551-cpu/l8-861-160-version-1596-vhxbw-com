(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var sliders = document.querySelectorAll('[data-hero-slider]');

  sliders.forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    show(0);

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  });

  var filterForms = document.querySelectorAll('[data-filter-form]');

  filterForms.forEach(function (form) {
    var keywordInput = form.querySelector('[data-filter-keyword]');
    var regionInput = form.querySelector('[data-filter-region]');
    var typeInput = form.querySelector('[data-filter-type]');
    var scopeSelector = form.getAttribute('data-filter-scope') || 'body';
    var scope = document.querySelector(scopeSelector) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-card]'));
    var empty = scope.querySelector('[data-empty-state]');

    function includes(value, keyword) {
      return String(value || '').toLowerCase().indexOf(keyword) !== -1;
    }

    function apply() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var region = regionInput ? regionInput.value : '';
      var type = typeInput ? typeInput.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var regionMatch = !region || card.getAttribute('data-region') === region;
        var typeMatch = !type || card.getAttribute('data-type') === type;
        var keywordMatch = !keyword || includes(haystack, keyword);
        var matched = regionMatch && typeMatch && keywordMatch;

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    form.addEventListener('input', apply);
    form.addEventListener('change', apply);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply();
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query && keywordInput) {
      keywordInput.value = query;
    }

    apply();
  });
})();
