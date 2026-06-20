
(function () {
  var toggle = document.querySelector('.mobile-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function startTimer() {
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }

    function resetTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      startTimer();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide-to')) || 0);
        resetTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        resetTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        resetTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var localInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));

  function getQueryFromUrl() {
    try {
      return new URLSearchParams(window.location.search).get('q') || '';
    } catch (error) {
      return '';
    }
  }

  function filterCards(value) {
    var grid = document.querySelector('[data-filter-grid]');
    if (!grid) {
      return;
    }
    var query = String(value || '').trim().toLowerCase();
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    cards.forEach(function (card) {
      var text = String(card.getAttribute('data-text') || '').toLowerCase();
      var visible = !query || text.indexOf(query) !== -1;
      card.classList.toggle('is-hidden', !visible);
    });
  }

  localInputs.forEach(function (input) {
    var initial = getQueryFromUrl();
    if (initial) {
      input.value = initial;
    }
    input.addEventListener('input', function () {
      filterCards(input.value);
    });
    filterCards(input.value);
  });

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');
      var value = button.getAttribute('data-filter-value') || '';
      localInputs.forEach(function (input) {
        input.value = value;
      });
      filterCards(value);
    });
  });
})();
