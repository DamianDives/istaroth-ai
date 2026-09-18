/* ==========================================================================
   ISTAROTH.AI — CORE APPLICATION & INTERACTIVE ENGINES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHudFilter();
  initBidIntelSwitcher();
  initRoiCalculator();
  initDiagnosticModal();
  initPortfolioFilter();
  initScrollReveal();
  initCardSpotlight();
  initPreviewTabs();
});

/* --------------------------------------------------------------------------
   1. HERO TELEMETRY HUD FILTER
   -------------------------------------------------------------------------- */
function initHudFilter() {
  const tabBtns = document.querySelectorAll('.hud-tab-btn');
  const streamRows = document.querySelectorAll('.stream-row');

  if (!tabBtns.length || !streamRows.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-hud-filter');

      streamRows.forEach(row => {
        const category = row.getAttribute('data-hud-category');
        if (filter === 'all' || category === filter) {
          row.style.display = 'flex';
          row.style.opacity = '1';
        } else {
          row.style.display = 'none';
          row.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. INTERACTIVE BIDINTEL LEVELING ENGINE (Trade Package Switcher)
   -------------------------------------------------------------------------- */
const BIDINTEL_PACKAGES = {
  electrical: {
    title: 'Commercial Electrical & Substation Package',
    budget: 'Budget: ₹8.50 Cr',
    noteText: 'Audit Insight: Vendor C appeared <strong>₹45 Lakhs cheaper</strong>, but carried <strong>₹1.83 Cr in hidden liabilities</strong>.',
    marginSaved: 'Margin Saved: ₹1.38 Cr',
    copilotTitle: '⚡ Critical Scope Exclusion Flagged',
    copilotText: 'Vendor C quote Page 14 Note 3 states: <em>"All 18% GST and testing &amp; commissioning of 33kV transformers excluded."</em> Adding statutory taxes and third-party testing brings true project exposure to <strong>₹9.78 Cr</strong>.',
    citation: '📄 Citing: proposal_vendor_c_rev2.pdf (p.14)',
    recText: 'Award to Subcontractor Alpha at ₹8.40 Cr. Complete scope coverage, GST fully included, locked warranty clauses.',
    rows: [
      {
        vendor: 'Subcontractor Alpha',
        sub: 'Tier 1 MEP Specialist',
        base: '₹8.40 Cr',
        scopeClass: 'ok',
        scopeText: '✓ Complete Scope Verified',
        tax: 'GST Included (18%)',
        risk: '₹8.40 Cr',
        riskColor: 'var(--emerald)'
      },
      {
        vendor: 'Subcontractor Beta',
        sub: 'Commercial Division',
        base: '₹8.10 Cr',
        scopeClass: 'warn',
        scopeText: '⚠ Omitted Crane Rigging (+₹25L)',
        tax: 'GST Included (18%)',
        risk: '₹8.35 Cr',
        riskColor: 'var(--text-main)'
      },
      {
        vendor: 'Subcontractor Gamma',
        sub: 'Regional Contractor',
        base: '₹7.95 Cr',
        strike: true,
        scopeClass: 'danger',
        scopeText: '❌ Testing & Cabling Omitted',
        tax: '18% GST Excluded (+₹1.43 Cr)',
        risk: '₹9.78 Cr',
        riskColor: 'var(--rose)'
      }
    ]
  },
  hvac: {
    title: 'Central HVAC & Water-Cooled Chiller Plant',
    budget: 'Budget: ₹12.40 Cr',
    noteText: 'Audit Insight: Vendor B omitted <strong>seasonal AHU balancing</strong> and vibration isolators (+₹42L during handover).',
    marginSaved: 'Margin Saved: ₹92 Lakhs',
    copilotTitle: '⚡ Equipment Exclusion Alert',
    copilotText: 'Vendor B proposal Page 9 excludes <em>BMS control integration modules</em> and variable speed drives. If awarded, change orders will add <strong>₹86 Lakhs</strong> during commissioning.',
    citation: '📄 Citing: hvac_vendor_b_schedule.pdf (p.9)',
    recText: 'Award to HVAC Systems Alpha at ₹12.10 Cr. Zero line-item exclusions, 5-year chiller compressor warranty included.',
    rows: [
      {
        vendor: 'HVAC Systems Alpha',
        sub: 'Commercial HVAC Solutions',
        base: '₹12.10 Cr',
        scopeClass: 'ok',
        scopeText: '✓ Full BMS & Chiller Scope',
        tax: 'All Taxes Paid',
        risk: '₹12.10 Cr',
        riskColor: 'var(--emerald)'
      },
      {
        vendor: 'Thermal Engineering Beta',
        sub: 'Regional Partner',
        base: '₹11.60 Cr',
        strike: true,
        scopeClass: 'danger',
        scopeText: '❌ BMS Controllers Excluded',
        tax: 'GST Extra (+₹2.08 Cr)',
        risk: '₹14.54 Cr',
        riskColor: 'var(--rose)'
      },
      {
        vendor: 'Industrial Climate Gamma',
        sub: 'Direct Enterprise',
        base: '₹12.35 Cr',
        scopeClass: 'ok',
        scopeText: '✓ Complete Specification',
        tax: 'All Taxes Paid',
        risk: '₹12.35 Cr',
        riskColor: 'var(--text-main)'
      }
    ]
  },
  facade: {
    title: 'Unitized Structural Glazing & Façade Package',
    budget: 'Budget: ₹18.20 Cr',
    noteText: 'Audit Insight: Vendor A omitted <strong>wind tunnel seismic testing</strong> and acoustic silicone sealing.',
    marginSaved: 'Margin Saved: ₹2.15 Crores',
    copilotTitle: '⚡ High-Risk Structural Exclusion',
    copilotText: 'Vendor A excludes <em>cradle hoisting equipment and ASTM water penetration field testing</em>. True project exposure is <strong>₹20.35 Cr</strong>.',
    citation: '📄 Citing: facade_annexure_b.pdf (p.28)',
    recText: 'Award to Façade Engineering Alpha at ₹17.90 Cr. Fully compliant with seismic zone 3 and 100% wind load certifications.',
    rows: [
      {
        vendor: 'Façade Engineering Alpha',
        sub: 'Façade Specialists',
        base: '₹17.90 Cr',
        scopeClass: 'ok',
        scopeText: '✓ Full Testing & Scaffolding',
        tax: 'GST Included',
        risk: '₹17.90 Cr',
        riskColor: 'var(--emerald)'
      },
      {
        vendor: 'Structural Envelopes Beta',
        sub: 'Architectural Works',
        base: '₹17.40 Cr',
        strike: true,
        scopeClass: 'danger',
        scopeText: '❌ Field Water Testing Omitted',
        tax: 'Freight & Taxes Excluded',
        risk: '₹20.35 Cr',
        riskColor: 'var(--rose)'
      },
      {
        vendor: 'Glazing Works Gamma',
        sub: 'National Fabricator',
        base: '₹18.10 Cr',
        scopeClass: 'ok',
        scopeText: '✓ Complete Package Spec',
        tax: 'GST Included',
        risk: '₹18.10 Cr',
        riskColor: 'var(--text-main)'
      }
    ]
  }
};

function renderBidIntelPackage(pkgKey) {
  const data = BIDINTEL_PACKAGES[pkgKey];
  if (!data) return;

  const titleEl = document.getElementById('table-package-title');
  const budgetEl = document.getElementById('table-budget-badge');
  const tbodyEl = document.getElementById('leveling-tbody');
  const auditNoteEl = document.getElementById('leveling-audit-note');

  const copilotTitle = document.getElementById('copilot-alert-title');
  const copilotText = document.getElementById('copilot-alert-text');
  const copilotCite = document.getElementById('copilot-citation-tag');
  const copilotRec = document.getElementById('copilot-rec-text');

  if (titleEl) titleEl.textContent = data.title;
  if (budgetEl) budgetEl.textContent = data.budget;

  if (auditNoteEl) {
    auditNoteEl.innerHTML = `<span>${data.noteText}</span><span style="color: var(--emerald); font-weight: 700;">${data.marginSaved}</span>`;
  }

  if (copilotTitle) copilotTitle.innerHTML = data.copilotTitle;
  if (copilotText) copilotText.innerHTML = data.copilotText;
  if (copilotCite) copilotCite.innerHTML = `<span>${data.citation}</span>`;
  if (copilotRec) copilotRec.textContent = data.recText;

  if (tbodyEl) {
    tbodyEl.innerHTML = data.rows.map(r => `
      <tr>
        <td class="vendor-cell">
          <strong>${r.vendor}</strong>
          <span>${r.sub}</span>
        </td>
        <td style="${r.strike ? 'text-decoration: line-through; color: var(--text-dim);' : ''}">${r.base}</td>
        <td><span class="tag-gap ${r.scopeClass}">${r.scopeText}</span></td>
        <td style="color: ${r.scopeClass === 'danger' ? 'var(--rose)' : 'var(--text-muted)'}; font-size: 13px;">${r.tax}</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: ${r.riskColor};">${r.risk}</td>
      </tr>
    `).join('');
  }
}

function initBidIntelSwitcher() {
  const pkgButtons = document.querySelectorAll('.pkg-tab-btn');
  if (!pkgButtons.length) return;

  pkgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pkgButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const pkg = btn.getAttribute('data-pkg');
      renderBidIntelPackage(pkg);
    });
  });

  // Initial render
  renderBidIntelPackage('electrical');
}

/* --------------------------------------------------------------------------
   3. OPERATIONAL ROI CALCULATOR
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const sliderStaff = document.getElementById('slider-staff');
  const sliderHours = document.getElementById('slider-hours');
  const sliderCost = document.getElementById('slider-cost');

  const valStaff = document.getElementById('val-staff');
  const valHours = document.getElementById('val-hours');
  const valCost = document.getElementById('val-cost');

  const outHours = document.getElementById('roi-hours-saved');
  const outSavings = document.getElementById('roi-annual-savings');

  if (!sliderStaff || !sliderHours || !sliderCost) return;

  function calculate() {
    const staff = parseInt(sliderStaff.value, 10);
    const hours = parseFloat(sliderHours.value);
    const cost = parseInt(sliderCost.value, 10);

    valStaff.textContent = `${staff} people`;
    valHours.textContent = `${hours} hrs`;
    valCost.textContent = `₹${cost.toLocaleString('en-IN')} / hr`;

    // 250 working days/year, 85% administrative efficiency recapture
    const annualHoursPerPerson = hours * 250;
    const totalAnnualHours = staff * annualHoursPerPerson;
    const recapturedHours = Math.round(totalAnnualHours * 0.85);
    const annualRupeesSaved = recapturedHours * cost;

    outHours.textContent = `${recapturedHours.toLocaleString('en-IN')} hrs`;

    if (annualRupeesSaved >= 10000000) {
      const crores = (annualRupeesSaved / 10000000).toFixed(2);
      outSavings.textContent = `₹${crores} Crores`;
    } else if (annualRupeesSaved >= 100000) {
      const lakhs = (annualRupeesSaved / 100000).toFixed(1);
      outSavings.textContent = `₹${lakhs} Lakhs`;
    } else {
      outSavings.textContent = `₹${annualRupeesSaved.toLocaleString('en-IN')}`;
    }
  }

  sliderStaff.addEventListener('input', calculate);
  sliderHours.addEventListener('input', calculate);
  sliderCost.addEventListener('input', calculate);

  calculate();
}

/* --------------------------------------------------------------------------
   4. DIAGNOSTIC INTAKE MODAL
   -------------------------------------------------------------------------- */
function initDiagnosticModal() {
  const modal = document.getElementById('diagnostic-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const openButtons = document.querySelectorAll('.btn-open-diagnostic');

  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function handleAuditSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('audit-submit-btn');
  const feedback = document.getElementById('audit-feedback');
  const form = document.getElementById('audit-form');

  if (submitBtn) {
    submitBtn.textContent = 'Transmitting Diagnostic Scope...';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    if (feedback) feedback.style.display = 'block';
    if (submitBtn) submitBtn.textContent = '✓ Intake Received';

    setTimeout(() => {
      const modal = document.getElementById('diagnostic-modal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
      if (form) form.reset();
      if (submitBtn) {
        submitBtn.textContent = 'Submit Diagnostic Request →';
        submitBtn.disabled = false;
      }
      if (feedback) feedback.style.display = 'none';
    }, 2000);
  }, 900);
}

/* --------------------------------------------------------------------------
   5. PORTFOLIO FILTER (For work.html)
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const workItems = document.querySelectorAll('.work-card-showcase, .work-card-large, .work-card-medium');

  if (!filterBtns.length || !workItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL OBSERVER (Smooth Entrance Animations)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE CARD SPOTLIGHT (Mouse Following Glow)
   -------------------------------------------------------------------------- */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.card-spotlight, .work-card-showcase, .ownership-card, .protocol-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE PREVIEW TABS (For work.html & Showcase Cards)
   -------------------------------------------------------------------------- */
function initPreviewTabs() {
  const tabGroups = document.querySelectorAll('.preview-tabs');
  tabGroups.forEach(group => {
    const groupName = group.getAttribute('data-target-group');
    const buttons = group.querySelectorAll('.preview-tab-btn');
    const panels = document.querySelectorAll(`.preview-tab-panel[data-group="${groupName}"]`);

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetTab = btn.getAttribute('data-tab');
        panels.forEach(panel => {
          if (panel.id === targetTab) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  });
}

