import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { photo, useContent, useLinks } from '../content.jsx';
import { Link } from 'react-router-dom';
import { Icon } from './Icons.jsx';

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }),
};

export function Head({ eyebrow, title, lead, center = true, camp }) {
  const { t } = useI18n();
  const c = camp != null ? t.camps[camp] : null;
  return (
    <motion.div className={`head ${center ? 'head--c' : ''}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      <motion.p className="eyebrow" variants={fadeUp}>
        <span className="eyebrow__peak"><Icon.peak size={14} /></span> {eyebrow}
        {c && <span className="camp" title={c[0]}><i />{c[0]} · {c[1]}</span>}
      </motion.p>
      <motion.h2 className="h2" variants={fadeUp} custom={1}>{title}</motion.h2>
      {lead && <motion.p className="lead" variants={fadeUp} custom={2}>{lead}</motion.p>}
    </motion.div>
  );
}

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.2, 0.8, 0.2, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <b ref={ref}>{v.toLocaleString('uk-UA')}{suffix}</b>;
}

export function Manifesto() {
  const { t } = useI18n();
  const row = [...t.manifesto, ...t.manifesto];
  return (
    <div className="manifesto" aria-hidden="true">
      <div className="manifesto__track">
        {row.map((m, i) => <span key={i}>{m}<Icon.peak size={20} /></span>)}
      </div>
    </div>
  );
}

export function Stats() {
  const { t } = useI18n();
  const items = [
    { to: 13, s: '+', l: t.stats.years },
    { to: 12, s: '', l: t.stats.regions },
    { to: 440, s: '+', l: t.stats.km },
    { to: 4808, s: '', l: t.stats.peak },
  ];
  return (
    <section className="stats container">
      {items.map((it, i) => (
        <motion.div className="stat" key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Counter to={it.to} suffix={it.s} />
          <span>{it.l}</span>
        </motion.div>
      ))}
    </section>
  );
}

export function About() {
  const { t } = useI18n();
  const { content } = useContent();
  const ph = content.settings.photos;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const rot = useTransform(scrollYProgress, [0, 1], [-6, 4]);
  return (
    <section className="section about" id="about" ref={ref}>
      <div className="container about__grid">
        <div className="about__photos">
          <motion.figure className="pic pic--main" style={{ y: y1, rotate: rot }}>
            <img src={photo(ph.aboutMain)} alt="Ліза Земскова — гірський гід" loading="lazy" />
          </motion.figure>
          <motion.figure className="pic pic--b" style={{ y: y2 }}>
            <img src={photo(ph.aboutB)} alt="" loading="lazy" />
          </motion.figure>
          <motion.figure className="pic pic--c" style={{ y: y1 }}>
            <img src={photo(ph.aboutC)} alt="" loading="lazy" />
          </motion.figure>
          <div className="about__badge"><b>UIMLA</b><span>International Mountain Leader</span></div>
        </div>
        <div className="about__text">
          <Head eyebrow={t.about.eyebrow} title={t.about.title} center={false} camp={3} />
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>{t.about.p1}</motion.p>
          <motion.p variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}>{t.about.p2}</motion.p>
          <motion.blockquote className="about__quote" variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
            “{t.about.quote}”
            <cite>— {t.about.sign}</cite>
          </motion.blockquote>
          <ol className="climb">
            {t.about.steps.map((s, i) => (
              <motion.li key={s.y} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ '--step': i }}>
                <b>{s.y}</b><span>{s.t}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  const { t } = useI18n();
  const { content } = useContent();
  const links = useLinks();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.2]);
  return (
    <section className="ctaband" ref={ref}>
      <motion.img src={photo(content.settings.photos.cta)} alt="" style={{ y, scale }} loading="lazy" />
      <div className="ctaband__shade" />
      <motion.div className="container ctaband__inner" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
        <motion.h2 variants={fadeUp}>{t.cta.title}</motion.h2>
        <motion.p variants={fadeUp} custom={1}>{t.cta.text}</motion.p>
        <motion.div variants={fadeUp} custom={2} className="ctaband__btns">
          <Link to="/contacts" className="btn btn--light">{t.cta.btn} <Icon.arrow size={18} /></Link>
          <a href={links.telegram} target="_blank" rel="noopener" className="btn btn--glass"><Icon.telegram size={18} /> Telegram</a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Reviews() {
  const { t } = useI18n();
  const { content } = useContent();
  const ph = content.settings.photos;
  const pics = [ph.reviewSveta, ph.reviewMikhail, ph.reviewLeonid];
  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <Head eyebrow={t.reviews.eyebrow} title={t.reviews.title} camp={5} />
        <div className="reviews__row">
          {t.reviews.items.map((r, i) => (
            <motion.figure className="rev" key={r.n} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} whileHover={{ y: -8, rotate: i === 1 ? 0 : i === 0 ? -1 : 1 }}>
              <div className="rev__pic"><img src={photo(pics[i])} alt="" loading="lazy" /></div>
              <div className="rev__stars">★★★★★</div>
              <blockquote>{r.t}</blockquote>
              <figcaption><b>{r.n}</b><small>{r.d}</small></figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
