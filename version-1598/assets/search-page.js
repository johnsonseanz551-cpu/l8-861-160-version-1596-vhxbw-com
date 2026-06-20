(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function escapeText(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function card(movie) {
    return [
      '<article class="movie-card" data-title="', escapeText(movie.title), '" data-genre="', escapeText(movie.genre), '" data-year="', escapeText(movie.year), '" data-region="', escapeText(movie.region), '">',
      '<a class="poster-link" href="./', escapeText(movie.file), '" aria-label="观看', escapeText(movie.title), '">',
      '<img src="', escapeText(movie.image), '" alt="', escapeText(movie.title), '" loading="lazy">',
      '<span class="poster-play">播放</span>',
      '</a>',
      '<div class="card-body">',
      '<h2><a href="./', escapeText(movie.file), '">', escapeText(movie.title), '</a></h2>',
      '<p class="meta-line">', escapeText(movie.year), ' · ', escapeText(movie.region), ' · ', escapeText(movie.type), '</p>',
      '<p class="card-desc">', escapeText(movie.oneLine), '</p>',
      '<div class="tag-row"><span>', escapeText(movie.genre), '</span></div>',
      '</div>',
      '</article>'
    ].join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var results = document.getElementById("search-results");
    var input = document.querySelector("[data-search-input]");
    if (!results || !window.MOVIE_INDEX) {
      return;
    }

    var initial = getQuery();
    if (input) {
      input.value = initial;
    }

    function render(value) {
      var query = String(value || "").trim().toLowerCase();
      var list = window.MOVIE_INDEX.filter(function (movie) {
        var text = [movie.title, movie.genre, movie.tags, movie.region, movie.type, movie.year, movie.oneLine].join(" ").toLowerCase();
        return !query || text.indexOf(query) !== -1;
      }).slice(0, 120);

      if (!list.length) {
        results.innerHTML = '<div class="empty-state">未找到相关影片</div>';
        return;
      }

      results.innerHTML = '<div class="card-grid">' + list.map(card).join("") + '</div>';
    }

    render(initial);

    if (input) {
      input.addEventListener("input", function () {
        render(input.value);
      });
    }
  });
})();
