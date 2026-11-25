import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';
import { photo } from '../content.jsx';
import { Icon } from './Icons.jsx';
import { fadeUp } from './Sections.jsx';

export function Level({ n }) {
  return (
    <span className="level" aria-label={`${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => <Icon.peak key={i} size={14} className={i <= n ? 'on' : ''} />)}
    </span>
  );
}

export const fmtDate = (iso, lang, opts = { day: 'numeric', month: 'short' }) =>
  new Date(iso + 'T12:00:00').toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-GB', opts);

export const fmtRange = (d, lang) => {
  const a = new Date(d.start + 'T12:00:00'), b = new Date(d.end + 'T12:00:00');
  const loc = lang === 'uk' ? 'uk-UA' : 'en-GB';
  const sameMonth = a.getMonth() === b.getMonth();
  const left = a.toLocaleDateString(loc, sameMonth ? { day: 'numeric' } : { day: 'numeric', month: 'short' });
  const right = b.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${left} – ${right}`;
};

export const nextDeparture = (tour) => {
  const today = new Date().toISOString().slice(0, 10);
  return (tour.departures || []).filter((d) => d.end >= today).sort((a, b) => a.start.localeCompare(b.start))[0];
};

export function Price({ tour, big }) {
  const { t } = useI18n();
  return (
    <div className={`price ${big ? 'price--big' : ''}`}>
      {tour.price ? (<><small>{t.tours.from}</small> €{Number(tour.price).toLocaleString('uk-UA')}</>) : <small className="price__req">{t.pages.onRequest}</small>}
    </div>
  );
}

// Elevation profile built from daily ascent/descent numbers
export function Profile({ route }) {
  const pts = useMemo(() => {
    let alt = 0, x = 0;
    const out = [[0, 0]];
    route.forEach((d) => {
      if (!d.km) return;
      out.push([x + d.km * 0.45, alt + (+d.up || 0)]);
      alt = alt + (+d.up || 0) - (+d.down || 0);
      x += +d.km;
      out.push([x, alt]);
    });
    return out;
  }, [route]);
  if (pts.length < 3) return null;
  const maxX = pts[pts.length - 1][0] || 1;
  const ys = pts.map((p) => p[1]);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = 600, H = 120;
  const sx = (x) => (x / maxX) * W;
  const sy = (y) => H - 10 - ((y - minY) / (maxY - minY || 1)) * (H - 24);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p[0]).toFixed(1)} ${sy(p[1]).toFixed(1)}`).join(' ');
  return (
    <svg className="profile" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity=".45" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${d} L${W} ${H} L0 ${H}Z`} fill="url(#pf)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} />
      <motion.path d={d} className="profile__line" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
    </svg>
  );
}

export function TourCard({ tour, i = 0 }) {
  const { t, tr, lang } = useI18n();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const nd = nextDeparture(tour);
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 8, y: ((e.clientY - r.top) / r.height - 0.5) * -8 });
  };
  return (
    <motion.article layout className="tour" variants={fadeUp} custom={i % 4} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
      onPointerMove={move} onPointerLeave={() => setTilt({ x: 0, y: 0 })} style={{ '--rx': `${tilt.y}deg`, '--ry': `${tilt.x}deg` }}>
      <Link to={`/tours/${tour.slug}`} className="tour__link" aria-label={tr(tour.name)} />
      <div className="tour__img">
        <img src={photo(tour.photo)} alt={tr(tour.name)} loading="lazy" />
        <span className="chip">{tr(tour.tag)}</span>
        {tour.isNew && <span className="chip chip--new">{t.pages.isNew}</span>}
        <span className="tour__days"><b>{tour.days}</b>{t.tours.days}</span>
        {tour.maxAlt ? <span className="tour__alt"><Icon.peak size={12} /> {Number(tour.maxAlt).toLocaleString('uk-UA')} m</span> : null}
      </div>
      <div className="tour__body">
        <p className="tour__countries">{tr(tour.countries)}</p>
        <h3>{tr(tour.name)}</h3>
        <ul className="tour__meta">
          {nd && <li><Icon.calendar size={16} />{fmtRange(nd, lang)}</li>}
          <li><Icon.route size={16} />{tour.km} {t.tours.km} · ↑{Number(tour.gain).toLocaleString('uk-UA')} m</li>
          <li><Icon.users size={16} />{tour.group} {t.tours.group}</li>
          <li><Level n={tour.level} /><span className="muted">{t.pages.levels[tour.level]}</span></li>
        </ul>
        <div className="tour__foot">
          <Price tour={tour} />
          <span className="btn btn--sm btn--primary">{t.tours.more} <Icon.arrow size={16} /></span>
        </div>
      </div>
    </motion.article>
  );
}
