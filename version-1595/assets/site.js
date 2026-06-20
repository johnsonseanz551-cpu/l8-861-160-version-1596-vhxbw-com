import { H as Hls } from './hls-vendor.js';

const ready = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
        return;
    }

    callback();
};

const normalize = (value) => (value || '').toString().trim().toLowerCase();

ready(() => {
    const menuButton = document.querySelector('.menu-toggle');
    const mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', () => {
            const expanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', String(!expanded));
            mobilePanel.classList.toggle('is-open', !expanded);
            document.body.classList.toggle('menu-open', !expanded);
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let current = 0;
        let timer = null;

        const showSlide = (index) => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        const start = () => {
            if (timer || slides.length < 2) {
                return;
            }

            timer = window.setInterval(() => showSlide(current + 1), 5500);
        };

        const stop = () => {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stop();
                showSlide(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    document.querySelectorAll('[data-filter-bar]').forEach((bar) => {
        const section = bar.parentElement || document;
        const list = section.querySelector('[data-filter-list]') || document.querySelector('[data-filter-list]');
        const cards = list ? Array.from(list.querySelectorAll('[data-card]')) : [];
        const input = bar.querySelector('[data-filter-input]');
        const typeSelect = bar.querySelector('[data-filter-type]');
        const yearSelect = bar.querySelector('[data-filter-year]');
        const empty = section.querySelector('[data-empty-state]') || document.querySelector('[data-empty-state]');

        const apply = () => {
            const keyword = normalize(input ? input.value : '');
            const type = normalize(typeSelect ? typeSelect.value : '');
            const year = normalize(yearSelect ? yearSelect.value : '');
            let visible = 0;

            cards.forEach((card) => {
                const haystack = normalize(card.dataset.search);
                const cardType = normalize(card.dataset.type);
                const cardYear = normalize(card.dataset.year);
                const matchesKeyword = !keyword || haystack.includes(keyword);
                const matchesType = !type || cardType === type;
                const matchesYear = !year || cardYear === year;
                const shouldShow = matchesKeyword && matchesType && matchesYear;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible > 0;
            }
        };

        [input, typeSelect, yearSelect].filter(Boolean).forEach((control) => {
            control.addEventListener('input', apply);
            control.addEventListener('change', apply);
        });

        apply();
    });

    const searchInput = document.querySelector('[data-search-page-input]');
    const searchList = document.querySelector('[data-search-list]');

    if (searchInput && searchList) {
        const params = new URLSearchParams(window.location.search);
        const initial = params.get('q') || '';
        const cards = Array.from(searchList.querySelectorAll('[data-card]'));
        const empty = document.querySelector('[data-empty-state]');
        searchInput.value = initial;

        const applySearch = () => {
            const keyword = normalize(searchInput.value);
            let visible = 0;

            cards.forEach((card) => {
                const shouldShow = !keyword || normalize(card.dataset.search).includes(keyword);
                card.hidden = !shouldShow;

                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible > 0;
            }
        };

        searchInput.addEventListener('input', applySearch);
        applySearch();
    }

    document.querySelectorAll('[data-player]').forEach((player) => {
        const video = player.querySelector('video');
        const trigger = player.querySelector('[data-play-trigger]');
        let hls = null;
        let attached = false;

        const attach = () => {
            if (!video || !trigger || attached) {
                return;
            }

            const stream = trigger.dataset.stream;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                attached = true;
                return;
            }

            if (Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                attached = true;
            }
        };

        const startPlayback = () => {
            attach();

            if (trigger) {
                trigger.classList.add('is-hidden');
            }

            if (video) {
                const playPromise = video.play();

                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {
                        if (trigger) {
                            trigger.classList.remove('is-hidden');
                        }
                    });
                }
            }
        };

        if (trigger) {
            trigger.addEventListener('click', startPlayback);
        }

        if (video) {
            video.addEventListener('click', () => {
                if (video.paused) {
                    startPlayback();
                }
            });
        }

        window.addEventListener('pagehide', () => {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    });
});
