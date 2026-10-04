/* ============================================================================
   FITNESS HAMOUCHI GYM — behaviour & motion
   ============================================================================

   Progressive enhancement throughout. The site is fully readable, navigable
   and bookable with JavaScript disabled or blocked; everything here adds
   polish on top of markup that already works.

   Two guards shape the whole file:

     1. prefers-reduced-motion. Smooth scrolling, parallax, split-line reveals
        and the hero video are all skipped for anyone who has asked their
        system for reduced motion. This is an accessibility requirement, not a
        preference — large transform animations trigger genuine nausea for
        people with vestibular disorders.

     2. Missing libraries. GSAP and Lenis are self-hosted, but if either fails
        to load the code falls back to IntersectionObserver and native
        scrolling rather than throwing and taking the rest of the page down.
   ========================================================================= */

(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const isRTL = root.getAttribute('dir') === 'rtl';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let REDUCED = reduceMotion.matches;

  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  const $ = (sel, ctx) => (ctx || doc).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || doc).querySelectorAll(sel));

  if (hasScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ======================================================================
     Preloader
     Dismissed on window load, with a hard timeout so a slow or failed asset
     can never leave a visitor staring at a blocking overlay.
     ====================================================================== */

  const loader = $('[data-loader]');

  function dismissLoader() {
    if (!loader || loader.classList.contains('is-done')) return;
    const bar = $('i', loader);
    if (bar) bar.style.inlineSize = '100%';
    window.setTimeout(() => {
      loader.classList.add('is-done');
      doc.body.classList.add('is-loaded');
      window.setTimeout(() => loader.remove(), 700);
    }, REDUCED ? 0 : 260);
  }

  if (loader) {
    if (REDUCED) {
      loader.remove();
    } else {
      const bar = $('i', loader);
      let progress = 0;
      const tick = window.setInterval(() => {
        progress = Math.min(progress + Math.random() * 18, 92);
        if (bar) bar.style.inlineSize = progress + '%';
      }, 180);

      const finish = () => {
        window.clearInterval(tick);
        dismissLoader();
      };
      window.addEventListener('load', finish, { once: true });
      // Safety net: never hold the page longer than 3.5s.
      window.setTimeout(finish, 3500);
    }
  }

  /* ======================================================================
     Smooth scrolling (Lenis)
     Driven from GSAP's ticker so scroll-linked animations stay in sync with
     the smoothed scroll position instead of fighting it.
     ====================================================================== */

  let lenis = null;

  function initSmoothScroll() {
    if (!hasLenis || REDUCED) return;
    // Pointer-coarse devices already have good native inertia; adding Lenis on
    // top makes phones feel laggy, so it stays desktop-only.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    if (hasGSAP) {
      lenis.on('scroll', () => {
        if (hasScrollTrigger) window.ScrollTrigger.update();
      });
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /** Scrolls to an element through Lenis when active, natively otherwise. */
  function scrollTo(target, offset) {
    if (lenis) lenis.scrollTo(target, { offset: offset || 0 });
    else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ======================================================================
     Header: compact on scroll, hide on scroll down, reveal on scroll up
     ====================================================================== */

  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;

    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-stuck', y > 24);

      // Only hide once well past the header, and never while a menu is open.
      const menuOpen = doc.body.classList.contains('menu-open');
      if (!menuOpen && y > 400 && y > last + 4) header.classList.add('is-hidden');
      else if (y < last - 4 || y < 200) header.classList.remove('is-hidden');

      last = y;
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ======================================================================
     Mobile menu
     Uses [hidden] for the accessibility tree plus a class for the transition,
     and traps focus while open.
     ====================================================================== */

  function initMenu() {
    const toggle = $('[data-menu-toggle]');
    const menu = $('[data-menu]');
    if (!toggle || !menu) return;

    const label = {
      open: toggle.getAttribute('aria-label') || 'Menu',
      close: toggle.getAttribute('data-label-close') || 'Close',
    };
    let lastFocus = null;

    const open = () => {
      lastFocus = doc.activeElement;
      menu.hidden = false;
      // Next frame, so the transition has a start state to animate from.
      requestAnimationFrame(() => menu.classList.add('is-open'));
      toggle.setAttribute('aria-expanded', 'true');
      doc.body.classList.add('menu-open');
      doc.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      const first = $('a, button', menu);
      if (first) first.focus({ preventScroll: true });
    };

    const close = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      doc.body.classList.remove('menu-open');
      doc.body.style.overflow = '';
      if (lenis) lenis.start();
      window.setTimeout(() => {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, 450);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };

    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'true') close();
      else open();
    });

    // Any navigation closes it.
    $$('a', menu).forEach((a) => a.addEventListener('click', close));

    doc.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') === 'true') close();
    });

    // Focus trap: Tab cycles within the open menu.
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = $$('a[href], button:not([disabled])', menu).filter(
        (el) => el.offsetParent !== null
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Desktop breakpoint reached while open — reset so the menu cannot be
    // left stuck over a desktop layout.
    window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => {
      if (e.matches && toggle.getAttribute('aria-expanded') === 'true') close();
    });
  }

  /* ======================================================================
     Language dropdowns
     ====================================================================== */

  function initLangMenus() {
    const wraps = $$('.lang');
    if (!wraps.length) return;

    const closeAll = (except) => {
      wraps.forEach((w) => {
        if (w === except) return;
        w.classList.remove('is-open');
        const b = $('[data-lang-toggle]', w);
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    };

    wraps.forEach((wrap) => {
      const btn = $('[data-lang-toggle]', wrap);
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrap.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        closeAll(wrap);
      });
    });

    doc.addEventListener('click', () => closeAll(null));
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll(null);
    });
  }

  /* ======================================================================
     Scroll reveals
     ScrollTrigger when available, IntersectionObserver otherwise, and
     everything simply visible when motion is reduced.
     ====================================================================== */

  function initReveals() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (REDUCED) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    if (hasScrollTrigger) {
      items.forEach((el) => {
        window.ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => el.classList.add('is-in'),
        });
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ======================================================================
     Split-line headings
     Wraps each visual line in a clipping box so it can slide up independently.
     Done by measuring rendered word positions rather than guessing, so it
     stays correct at any viewport width and in any language.
     ====================================================================== */

  function splitIntoLines(el) {
    // Only split plain text — never destroy nested markup such as links.
    if (el.querySelector('a, strong, em, span')) return false;

    const text = el.textContent.trim();
    if (!text) return false;

    // Arabic is cursive: wrapping each word in its own element is safe (words
    // are separated anyway), but splitting *within* a word would break the
    // joining behaviour. Word-level is all we do, so this is fine either way.
    const words = text.split(/\s+/);
    el.textContent = '';

    const spans = words.map((word, i) => {
      const s = doc.createElement('span');
      s.className = 'word';
      s.textContent = word + (i < words.length - 1 ? ' ' : '');
      el.appendChild(s);
      return s;
    });

    // Group words by their rendered vertical offset = one visual line.
    const lines = [];
    let current = null;
    let lastTop = null;

    spans.forEach((span) => {
      const top = Math.round(span.offsetTop);
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        current = [];
        lines.push(current);
        lastTop = top;
      }
      current.push(span);
    });

    if (lines.length === 0) return false;

    el.textContent = '';
    lines.forEach((line, i) => {
      const box = doc.createElement('span');
      box.className = 'line';
      const inner = doc.createElement('span');
      inner.style.setProperty('--li', String(i));
      line.forEach((w) => inner.appendChild(w));
      box.appendChild(inner);
      el.appendChild(box);
    });

    return true;
  }

  function initSplitHeadings() {
    const heads = $$('[data-split="lines"]');
    if (!heads.length) return;

    if (REDUCED) {
      heads.forEach((el) => el.classList.add('is-in'));
      return;
    }

    heads.forEach((el) => {
      const ok = splitIntoLines(el);
      if (!ok) {
        el.classList.add('is-in');
        return;
      }

      if (hasScrollTrigger) {
        window.ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => el.classList.add('is-in'),
        });
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            });
          },
          { rootMargin: '0px 0px -10% 0px' }
        );
        io.observe(el);
      }
    });

    // Re-split on resize: a heading that wrapped over three lines on a phone
    // may wrap over two on a tablet, and stale line boxes would clip it.
    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        heads.forEach((el) => {
          if (!el.classList.contains('is-in')) return;
          const flat = el.textContent.replace(/\s+/g, ' ').trim();
          el.textContent = flat;
          splitIntoLines(el);
          el.classList.add('is-in');
        });
        if (hasScrollTrigger) window.ScrollTrigger.refresh();
      }, 250);
    });
  }

  /* ======================================================================
     Animated counters
     The final value is already in the DOM — this only animates towards it, so
     a crawler or a no-JS visitor always reads the real number.
     ====================================================================== */

  function initCounters() {
    const els = $$('[data-count]');
    if (!els.length || REDUCED) return;

    const animate = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      if (!Number.isFinite(target)) return;
      const valueSpan = el.querySelector('span');
      if (!valueSpan) return;

      const suffix = String(valueSpan.textContent).replace(/[\d.\s]/g, '');
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        // easeOutExpo — fast then settling, which reads as "counting up".
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        const value = Math.round(target * eased);
        valueSpan.textContent = value.toLocaleString(root.lang || 'fr') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ======================================================================
     Hero video
     Loaded only when it can actually be used: not on reduced motion, not on a
     metered connection, and not in data-saver mode. The poster image is the
     Largest Contentful Paint element either way, so this never delays it.
     ====================================================================== */

  function initHeroVideo() {
    const video = $('[data-hero-video]');
    if (!video) return;

    if (REDUCED) {
      video.remove();
      return;
    }

    const conn = navigator.connection;
    if (conn) {
      if (conn.saveData) return;
      if (/(^|-)2g$/.test(conn.effectiveType || '')) return;
    }

    const start = () => {
      video.preload = 'auto';
      video.load();
      const play = video.play();
      if (play && typeof play.catch === 'function') {
        // Autoplay can still be refused; the poster stays, which is fine.
        play.catch(() => {});
      }
    };

    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });

    // Wait until the page has settled so the video never competes with the
    // poster, the fonts or the stylesheet for bandwidth.
    if (doc.readyState === 'complete') window.setTimeout(start, 450);
    else window.addEventListener('load', () => window.setTimeout(start, 450), { once: true });

    // Pause while off-screen — a looping video in a background tab or below
    // the fold burns battery for nothing.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(video);

    doc.addEventListener('visibilitychange', () => {
      if (doc.hidden) video.pause();
    });
  }

  /* ======================================================================
     Parallax
     Subtle only. Large parallax offsets are the fastest way to make a site
     feel cheap, and they wreck scroll performance on mid-range phones.
     ====================================================================== */

  function initParallax() {
    if (REDUCED || !hasScrollTrigger) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const hero = $('[data-hero]');
    if (hero) {
      const media = $('.hero__media', hero);
      const content = $('.hero__content', hero);

      if (media) {
        window.gsap.to(media, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (content) {
        window.gsap.to(content, {
          yPercent: -8,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }

    // Section rules draw themselves in as they enter.
    $$('.rule span').forEach((bar) => {
      window.gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: '100%',
          ease: 'none',
          scrollTrigger: { trigger: bar.parentElement, start: 'top 95%', end: 'top 55%', scrub: true },
        }
      );
    });
  }

  /* ======================================================================
     Floating WhatsApp button
     Appears once the hero is behind you, so it never covers the primary CTA.
     ====================================================================== */

  function initFab() {
    const fab = $('[data-fab]');
    if (!fab) return;

    const show = () => fab.classList.add('is-visible');
    const hide = () => fab.classList.remove('is-visible');

    let ticking = false;
    const update = () => {
      if (window.scrollY > window.innerHeight * 0.6) show();
      else hide();
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ======================================================================
     Anchor links
     Routed through Lenis so in-page jumps use the same easing as the rest of
     the scrolling instead of snapping.
     ====================================================================== */

  function initAnchors() {
    doc.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      const target = doc.getElementById(id.slice(1)) || (id === '#top' ? doc.body : null);
      if (!target) return;

      e.preventDefault();
      const header = $('[data-header]');
      const offset = header ? -(header.offsetHeight + 12) : 0;
      scrollTo(target === doc.body ? 0 : target, offset);

      // Keep the URL and focus in sync for keyboard and screen-reader users.
      if (id !== '#top') {
        history.pushState(null, '', id);
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  }

  /* ======================================================================
     Contact form
     There is no backend. The form composes the enquiry and hands it to a
     channel the gym already reads — WhatsApp first, email as a fallback.
     Without JavaScript the form still submits as a plain mailto via its
     action attribute, so it degrades rather than failing silently.
     ====================================================================== */

  function initContactForm() {
    const form = $('[data-contact-form]');
    if (!form) return;

    const wa = form.getAttribute('data-wa');
    const email = form.getAttribute('data-email');
    if (!wa && !email) return;

    form.addEventListener('submit', (e) => {
      // Let the browser show its own validation messages first.
      if (!form.checkValidity()) return;

      e.preventDefault();

      const data = new FormData(form);
      const get = (k) => String(data.get(k) || '').trim();

      const lines = [];
      const labelFor = (name) => {
        const field = form.querySelector('[name="' + name + '"]');
        const label = field && field.id ? form.querySelector('label[for="' + field.id + '"]') : null;
        return label ? label.textContent.trim() : name;
      };

      ['name', 'phone', 'club', 'goal'].forEach((key) => {
        const value = get(key);
        if (value) lines.push(labelFor(key) + ': ' + value);
      });
      const message = get('message');
      if (message) lines.push('', message);

      const body = lines.join('\n');

      if (wa) {
        window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
      } else if (email) {
        const subject = doc.title;
        window.location.href =
          'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      }
    });
  }

  /* ======================================================================
     Current-year-safe external link hardening
     Any link that opens in a new tab gets rel="noopener" even if the markup
     forgot it, closing the window.opener hijacking vector.
     ====================================================================== */

  function hardenExternalLinks() {
    $$('a[target="_blank"]').forEach((a) => {
      const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      a.setAttribute('rel', rel.join(' '));
    });
  }

  /* ======================================================================
     Boot
     ====================================================================== */

  function init() {
    initSmoothScroll();
    initHeader();
    initMenu();
    initLangMenus();
    initReveals();
    initSplitHeadings();
    initCounters();
    initHeroVideo();
    initParallax();
    initFab();
    initAnchors();
    initContactForm();
    hardenExternalLinks();

    if (hasScrollTrigger) {
      // Images finishing later change the page height; refresh so every
      // trigger position stays correct.
      window.addEventListener('load', () => window.ScrollTrigger.refresh());
    }
  }

  // React to the motion preference changing mid-session.
  reduceMotion.addEventListener('change', (e) => {
    REDUCED = e.matches;
    if (!REDUCED) return;
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    if (hasScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill());
    $$('.reveal, [data-split="lines"]').forEach((el) => el.classList.add('is-in'));
    const video = $('[data-hero-video]');
    if (video) video.pause();
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
