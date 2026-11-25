import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { photo, useContent, publishedTours } from '../content.jsx';
import { Icon } from '../components/Icons.jsx';
import { Level, Price, fmtRange, fmtDate } from '../components/Tours.jsx';
import PageHero from '../components/PageHero.jsx';

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const COLORS = ['#8b8ef0', '#f0a6b8', '#7ccfbe', '#f2c46d', '#9fc3f7', '#c9a2f2', '#f7a072', '#8fd18a'];

export default function CalendarPage() {
  const { t, tr, lang } = useI18n();
  const { content } = useContent();
  const tours = publishedTours(content);
  const color = useMemo(() => Object.fromEntries(tours.map((x, i) => [x.slug, COLORS[i % COLORS.length]])), [tours]);

  // start at the first month that has an upcoming departure (or the current month)
  const todayIso = iso(new Date());
  const firstDep = tours.flatMap((x) => x.departures || []).filter((d) => d.end >= todayIso).map((d) => d.start).sort()[0];
  const startDate = firstDep ? new Date(firstDep + 'T12:00:00') : new Date();
  const [view, setView] = useState({ y: startDate.getFullYear(), m: startDate.getMonth() });
  const [sel, setSel] = useState(null);

  const days = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const shift = (first.getDay() + 6) % 7; // Monday first
    const n = new Date(view.y, view.m + 1, 0).getDate();
    return [...Array(shift).fill(null), ...Array.from({ length: n }, (_, i) => new Date(view.y, view.m, i + 1))];
  }, [view]);

  const runsOn = (date) => tours.filter((x) => (x.departures || []).some((d) => date >= d.start && date <= d.end));
  const monthStart = iso(new Date(view.y, view.m, 1));
  const monthEnd = iso(new Date(view.y, view.m + 1, 0));
  const monthTours = tours.map((x) => ({ tour: x, deps: (x.departures || []).filter((d) => d.start <= monthEnd && d.end >= monthStart) })).filter((x) => x.deps.length);
  const selTours = sel ? runsOn(sel) : null;
  const shown = sel ? selTours.map((x) => ({ tour: x, deps: x.departures.filter((d) => sel >= d.start && sel <= d.end) })) : monthTours;

  const move = (d) => { setSel(null); setView((v) => { const nd = new Date(v.y, v.m + d, 1); return { y: nd.getFullYear(), m: nd.getMonth() }; }); };
  const loc = lang === 'uk' ? 'uk-UA' : 'en-GB';
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2027, 1, 1 + i).toLocaleDateString(loc, { weekday: 'short' }));

  return (
    <>
      <PageHero title={t.pages.calTitle} lead={t.pages.calLead} img={tours.find((x) => x.slug === 'dolomites')?.gallery?.[0] || tours[0]?.photo} />
      <section className="section section--tight">
        <div className="container cal-wrap">
          <div className="cal">
            <div className="cal__head">
              <button className="round" onClick={() => move(-1)} aria-label="Prev"><Icon.left /></button>
              <AnimatePresence mode="wait">
                <motion.h2 key={`${view.y}-${view.m}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {new Date(view.y, view.m, 1).toLocaleDateString(loc, { month: 'long', year: 'numeric' })}
                </motion.h2>
              </AnimatePresence>
              <button className="round" onClick={() => move(1)} aria-label="Next"><Icon.right /></button>
            </div>
            <div className="cal__grid cal__grid--wd">{weekdays.map((w) => <span key={w}>{w}</span>)}</div>
            <motion.div key={`${view.y}-${view.m}`} className="cal__grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {days.map((d, i) => {
                if (!d) return <span key={'e' + i} />;
                const k = iso(d);
                const runs = runsOn(k);
                return (
                  <button key={k} className={`cal__day ${runs.length ? 'has' : ''} ${sel === k ? 'is-sel' : ''} ${k === todayIso ? 'is-today' : ''}`} onClick={() => setSel(sel === k ? null : k)}>
                    <b>{d.getDate()}</b>
                    <span className="cal__dots">{runs.slice(0, 4).map((x) => <i key={x.slug} style={{ background: color[x.slug] }} />)}</span>
                  </button>
                );
              })}
            </motion.div>
            <div className="cal__legend">
              {monthTours.map(({ tour }) => <span key={tour.slug}><i style={{ background: color[tour.slug] }} />{tr(tour.name)}</span>)}
            </div>
          </div>

          <div className="cal-list">
            <h3>{sel ? `${t.pages.calSelected} ${fmtDate(sel, lang, { day: 'numeric', month: 'long' })}` : t.pages.calMonth}</h3>
            <AnimatePresence mode="popLayout">
              {shown.map(({ tour, deps }, i) => (
                <motion.div layout key={tour.slug} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/tours/${tour.slug}`} className="calcard" style={{ '--c': color[tour.slug] }}>
                    <img src={photo(tour.photo)} alt="" loading="lazy" />
                    <div>
                      <b>{tr(tour.name)}</b>
                      <small>{deps.map((d) => fmtRange(d, lang)).join(' · ')}</small>
                      <span className="calcard__row"><Level n={tour.level} /><Price tour={tour} /></span>
                    </div>
                    <Icon.arrow size={18} />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
            {!shown.length && <p className="empty">{t.pages.calEmpty}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
