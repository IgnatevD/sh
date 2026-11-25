import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';
import { photo, useContent, useLinks } from '../content.jsx';
import { Icon } from './Icons.jsx';
import Climbers from './Climbers.jsx';


function Snow() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = c.getContext('2d');
    let W, H, flakes = [], raf, visible = true;
    const make = (any) => ({ x: Math.random() * W, y: any ? Math.random() * H : -8, r: Math.random() * 2.2 + 0.5, s: Math.random() * 0.7 + 0.3, w: Math.random() * 6 });
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      W = c.offsetWidth; H = c.offsetHeight;
      c.width = W * d; c.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      flakes = Array.from({ length: Math.round(W / (W < 600 ? 9 : 7)) }, () => make(true));
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const draw = () => {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,255,255,.8)';
        flakes.forEach((f, i) => {
          f.w += 0.012; f.y += f.s; f.x += Math.sin(f.w) * 0.35 - 0.1;
          if (f.y > H + 4) flakes[i] = make(false);
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
        });
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); io.disconnect(); };
  }, []);
  return <canvas ref={ref} className="snow" aria-hidden="true" />;
}

const word = {
  hidden: { y: '110%' },
  show: (i) => ({ y: 0, transition: { delay: 0.25 + i * 0.12, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } }),
};

export default function Hero({ ready, spotlight }) {
  const { t } = useI18n();
  const { content } = useContent();
  const links = useLinks();
  const SLIDES = content.settings.heroSlides.length ? content.settings.heroSlides : [''];
  const [slide, setSlide] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const ridgeY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [SLIDES.length]);

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__photos" style={{ y: photoY }}>
        {SLIDES.map((id, i) => (
          <img key={id + i} src={photo(id)} alt="" className={`hero__photo ${i === slide % SLIDES.length ? 'is-on' : ''}`} fetchpriority={i === 0 ? 'high' : 'low'} loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
        <div className="hero__shade" />
      </motion.div>

      <Snow />

      <motion.div className="hero__content container" style={{ y: textY }}>
        <motion.p className="hero__eyebrow" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
          <span className="dot" /> {t.hero.eyebrow}
        </motion.p>
        <h1 className="hero__title">
          {[t.hero.title1, t.hero.title2, t.hero.title3].map((w, i) => (
            <span className={`line line--${i}`} key={i}>
              <motion.span custom={i} variants={word} initial="hidden" animate={ready ? 'show' : 'hidden'}>{w}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="hero__sub" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}>
          {t.hero.sub}
        </motion.p>
        <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }}>
          <Link to="/tours" className="btn btn--primary">{t.hero.cta} <Icon.arrow size={18} /></Link>
          <a href={links.telegram} target="_blank" rel="noopener" className={`btn btn--glass ${spotlight ? 'is-spotlight' : ''}`}>
            <Icon.telegram size={18} /> {t.hero.write}
          </a>
        </motion.div>

        <div className="hero__dots" role="tablist" aria-label="slides">
          {SLIDES.map((_, i) => (
            <button key={i} className={i === slide % SLIDES.length ? 'is-on' : ''} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </motion.div>

      <motion.div className="hero__ridge" style={{ y: ridgeY }}>
        <Climbers />
      </motion.div>
    </section>
  );
}
