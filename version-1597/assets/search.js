(function () {
    var form = document.getElementById("global-search-form");
    var input = document.getElementById("global-search-input");
    var results = document.getElementById("search-results");
    var empty = document.getElementById("search-empty");

    if (!form || !input || !results || !Array.isArray(SEARCH_MOVIES)) {
        return;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"]/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[character];
        });
    }

    function render(list) {
        var html = list.slice(0, 96).map(function (movie) {
            return [
                "<article class=\"movie-card\">",
                "<a class=\"movie-poster\" href=\"" + escapeHtml(movie.url) + "\">",
                "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
                "<span class=\"play-mark\">▶</span>",
                "</a>",
                "<div class=\"movie-info\">",
                "<div class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
                "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
                "<p>" + escapeHtml(movie.oneLine) + "</p>",
                "<div class=\"tag-row\"><span>" + escapeHtml(movie.genre) + "</span></div>",
                "</div>",
                "</article>"
            ].join("");
        }).join("");

        results.innerHTML = html;

        if (empty) {
            empty.classList.toggle("is-visible", list.length === 0);
        }
    }

    function runSearch() {
        var keyword = input.value.trim().toLowerCase();

        if (!keyword) {
            render(SEARCH_MOVIES.slice(0, 48));
            return;
        }

        var matched = SEARCH_MOVIES.filter(function (movie) {
            return movie.text.toLowerCase().indexOf(keyword) !== -1;
        });

        render(matched);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        runSearch();
    });

    input.addEventListener("input", runSearch);

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query) {
        input.value = query;
        runSearch();
    }
})();
