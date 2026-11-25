import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';
import { useLinks } from '../content.jsx';
import { Icon } from './Icons.jsx';
import GuideGirl from './GuideGirl.jsx';

// Guide mascot: pops up, waves, and points at what to tap next depending on the page / section.
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
  const tips = {
    top: { text: t.guide.tip, actions: [{ ...tg, label: t.hero.write, cls: 'btn--primary' }, { to: '/contacts', label: t.nav.contacts, icon: <Icon.arrow size={16} />, cls: 'btn--soft' }] },
    tours: { text: t.guide.tipTours, actions: [{ to: '/calendar', label: t.nav.calendar, icon: <Icon.calendar size={16} />, cls: 'btn--primary' }] },
    calendar: { text: lang === 'uk' ? 'Обери дату в календарі — і я покажу, які тури тоді йдуть 📅' : 'Pick a date in the calendar — I’ll show which tours run then 📅', actions: [] },
    tour: { text: lang === 'uk' ? 'Сподобався маршрут? Напиши мені — забронюю тобі місце! 🧡' : 'Like this route? Message me — I’ll save you a spot! 🧡', actions: [tg, wa] },
    contacts: { text: t.guide.tipContacts, actions: [tg, wa] },
  };
  const tip = tips[spot];

  useEffect(() => { setBubble(!!tips[spot] && !dismissed[spot]); }, [spot, dismissed]); // eslint-disable-line
  // on phones the bubble folds away by itself after a few seconds (tap the guide to open it again)
  useEffect(() => {
    if (!bubble || !shown || window.innerWidth > 620) return;
    const id = setTimeout(() => setBubble(false), 9000);
    return () => clearTimeout(id);
  }, [bubble, shown, spot]);
  useEffect(() => { onSpotlight?.(shown && bubble && spot === 'top'); }, [shown, bubble, spot, onSpotlight]);

  const close = () => { setBubble(false); setDismissed((d) => ({ ...d, [spot]: true })); };

  return (
    <AnimatePresence>
      {shown && (
        <motion.div className={`buddy ${bubble && tip ? 'has-bubble' : ''}`} initial={{ y: 220, rotate: -12 }} animate={{ y: 0, rotate: 0 }} exit={{ y: 220 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }}>
          <button className="buddy__girl" onClick={() => setBubble((b) => !b)} aria-label={t.guide.hi}>
            <GuideGirl pointing={bubble && !!tip} />
          </button>
          <AnimatePresence mode="wait">
            {bubble && tip && (
              <motion.div key={spot + lang} className="buddy__bubble" initial={{ opacity: 0, scale: 0.6, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.6, x: -20 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                <button className="buddy__x" onClick={close} aria-label={t.guide.close}><Icon.close size={14} /></button>
                <b>{t.guide.hi}</b>
                <p>{tip.text}</p>
                {tip.actions.length > 0 && (
                  <div className="buddy__actions">
                    {tip.actions.map((a) => a.to ? (
                      <Link key={a.label} to={a.to} className={`btn btn--sm ${a.cls}`}>{a.icon}{a.label}</Link>
                    ) : (
                      <a key={a.label} href={a.href} target={a.ext ? '_blank' : undefined} rel="noopener" className={`btn btn--sm ${a.cls}`}>{a.icon}{a.label}</a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
