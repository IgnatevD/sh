import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { photo, useContent } from '../content.jsx';
import { Icon } from './Icons.jsx';
import { Head } from './Sections.jsx';

const DUR = 5000;

function Viewer({ stories, start, onClose }) {
  const { tr, t } = useI18n();
  const [s, setS] = useState(start);
  const [k, setK] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prog, setProg] = useState(0);
  const holdRef = useRef(0);
  const touchY = useRef(null);
  const story = stories[s];

  const next = useCallback(() => {
    setProg(0);
    if (k < story.slides.length - 1) setK(k + 1);
    else if (s < stories.length - 1) { setS(s + 1); setK(0); }
    else onClose();
  }, [k, s, story, onClose]);
  const prev = () => {
    setProg(0);
    if (k > 0) setK(k - 1);
    else if (s > 0) { setS(s - 1); setK(stories[s - 1].slides.length - 1); }
  };

  useEffect(() => {
    if (paused) return;
    let raf, last = performance.now();
    const tick = (now) => {
      setProg((p) => {
        const np = p + (now - last) / DUR;
        last = now;
        return np;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, s, k]);
  useEffect(() => { if (prog >= 1) next(); }, [prog, next]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  });

  // preload the next image
  useEffect(() => {
    const n = story.slides[k + 1] || stories[s + 1]?.slides[0];
    if (n) new Image().src = photo(n.id);
  }, [s, k, story]);

  const down = (e) => { holdRef.current = Date.now(); setPaused(true); touchY.current = e.touches?.[0]?.clientY ?? null; };
  const up = (e, side) => {
    setPaused(false);
    const endY = e.changedTouches?.[0]?.clientY;
    if (touchY.current != null && endY != null && endY - touchY.current > 90) return onClose();
    if (Date.now() - holdRef.current < 250) side === 'l' ? prev() : next();
  };

  const slide = story.slides[k];
  return createPortal(
    <motion.div className="sv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="sv__card" initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
        <div className="sv__bars">
          {story.slides.map((_, i) => (
            <span key={i}><i style={{ width: `${i < k ? 100 : i === k ? Math.min(100, prog * 100) : 0}%` }} /></span>
          ))}
        </div>
        <div className="sv__top">
          <img src={photo(story.cover)} alt="" />
          <b>{tr(story.title)}</b>
          <small>Eliz Happy Travel</small>
          <button onClick={onClose} aria-label="Close"><Icon.close /></button>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img key={slide.id} src={photo(slide.id)} alt="" className="sv__img" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: paused ? 1.08 : 1.18 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.4 }, scale: { duration: DUR / 1000, ease: 'linear' } }} />
        </AnimatePresence>
        <motion.p key={slide.id + 'c'} className="sv__cap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{tr(slide.text)}</motion.p>
        <div className="sv__hit sv__hit--l" onMouseDown={down} onTouchStart={down} onMouseUp={(e) => up(e, 'l')} onTouchEnd={(e) => up(e, 'l')} />
        <div className="sv__hit sv__hit--r" onMouseDown={down} onTouchStart={down} onMouseUp={(e) => up(e, 'r')} onTouchEnd={(e) => up(e, 'r')} />
        <small className="sv__hint">{t.stories.tapNext}</small>
      </motion.div>
      <button className="sv__bg" onClick={onClose} aria-label="Close" />
    </motion.div>,
    document.body
  );
}

export default function Stories() {
  const { t, tr } = useI18n();
  const { stories } = useContent().content;
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eht-seen') || '[]'); } catch (e) { return []; }
  });
  const openStory = (i) => {
    setOpen(i);
    const n = [...new Set([...seen, stories[i].key])];
    setSeen(n);
    try { localStorage.setItem('eht-seen', JSON.stringify(n)); } catch (e) {}
  };
  return (
    <section className="section stories" id="stories">
      <div className="container">
        <Head eyebrow={t.stories.eyebrow} title={t.stories.title} lead={t.stories.hint} camp={2} />
        <div className="stories__row">
          {stories.map((s, i) => (
            <motion.button key={s.key} className={`story ${seen.includes(s.key) ? 'is-seen' : ''}`} onClick={() => openStory(i)}
              initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
              <span className="story__ring"><img src={photo(s.cover)} alt="" loading="lazy" /></span>
              <span className="story__name">{tr(s.title)}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>{open !== null && <Viewer stories={stories} start={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
