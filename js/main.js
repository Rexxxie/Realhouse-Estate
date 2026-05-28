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
     SEARCH TABS & FIELD UX ENHANCEMENT
     (Hides Bedrooms & Property Type select fields and shows Size for Land category)
     ---------------------------------------------------------- */
  const searchTabs = document.querySelectorAll('.search-tab');
  const bedroomsField = document.getElementById('searchBedroomsField');
  const typeField = document.getElementById('searchTypeField');
  const measurementField = document.getElementById('searchMeasurementField');
  const allSelects = document.querySelectorAll('.search-box__form select');
  
  // Find the Property Type select dropdown dynamically
  const typeSelect = Array.from(allSelects).find(select => {
    return select.options[0] && select.options[0].textContent.includes('Property Type');
  });

  const updateSearchFields = (category) => {
    const cleanCategory = (category || '').toLowerCase().trim();
    
    if (cleanCategory === 'land') {
      // Land Mode: Hide Bedrooms, Hide Property Type, Show Size
      if (bedroomsField) bedroomsField.style.display = 'none';
      if (typeField) typeField.style.display = 'none';
      if (measurementField) measurementField.style.display = '';
    } else if (cleanCategory === 'commercial') {
      // Commercial Mode: Hide Bedrooms, Show Property Type, Hide Size
      if (bedroomsField) bedroomsField.style.display = 'none';
      if (typeField) typeField.style.display = '';
      if (measurementField) measurementField.style.display = 'none';
    } else {
      // Residential Modes (Buy, Rent, Shortlet): Show Bedrooms, Show Property Type, Hide Size
      if (bedroomsField) bedroomsField.style.display = '';
      if (typeField) typeField.style.display = '';
      if (measurementField) measurementField.style.display = 'none';
    }
  };

  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const tabName = tab.getAttribute('data-tab');
      updateSearchFields(tabName);
      
      // Auto-set the property type dropdown if it exists to match tab category
      if (typeSelect) {
        if (tabName === 'land') {
          typeSelect.value = 'Land';
        } else if (tabName === 'commercial') {
          typeSelect.value = 'Commercial';
        } else {
          typeSelect.value = ''; // Reset to default
        }
      }
    });
  });

  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      updateSearchFields(e.target.value);
    });
  }

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

  /* ----------------------------------------------------------
     PROPERTY DETAILS MODAL SYSTEM (Progressive Enhancement)
     ---------------------------------------------------------- */
  const propertiesData = {
    "Luxury 5-Bedroom Mansion": {
      location: "Mayfair, London",
      price: "£2,500,000",
      specs: [
        { icon: "fas fa-bed", value: "5 Beds" },
        { icon: "fas fa-bath", value: "6 Baths" },
        { icon: "fas fa-ruler-combined", value: "1,200 sqm" }
      ],
      image: "images/prop-mayfair-mansion.jpg",
      badges: ["<span class='badge badge--sale'>For Sale</span>", "<span class='badge badge--featured'>Featured</span>"],
      desc: "This ultra-luxury Georgian-style brick mansion situated in the heart of Mayfair represents the absolute pinnacle of luxury living in central London. Offering highly sophisticated classical interior design, high ceilings, underfloor heating, a private lift, and a landscaped private garden, this home has been completely refurbished to pristine architectural specifications.",
      amenities: ["Underfloor Heating", "Landscaped Garden", "Private Elevator", "24/7 Security", "Wine Cellar", "Smart Home Automation"],
      agent: {
        name: "Christopher Olajide",
        avatar: "agent-avatar av1"
      }
    },
    "4-Bed Semi-Detached Duplex": {
      location: "Richmond, London",
      price: "£7,000 <span>/mo</span>",
      specs: [
        { icon: "fas fa-bed", value: "4 Beds" },
        { icon: "fas fa-bath", value: "4 Baths" },
        { icon: "fas fa-ruler-combined", value: "450 sqm" }
      ],
      image: "images/prop-richmond-duplex.jpg",
      badges: ["<span class='badge badge--rent'>For Rent</span>"],
      desc: "An absolutely stunning Victorian semi-detached home nestled in one of Richmond's most tranquil residential streets. Designed over three floors, it boasts an elegant double reception room with high-end fireplaces, a grand open-plan kitchen/diner leading to a manicured garden, and close proximity to Richmond Park and top-performing schools.",
      amenities: ["Manicured Garden", "Victorian Fireplace", "Open-plan Kitchen", "Walk-in Wardrobe", "Allocated Parking", "Excellent Transport Links"],
      agent: {
        name: "Sarah Jenkins",
        avatar: "agent-avatar av2"
      }
    },
    "5-Bed Detached Duplex": {
      location: "New Town, Edinburgh",
      price: "£1,500,000",
      specs: [
        { icon: "fas fa-bed", value: "5 Beds" },
        { icon: "fas fa-bath", value: "5 Baths" },
        { icon: "fas fa-ruler-combined", value: "800 sqm" }
      ],
      image: "images/prop-edinburgh-duplex.jpg",
      badges: ["<span class='badge badge--sale'>For Sale</span>", "<span class='badge badge--new'>New</span>"],
      desc: "A breathtaking and highly prestigious classical gray sandstone townhouse in Edinburgh's historic New Town. Overlooking beautiful private gardens, the property blends spectacular architectural period details (including ornate plasterwork, sash windows, and working shutters) with a luxurious modern layout.",
      amenities: ["Classical Sandstone", "Ornate Plasterwork", "Garden Views", "Double Garage", "High-speed Fiber", "Basement Suite"],
      agent: {
        name: "Edward Sterling",
        avatar: "agent-avatar av3"
      }
    },
    "Luxury 3-Bed Penthouse": {
      location: "Canary Wharf, London",
      price: "£350 <span>/night</span>",
      specs: [
        { icon: "fas fa-bed", value: "3 Beds" },
        { icon: "fas fa-bath", value: "3 Baths" },
        { icon: "fas fa-ruler-combined", value: "380 sqm" }
      ],
      image: "images/prop-canary-penthouse.jpg",
      badges: ["<span class='badge badge--shortlet'>Short Let</span>", "<span class='badge badge--featured'>Featured</span>"],
      desc: "Experience spectacular dockside living from this ultra-modern high-rise glass penthouse. Situated on the top floor of a prestigious Canary Wharf tower, it offers breathtaking floor-to-ceiling panoramic views over London's skyline and the River Thames, complete with a wrapped glass terrace and private concierge services.",
      amenities: ["Panoramic Skyline Views", "Wrapped Glass Terrace", "24/7 Concierge", "Integrated Miele Appliances", "Private Gym & Spa Access", "Air Conditioning"],
      agent: {
        name: "Fiona Adler",
        avatar: "agent-avatar av4"
      }
    },
    "Residential Land – 2 Plots": {
      location: "Windsor, Berkshire",
      price: "£750,000",
      specs: [
        { icon: "fas fa-expand-arrows-alt", value: "1,200 sqm" },
        { icon: "fas fa-file-alt", value: "Freehold" },
        { icon: "fas fa-road", value: "Road Access" }
      ],
      image: "images/prop-windsor-land.jpg",
      badges: ["<span class='badge badge--land'>Land</span>"],
      desc: "A phenomenal opportunity to acquire a prime residential plot consisting of 2 premium land plots in beautiful, historic Windsor. Boasting direct highway road access, secure perimeter fencing, and full planning permission for two custom luxury detaches houses, this freehold land represents a rare investment opportunity.",
      amenities: ["Freehold Tenure", "Full Planning Permission", "Direct Road Access", "Water & Electricity Ready", "Secure Perimeter Fencing", "Near Windsor Great Park"],
      agent: {
        name: "Christopher Olajide",
        avatar: "agent-avatar av1"
      }
    },
    "3-Bed Terrace House": {
      location: "Richmond, London",
      price: "£450,000",
      specs: [
        { icon: "fas fa-bed", value: "3 Beds" },
        { icon: "fas fa-bath", value: "3 Baths" },
        { icon: "fas fa-ruler-combined", value: "220 sqm" }
      ],
      image: "images/prop-richmond-terrace.jpg",
      badges: ["<span class='badge badge--sale'>For Sale</span>", "<span class='badge badge--new'>New Dev</span>"],
      desc: "A highly charming and beautifully presented traditional brick terraced townhouse in highly popular Richmond. Providing stylish light-filled interiors, this property offers three double bedrooms, a delightful fitted kitchen, and a private rear patio. Ideal for young professionals and growing families.",
      amenities: ["Traditional Brick Facade", "Private Rear Patio", "Modern Fitted Kitchen", "Sash Windows", "Close to High Street", "Attic Storage Space"],
      agent: {
        name: "Sarah Jenkins",
        avatar: "agent-avatar av2"
      }
    },
    "Modern 2-Bed Apartment": {
      location: "West End, Edinburgh",
      price: "£2,500 <span>/mo</span>",
      specs: [
        { icon: "fas fa-bed", value: "2 Beds" },
        { icon: "fas fa-bath", value: "2 Baths" },
        { icon: "fas fa-ruler-combined", value: "140 sqm" }
      ],
      image: "images/prop-edinburgh-apartment.jpg",
      badges: ["<span class='badge badge--rent'>For Rent</span>"],
      desc: "A highly sophisticated modern 2-bedroom luxury apartment located in Edinburgh's exclusive West End. Featuring clean contemporary lines, double glazing, premium engineered oak flooring, designer bathroom suites, and built-in wardrobes, this ready-to-move-in home defines high-quality urban living.",
      amenities: ["Oak Hardwood Floors", "Double Glazing", "Designer Bathrooms", "Built-in Wardrobes", "Private Resident Parking", "Secure Intercom System"],
      agent: {
        name: "Edward Sterling",
        avatar: "agent-avatar av3"
      }
    },
    "5-Floor Office Complex": {
      location: "City of London",
      price: "£1,800,000",
      specs: [
        { icon: "fas fa-building", value: "5 Floors" },
        { icon: "fas fa-car", value: "40 Parking" },
        { icon: "fas fa-ruler-combined", value: "3,200 sqm" }
      ],
      image: "images/prop-london-office.jpg",
      badges: ["<span class='badge badge--sale'>Commercial</span>"],
      desc: "A premier commercial glass office complex strategically positioned in the high-stakes City of London financial district. Offering 5 floors of high-performance flexible workspace, high-speed lift access, robust central climate control, and a subterranean car park with 40 allocated spaces.",
      amenities: ["Financial District Location", "Flexible Layout Floors", "High-speed Passenger Lifts", "Underground Parking (40 bays)", "Central Climate Control", "Executive Boardrooms"],
      agent: {
        name: "Edward Sterling",
        avatar: "agent-avatar av3"
      }
    },
    "4-Bed Detached Bungalow": {
      location: "Wilmslow, Cheshire",
      price: "£950,000",
      specs: [
        { icon: "fas fa-bed", value: "4 Beds" },
        { icon: "fas fa-bath", value: "4 Baths" },
        { icon: "fas fa-ruler-combined", value: "600 sqm" }
      ],
      image: "images/prop-wilmslow-bungalow.jpg",
      badges: ["<span class='badge badge--sale'>For Sale</span>"],
      desc: "An absolutely stunning and highly exclusive mid-century modern detached bungalow situated in prestigious Wilmslow, Cheshire. Offering a magnificent layout with glass walls framing a beautifully manicured landscaped garden, double garaging, and top-tier luxury finishing throughout.",
      amenities: ["Mid-Century Modern Architecture", "Glass Walls", "Landscaped Rear Garden", "Double Garaging", "Underfloor Heating", "Premium Cheshire Location"],
      agent: {
        name: "Christopher Olajide",
        avatar: "agent-avatar av1"
      }
    }
  };

  const detailsDialog = document.getElementById('propertyDetailsDialog');
  const closeDetailsBtn = document.getElementById('closePropertyDialogBtn');

  if (detailsDialog && closeDetailsBtn) {
    // Open Dialog Function
    const openPropertyModal = (card) => {
      const titleEl = card.querySelector('.property-card__title');
      if (!titleEl) return;
      const title = titleEl.textContent.trim();
      const data = propertiesData[title];
      if (!data) return;

      // Populate Elements
      document.getElementById('modalPropertyImg').src = data.image;
      document.getElementById('modalPropertyImg').alt = title;
      document.getElementById('modalPropertyTitle').textContent = title;
      document.getElementById('modalPropertyPrice').innerHTML = data.price;
      document.getElementById('modalPropertyLocationTag').textContent = data.location;
      document.getElementById('modalPropertyDesc').textContent = data.desc;

      // Populate Specs Dynamically with Type-Specific Icons
      const specsContainer = document.getElementById('modalPropertySpecs');
      if (specsContainer) {
        specsContainer.innerHTML = data.specs.map(spec => `
          <div class="spec-item">
            <i class="${spec.icon}"></i>
            <span>${spec.value}</span>
          </div>
        `).join('');
      }

      // Populate Badges
      const badgesContainer = document.getElementById('modalPropertyBadges');
      badgesContainer.innerHTML = data.badges.join('');

      // Populate Amenities
      const amenitiesContainer = document.getElementById('modalPropertyAmenities');
      amenitiesContainer.innerHTML = data.amenities.map(amenity => `<li>${amenity}</li>`).join('');

      // Populate Agent details
      document.getElementById('modalPropertyAgentName').textContent = data.agent.name;
      const avatarEl = document.getElementById('modalPropertyAgentAvatar');
      avatarEl.className = data.agent.avatar;

      // WhatsApp Dynamic Link Setup
      const whatsappText = `Hi, I am interested in the ${title} in ${data.location}. Could you please send me more details?`;
      document.getElementById('modalPropertyWhatsappCta').href = `https://wa.me/447796370134?text=${encodeURIComponent(whatsappText)}`;

      // Email Dynamic Link Setup
      const emailSubject = `Enquiry: ${title}`;
      const emailBody = `Hi,\n\nI am highly interested in the ${title} in ${data.location}.\nCould you please provide more details and schedule a virtual structural survey or viewing for this listing?\n\nKind regards,\n[Your Name]`;
      document.getElementById('modalPropertyEmailCta').href = `mailto:info@rexleyadio.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // Open Modal
      detailsDialog.showModal();
      document.body.style.overflow = 'hidden'; // Trap body scroll
    };

    // Close Dialog Function
    const closePropertyModal = () => {
      detailsDialog.close();
    };

    // Handle close dialog event
    closeDetailsBtn.addEventListener('click', closePropertyModal);
    detailsDialog.addEventListener('close', () => {
      document.body.style.overflow = ''; // Release body scroll
    });

    // Fallback for click outside modal to dismiss (light-dismiss backdrop click)
    detailsDialog.addEventListener('click', (event) => {
      if (event.target !== detailsDialog) return;
      const rect = detailsDialog.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) {
        closePropertyModal();
      }
    });

    // Intercept Details Click Events (Progressive Enhancement)
    document.addEventListener('click', (event) => {
      const detailsCta = event.target.closest('.property-card__cta, .property-card__overlay .btn');
      if (!detailsCta) return;

      const card = detailsCta.closest('.property-card');
      if (card) {
        event.preventDefault();
        openPropertyModal(card);
      }
    });
  }

});
