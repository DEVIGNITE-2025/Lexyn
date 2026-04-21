const yearNodes = document.querySelectorAll('[data-year]');
yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
    });
  });
}

const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === currentPage) {
      link.classList.add('is-active');
    }
  });
}

const revealTargets = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && revealTargets.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((node) => observer.observe(node));
} else {
  revealTargets.forEach((node) => node.classList.add('is-visible'));
}
