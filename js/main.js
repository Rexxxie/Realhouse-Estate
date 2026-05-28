/* ============================================================
   Realhouse Estate – main.js
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     STICKY HEADER
     (header--solid pages stay solid; transparent pages scroll)
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  const updateHeader = () => {
    if (header.classList.contains('header--solid')) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ----------------------------------------------------------
     MOBILE NAV TOGGLE
  ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  const openMenu = () => {
    navMenu.classList.add('open');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-expanded', 'true');

    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
    spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
    spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');

    const spans = navToggle.querySelectorAll('span');
    spans[0].style.cssText = '';
    spans[1].style.cssText = '';
    spans[2].style.cssText = '';
  };

  navToggle.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ----------------------------------------------------------
     ACTIVE NAV LINK — multi-page version
     On inner pages the active class is set in HTML.
     On the home page we also highlight by scroll.
  ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0 && !header.classList.contains('header--solid')) {
    const highlightNav = () => {
      const scrollY = window.scrollY + 100;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav__link[href="#${id}"]`);
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
  }

  /* ----------------------------------------------------------
     HERO SLIDE SHOW
  ---------------------------------------------------------- */
  const slides = document.querySelectorAll('.hero__slide');
  let currentSlide = 0;

  const nextSlide = () => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  };

  if (slides.length > 1) {
    setInterval(nextSlide, 5000);
  }

  /* ----------------------------------------------------------
     HERO COUNTER ANIMATION
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.hero__stat-number');
  let countersStarted = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        counter.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  };

  // Trigger when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('home');
  if (heroSection) heroObserver.observe(heroSection);

  /* ----------------------------------------------------------
     SEARCH TABS
  ---------------------------------------------------------- */
  const searchTabs = document.querySelectorAll('.search-tab');

  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ----------------------------------------------------------
     PROPERTY FILTER PILLS
  ---------------------------------------------------------- */
  const pills = document.querySelectorAll('.pill');
  const propertyCards = document.querySelectorAll('.property-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      propertyCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';

        if (filter === 'all' || category.includes(filter)) {
          card.style.display = '';
          // Re-trigger animation
          card.classList.remove('reveal', 'revealed');
          void card.offsetWidth;
          card.classList.add('reveal');
          setTimeout(() => card.classList.add('revealed'), 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ----------------------------------------------------------
     WISHLIST TOGGLE
  ---------------------------------------------------------- */
  document.querySelectorAll('.property-card__wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        icon.style.color = '#e11d48';
        showToast('Added to favourites!', 'success');
      } else {
        icon.className = 'far fa-heart';
        icon.style.color = '';
        showToast('Removed from favourites', 'success');
      }
    });
  });

  /* ----------------------------------------------------------
     TESTIMONIALS SLIDER
  ---------------------------------------------------------- */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    let visibleCount = getVisibleCount();
    let currentIndex = 0;
    const totalGroups = Math.ceil(cards.length / visibleCount);

    function getVisibleCount() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const groups = Math.ceil(cards.length / getVisibleCount());
      for (let i = 0; i < groups; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      visibleCount = getVisibleCount();
      const groups = Math.ceil(cards.length / visibleCount);
      currentIndex = Math.max(0, Math.min(index, groups - 1));

      cards.forEach((card, i) => {
        const start = currentIndex * visibleCount;
        const end = start + visibleCount;
        card.style.display = (i >= start && i < end) ? '' : 'none';
      });

      document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    buildDots();
    goTo(0);

    window.addEventListener('resize', () => {
      buildDots();
      goTo(0);
    });

    // Auto advance
    setInterval(() => {
      const groups = Math.ceil(cards.length / getVisibleCount());
      goTo((currentIndex + 1) % groups);
    }, 6000);
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL (Intersection Observer)
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.property-card, .service-card, .agent-card, .testimonial-card, .process-step, .city-card, .contact-detail'
  );

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Observe all reveal elements (both programmatically added and hardcoded in HTML)
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     ABOUT SECTION REVEAL
  ---------------------------------------------------------- */
  const aboutElements = document.querySelectorAll('.about-content, .about-visual, .check-item');
  aboutElements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ----------------------------------------------------------
     CONTACT FORM
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#16a34a';

        showToast('Thank you! We\'ll get back to you within 24 hours.', 'success');

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          contactForm.reset();
        }, 3500);
      }, 1800);
    });
  }

  /* ----------------------------------------------------------
     NEWSLETTER FORM
  ---------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed! You\'ll receive property alerts soon.', 'success');
      newsletterForm.reset();
    });
  }

  /* ----------------------------------------------------------
     BACK TO TOP BUTTON
  ---------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     SMOOTH SCROLL FOR ANCHOR LINKS
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     TOAST NOTIFICATION
  ---------------------------------------------------------- */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 420);
    }, 4000);
  }

  /* ----------------------------------------------------------
     CITY CARDS — navigate to properties page
  ---------------------------------------------------------- */
  document.querySelectorAll('.city-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      window.location.href = 'properties.html';
    });
  });

  /* ----------------------------------------------------------
     FAQ ACCORDION (contact page)
  ---------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ----------------------------------------------------------
     ABOUT PAGE — stat counters (triggered on scroll)
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    let statsStarted = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsStarted) {
          statsStarted = true;
          statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            const start = performance.now();
            const update = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - (1 - progress) * (1 - progress);
              el.textContent = Math.floor(eased * target).toLocaleString();
              if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
          });
        }
      });
    }, { threshold: 0.3 });
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);
  }

  /* ----------------------------------------------------------
     VIEW TOGGLE (properties page: grid / list)
  ---------------------------------------------------------- */
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('propertiesGrid');
      if (!grid) return;
      if (btn.getAttribute('data-view') === 'list') {
        grid.style.gridTemplateColumns = '1fr';
      } else {
        grid.style.gridTemplateColumns = '';
      }
    });
  });

  /* ----------------------------------------------------------
     PAGINATION (properties page)
  ---------------------------------------------------------- */
  document.querySelectorAll('.page-btn:not(.page-btn--prev):not(.page-btn--next)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

});
