/* ══════════════════════════════════════════
   PATE MUSIC — main.js
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAV: scroll-aware hide/show + active state ─── */
  const nav        = document.getElementById('site-nav');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  let lastScrollY  = 0;
  let ticking      = false;

  function handleScroll() {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    // Hide nav on scroll down, show on scroll up
    if (y > lastScrollY && y > 120) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ─── HAMBURGER MENU ─── */
  function toggleMenu(open) {
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close mobile menu on nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) toggleMenu(false);
  });

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach((el, i) => {
      // Stagger sibling elements within the same parent
      const siblings = [...el.parentElement.querySelectorAll('.fade-up')];
      const siblingIndex = siblings.indexOf(el);
      if (siblingIndex > 0) {
        el.style.transitionDelay = `${siblingIndex * 80}ms`;
      }
      observer.observe(el);
    });
  } else {
    // Fallback: just make everything visible
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── ACTIVE NAV LINK on scroll ─── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 3;
    let active = '';
    sections.forEach(s => {
      if (s.offsetTop <= scrollMid) active = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + active);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ─── GALLERY: lightbox-style expand on click ─── */
  const galleryItems = document.querySelectorAll('.g-item img');

  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed; inset:0; z-index:999;
        background:rgba(9,9,13,0.95);
        display:flex; align-items:center; justify-content:center;
        cursor:zoom-out;
        animation: fadeIn 200ms ease-out;
      `;
      const style = document.createElement('style');
      style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
      document.head.appendChild(style);

      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt;
      clone.style.cssText = `
        max-width:90vw; max-height:90vh;
        object-fit:contain;
        border-radius:8px;
        box-shadow:0 24px 80px rgba(0,0,0,0.8);
        animation:fadeIn 250ms ease-out;
      `;

      overlay.appendChild(clone);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const close = () => {
        overlay.remove();
        style.remove();
        document.body.style.overflow = '';
      };
      overlay.addEventListener('click', close);
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });
    });
    img.style.cursor = 'zoom-in';
  });

  /* ─── PLATFORM BUTTON GLOW on hover ─── */
  const platformBtns = document.querySelectorAll('.btn-platform');
  platformBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 0 14px rgba(255,106,61,0.18)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '';
    });
  });

})();
