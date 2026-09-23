/* ==========================================================================
   ISTAROTH.AI - Dynamic Interaction Controller
   Scroll reveal, stat counter rollups, mobile drawer, navbar effects,
   card mouse light glow
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ─── Scroll Reveal (Pure IntersectionObserver) ─────────────────── */
  function initReveal() {
    const revealEls = document.querySelectorAll('.sr, .reveal');
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in', 'visible');
            observer.unobserve(e.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px 60px 0px'
      });

      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in', 'visible'));
    }
  }
  initReveal();

  /* ─── Navbar Scroll Blur Effect ─────────────────────────────────── */
  function initNavbar() {
    const navbar = document.getElementById('navbar') || document.querySelector('.nav');
    if (!navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
  initNavbar();

  /* ─── Mobile Drawer Toggle (Handles both #ham and #nav-burger) ─── */
  function initDrawer() {
    const burger = document.getElementById('ham') || document.getElementById('nav-burger');
    const drawer = document.getElementById('drawer') || document.getElementById('nav-drawer');
    if (!burger || !drawer) return;

    burger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking any link in drawer
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
  initDrawer();

  /* ─── Stat Counter Rollup ───────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const runCount = (el) => {
      const target = parseFloat(el.dataset.count);
      if (isNaN(target)) return;
      const duration = 1600;
      const isDecimal = target % 1 !== 0;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = eased * target;
        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target.toString();
        }
      }
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCount(e.target);
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });

      counters.forEach((el) => observer.observe(el));
    } else {
      counters.forEach(runCount);
    }
  }
  initCounters();

  /* ─── Active Navbar Link ────────────────────────────────────────── */
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-menu a, .drawer a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }
  initActiveNav();

  /* ─── Subtle Card Mouse Spotlight Effect (Cosmiron aesthetic) ─── */
  function initCardSpotlight() {
    const cards = document.querySelectorAll('.card, .p-card, .why-card, .practice-card, .service-card, .comp-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
  initCardSpotlight();

  /* ─── High-Performance Scroll-Driven Headings Color Scrub ──────── */
  function initScrollColorScrub() {
    const scrubEls = document.querySelectorAll('.sec-head h2, .wwd-services h2, .page-hero h1, .scroll-scrub-title');
    if (!scrubEls.length) return;

    if (!('IntersectionObserver' in window)) {
      scrubEls.forEach(el => el.style.setProperty('--scroll-p', '60%'));
      return;
    }

    const visibleEls = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleEls.add(entry.target);
        } else {
          visibleEls.delete(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px 100px 0px'
    });

    scrubEls.forEach(el => observer.observe(el));

    let ticking = false;
    function updateScrub() {
      if (visibleEls.size === 0) {
        ticking = false;
        return;
      }
      const windowH = window.innerHeight || 800;
      visibleEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const start = windowH * 0.92;
        const end = windowH * 0.25;
        let progress = (start - rect.top) / (start - end);
        progress = Math.max(0, Math.min(1.15, progress));
        el.style.setProperty('--scroll-p', `${(progress * 100).toFixed(1)}%`);
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking && visibleEls.size > 0) {
        requestAnimationFrame(updateScrub);
        ticking = true;
      }
    }, { passive: true });

    // Initial calculation
    requestAnimationFrame(updateScrub);
  }
  initScrollColorScrub();
});

/* ─── Global Comparison Filter (Manual vs Autonomous AI) ───────── */
window.filterComp = function(type) {
  const tabs = document.querySelectorAll('.comp-tab');
  const targetTab = document.getElementById(`tab-${type}`);
  const isAlreadyActive = targetTab && targetTab.classList.contains('active');

  tabs.forEach(t => t.classList.remove('active'));

  let activeType = type;
  if (isAlreadyActive) {
    // Tapping the active tab deselects it and shows all cards
    activeType = 'all';
  } else if (targetTab) {
    targetTab.classList.add('active');
  }

  const cards = document.querySelectorAll('.comp-card');
  cards.forEach(card => {
    const isAi = card.classList.contains('highlight');
    if (activeType === 'all') {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    } else if (activeType === 'manual') {
      if (!isAi) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    } else if (activeType === 'ai') {
      if (isAi) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    }
  });
};
