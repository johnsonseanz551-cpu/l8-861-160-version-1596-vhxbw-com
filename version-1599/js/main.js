(function () {
  var toggle = document.querySelector('.mobile-toggle');
  var menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var filterRoot = document.querySelector('[data-filterable]');
  var searchInput = document.querySelector('.site-search-input');
  var yearSelect = document.querySelector('.site-filter-select');
  var countBox = document.querySelector('.filter-count');

  if (filterRoot && searchInput) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (initialQuery) {
      searchInput.value = initialQuery;
    }

    function applyFilters() {
      var query = searchInput.value.trim().toLowerCase();
      var year = yearSelect ? yearSelect.value : '';
      var items = Array.prototype.slice.call(filterRoot.children);
      var visible = 0;

      items.forEach(function (item) {
        var text = [
          item.getAttribute('data-title'),
          item.getAttribute('data-region'),
          item.getAttribute('data-genre'),
          item.getAttribute('data-tags'),
          item.getAttribute('data-year'),
          item.getAttribute('data-category')
        ].join(' ').toLowerCase();
        var matchesText = !query || text.indexOf(query) !== -1;
        var matchesYear = !year || item.getAttribute('data-year') === year;
        var show = matchesText && matchesYear;

        item.classList.toggle('is-hidden-card', !show);

        if (show) {
          visible += 1;
        }
      });

      if (countBox) {
        countBox.textContent = query || year ? '匹配 ' + visible + ' 部' : '';
      }
    }

    searchInput.addEventListener('input', applyFilters);

    if (yearSelect) {
      yearSelect.addEventListener('change', applyFilters);
    }

    applyFilters();
  }
})();
