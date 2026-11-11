'use strict';

/* =========================================================
   Константи
   ========================================================= */
const SELECTORS = {
  topic: '.topic',
  topicHeader: '.topic__header',
};
const CLASSES = {
  open: 'is-open',
  visible: 'is-visible',
  active: 'is-active',
};
const STORAGE_KEYS = {
  theme: 'web-zero-theme',
  todos: 'web-zero-todos',
};
const TO_TOP_OFFSET = 400;

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
      /* сховище недоступне — просто ігноруємо */
    }
  },
};

/* =========================================================
   Акордеон: теми, що розкриваються
   ========================================================= */
const topics = document.querySelectorAll(SELECTORS.topic);
const toggleAllBtn = document.getElementById('toggleAll');

function setTopic(topic, open) {
  const header = topic.querySelector(SELECTORS.topicHeader);
  topic.classList.toggle(CLASSES.open, open);
  header.setAttribute('aria-expanded', String(open));
}

function updateToggleAllLabel() {
  const allOpen = [...topics].every((t) => t.classList.contains(CLASSES.open));
  toggleAllBtn.textContent = allOpen ? 'Згорнути все' : 'Розгорнути все';
  toggleAllBtn.setAttribute('aria-pressed', String(allOpen));
}

topics.forEach((topic, i) => {
  const header = topic.querySelector(SELECTORS.topicHeader);
  const body = topic.querySelector('.topic__body');
  const id = `topic-body-${i}`;
  body.id = id;
  header.setAttribute('aria-controls', id);

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
nav.querySelectorAll('.nav__link').forEach((link) =>
  link.addEventListener('click', () => setMenu(false))
);
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
   Демо: лічильник
   ========================================================= */
const counterBtn = document.getElementById('counterBtn');
const counterValue = document.getElementById('counterValue');
const counterReset = document.getElementById('counterReset');
let count = 0;

counterBtn.addEventListener('click', () => {
  count++;
  counterValue.textContent = count;
});
counterReset.addEventListener('click', () => {
  count = 0;
  counterValue.textContent = count;
});

/* =========================================================
   Демо: список справ (зберігається в браузері)
   ========================================================= */
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
let todos = storage.get(STORAGE_KEYS.todos, [
  { id: 1, text: 'Вивчити семантичні теги', done: true },
  { id: 2, text: 'Зробити адаптивну галерею', done: false },
]);

function saveTodos() {
  storage.set(STORAGE_KEYS.todos, todos);
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo__item${todo.done ? ' is-done' : ''}`;

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'todo__check';
    check.checked = todo.done;
    check.setAttribute('aria-label', `Виконано: ${todo.text}`);
    check.addEventListener('change', () => {
      todo.done = check.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement('span');
    text.className = 'todo__text';
    text.textContent = todo.text;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'todo__remove';
    remove.textContent = '✕';
    remove.setAttribute('aria-label', `Видалити: ${todo.text}`);
    remove.addEventListener('click', () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    li.append(check, text, remove);
    todoList.append(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  todoInput.value = '';
  saveTodos();
  renderTodos();
});

renderTodos();

/* =========================================================
   Форма контактів (перевірка полів)
   ========================================================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  contactForm.querySelectorAll('.input').forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== '';
    field.classList.toggle('is-invalid', !ok);
    if (!ok) valid = false;
  });

  formStatus.className = 'form-status';
  if (!valid) {
    formStatus.textContent = 'Будь ласка, заповніть усі поля правильно.';
    formStatus.classList.add('is-error');
    return;
  }

  const name = contactForm.elements.name.value.trim();
  formStatus.textContent = `Дякуємо, ${name}! Повідомлення отримано.`;
  formStatus.classList.add('is-success');
  contactForm.reset();
});

contactForm.addEventListener('input', (e) => {
  if (e.target.classList.contains('is-invalid')) e.target.classList.remove('is-invalid');
});

/* =========================================================
   Рік у підвалі
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();
