/* ==========================================================================
   ISTAROTH.AI - Dynamic Interaction Controller
   Scroll reveal, stat counter rollups, mobile drawer, navbar effects,
   card mouse light glow
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ─── Scroll Reveal (with instant viewport reveal & fallback) ────── */
  function initReveal() {
    const revealEls = document.querySelectorAll('.sr, .reveal');
    if (!revealEls.length) return;

    // Check if IntersectionObserver is supported
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
        rootMargin: '0px 0px 50px 0px' // trigger slightly before it comes into view
      });

      revealEls.forEach((el) => {
        // If element is already in viewport on load, show immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('in', 'visible');
        } else {
          observer.observe(el);
        }
      });

      // Safety timeout: ensure everything reveals after 1.2s max in case of lag/slow scroll
      setTimeout(() => {
        revealEls.forEach(el => el.classList.add('in', 'visible'));
      }, 1200);
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
});

/* ─── Global Comparison Filter (Manual vs Autonomous AI) ───────── */
window.filterComp = function(type) {
  const tabs = document.querySelectorAll('.comp-tab');
  tabs.forEach(t => t.classList.remove('active'));

  const activeTab = document.getElementById(`tab-${type}`);
  if (activeTab) activeTab.classList.add('active');

  const cards = document.querySelectorAll('.comp-card');
  cards.forEach(card => {
    const isAi = card.classList.contains('highlight');
    if (type === 'all') {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    } else if (type === 'manual') {
      if (!isAi) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    } else if (type === 'ai') {
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
