// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('open');
});
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// ===== ACTIVE NAV =====
function updateActiveNav() {
  const sections = ['home', 'services', 'doctors', 'booking'];
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav__link[data-section="${id}"]`);
    if (!el || !link) return;
    if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
      document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ===== REVEAL ON SCROLL =====
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString('uk-UA');
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat__num').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const statsEl = document.querySelector('.hero__stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== DOCTOR FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.doctor-card').forEach(card => {
      const show = filter === 'all' || card.dataset.specialty === filter;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeIn 0.4s ease';
      }
    });
  });
});

// ===== SELECT DOCTOR FROM CARD =====
function selectDoctor(name, spec) {
  const select = document.getElementById('doctor');
  const option = `${name} — ${spec}`;
  for (let opt of select.options) {
    if (opt.value === option) { select.value = option; break; }
  }
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// ===== FORM MIN DATE =====
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  dateInput.min = today.toISOString().split('T')[0];
}

// ===== FORM VALIDATION & SUBMIT =====
const form = document.getElementById('bookingForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) submitForm();
  });
}

function validateForm() {
  let valid = true;
  const rules = [
    { id: 'fname', errId: 'fnameErr', msg: "Введіть ваше ім'я", check: v => v.trim().length >= 2 },
    { id: 'phone', errId: 'phoneErr', msg: 'Введіть коректний номер телефону', check: v => /^[\d\s\+\(\)\-]{10,}$/.test(v.trim()) },
    { id: 'email', errId: 'emailErr', msg: 'Введіть коректний email', check: v => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'doctor', errId: 'doctorErr', msg: 'Оберіть лікаря', check: v => v !== '' },
    { id: 'date', errId: 'dateErr', msg: 'Оберіть дату', check: v => v !== '' },
    { id: 'time', errId: 'timeErr', msg: 'Оберіть час', check: v => v !== '' },
  ];
  rules.forEach(rule => {
    const el = document.getElementById(rule.id);
    const err = document.getElementById(rule.errId);
    if (!rule.check(el.value)) {
      err.textContent = rule.msg;
      el.classList.add('invalid');
      valid = false;
    } else {
      err.textContent = '';
      el.classList.remove('invalid');
    }
  });
  return valid;
}

function submitForm() {
  const name = document.getElementById('fname').value;
  const doctor = document.getElementById('doctor').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const dateFormatted = new Date(date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('modalText').innerHTML =
    `<strong>${name}</strong>, ваш запис підтверджено!<br><br>
     👨‍⚕️ <strong>${doctor}</strong><br>
     📅 ${dateFormatted} о ${time}<br><br>
     Ми зв'яжемось з вами для підтвердження.`;
  document.getElementById('modal').classList.add('open');
  form.reset();
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ===== KEYBOARD ESC =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== FADEIN ANIMATION =====
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }`;
document.head.appendChild(style);
