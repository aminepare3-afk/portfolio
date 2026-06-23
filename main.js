/* ===== LOADER ===== */
const loader = document.getElementById('loader');
const loaderNum = document.getElementById('loader-num');
let count = 0;
const counter = setInterval(() => {
  count++;
  loaderNum.textContent = String(count).padStart(3, '0');
  if (count >= 100) {
    clearInterval(counter);
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}, 18);

/* ===== NAV SCROLL + PROGRESS ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const prog = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('progress-bar').style.width = prog + '%';
});

/* ===== PARALLAX HERO GRID ===== */
window.addEventListener('mousemove', e => {
  const grid = document.querySelector('.hero-bg-grid');
  if (!grid) return;
  const x = (e.clientX / window.innerWidth  - 0.5) * 16;
  const y = (e.clientY / window.innerHeight - 0.5) * 16;
  grid.style.transform = `translate(${x}px,${y}px)`;
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ===== REVEAL ON SCROLL ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('in'), i * 70);
  });
}, { threshold: 0.07 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ===== SKILL BARS ===== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sk-bar').forEach(b => b.classList.add('animated'));
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.sk').forEach(c => skillObserver.observe(c));

/* ===== CONTACT FORM ===== */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.innerHTML = '✓ Message envoyé ! <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  btn.style.background = '#00E07A';
  btn.style.color = '#000';
  setTimeout(() => {
    btn.innerHTML = 'Envoyer le message <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
}