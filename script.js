// Lexyn Solutions — premium interactions

(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- Nav scroll state ----------
  const nav = document.getElementById('nav');
  const progressBar = document.querySelector('.progress span');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 8);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // ---------- Smooth anchor scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });

  // ---------- Word-by-word reveal split ----------
  document.querySelectorAll('[data-reveal-words]').forEach(el => {
    const walk = (node) => {
      const children = Array.from(node.childNodes);
      children.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          const parts = text.split(/(\s+)/);
          parts.forEach(part => {
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else if (part.length) {
              const wrap = document.createElement('span');
              wrap.className = 'word';
              const inner = document.createElement('span');
              inner.textContent = part;
              wrap.appendChild(inner);
              frag.appendChild(wrap);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // Wrap the element itself as a word for visual parity (so italics / accent reveal)
          if (!child.classList.contains('word')) {
            const wrap = document.createElement('span');
            wrap.className = 'word';
            const inner = document.createElement('span');
            // move children of element into inner clone of element
            const clone = child.cloneNode(false);
            clone.innerHTML = child.innerHTML;
            inner.appendChild(clone);
            wrap.appendChild(inner);
            child.replaceWith(wrap);
          }
        }
      });
    };
    walk(el);

    // Stagger
    el.querySelectorAll('.word > span').forEach((s, i) => {
      s.style.transitionDelay = `${Math.min(i * 45, 600)}ms`;
    });
  });

  // ---------- Reveal observer ----------
  const revealTargets = [
    '[data-reveal-words]',
    '.hero__lede', '.hero__actions', '.hero__foot',
    '.trust__inner', '.trust__marquee',
    '.about__head', '.about__copy',
    '.section-head', '.card', '.process__step',
    '.why__bento', '.why__cell',
    '.industry', '.faq__item', '.cta__inner'
  ];
  const nodes = document.querySelectorAll(revealTargets.join(','));
  nodes.forEach((n, i) => {
    if (!n.hasAttribute('data-reveal-words')) n.classList.add('reveal');
    if (n.matches('.card, .process__step, .industry, .why__cell, .faq__item')) {
      const siblings = Array.from(n.parentElement.children);
      const idx = siblings.indexOf(n);
      n.style.transitionDelay = `${idx * 90}ms`;
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
  nodes.forEach(n => io.observe(n));

  // ---------- Animated counters ----------
  const counters = document.querySelectorAll('.trust__num b[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const isFloat = !Number.isInteger(target);
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = isFloat ? v.toFixed(1) : Math.round(v).toString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = isFloat ? target.toFixed(1) : target.toString();
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));

  // ---------- Hero parallax (subtle) ----------
  if (!prefersReduced && isFinePointer) {
    const orbs = document.querySelectorAll('.hero__orb');
    if (orbs.length) {
      let mx = 0, my = 0, tx = 0, ty = 0;
      const onMove = (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        tx = (e.clientX - cx) / cx;
        ty = (e.clientY - cy) / cy;
      };
      window.addEventListener('mousemove', onMove);
      const loop = () => {
        mx += (tx - mx) * 0.04;
        my += (ty - my) * 0.04;
        orbs.forEach((o, i) => {
          const k = (i + 1) * 16;
          o.style.transform = `translate(${mx * k}px, ${my * k}px)`;
        });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  // ---------- Card cursor halo ----------
  document.querySelectorAll('.card, .industry').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // ---------- Magnetic buttons ----------
  if (!prefersReduced && isFinePointer) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 0.35;
      let raf;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
        });
      };
      const reset = () => {
        cancelAnimationFrame(raf);
        el.style.transform = '';
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', reset);
    });
  }

  // ---------- Custom cursor ----------
  if (!prefersReduced && isFinePointer) {
    const cursor = document.querySelector('.cursor');
    const dot = cursor.querySelector('.cursor__dot');
    const ring = cursor.querySelector('.cursor__ring');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my;
    let active = false;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!active) { active = true; cursor.classList.add('is-active'); }
    });
    window.addEventListener('mouseleave', () => { active = false; cursor.classList.remove('is-active'); });

    const loop = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Cursor states
    document.querySelectorAll('[data-cursor]').forEach(el => {
      const type = el.getAttribute('data-cursor');
      el.addEventListener('mouseenter', () => {
        cursor.classList.remove('is-link', 'is-cta');
        cursor.classList.add(type === 'cta' ? 'is-cta' : 'is-link');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-link', 'is-cta');
      });
    });
  }
})();

/* ============================================================
   EMAIL JS — CONTACT FORM
   Replace the three constants below with your EmailJS credentials.
   Dashboard → https://dashboard.emailjs.com
   ============================================================ */
const EMAILJS_PUBLIC_KEY  = '9cvP5Kb4utHZF9F5f';   // Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_4gmd0yz';   // Email Services tab
const EMAILJS_TEMPLATE_ID = 'template_cwyfjsk';  // Email Templates tab

(function initContactForm() {
  if (typeof emailjs === 'undefined') return;

  emailjs.init(EMAILJS_PUBLIC_KEY);

  const form      = document.getElementById('contact-form');
  const statusEl  = document.getElementById('cf-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Client-side validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(function (inp) {
      inp.classList.remove('is-error');
      if (!inp.value.trim()) {
        inp.classList.add('is-error');
        valid = false;
      }
    });
    if (!valid) return;

    const submitBtn = form.querySelector('.contact-form__submit');
    submitBtn.disabled = true;
    statusEl.className = 'contact-form__status';
    statusEl.textContent = 'Sending\u2026';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(function () {
        statusEl.className = 'contact-form__status is-success';
        statusEl.textContent = 'Message sent \u2014 we\u2019ll be in touch within one business day.';
        form.reset();
        submitBtn.disabled = false;
      })
      .catch(function () {
        statusEl.className = 'contact-form__status is-error';
        statusEl.textContent = 'Something went wrong. Please email stanton@lexyn.co.za directly.';
        submitBtn.disabled = false;
      });
  });
}());
