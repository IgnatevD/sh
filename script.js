'use strict';

/* =========================================================
   Константи
   ========================================================= */
const CLASSES = {
  open: 'is-open',
  visible: 'is-visible',
  active: 'is-active',
  copied: 'is-copied',
};
const STORAGE_KEYS = {
  theme: 'site-path-theme',
};
const TO_TOP_OFFSET = 400;
const TOAST_DURATION = 2000;

/* Безпечна робота з localStorage */
const storage = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* сховище недоступне — ігноруємо */
    }
  },
};

/* =========================================================
   Спливне повідомлення
   ========================================================= */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add(CLASSES.visible);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove(CLASSES.visible), TOAST_DURATION);
}

/* =========================================================
   Акордеон: теми, що розкриваються
   ========================================================= */
const topics = document.querySelectorAll('.topic');
const toggleAllBtn = document.getElementById('toggleAll');

function setTopic(topic, open) {
  topic.classList.toggle(CLASSES.open, open);
  topic.querySelector('.topic__header').setAttribute('aria-expanded', String(open));
}

function updateToggleAllLabel() {
  const allOpen = [...topics].every((t) => t.classList.contains(CLASSES.open));
  toggleAllBtn.textContent = allOpen ? 'Згорнути все' : 'Розгорнути все';
  toggleAllBtn.setAttribute('aria-pressed', String(allOpen));
}

topics.forEach((topic, i) => {
  const header = topic.querySelector('.topic__header');
  const body = topic.querySelector('.topic__body');
  body.id = `topic-body-${i}`;
  header.setAttribute('aria-controls', body.id);

  header.addEventListener('click', () => {
    setTopic(topic, !topic.classList.contains(CLASSES.open));
    updateToggleAllLabel();
  });
});

toggleAllBtn.addEventListener('click', () => {
  const shouldOpen = ![...topics].every((t) => t.classList.contains(CLASSES.open));
  topics.forEach((t) => setTopic(t, shouldOpen));
  updateToggleAllLabel();
});

/* Перехід за посиланням на етап — відкриваємо його першу тему */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    const firstTopic = target && target.querySelector('.topic');
    if (firstTopic && !firstTopic.classList.contains(CLASSES.open)) {
      setTopic(firstTopic, true);
      updateToggleAllLabel();
    }
  });
});

/* =========================================================
   Кнопка «Копіювати» для кожного блоку коду
   ========================================================= */
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

document.querySelectorAll('pre.code').forEach((pre) => {
  const wrap = document.createElement('div');
  wrap.className = 'code-wrap';
  pre.before(wrap);
  wrap.append(pre);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.textContent = 'Копіювати';
  btn.setAttribute('aria-label', 'Скопіювати код');
  wrap.append(btn);

  btn.addEventListener('click', async () => {
    try {
      await copyText(pre.innerText.trim());
      btn.textContent = 'Скопійовано ✓';
      btn.classList.add(CLASSES.copied);
      showToast('Код скопійовано');
    } catch {
      showToast('Не вдалося скопіювати');
    }
    setTimeout(() => {
      btn.textContent = 'Копіювати';
      btn.classList.remove(CLASSES.copied);
    }, TOAST_DURATION);
  });
});

/* =========================================================
   Мобільне меню
   ========================================================= */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle(CLASSES.open, open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
}

burger.addEventListener('click', () => setMenu(!nav.classList.contains(CLASSES.open)));
nav.querySelectorAll('.nav__link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

/* =========================================================
   Тема (світла / темна)
   ========================================================= */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = storage.get(STORAGE_KEYS.theme, null);
if (savedTheme) root.dataset.theme = savedTheme;

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  storage.set(STORAGE_KEYS.theme, next);
});

/* =========================================================
   Поява блоків при прокрутці + активний пункт меню
   ========================================================= */
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(CLASSES.visible);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((el) => revealObserver.observe(el));

  const navLinks = document.querySelectorAll('.nav__link');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle(CLASSES.active, link.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('main .section[id]').forEach((s) => sectionObserver.observe(s));
} else {
  revealItems.forEach((el) => el.classList.add(CLASSES.visible));
}

/* =========================================================
   Кнопка «Нагору»
   ========================================================= */
const toTop = document.getElementById('toTop');
window.addEventListener(
  'scroll',
  () => toTop.classList.toggle(CLASSES.visible, window.scrollY > TO_TOP_OFFSET),
  { passive: true }
);
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =========================================================
   Демо з кроку 3.4 — той самий код, що в інструкції
   ========================================================= */
document.getElementById('helloBtn').addEventListener('click', function () {
  alert('Вітаю! Ви створили свій перший сайт 🚀');
});

/* =========================================================
   Рік у підвалі
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();
