/* ======= Utilities & DOM refs ======= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('overlay');
const darkToggle = document.getElementById('darkModeToggle');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const yearEl = document.getElementById('year');

/* ======= Small helpers ======= */
const lockScroll = (lock) => {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  document.body.style.overflow = lock ? 'hidden' : '';
};

/* ======= Mobile nav toggling ======= */
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('show');
  if(!overlay.hidden) {
    overlay.hidden = true;
    lockScroll(false);
  } else {
    overlay.hidden = false;
    lockScroll(true);
  }
});

overlay?.addEventListener('click', () => {
  navLinks.classList.remove('show');
  overlay.hidden = true;
  navToggle.setAttribute('aria-expanded', 'false');
  lockScroll(false);
});

/* Close mobile nav when a link is clicked */
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('show');
    overlay.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    lockScroll(false);
  });
});

/* ======= Dark mode (persist) ======= */
const LS_KEY = 'ae_dark_mode';
function setDarkMode(on){
  document.body.classList.toggle('dark-mode', on);
  darkToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
  localStorage.setItem(LS_KEY, on ? '1' : '0');
}
darkToggle?.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});
// initialize from localStorage
if(localStorage.getItem(LS_KEY) === '1') setDarkMode(true);

/* ======= Smooth scroll for in-page links ======= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if(!href || href === '#') return;
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });
});

/* ======= Intersection Observer: reveal elements & animate skill bars ======= */
const toObserve = document.querySelectorAll('.slide-in, .project-card, .hero-title, .skills, .about, .projects, .contact');
const obs = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      // if it's the skills section, animate bars once
      if(entry.target.id === 'skills' || entry.target.classList.contains('skills')){
        document.querySelectorAll('.skill-bar span').forEach(s => {
          s.style.width = s.dataset.width || s.getAttribute('data-width') || '0%';
        });
      }
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.18, rootMargin: '0px 0px -80px 0px'});

toObserve.forEach(el => obs.observe(el));

/* ======= Project filtering ======= */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cat = card.dataset.category;
      if(filter === 'all' || cat === filter) {
        card.style.display = '';
        // small animation
        card.style.opacity = 0;
        setTimeout(()=> card.style.opacity = 1, 20);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ======= Typed text (simple, robust) ======= */
const phrases = ["AE Works", "a Web Developer", "a Freelancer"];
const typedEl = document.getElementById('typed-text');

let tIndex = 0, charIndex = 0, deleting = false;
function typedTick(){
  const current = phrases[tIndex];
  if(!deleting){
    typedEl.textContent = current.slice(0, ++charIndex);
    if(charIndex === current.length){
      deleting = true;
      setTimeout(typedTick, 900);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if(charIndex === 0){
      deleting = false;
      tIndex = (tIndex + 1) % phrases.length;
    }
  }
  setTimeout(typedTick, deleting ? 40 : 120);
}
document.addEventListener('DOMContentLoaded', () => typedTick());

/* ======= Scroll top button ======= */
window.addEventListener('scroll', () => {
  if(window.scrollY > 300) scrollTopBtn.style.display = 'block';
  else scrollTopBtn.style.display = 'none';
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* ======= Contact form (AJAX to FormSubmit) ======= */
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  formStatus.textContent = 'Sending...';
  const url = form.action.replace(/\/$/, '') + '/ajax';
  try{
    const data = new FormData(form);
    const res = await fetch(url, {method: 'POST', body: data});
    const json = await res.json();
    if(res.ok){
      formStatus.textContent = 'Thanks! I received your message.';
      form.reset();
    } else {
      formStatus.textContent = json.message || 'Unable to send. Please try via email.';
    }
  }catch(err){
    formStatus.textContent = 'Network error — try again or email me directly.';
    console.error(err);
  }
});

/* ======= Small page bits ======= */
if(yearEl) yearEl.textContent = new Date().getFullYear();


