(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, itemIndex) {
            slide.classList.toggle("is-active", itemIndex === activeIndex);
        });

        dots.forEach(function (dot, itemIndex) {
            dot.classList.toggle("is-active", itemIndex === activeIndex);
        });
    }

    function startHero() {
        if (timer || slides.length < 2) {
            return;
        }

        timer = window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5000);
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var next = Number(dot.getAttribute("data-slide") || 0);
            showSlide(next);
        });
    });

    showSlide(0);
    startHero();

    var filterInput = document.querySelector(".movie-filter-input");
    var filterSelect = document.querySelector(".movie-filter-select");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".all-movies .movie-card"));
    var emptyState = document.querySelector(".empty-state");

    function filterCards() {
        if (!cards.length) {
            return;
        }

        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
        var genre = filterSelect ? filterSelect.value.trim().toLowerCase() : "";
        var visible = 0;

        cards.forEach(function (card) {
            var text = [
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags"),
                card.getAttribute("data-year")
            ].join(" ").toLowerCase();
            var genreText = (card.getAttribute("data-genre") || "").toLowerCase();
            var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchedGenre = !genre || genreText.indexOf(genre) !== -1;
            var matched = matchedKeyword && matchedGenre;

            card.style.display = matched ? "" : "none";
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("is-visible", visible === 0);
        }
    }

    if (filterInput) {
        filterInput.addEventListener("input", filterCards);
    }

    if (filterSelect) {
        filterSelect.addEventListener("change", filterCards);
    }
})();
