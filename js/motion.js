/* ============================================================
   REALHOUSE ESTATE — CINEMATIC MOTION ENGINE
   Scroll choreography layer. Progressive enhancement only:
   if GSAP/Lenis fail to load, the site renders fully and
   nothing is left hidden.
   ============================================================ */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const root = document.documentElement;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ----------------------------------------------------------
     Marquee — clone the track so the -50% loop is seamless
     regardless of how many items the markup has.
     ---------------------------------------------------------- */
  function primeMarquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      if (track.dataset.cloned) return;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = 'true';
    });
  }

  /* ----------------------------------------------------------
     Page transition curtain (also the first-load intro)
     ---------------------------------------------------------- */
  function buildCurtain() {
    const curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.innerHTML = '<span class="curtain__mark">Realhouse<em>Estate</em></span>';
    document.body.appendChild(curtain);
    return curtain;
  }

  function wirePageTransitions(curtain) {
    document.addEventListener('click', e => {
      /* Something already handled this click — e.g. main.js intercepting a
         "Details" link to open the property modal. Never navigate over it. */
      if (e.defaultPrevented) return;

      const link = e.target.closest('a');
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('http')) return;

      e.preventDefault();
      gsap.set(curtain, { yPercent: 100, autoAlpha: 1 });
      gsap.timeline()
        .to(curtain, { yPercent: 0, duration: 0.7, ease: 'power4.inOut' })
        .to(curtain.querySelector('.curtain__mark'),
            { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.35')
        .call(() => { window.location.href = href; });
    });
  }

  /* ----------------------------------------------------------
     Word-level text splitting (preserves .highlight spans, <br>)
     ---------------------------------------------------------- */
  function splitWords(rootEl) {
    if (rootEl.dataset.split) return Array.from(rootEl.querySelectorAll('.word-mask > span'));
    const targets = [];

    (function walk(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          if (!child.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
            const mask = document.createElement('span');
            mask.className = 'word-mask';
            const inner = document.createElement('span');
            inner.textContent = part;
            mask.appendChild(inner);
            frag.appendChild(mask);
            targets.push(inner);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(rootEl);

    rootEl.dataset.split = 'true';
    return targets;
  }

  /* ----------------------------------------------------------
     Custom cursor — dot + lagging ring
     ---------------------------------------------------------- */
  function initCursor() {
    if (isTouch) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

    window.addEventListener('mousemove', e => {
      root.classList.add('cursor-active');
      dx(e.clientX); dy(e.clientY);
      rx(e.clientX); ry(e.clientY);
    });

    document.addEventListener('mouseover', e => {
      const hit = e.target.closest('a, button, .property-card, .city-card, .search-tab, .pill, input, select, textarea');
      root.classList.toggle('cursor-hover', !!hit);
    });

    document.addEventListener('mouseleave', () => root.classList.remove('cursor-active'));
  }

  /* ----------------------------------------------------------
     Scroll progress rail
     ---------------------------------------------------------- */
  function initRail() {
    const rail = document.createElement('div');
    rail.className = 'scroll-rail';
    rail.innerHTML = '<div class="scroll-rail__fill"></div>';
    document.body.appendChild(rail);
    const fill = rail.firstElementChild;

    gsap.to(fill, {
      width: '100%',
      ease: 'none',
      scrollTrigger: { start: 0, end: () => document.body.scrollHeight - window.innerHeight, scrub: 0.3 }
    });
  }

  /* ----------------------------------------------------------
     Hero — pinned, bg scales up, content lifts and dissolves
     ---------------------------------------------------------- */
  function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const bg = hero.querySelector('.hero__bg');
    const content = hero.querySelector('.hero__content');
    const scrollCue = hero.querySelector('.hero__scroll');

    /* Entrance */
    const title = hero.querySelector('.hero__title');
    const intro = gsap.timeline({ delay: 0.35 });

    if (title) {
      intro.from(splitWords(title), {
        yPercent: 118, duration: 1.15, ease: 'power4.out', stagger: 0.045
      }, 0);
    }
    intro
      .from(hero.querySelector('.hero__badge'), { autoAlpha: 0, y: 22, duration: 0.8, ease: 'power3.out' }, 0.1)
      .from(hero.querySelector('.hero__subtitle'), { autoAlpha: 0, y: 26, duration: 0.9, ease: 'power3.out' }, 0.55)
      .from(hero.querySelector('.search-box'), { autoAlpha: 0, y: 44, duration: 1.1, ease: 'power4.out' }, 0.7)
      .from(hero.querySelectorAll('.hero__stat'), { autoAlpha: 0, y: 26, duration: 0.8, ease: 'power3.out', stagger: 0.09 }, 0.9)
      .from(scrollCue, { autoAlpha: 0, duration: 0.7 }, 1.2);

    /* Pinned scroll sequence — the signature cinematic move.
       Skipped on small screens where pinning fights mobile chrome. */
    if (window.innerWidth < 768) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=95%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1
      }
    });

    tl.to(bg, { scale: 1.28, ease: 'none' }, 0)
      .to(content, { yPercent: -18, autoAlpha: 0, filter: 'blur(6px)', ease: 'power1.in' }, 0)
      .to(scrollCue, { autoAlpha: 0, ease: 'none' }, 0);
  }

  /* ----------------------------------------------------------
     Section cinema — every section gets the hero's scroll treatment.

     Sections that fit the viewport are genuinely pinned, like the hero.
     Taller ones can't be: pinning a 1400px section inside a 900px window
     makes its lower third unreachable while the lock is held. Those get the
     same scrub-driven push-in and dissolve without the lock, so the feel is
     identical and nothing is cut off.
     ---------------------------------------------------------- */
  function initSectionCinema() {
    const SECTIONS = document.querySelectorAll(
      '.section, .cities-section, .process-section, .stats-section, .cta-banner, ' +
      '.rating-summary-section, .search-bar-section, .policy-section'
    );

    SECTIONS.forEach(section => {
      if (section.closest('.hero')) return;

      /* A transformed ancestor becomes the containing block for its
         descendants, which breaks position:sticky children outright. */
      if (section.querySelector('.blog-sidebar, .policy-sidebar')) return;

      const inner = section.querySelector('.container');
      if (!inner) return;

      const fitsViewport = section.offsetHeight <= window.innerHeight * 1.02;
      gsap.set(inner, { willChange: 'transform, opacity' });

      if (fitsViewport && window.innerWidth >= 768) {
        /* Pinned beat — the section locks while its content pushes in,
           then lifts, tilts back and dissolves. Same recipe as the hero. */
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=90%',
            pin: true,
            pinSpacing: true,
            scrub: 0.55,
            anticipatePin: 1
          }
        })
          .fromTo(inner,
            { scale: 0.86, y: 90, rotationX: 9, transformPerspective: 1400, transformOrigin: 'center top' },
            { scale: 1, y: 0, rotationX: 0, ease: 'none', duration: 0.45 }, 0)
          .to(inner,
            { scale: 0.9, y: -90, rotationX: -7, autoAlpha: 0, ease: 'none', duration: 0.4 }, 0.6);
        return;
      }

      /* Too tall to pin — scrub the push-in as it arrives... */
      gsap.fromTo(inner,
        { scale: 0.86, y: 130, autoAlpha: 0, rotationX: 9, transformPerspective: 1400, transformOrigin: 'center top' },
        {
          scale: 1, y: 0, autoAlpha: 1, rotationX: 0, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 28%', scrub: 0.55 }
        });

      /* ...and the dissolve as it leaves. Starts at 'bottom 45%' rather than
         earlier so content stays fully legible while it is still centre-screen. */
      gsap.to(inner, {
        scale: 0.9, y: -100, rotationX: -7, autoAlpha: 0,
        transformPerspective: 1400, transformOrigin: 'center bottom', ease: 'none',
        scrollTrigger: { trigger: section, start: 'bottom 45%', end: 'bottom top', scrub: 0.55 }
      });
    });
  }

  /* ----------------------------------------------------------
     Section titles — masked word reveal
     ---------------------------------------------------------- */
  function initTitles() {
    document.querySelectorAll('.section__title, .page-banner__content h1, .cta-banner h2, .about-content h2, .contact-info h2')
      .forEach(el => {
        const words = splitWords(el);
        if (!words.length) return;
        gsap.from(words, {
          yPercent: 118,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.035,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

    document.querySelectorAll('.section__tag, .section__subtitle').forEach(el => {
      gsap.from(el, {
        autoAlpha: 0, y: 20, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });
  }

  /* ----------------------------------------------------------
     Card / block reveals — staggered per grid
     ---------------------------------------------------------- */
  function initReveals() {
    const GRIDS = [
      '.properties-grid', '.cities-grid', '.services-grid', '.why-grid',
      '.mv-grid', '.team-grid', '.awards-grid', '.offices-grid',
      '.testimonials-full-grid', '.video-grid', '.blog-grid',
      '.stats-grid', '.process-steps', '.faq-list', '.about-checklist'
    ];

    /* fromTo (not from) with an explicit visible end state — `.reveal`
       elements would otherwise resolve their end value to whatever the
       stylesheet says and animate 0 -> 0. */
    const revealIn = (targets, trigger, opts = {}) =>
      gsap.fromTo(targets,
        { autoAlpha: 0, y: opts.y || 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: opts.duration || 1,
          ease: 'power3.out',
          stagger: opts.stagger || 0,
          clearProps: 'transform',
          scrollTrigger: { trigger, start: opts.start || 'top 86%' }
        });

    GRIDS.forEach(sel => {
      document.querySelectorAll(sel).forEach(grid => {
        const kids = Array.from(grid.children);
        if (!kids.length) return;
        revealIn(kids, grid, { y: 56, stagger: 0.09, start: 'top 85%' });
      });
    });

    /* Anything still tagged .reveal that a grid did not cover */
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.closest(GRIDS.join(','))) return;
      revealIn(el, el, { y: 44, duration: 0.9, start: 'top 88%' });
    });

    /* Standalone blocks */
    document.querySelectorAll('.about-visual, .contact-form-wrap, .rating-summary, .blog-hero, .search-box--flat, .policy-content > *')
      .forEach(el => revealIn(el, el, { y: 40, start: 'top 88%' }));
  }

  /* ----------------------------------------------------------
     Multi-layer parallax — depth on scroll
     ---------------------------------------------------------- */
  function initParallax() {
    /* Inner-page banners drift slower than the page */
    document.querySelectorAll('.page-banner__bg').forEach(bg => {
      gsap.to(bg, {
        yPercent: 16, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: bg.closest('.page-banner'), start: 'top top', end: 'bottom top', scrub: 0.5 }
      });
    });

    /* Property + city imagery drifts inside its frame */
    document.querySelectorAll('.property-card__image img, .city-card__bg, .blog-card__thumb').forEach(img => {
      gsap.fromTo(img,
        { yPercent: -5 },
        {
          yPercent: 5, ease: 'none',
          scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
    });

    /* CTA glow field counter-moves */
    document.querySelectorAll('.cta-banner__bg').forEach(bg => {
      gsap.fromTo(bg, { yPercent: -12 }, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: bg.closest('.cta-banner'), start: 'top bottom', end: 'bottom top', scrub: 0.7 }
      });
    });
  }

  /* ----------------------------------------------------------
     Tone morph — the page background crossfades dark <-> light
     as designated sections take the frame.
     ---------------------------------------------------------- */
  function initToneMorph() {
    const LIGHT = '.section--alt, .process-section, .rating-summary-section, .policy-section';
    document.querySelectorAll(LIGHT).forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: self => root.classList.toggle('tone-lift', self.isActive)
      });
    });
  }

  /* ----------------------------------------------------------
     Card interaction — mouse-tracked 3D tilt + press feedback

     The tilt is driven from JS rather than CSS because an inline transform
     always beats a stylesheet :hover rule; the lift has to live here too or
     it would simply be overwritten.
     ---------------------------------------------------------- */
  function initCardInteraction() {
    const CARDS = '.property-card, .service-card, .city-card, .blog-card, .testimonial-card, .team-card, .office-card, .mv-card';

    document.querySelectorAll(CARDS).forEach(card => {
      const isProperty = card.classList.contains('property-card');

      if (!isTouch) {
        const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
        const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });

        gsap.set(card, { transformPerspective: 1000, transformOrigin: 'center' });

        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          rotY(dx * 9);
          rotX(-dy * 9);
        });

        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -14, scale: 1.03, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
        });

        card.addEventListener('mouseleave', () => {
          rotY(0); rotX(0);
          gsap.to(card, { y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' });
        });
      }

      /* Press feedback — the card gives under the click */
      card.addEventListener('pointerdown', () => {
        gsap.to(card, { scale: 0.97, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt =>
        card.addEventListener(evt, () => {
          gsap.to(card, { scale: isTouch ? 1 : 1.03, duration: 0.5, ease: 'back.out(2.2)', overwrite: 'auto' });
        }));

      if (!isProperty) return;

      /* Wishlist heart — pop with a ring burst */
      const heart = card.querySelector('.property-card__wishlist');
      if (heart) {
        heart.addEventListener('click', e => {
          e.stopPropagation();
          gsap.fromTo(heart,
            { scale: 0.6 },
            { scale: 1, duration: 0.75, ease: 'elastic.out(1, 0.4)' });

          const ring = document.createElement('span');
          Object.assign(ring.style, {
            position: 'absolute', inset: '0', borderRadius: '50%',
            border: '2px solid #E15A32', pointerEvents: 'none'
          });
          heart.appendChild(ring);
          gsap.to(ring, {
            scale: 2.4, autoAlpha: 0, duration: 0.7, ease: 'power2.out',
            onComplete: () => ring.remove()
          });
        });
      }
    });
  }

  /* ----------------------------------------------------------
     Property modal — FLIP the card's photo into the dialog

     main.js owns opening the dialog. This measures the card image before
     that happens and the modal image straight after, then flies a clone
     between the two so the photo appears to physically expand.
     ---------------------------------------------------------- */
  function initModalFlip() {
    const dialog = document.getElementById('propertyDetailsDialog');
    if (!dialog) return;

    document.addEventListener('click', e => {
      const cta = e.target.closest('.property-card__cta, .property-card__overlay .btn');
      if (!cta) return;

      const card = cta.closest('.property-card');
      const source = card && card.querySelector('.property-card__image img');
      if (!source) return;

      /* FIRST — measure before main.js opens the dialog */
      const first = source.getBoundingClientRect();

      requestAnimationFrame(() => {
        if (!dialog.open) return;                       // main.js declined to open it
        const target = document.getElementById('modalPropertyImg');
        if (!target) return;

        const last = target.getBoundingClientRect();
        if (!last.width || !last.height) return;        // nothing to fly toward

        const clone = document.createElement('img');
        clone.src = target.src || source.src;
        Object.assign(clone.style, {
          position: 'fixed', margin: '0', objectFit: 'cover', zIndex: '10001',
          left: `${first.left}px`, top: `${first.top}px`,
          width: `${first.width}px`, height: `${first.height}px`,
          borderRadius: '16px', pointerEvents: 'none'
        });

        /* showModal() puts the dialog in the browser's top layer, which paints
           above every normal stacking context — including its own backdrop. A
           clone parented to <body> would fly behind it no matter the z-index,
           so it has to be a child of the dialog, with overflow unclipped for
           the part of the flight that happens outside the dialog's bounds. */
        const prevOverflow = dialog.style.overflow;
        dialog.style.overflow = 'visible';
        dialog.appendChild(clone);

        /* Hide the real pieces while the clone travels */
        gsap.set(target, { autoAlpha: 0 });
        gsap.set(dialog.querySelector('.modal-details'), { autoAlpha: 0, x: 40 });

        gsap.timeline({
          onComplete: () => {
            clone.remove();
            dialog.style.overflow = prevOverflow;
            gsap.set(target, { autoAlpha: 1 });
          }
        })
          .to(clone, {
            left: last.left, top: last.top,
            width: last.width, height: last.height,
            borderRadius: 0,
            duration: 0.75, ease: 'power4.inOut'
          })
          .to(dialog.querySelector('.modal-details'), {
            autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out'
          }, 0.3);
      });
    });

    /* Reset, so a reopened dialog is never left mid-animation */
    dialog.addEventListener('close', () => {
      gsap.set([dialog.querySelector('.modal-details'), document.getElementById('modalPropertyImg')],
        { clearProps: 'all' });
    });
  }

  /* ----------------------------------------------------------
     Magnetic buttons
     ---------------------------------------------------------- */
  function initMagnetic() {
    if (isTouch) return;

    document.querySelectorAll('.btn, .nav__logo-icon, .back-to-top, .social-btn, .footer-socials a')
      .forEach(el => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

        el.addEventListener('mousemove', e => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.42);
        });
        el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
      });
  }

  /* ----------------------------------------------------------
     Smooth scroll (Lenis) wired into ScrollTrigger
     ---------------------------------------------------------- */
  function initLenis() {
    if (typeof window.Lenis === 'undefined') return null;

    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Anchor links + back-to-top go through Lenis */
    document.addEventListener('click', e => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor && anchor.getAttribute('href').length > 1) {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      }
      if (e.target.closest('#backToTop')) lenis.scrollTo(0);
    });

    /* The modal must not scroll the page behind it */
    const dialog = document.getElementById('propertyDetailsDialog');
    if (dialog) {
      new MutationObserver(() => dialog.open ? lenis.stop() : lenis.start())
        .observe(dialog, { attributes: true, attributeFilter: ['open'] });
    }

    return lenis;
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  function boot() {
    primeMarquee();

    if (!hasGSAP || REDUCED) {
      /* No motion layer — make sure nothing stays hidden. */
      root.classList.remove('motion-ready');
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    root.classList.add('motion-ready');

    const curtain = buildCurtain();
    gsap.set(curtain, { yPercent: 0 });

    initLenis();
    initCursor();
    initRail();
    initHero();
    initSectionCinema();
    initTitles();
    initReveals();
    initParallax();
    initToneMorph();
    initCardInteraction();
    initModalFlip();
    initMagnetic();

    /* Lift the intro curtain */
    gsap.timeline({ delay: 0.15 })
      .to(curtain.querySelector('.curtain__mark'), { autoAlpha: 0, y: -18, duration: 0.5, ease: 'power2.in' })
      .to(curtain, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.15')
      .set(curtain, { autoAlpha: 0 });

    wirePageTransitions(curtain);

    /* Images settle late, so recalculate once everything has loaded — but only
       if the visitor is still at the top. Remote imagery can finish long after
       they have started scrolling, and refreshing mid-scroll past a pinned
       section yanks the page backwards. */
    window.addEventListener('load', () => {
      if (window.scrollY < 80) ScrollTrigger.refresh();
    });
  }

  /* motion-ready is set before first paint so .reveal elements never flash */
  if (hasGSAP && !REDUCED) root.classList.add('motion-ready');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
