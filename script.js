const navMenu = document.getElementById('nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const themeToggle = document.getElementById('themeToggle');
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const revealEls = document.querySelectorAll('.reveal');

const setTheme = (theme) => {
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  const icon = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.textContent = icon;
  themeToggleDesktop.textContent = icon;
};

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

const toggleTheme = () => setTheme((document.body.dataset.theme || 'light') === 'light' ? 'dark' : 'light');
themeToggle.addEventListener('click', toggleTheme);
themeToggleDesktop.addEventListener('click', toggleTheme);

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { threshold: 0.45 });

sections.forEach(section => navObserver.observe(section));

const setError = (field, message) => {
  const error = field.parentElement.querySelector('.error');
  error.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
};

const validateEmail = (email) => /^[^s@]+@[^s@]+.[^s@]+$/.test(email);

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  let valid = true;

  [name, email, subject, message].forEach(field => setError(field, ''));

  if (!name.value.trim()) { setError(name, 'Please enter your name.'); valid = false; }
  if (!email.value.trim()) { setError(email, 'Please enter your email.'); valid = false; }
  else if (!validateEmail(email.value.trim())) { setError(email, 'Please enter a valid email address.'); valid = false; }
  if (!subject.value.trim()) { setError(subject, 'Please enter a subject.'); valid = false; }
  if (!message.value.trim()) { setError(message, 'Please enter your message.'); valid = false; }
  else if (message.value.trim().length < 20) { setError(message, 'Please write at least 20 characters.'); valid = false; }

  const note = document.getElementById('formNote');
  if (valid) {
    note.textContent = 'Your message is ready for backend or email service integration later.';
    contactForm.reset();
  } else {
    note.textContent = 'Please fix the highlighted fields and try again.';
  }
});
