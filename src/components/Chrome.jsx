// Site "chrome": header, preloader, altimeter, floating contact button, footer
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { useLinks } from '../content.jsx';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icons.jsx';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Eliz Happy Travel">
      <svg viewBox="0 0 44 30" className="logo__mark" aria-hidden="true">
        <path d="M2 28 L15 8 L21 17 L28 4 L42 28Z" />
        <path className="logo__snow" d="M28 4 L24.6 10.4 L28 8.6 L31.4 10.4Z" />
      </svg>
      <span className="logo__text">Eliz<b>Happy</b>Travel</span>
    </Link>
  );
}

export function Header({ theme, setTheme }) {
  const { t, lang, setLang } = useI18n();
  const links = useLinks();
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 30);
    setHidden(y > prev && y > 500 && !open);
  });
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('menu-open', open);
  }, [open]);
  useEffect(() => setOpen(false), [loc.pathname]);
  const items = [['tours', '/tours'], ['calendar', '/calendar'], ['news', '/news'], ['gallery', '/gallery'], ['about', '/about'], ['contacts', '/contacts']];
  const solid = loc.pathname !== '/';

  return (
    <>
    <header className={`header ${scrolled || solid || open ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''} ${open ? 'is-menu' : ''}`}>
      <div className="container header__inner">
        <Logo />
        <nav className="nav">
          {items.map(([k, to]) => <NavLink key={k} to={to}>{t.nav[k]}</NavLink>)}
        </nav>
        <div className="header__tools">
          <div className="seg" role="group" aria-label="Language">
            {['uk', 'en'].map((l) => (
              <button key={l} className={lang === l ? 'is-on' : ''} onClick={() => setLang(l)}>{l === 'uk' ? 'UA' : 'EN'}</button>
            ))}
          </div>
          <button className="round" onClick={setTheme} aria-label="Theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ y: 18, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: -18, rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'grid' }}>
                {theme === 'dark' ? <Icon.moon size={19} /> : <Icon.sun size={19} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className={`round burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </div>

    </header>
    {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div className="mnav" initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)' }} transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}>
            <nav>
              {[['home', '/'], ...items].map(([k, to], i) => (
                <motion.div key={k} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                  <NavLink to={to} end onClick={() => setOpen(false)}><small>0{i + 1}</small>{t.nav[k]}</NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="mnav__msg">
              <a href={links.telegram} target="_blank" rel="noopener" className="msg msg--tg"><Icon.telegram /></a>
              <a href={links.whatsapp} target="_blank" rel="noopener" className="msg msg--wa"><Icon.whatsapp /></a>
              <a href={links.viber} className="msg msg--vb"><Icon.viber /></a>
              <a href={links.phone} className="msg msg--ph"><Icon.phone /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}

export function Preloader({ onDone }) {
  const { t } = useI18n();
  const [alt, setAlt] = useState(0);
  useEffect(() => {
    let raf, t0;
    const dur = 1700;
    const tick = (ts) => {
      t0 ??= ts;
      const p = Math.min(1, (ts - t0) / dur);
      setAlt(Math.round(4808 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <motion.div className="preloader" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}>
      <svg viewBox="0 0 200 120" className="preloader__mtn" aria-hidden="true">
        <path className="preloader__line" d="M10 110 L60 50 L85 75 L130 14 L190 110" />
        <circle r="5" className="preloader__dot">
          <animateMotion dur="1.7s" fill="freeze" keyPoints="0;0.66" keyTimes="0;1" calcMode="spline" keySplines=".2 .8 .3 1" path="M10 110 L60 50 L85 75 L130 14 L190 110" />
        </circle>
      </svg>
      <div className="preloader__alt">{alt.toLocaleString('uk-UA')}<small> m</small></div>
      <p>{t.preloader}</p>
    </motion.div>
  );
}

// Scroll altimeter: vertical rope on desktop, a thin altitude bar on mobile
export function Altimeter() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [alt, setAlt] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setAlt(Math.round(Math.max(0, v) * 4808)));
  const h = useTransform(p, (v) => `${v * 100}%`);
  return (
    <>
      <div className="alti" aria-hidden="true">
        <div className="alti__rope"><motion.div className="alti__fill" style={{ height: h }} /></div>
        <motion.div className="alti__climber" style={{ bottom: h }}><Icon.peak size={13} /></motion.div>
        <div className="alti__val">{alt.toLocaleString('uk-UA')} m</div>
      </div>
      <div className="alti-m" aria-hidden="true">
        <motion.div className="alti-m__fill" style={{ width: h }} />
        {alt > 30 && <div className="alti-m__chip">⛰ {alt.toLocaleString('uk-UA')} m</div>}
      </div>
    </>
  );
}

export function FloatingContact() {
  const { t } = useI18n();
  const links = useLinks();
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.classList.toggle('fab-open', open); }, [open]);
  const list = [
    { k: 'tg', href: links.telegram, icon: <Icon.telegram />, label: t.contacts.tg },
    { k: 'wa', href: links.whatsapp, icon: <Icon.whatsapp />, label: t.contacts.wa },
    { k: 'vb', href: links.viber, icon: <Icon.viber />, label: t.contacts.viber },
    { k: 'ph', href: links.phone, icon: <Icon.phone />, label: links.phonePretty },
  ];
  return (
    <div className={`fab ${open ? 'is-open' : ''}`}>
      <AnimatePresence>
        {open && list.map((it, i) => (
          <motion.a key={it.k} href={it.href} target={it.k === 'ph' || it.k === 'vb' ? undefined : '_blank'} rel="noopener" className={`fab__item msg--${it.k}`}
            initial={{ opacity: 0, y: 20, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.6 }} transition={{ delay: (list.length - i) * 0.04 }}>
            <span className="fab__label">{it.label}</span>
            <span className="fab__icon">{it.icon}</span>
          </motion.a>
        ))}
      </AnimatePresence>
      <button className="fab__main" onClick={() => setOpen(!open)} aria-label={t.fab} aria-expanded={open}>
        <span className="fab__ring" />
        {open ? <Icon.close /> : <Icon.chat />}
      </button>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();
  const links = useLinks();
  return (
    <footer className="footer">
      <svg className="footer__ridge" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90 L0 60 L140 22 L260 58 L400 10 L540 52 L680 26 L820 64 L980 14 L1120 54 L1280 24 L1440 50 L1440 90Z" />
      </svg>
      <div className="container footer__inner">
        <Logo />
        <div className="footer__links">
          <a href={links.telegram} target="_blank" rel="noopener"><Icon.telegram size={18} /></a>
          <a href={links.whatsapp} target="_blank" rel="noopener"><Icon.whatsapp size={18} /></a>
          <a href={links.instagram} target="_blank" rel="noopener"><Icon.instagram size={18} /></a>
          <a href={links.facebook} target="_blank" rel="noopener"><Icon.facebook size={18} /></a>
          <a href={links.mail}><Icon.mail size={18} /></a>
        </div>
        <nav className="footer__nav">
          {[['tours', '/tours'], ['calendar', '/calendar'], ['news', '/news'], ['gallery', '/gallery'], ['about', '/about'], ['contacts', '/contacts']].map(([k, to]) => <Link key={k} to={to}>{t.nav[k]}</Link>)}
        </nav>
        <p className="footer__copy">© {new Date().getFullYear()} Eliz Happy Travel · {t.footer.made} 🏔 · <a href={links.mail}>{links.email}</a> · <a href={links.phone}>{links.phonePretty}</a></p>
      </div>
    </footer>
  );
}
