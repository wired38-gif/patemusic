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
