(function () {
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function toggleMobileNav() {
    const nav = $('[data-mobile-nav]');
    if (!nav) return;
    nav.classList.toggle('open');
  }

  function closeMobileNav() {
    const nav = $('[data-mobile-nav]');
    if (!nav) return;
    nav.classList.remove('open');
  }

  function setupMenu() {
    const toggle = $('[data-menu-toggle]');
    if (toggle) {
      toggle.addEventListener('click', toggleMobileNav);
    }
    document.addEventListener('click', function (ev) {
      const nav = $('[data-mobile-nav]');
      const header = $('.site-header');
      if (!nav || !header) return;
      if (!header.contains(ev.target)) {
        closeMobileNav();
      }
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector('script[data-loaded-src="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(); });
        existing.addEventListener('error', reject);
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.dataset.loadedSrc = src;
      s.onload = function () { resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function setupPlayer() {
    const shell = $('[data-player-shell]');
    if (!shell) return;
    const video = $('video', shell);
    const btn = $('[data-play-button]', shell);
    const url = shell.getAttribute('data-stream-url');
    if (!video || !url) return;

    let hls = null;

    function attachStream() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        return Promise.resolve();
      }

      return loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js').then(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          video.src = url;
        }
      }).catch(function () {
        video.src = url;
      });
    }

    function hideOverlay() {
      const overlay = $('.player-overlay', shell);
      if (overlay) overlay.style.display = 'none';
    }

    function playVideo() {
      attachStream().then(function () {
        return video.play();
      }).then(hideOverlay).catch(function () {
        hideOverlay();
      });
    }

    if (btn) {
      btn.addEventListener('click', playVideo);
    }

    video.addEventListener('click', playVideo);
    video.addEventListener('play', hideOverlay);
    video.addEventListener('loadeddata', function () {
      const overlay = $('.player-overlay', shell);
      if (overlay) overlay.style.display = 'grid';
    });
  }

  function buildSearchPage() {
    const results = $('[data-search-results]');
    const countEl = $('[data-search-count]');
    const emptyEl = $('[data-search-empty]');
    const dataEl = $('#search-data');
    if (!results) return;

    let data = [];
    if (window.MOVIE_SEARCH_DATA && Array.isArray(window.MOVIE_SEARCH_DATA)) {
      data = window.MOVIE_SEARCH_DATA;
    } else if (dataEl) {
      try {
        data = JSON.parse(dataEl.textContent || '[]');
      } catch (err) {
        data = [];
      }
    }

    const params = new URLSearchParams(window.location.search);
    const q = (params.get('q') || '').trim();
    const input = $('[data-search-input]');
    if (input) input.value = q;

    function render(list) {
      results.innerHTML = '';
      if (countEl) countEl.textContent = String(list.length);
      if (!q) {
        if (emptyEl) emptyEl.style.display = 'block';
        results.innerHTML = '';
        return;
      }
      if (emptyEl) emptyEl.style.display = list.length ? 'none' : 'block';
      if (!list.length) {
        results.innerHTML = '';
        return;
      }
      const html = list.map(function (item) {
        return `
          <article class="movie-card" style="${item.style}">
            <a href="/movie/${item.id}.html">
              <div class="movie-poster" data-index="${item.cover_no}" data-group="${item.group}"></div>
            </a>
            <div class="movie-body">
              <h3><a href="/movie/${item.id}.html">${item.title}</a></h3>
              <div class="meta"><span>${item.year}</span><span>${item.group}</span><span>${item.genre}</span></div>
              <p>${item.one_line}</p>
              <div class="movie-tags">${item.tags.slice(0, 3).map(function (t) { return `<span class="tag">${t}</span>`; }).join('')}</div>
            </div>
          </article>
        `;
      }).join('');
      results.innerHTML = html;
    }

    if (!q) {
      render([]);
      return;
    }

    const needle = q.toLowerCase();
    const filtered = data.filter(function (item) {
      const hay = [
        item.title,
        item.one_line,
        item.summary,
        item.genre,
        item.group,
        item.tags.join(' ')
      ].join(' ').toLowerCase();
      return hay.indexOf(needle) !== -1;
    });

    render(filtered);

    if (input) {
      input.addEventListener('change', function () {
        const value = (input.value || '').trim();
        const url = new URL(window.location.href);
        if (value) {
          url.searchParams.set('q', value);
        } else {
          url.searchParams.delete('q');
        }
        window.location.href = url.toString();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupPlayer();
    buildSearchPage();
  });
})();
