import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { photo } from '../content.jsx';
import { Icon } from './Icons.jsx';

// Hero banner for inner pages: photo with parallax + mountain ridge cut-out
export default function PageHero({ title, lead, img, small, portrait, portraitCaption, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  return (
    <section className={`phero ${small ? 'phero--small' : ''} ${portrait ? 'phero--portrait' : ''}`} ref={ref}>
      {img && <motion.img src={photo(img)} alt="" style={{ y }} className="phero__img" />}
      <div className="phero__shade" />
      {portrait && (
        <motion.figure className="phero__portrait" initial={{ opacity: 0, y: 40, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 3 }} transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 14 }}>
          <img src={photo(portrait)} alt="" />
          {portraitCaption && <figcaption><Icon.peak size={12} /> {portraitCaption}</figcaption>}
        </motion.figure>
      )}
      <div className="container phero__inner">
        <motion.p className="eyebrow eyebrow--light" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><Icon.peak size={14} /> Eliz Happy Travel</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}>{title}</motion.h1>
        {lead && <motion.p className="phero__lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>{lead}</motion.p>}
        {children}
      </div>
      <svg className="phero__ridge" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 80 L0 50 L160 18 L300 52 L460 8 L620 46 L760 22 L900 58 L1060 12 L1220 48 L1340 26 L1440 44 L1440 80Z" />
      </svg>
    </section>
  );
}
