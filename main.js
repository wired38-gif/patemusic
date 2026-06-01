/* ─────────────────────────────────────────
   PATE MUSIC — main.js
   Nav scroll state · Mobile menu · Strip drag scroll
   ───────────────────────────────────────── */

(function () {
  'use strict';

  // ── Scrolled nav state ──────────────────
  const nav = document.getElementById('site-nav');
  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile menu ─────────────────────────
  const ham = document.querySelector('.hamburger');
  const mob = document.getElementById('mobile-menu');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      ham.setAttribute('aria-expanded', open);
      mob.classList.toggle('open', open);
      mob.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', false);
        mob.classList.remove('open');
        mob.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
      });
    });
  }

  // ── Photo strip — drag to scroll ────────
  const strip = document.querySelector('.strip-track');
  if (strip) {
    let isDown = false, startX = 0, scrollLeft = 0;
    strip.addEventListener('mousedown', e => {
      isDown = true;
      strip.style.cursor = 'grabbing';
      startX = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
    });
    strip.addEventListener('mouseleave', () => { isDown = false; strip.style.cursor = 'grab'; });
    strip.addEventListener('mouseup', () => { isDown = false; strip.style.cursor = 'grab'; });
    strip.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.4;
      strip.scrollLeft = scrollLeft - walk;
    });
    // Touch support
    let touchStart = 0, touchScrollLeft = 0;
    strip.addEventListener('touchstart', e => {
      touchStart = e.touches[0].pageX;
      touchScrollLeft = strip.scrollLeft;
    }, { passive: true });
    strip.addEventListener('touchmove', e => {
      const x = e.touches[0].pageX;
      const walk = (x - touchStart) * 1.2;
      strip.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });
  }

  // ── Smooth anchor scroll ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

})();

// ── Scroll reveal ────────────────────────
document.querySelectorAll(
  '.panel-title, .panel-eyebrow, .panel-sub, .panel-actions, .about-title, .about-copy, .about-tags, .connect-title, .gp-label, .gp-caption, .neon-panel-title, .neon-panel-sub'
).forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Music Player ─────────────────────────
(function() {
  const player  = document.getElementById('music-player');
  const toggle  = document.getElementById('mp-toggle');
  const closer  = document.getElementById('mp-close');
  const volSldr = document.getElementById('mp-volume');
  const playIco = toggle && toggle.querySelector('.mp-play');
  const pauseIco= toggle && toggle.querySelector('.mp-pause');

  // Use YouTube embed audio via a hidden iframe as Spotify requires OAuth
  // Instead wire to a direct DistroKid preview or YouTube IFrame API
  // For now create a silent placeholder that prompts Spotify open
  if (!player || !toggle) return;

  let playing = false;

  // Try to use the YouTube iframe API for audio
  const ytFrame = document.createElement('iframe');
  ytFrame.src = 'https://www.youtube.com/embed/PmNR6i_MANs?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=PmNR6i_MANs';
  ytFrame.allow = 'autoplay; encrypted-media';
  ytFrame.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
  ytFrame.id = 'yt-audio-frame';
  document.body.appendChild(ytFrame);

  let ytPlayer = null;
  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new window.YT.Player('yt-audio-frame', {
      events: {
        onReady: function(e) {
          e.target.setVolume(20);
        }
      }
    });
  };

  // Load YouTube API
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  toggle.addEventListener('click', () => {
    if (!ytPlayer) return;
    if (!playing) {
      ytPlayer.playVideo();
      playing = true;
      if (playIco) playIco.style.display = 'none';
      if (pauseIco) pauseIco.style.display = '';
      toggle.setAttribute('aria-label', 'Pause background music');
    } else {
      ytPlayer.pauseVideo();
      playing = false;
      if (playIco) playIco.style.display = '';
      if (pauseIco) pauseIco.style.display = 'none';
      toggle.setAttribute('aria-label', 'Play background music');
    }
  });

  volSldr && volSldr.addEventListener('input', () => {
    if (ytPlayer) ytPlayer.setVolume(parseInt(volSldr.value));
  });

  closer && closer.addEventListener('click', () => {
    if (ytPlayer && playing) ytPlayer.pauseVideo();
    player.classList.add('hidden');
  });
})();

/* ────────────────────────────────────────
   VENUE CAROUSEL
   ──────────────────────────────────────── */
(function () {
  const carousel = document.getElementById('venueCarousel');
  if (!carousel) return;

  const slides  = Array.from(carousel.querySelectorAll('.vc-slide'));
  const dotsWrap = document.getElementById('vcDots');
  const locEl   = document.getElementById('vcLocation');
  const nameEl  = document.getElementById('vcName');
  const descEl  = document.getElementById('vcDesc');
  const labelEl = document.getElementById('vcLabel');
  const prevBtn = document.getElementById('vcPrev');
  const nextBtn = document.getElementById('vcNext');

  let current = 0;
  let timer;
  const INTERVAL = 5000;

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'vc-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.vc-dot'));

  function updateText(slide) {
    locEl.textContent   = slide.dataset.location || '';
    nameEl.textContent  = slide.dataset.name     || '';
    descEl.textContent  = slide.dataset.desc     || '';
    labelEl.textContent = slide.dataset.label    || '';
  }

  function goTo(idx) {
    slides[current].classList.remove('vc-active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('vc-active');
    dots[current].classList.add('active');
    updateText(slides[current]);
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch swipe support
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  updateText(slides[0]);
  resetTimer();
}());
