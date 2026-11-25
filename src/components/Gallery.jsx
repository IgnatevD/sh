import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { photo, useContent } from '../content.jsx';
import { galleryCats } from '../data/photos.js';
import { Icon } from './Icons.jsx';
import { Head } from './Sections.jsx';
import FilterChips from './Filters.jsx';

function Lightbox({ list, index, onClose }) {
  const [i, setI] = useState(index);
  const [dir, setDir] = useState(0);
  const go = (d) => { setDir(d); setI((x) => (x + d + list.length) % list.length); };
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; };
  });
  return createPortal(
    <motion.div className="lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <AnimatePresence mode="popLayout" custom={dir} initial={false}>
        <motion.img key={list[i].id} src={photo(list[i].id)} alt="" className="lb__img" custom={dir}
          initial={{ opacity: 0, x: dir * 120, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: dir * -120, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
          onClick={(e) => e.stopPropagation()} />
      </AnimatePresence>
      <button className="lb__btn lb__btn--l round" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Prev"><Icon.left /></button>
      <button className="lb__btn lb__btn--r round" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next"><Icon.right /></button>
      <button className="lb__x round" onClick={onClose} aria-label="Close"><Icon.close /></button>
      <span className="lb__count">{i + 1} / {list.length}</span>
    </motion.div>,
    document.body
  );
}

export default function Gallery({ limit = 18, withHead = true }) {
  const { t } = useI18n();
  const { gallery } = useContent().content;
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState(null);
  const [more, setMore] = useState(false);
  const list = gallery.filter((g) => cat === 'all' || g.cat === cat);
  const shown = cat === 'all' && !more ? list.slice(0, limit) : list;
  return (
    <section className="section gallery" id="gallery">
      <div className="container">
        {withHead && <Head eyebrow={t.gallery.eyebrow} title={t.gallery.title} camp={4} />}
        <FilterChips center value={cat} onChange={(v) => { setCat(v); setMore(false); }}
          options={galleryCats.map((c) => [c, t.gallery.cats[c], c === 'all' ? gallery.length : gallery.filter((g) => g.cat === c).length])} />
        <motion.div className="masonry" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((g, i) => (
              <motion.button layout key={g.id} className="masonry__item" onClick={() => setOpen(i)}
                initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}>
                <img src={photo(g.id)} alt="" loading="lazy" />
                <span className="masonry__tag">{t.gallery.cats[g.cat]}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
        {cat === 'all' && list.length > limit && !more && (
          <div className="center"><button className="btn btn--soft" onClick={() => setMore(true)}>+ {list.length - limit}</button></div>
        )}
      </div>
      <AnimatePresence>{open !== null && <Lightbox list={shown} index={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
