import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';
import { useLinks } from '../content.jsx';
import { Icon } from './Icons.jsx';
import GuideGirl from './GuideGirl.jsx';

// Page-specific tips. Every tip ends with a way to contact Liza.
const TIPS = {
  uk: {
    top: 'Тисни сюди — і плануємо твою першу вершину!',
    home: 'Гортай далі — там сторіз, галерея й відгуки. А якщо вже хочеш у гори — пиши!',
    tours: 'Обирай тур — тут усе найцікавіше ⛰ Не знаєш, що обрати? Підкажу в месенджері.',
    tour: 'Сподобався маршрут? Напиши мені — забронюю тобі місце! 🧡',
    calendar: 'Обери дату в календарі — і я покажу, які тури тоді йдуть 📅 Потрібна інша дата? Пиши.',
    news: 'Тут свіжі новини з гір. Хочеш побачити Монблан чи Маттерхорн наживо? Пиши!',
    post: 'Цікаво? У горах це ще вражає більше. Розповім деталі в месенджері 🙂',
    about: 'Це я 👋 Маєш питання про підготовку, спорядження чи маршрут — питай!',
    gallery: 'Такі кадри чекають і на тебе. Обери тур або напиши мені!',
    contacts: 'Пиши в будь-який месенджер — відповім швидко!',
    lost: 'Ой, здається, ми зійшли зі стежки. Повернімося на головну або напиши мені!',
  },
  en: {
    top: 'Tap here — let’s plan your first summit!',
    home: 'Keep scrolling — stories, gallery and reviews are below. Ready for the mountains? Message me!',
    tours: 'Pick a tour — all the good stuff is here ⛰ Not sure which one? I’ll help in a message.',
    tour: 'Like this route? Message me — I’ll save you a spot! 🧡',
    calendar: 'Pick a date — I’ll show which tours run then 📅 Need other dates? Message me.',
    news: 'Fresh mountain news. Want to see Mont Blanc or the Matterhorn for real? Message me!',
    post: 'Interesting? It’s even more impressive in the mountains. Ask me for details 🙂',
    about: 'That’s me 👋 Questions about training, gear or routes — just ask!',
    gallery: 'Views like these are waiting for you too. Pick a tour or message me!',
    contacts: 'Message me in any app — I reply fast!',
    lost: 'Oops, looks like we lost the trail. Back home — or message me!',
  },
};

export default function GuideBuddy({ spot, ready, onSpotlight }) {
  const { t, lang } = useI18n();
  const links = useLinks();
  const [shown, setShown] = useState(false);
  const [bubble, setBubble] = useState(true);
  const [dismissed, setDismissed] = useState({});

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setShown(true), 1600);
    return () => clearTimeout(id);
  }, [ready]);

  const tg = { href: links.telegram, label: 'Telegram', icon: <Icon.telegram size={16} />, cls: 'msg--tg', ext: true };
  const wa = { href: links.whatsapp, label: 'WhatsApp', icon: <Icon.whatsapp size={16} />, cls: 'msg--wa', ext: true };
  const go = (to, label, icon) => ({ to, label, icon, cls: 'btn--soft' });
  const extra = {
    top: [go('/tours', t.nav.tours, <Icon.arrow size={16} />)],
    home: [go('/tours', t.nav.tours, <Icon.arrow size={16} />)],
    tours: [go('/calendar', t.nav.calendar, <Icon.calendar size={16} />)],
    calendar: [go('/tours', t.nav.tours, <Icon.arrow size={16} />)],
    news: [go('/tours', t.nav.tours, <Icon.arrow size={16} />)],
    post: [go('/news', t.nav.news, <Icon.arrow size={16} />)],
    about: [go('/tours', t.nav.tours, <Icon.arrow size={16} />)],
    gallery: [go('/tours', t.nav.tours, <Icon.arrow size={16} />)],
    lost: [go('/', t.pages.toHome, <Icon.arrow size={16} />)],
  };
  const key = TIPS.uk[spot] ? spot : 'home';
  const tip = { text: TIPS[lang][key], actions: [tg, wa, ...(extra[key] || [])] };

  useEffect(() => { setBubble(!dismissed[key]); }, [key, dismissed]);
  useEffect(() => { onSpotlight?.(shown && bubble && key === 'top'); }, [shown, bubble, key, onSpotlight]);
  // on phones the bubble folds away by itself after a few seconds (tap the guide to open it again)
  useEffect(() => {
    if (!bubble || !shown || window.innerWidth > 620) return;
    const id = setTimeout(() => setBubble(false), 9000);
    return () => clearTimeout(id);
  }, [bubble, shown, key]);

  const close = () => { setBubble(false); setDismissed((d) => ({ ...d, [key]: true })); };

  return (
    <AnimatePresence>
      {shown && (
        <motion.div className={`buddy ${bubble ? 'has-bubble' : ''}`} initial={{ y: 220, rotate: -12 }} animate={{ y: 0, rotate: 0 }} exit={{ y: 220 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }}>
          <button className="buddy__girl" onClick={() => setBubble((b) => !b)} aria-label={t.guide.hi} aria-expanded={bubble}>
            <GuideGirl pointing={bubble} />
          </button>
          <AnimatePresence mode="wait">
            {bubble && (
              <motion.div key={key + lang} className="buddy__bubble" initial={{ opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 10 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                <button className="buddy__x" onClick={close} aria-label={t.guide.close}><Icon.close size={14} /></button>
                <b>{t.guide.hi}</b>
                <p>{tip.text}</p>
                <div className="buddy__actions">
                  {tip.actions.map((a) => a.to ? (
                    <Link key={a.label} to={a.to} className={`btn btn--sm ${a.cls}`}>{a.icon}{a.label}</Link>
                  ) : (
                    <a key={a.label} href={a.href} target={a.ext ? '_blank' : undefined} rel="noopener" className={`btn btn--sm ${a.cls}`}>{a.icon}{a.label}</a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
