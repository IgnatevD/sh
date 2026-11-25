import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useContent } from './content.jsx';

const dict = {
  uk: {
    nav: { home: 'Головна', about: 'Про мене', stories: 'Сторіз', tours: 'Тури', calendar: 'Календар', news: 'Новини', gallery: 'Галерея', reviews: 'Відгуки', contacts: 'Контакти' },
    pages: {
      toursTitle: 'Усі тури', toursLead: 'Від легких стежок Мадейри до 4167 м Тубкаля. Обирай регіон, складність і місяць.',
      region: 'Регіон', level: 'Складність', month: 'Місяць', any: 'Будь-який', all: 'Усі', found: 'Знайдено турів', reset: 'Скинути', none: 'Нічого не знайдено — спробуй змінити фільтри або напиши мені, складемо індивідуальний маршрут.',
      regions: { alps: 'Альпи', dolomites: 'Доломіти', balkans: 'Балкани', scandinavia: 'Скандинавія', morocco: 'Марокко', islands: 'Острови', carpathians: 'Карпати й Татри', iberia: 'Іспанія' },
      levels: { 1: 'Дуже легко', 2: 'Легко', 3: 'Середньо', 4: 'Вище середнього', 5: 'Складно' },
      isNew: 'Новинка', onRequest: 'за запитом', departures: 'Найближчі виїзди', status: { open: 'Є місця', few: 'Мало місць', full: 'Немає місць' },
      highlights: 'Родзинки маршруту', back: 'Усі тури', similar: 'Схожі тури', ask: 'Запитати про тур',
      calTitle: 'Календар турів', calLead: 'Обери дату — і побачиш тури, які проходять у цей час. Кольорові дні — дні з виїздами.',
      calSelected: 'Тури на', calMonth: 'Тури в цьому місяці', calEmpty: 'На цю дату турів немає — подивись сусідні дні або напиши про індивідуальний тур.', today: 'Сьогодні',
      newsTitle: 'Новини гір', newsLead: 'Монблан, Маттерхорн та улюблені маршрути — що змінюється в горах і що це означає для мандрівників.', readMore: 'Читати', source: 'Джерело', allNews: 'Усі новини', latest: 'Свіжі новини з гір',
      galleryTitle: 'Галерея', aboutTitle: 'Про мене', contactsTitle: 'Контакти', featured: 'Популярні тури', allTours: 'Дивитися всі тури', whereNext: 'Куди далі?',
      notFound: 'Сторінку не знайдено', toHome: 'На головну',
    },
    hero: {
      eyebrow: 'Гірський гід · кваліфікація UIMLA',
      title1: 'Гори',
      title2: 'кличуть.',
      title3: 'Підемо разом?',
      sub: 'Трекінг і авторські тури Альпами, Доломітами, Балканами та Лапландією — з гідом, яка живе горами з 2014 року.',
      cta: 'Обрати пригоду',
      write: 'Написати в Telegram',
      scroll: 'гортай вгору ↑ до вершини',
    },
    guide: {
      hi: 'Привіт! Я Ліза 👋',
      tip: 'Тисни сюди — і плануємо твою першу вершину!',
      tipTours: 'Обирай тур — тут усе найцікавіше ⛰',
      tipContacts: 'Пиши в будь-який месенджер — відповім швидко!',
      close: 'Закрити',
    },
    stats: { years: 'років у горах', regions: 'гірських регіонів', km: 'км стежок за сезон', peak: 'м — висота Монблану' },
    manifesto: ['Не турист — мандрівник', 'Кожен крок до вершини', 'Гори змінюють людей', 'Безпека понад усе', 'Емоції на все життя'],
    about: {
      eyebrow: 'Хто веде вас нагору',
      title: 'Я — гірська душа і непосидюча мандрівниця',
      p1: 'Привіт, друзі! Мене звати Ліза Земскова. Мої подорожі почалися з роботи на круїзних лайнерах, яка відкрила мені світ. А горами я захопилася з першого походу рідними Карпатами у 2014 році.',
      p2: 'Відтоді я ходжу в гори по всьому світу, захопилася скелелазінням та альпінізмом, а головне — опанувала професію гірського провідника і отримую кваліфікацію міжнародної асоціації гірських лідерів UIMLA.',
      quote: 'Любов до гір і людей допомагає мені досягати мети — щоб ваш час у горах став незабутньою пригодою!',
      sign: 'Ліза',
      steps: [
        { y: '2014', t: 'Перший похід — Карпати' },
        { y: '2019', t: 'Почала працювати гідом' },
        { y: '2022', t: 'Чеська кваліфікація гірського гіда' },
        { y: 'UIMLA', t: 'Міжнародний гірський лідер' },
      ],
    },
    stories: { eyebrow: 'Сторіз з гір', title: 'Гори очима гіда', hint: 'Торкнись, щоб переглянути', tapNext: 'тап — далі, утримання — пауза' },
    tours: {
      eyebrow: 'Сезон пригод', title: 'Обери свою вершину', lead: 'Малі групи, продумана логістика і найкрасивіші стежки Європи.',
      days: 'днів', hiking: 'ходових днів', km: 'км', gain: 'м набору', group: 'осіб', from: 'від', more: 'Детальніше', book: 'Хочу в цей тур',
      level: 'Складність', meet: 'Зустріч', deposit: 'Передоплата', route: 'Маршрут по днях', incl: 'Включено', excl: 'Не включено', maxAlt: 'макс. висота',
      note: '* Дати сезону 2024 — нові дати уточнюйте в месенджері.',
    },
    gallery: {
      eyebrow: 'Галерея', title: 'Моменти, заради яких ми йдемо вгору',
      cats: { all: 'Усі', alps: 'Альпи', dolomites: 'Доломіти', balkans: 'Балкани', lapland: 'Лапландія', alpinism: 'Альпінізм', people: 'Люди' },
    },
    reviews: {
      eyebrow: 'Відгуки', title: 'Вони вже були на вершині',
      items: [
        { n: 'Світлана', d: 'Тур навколо Монблану', t: 'Десятиденний трек навколо Монблану запам’ятається надовго. Чудова організація — обов’язково піду з Лізою в нові походи!' },
        { n: 'Михайло', d: 'Тур навколо Монблану, 2022', t: 'Ходили компанією друзів. Ліза 8 днів тримала нашу дружну, але часом непросту групу за графіком — і при цьому завжди була привітною та уважною до кожного.' },
        { n: 'Леонід', d: 'Тур навколо Монблану', t: 'Наша група була різною за віком і підготовкою, але Ліза провела всіх складним маршрутом. Рекомендую без вагань!' },
      ],
    },
    cta: { title: 'Твоя вершина вже чекає', text: 'Групові та індивідуальні тури. Розкажи про мрію — складемо маршрут разом.', btn: 'Забронювати місце' },
    contacts: {
      eyebrow: 'Зв’язок', title: 'Напиши мені — і рушаймо!',
      text: 'Найшвидше відповідаю в Telegram та WhatsApp. Можна також зателефонувати або написати на пошту.',
      tg: 'Telegram', wa: 'WhatsApp', viber: 'Viber', call: 'Подзвонити', mail: 'Email', ig: 'Instagram', fb: 'Facebook',
      formTitle: 'Заявка на тур',
      name: 'Ваше ім’я', contact: 'Телефон, Telegram або email', tour: 'Тур', people: 'Осіб', message: 'Повідомлення (необов’язково)',
      custom: 'Індивідуальний тур',
      send: 'Надіслати заявку', sendTg: 'або одразу в Telegram', sendWa: 'або в WhatsApp',
      ok: 'Дякую! Заявку отримано — Ліза зв’яжеться з вами найближчим часом 🏔',
      err: 'Вкажіть ім’я та контакт, будь ласка',
      fallback: 'Не вдалося надіслати форму — напишіть, будь ласка, в Telegram чи WhatsApp.',
      msgTpl: 'Привіт, Лізо! Мене звати {name}. Цікавить тур «{tour}», нас {people}. {message}',
    },
    footer: { made: 'Зроблено з любов’ю до гір', top: 'На вершину' },
    preloader: 'Підйом до табору',
    camps: [['Базовий табір', '1 200 м'], ['Табір I', '2 400 м'], ['Табір II', '3 200 м'], ['Табір III', '3 900 м'], ['Табір IV', '4 300 м'], ['Штурмовий табір', '4 600 м'], ['Вершина', '4 808 м']],
    summit: 'Вершину взято!',
    fab: 'Зв’язатися',
  },
  en: {
    nav: { home: 'Home', about: 'About', stories: 'Stories', tours: 'Tours', calendar: 'Calendar', news: 'News', gallery: 'Gallery', reviews: 'Reviews', contacts: 'Contacts' },
    pages: {
      toursTitle: 'All tours', toursLead: 'From the easy trails of Madeira to 4,167 m Toubkal. Pick a region, difficulty and month.',
      region: 'Region', level: 'Difficulty', month: 'Month', any: 'Any', all: 'All', found: 'Tours found', reset: 'Reset', none: 'Nothing found — try other filters or message me for a private route.',
      regions: { alps: 'Alps', dolomites: 'Dolomites', balkans: 'Balkans', scandinavia: 'Scandinavia', morocco: 'Morocco', islands: 'Islands', carpathians: 'Carpathians & Tatras', iberia: 'Spain' },
      levels: { 1: 'Very easy', 2: 'Easy', 3: 'Moderate', 4: 'Above average', 5: 'Hard' },
      isNew: 'New', onRequest: 'on request', departures: 'Upcoming departures', status: { open: 'Available', few: 'Few spots', full: 'Full' },
      highlights: 'Highlights', back: 'All tours', similar: 'Similar tours', ask: 'Ask about this tour',
      calTitle: 'Tour calendar', calLead: 'Pick a date to see the tours running at that time. Coloured days have departures.',
      calSelected: 'Tours on', calMonth: 'Tours this month', calEmpty: 'No tours on this date — check nearby days or ask about a private trip.', today: 'Today',
      newsTitle: 'Mountain news', newsLead: 'Mont Blanc, the Matterhorn and our favourite routes — what is changing in the mountains and what it means for travellers.', readMore: 'Read', source: 'Source', allNews: 'All news', latest: 'Fresh mountain news',
      galleryTitle: 'Gallery', aboutTitle: 'About me', contactsTitle: 'Contacts', featured: 'Popular tours', allTours: 'See all tours', whereNext: 'Where next?',
      notFound: 'Page not found', toHome: 'Home',
    },
    hero: {
      eyebrow: 'Mountain guide · UIMLA qualification',
      title1: 'The mountains',
      title2: 'are calling.',
      title3: 'Shall we go?',
      sub: 'Trekking and author-led tours across the Alps, Dolomites, Balkans and Lapland — with a guide who has lived for the mountains since 2014.',
      cta: 'Choose an adventure',
      write: 'Message on Telegram',
      scroll: 'scroll up ↑ to the summit',
    },
    guide: {
      hi: 'Hi! I’m Liza 👋',
      tip: 'Tap here — let’s plan your first summit!',
      tipTours: 'Pick a tour — all the good stuff is here ⛰',
      tipContacts: 'Message me in any app — I reply fast!',
      close: 'Close',
    },
    stats: { years: 'years in the mountains', regions: 'mountain regions', km: 'km of trails per season', peak: 'm — Mont Blanc height' },
    manifesto: ['Not a tourist — a traveller', 'Every step to the summit', 'Mountains change people', 'Safety first', 'Emotions for life'],
    about: {
      eyebrow: 'Who leads you up',
      title: 'A mountain soul and a restless traveller',
      p1: 'Hi friends! I’m Liza Zemskova. My travels began while working on cruise ships, which opened the world to me. I fell for the mountains on my very first hike in my native Carpathians in 2014.',
      p2: 'Since then I’ve hiked mountains around the world, taken up rock climbing and alpinism, and — most importantly — became a professional mountain guide working towards the international UIMLA qualification.',
      quote: 'Love for mountains and people drives me — so your time in the mountains becomes an unforgettable adventure!',
      sign: 'Liza',
      steps: [
        { y: '2014', t: 'First hike — the Carpathians' },
        { y: '2019', t: 'Started guiding' },
        { y: '2022', t: 'Czech mountain guide qualification' },
        { y: 'UIMLA', t: 'International Mountain Leader' },
      ],
    },
    stories: { eyebrow: 'Mountain stories', title: 'The mountains through a guide’s eyes', hint: 'Tap to watch', tapNext: 'tap — next, hold — pause' },
    tours: {
      eyebrow: 'Adventure season', title: 'Choose your summit', lead: 'Small groups, well-planned logistics and Europe’s most beautiful trails.',
      days: 'days', hiking: 'hiking days', km: 'km', gain: 'm gain', group: 'people', from: 'from', more: 'Details', book: 'I want this tour',
      level: 'Difficulty', meet: 'Meeting point', deposit: 'Deposit', route: 'Day-by-day route', incl: 'Included', excl: 'Not included', maxAlt: 'max altitude',
      note: '* 2024 season dates — ask in a messenger for the new dates.',
    },
    gallery: {
      eyebrow: 'Gallery', title: 'Moments we climb for',
      cats: { all: 'All', alps: 'Alps', dolomites: 'Dolomites', balkans: 'Balkans', lapland: 'Lapland', alpinism: 'Alpinism', people: 'People' },
    },
    reviews: {
      eyebrow: 'Reviews', title: 'They’ve already been to the top',
      items: [
        { n: 'Sveta', d: 'Tour du Mont Blanc', t: 'The 10-day Mont Blanc trek was unforgettable. Great organisation — I’ll definitely join more hikes with Liza!' },
        { n: 'Mikhail', d: 'Tour du Mont Blanc, 2022', t: 'We went as a group of friends. For 8 days Liza kept our close-knit but sometimes demanding group on schedule — and stayed friendly and attentive to everyone.' },
        { n: 'Leonid', d: 'Tour du Mont Blanc', t: 'Our group was mixed in age and fitness, yet Liza got everyone through the demanding route. Recommend without hesitation!' },
      ],
    },
    cta: { title: 'Your summit is waiting', text: 'Group and private tours. Tell me your dream — we’ll plan the route together.', btn: 'Book a spot' },
    contacts: {
      eyebrow: 'Get in touch', title: 'Message me — and let’s go!',
      text: 'I reply fastest on Telegram and WhatsApp. You can also call or send an email.',
      tg: 'Telegram', wa: 'WhatsApp', viber: 'Viber', call: 'Call', mail: 'Email', ig: 'Instagram', fb: 'Facebook',
      formTitle: 'Tour request',
      name: 'Your name', contact: 'Phone, Telegram or email', tour: 'Tour', people: 'People', message: 'Message (optional)',
      custom: 'Private tour',
      send: 'Send request', sendTg: 'or straight to Telegram', sendWa: 'or to WhatsApp',
      ok: 'Thank you! Request received — Liza will get back to you soon 🏔',
      err: 'Please enter your name and a contact',
      fallback: 'Couldn’t send the form — please message on Telegram or WhatsApp.',
      msgTpl: 'Hi Liza! My name is {name}. I’m interested in “{tour}”, we are {people}. {message}',
    },
    footer: { made: 'Made with love for the mountains', top: 'To the summit' },
    preloader: 'Climbing to base camp',
    camps: [['Base camp', '1,200 m'], ['Camp I', '2,400 m'], ['Camp II', '3,200 m'], ['Camp III', '3,900 m'], ['Camp IV', '4,300 m'], ['High camp', '4,600 m'], ['Summit', '4,808 m']],
    summit: 'Summit reached!',
    fab: 'Contact',
  },
};

const I18nCtx = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const s = localStorage.getItem('eht-lang');
      if (s) return s;
    } catch (e) {}
    return (navigator.language || 'uk').startsWith('en') ? 'en' : 'uk';
  });
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('eht-lang', lang); } catch (e) {}
  }, [lang]);
  // tr({uk, en}) picks a localized field from data objects
  const tr = (o) => (o && typeof o === 'object' ? o[lang] || o.uk || '' : o);
  const { content } = useContent();
  // apply text overrides from admin: { "hero.title1": "..." }
  const t = useMemo(() => {
    const base = structuredClone(dict[lang]);
    const ov = content?.texts?.[lang] || {};
    Object.entries(ov).forEach(([path, val]) => {
      if (!val) return;
      const keys = path.split('.');
      let o = base;
      keys.slice(0, -1).forEach((k) => { o = o[k] ?? (o[k] = {}); });
      o[keys[keys.length - 1]] = val;
    });
    return base;
  }, [lang, content]);
  return <I18nCtx.Provider value={{ lang, setLang, t, tr }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);

// keys editable in admin ("Тексти" tab)
export const EDITABLE_TEXTS = ['hero.eyebrow', 'hero.title1', 'hero.title2', 'hero.title3', 'hero.sub', 'hero.cta', 'about.title', 'about.p1', 'about.p2', 'about.quote', 'cta.title', 'cta.text', 'contacts.title', 'contacts.text', 'guide.tip', 'guide.tipTours', 'guide.tipContacts', 'pages.newsLead', 'pages.toursLead'];
export const getText = (lang, path) => path.split('.').reduce((o, k) => o?.[k], dict[lang]);
