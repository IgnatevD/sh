import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { photo, useContent, useLinks, publishedTours } from '../content.jsx';
import { Icon } from '../components/Icons.jsx';
import { Head } from '../components/Sections.jsx';
import { TourCard, Level, Price, Profile, fmtRange } from '../components/Tours.jsx';
import PageHero from '../components/PageHero.jsx';
import FilterChips from '../components/Filters.jsx';
import Contacts from '../components/Contacts.jsx';
import NotFound from './NotFound.jsx';

const MONTHS = (lang) => Array.from({ length: 12 }, (_, m) => new Date(2027, m, 1).toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-GB', { month: 'long' }));

export default function ToursPage() {
  const { t, lang } = useI18n();
  const { content } = useContent();
  const all = publishedTours(content);
  const [params, setParams] = useSearchParams();
  const region = params.get('region') || '';
  const level = params.get('level') || '';
  const month = params.get('month') || '';
  const set = (k, v) => {
    const p = new URLSearchParams(params);
    v ? p.set(k, v) : p.delete(k);
    setParams(p, { replace: true });
  };
  const regions = [...new Set(all.map((x) => x.region))];
  const list = all.filter((x) =>
    (!region || x.region === region) &&
    (!level || (level === 'easy' ? x.level <= 2 : level === 'mid' ? x.level === 3 : x.level >= 4)) &&
    (!month || (x.departures || []).some((d) => {
      const m = +month - 1;
      const a = new Date(d.start), b = new Date(d.end);
      return a.getMonth() === m || b.getMonth() === m;
    })));

  return (
    <>
      <PageHero title={t.pages.toursTitle} lead={t.pages.toursLead} img={all[0]?.gallery?.[0] || all[0]?.photo} />
      <section className="section section--tight">
        <div className="container">
          <div className="tfilters">
            <FilterChips value={region} onChange={(v) => set('region', v)}
              options={[['', t.pages.all, all.length], ...regions.map((r) => [r, t.pages.regions[r] || r, all.filter((x) => x.region === r).length])]} />
            <div className="tfilters__selects">
              <label className="sel"><span>{t.pages.level}</span>
                <select value={level} onChange={(e) => set('level', e.target.value)}>
                  <option value="">{t.pages.any}</option>
                  <option value="easy">{t.pages.levels[2]}</option>
                  <option value="mid">{t.pages.levels[3]}</option>
                  <option value="hard">{t.pages.levels[4]}</option>
                </select>
              </label>
              <label className="sel"><span>{t.pages.month}</span>
                <select value={month} onChange={(e) => set('month', e.target.value)}>
                  <option value="">{t.pages.any}</option>
                  {MONTHS(lang).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
              </label>
              {(region || level || month) && <button className="btn btn--sm btn--ghost" onClick={() => setParams({})}>{t.pages.reset}</button>}
            </div>
          </div>
          <p className="muted found">{t.pages.found}: <b>{list.length}</b></p>
          <motion.div layout className="tours__grid">
            <AnimatePresence mode="popLayout">
              {list.map((tour, i) => <TourCard key={tour.slug} tour={tour} i={i} />)}
            </AnimatePresence>
          </motion.div>
          {!list.length && <p className="empty">{t.pages.none}</p>}
        </div>
      </section>
    </>
  );
}

export function TourPage() {
  const { slug } = useParams();
  const { t, tr, lang } = useI18n();
  const { content } = useContent();
  const links = useLinks();
  const tour = content.tours.find((x) => x.slug === slug);
  const [img, setImg] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  useEffect(() => setImg(0), [slug]);
  if (!tour) return <NotFound />;
  const pics = [tour.photo, ...(tour.gallery || [])].filter(Boolean);
  const today = new Date().toISOString().slice(0, 10);
  const deps = (tour.departures || []).filter((d) => d.end >= today).sort((a, b) => a.start.localeCompare(b.start));
  const similar = publishedTours(content).filter((x) => x.slug !== slug && (x.region === tour.region || Math.abs(x.level - tour.level) <= 1)).slice(0, 3);
  const msg = lang === 'uk' ? `Привіт, Лізо! Хочу в тур «${tr(tour.name)}» 🏔` : `Hi Liza! I’d like to join “${tr(tour.name)}” 🏔`;

  return (
    <article className="tourpage">
      <section className="tp-hero" ref={ref}>
        <AnimatePresence mode="popLayout">
          <motion.img key={pics[img]} src={photo(pics[img])} alt="" style={{ y }} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
        </AnimatePresence>
        <div className="phero__shade" />
        <div className="container tp-hero__inner">
          <Link to="/tours" className="back back--light"><Icon.left size={18} /> {t.pages.back}</Link>
          <div className="tp-hero__chips">
            <span className="chip">{tr(tour.tag)}</span>
            {tour.isNew && <span className="chip chip--new">{t.pages.isNew}</span>}
          </div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>{tr(tour.name)}</motion.h1>
          <p className="tp-hero__countries"><Icon.pin size={18} /> {tr(tour.countries)}</p>
          <div className="tp-hero__thumbs">
            {pics.map((p, i) => (
              <button key={p + i} className={i === img ? 'is-on' : ''} onClick={() => setImg(i)}><img src={photo(p)} alt="" loading="lazy" /></button>
            ))}
          </div>
        </div>
        <svg className="phero__ridge" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80 L0 50 L160 18 L300 52 L460 8 L620 46 L760 22 L900 58 L1060 12 L1220 48 L1340 26 L1440 44 L1440 80Z" /></svg>
      </section>

      <div className="container tp-grid">
        <div className="tp-main">
          <div className="facts">
            <div><Icon.calendar size={18} /><b>{tour.days} {t.tours.days}</b><small>{tour.hikingDays} {t.tours.hiking}</small></div>
            <div><Icon.route size={18} /><b>~{tour.km} {t.tours.km}</b><small>↑ {Number(tour.gain).toLocaleString('uk-UA')} {t.tours.gain}</small></div>
            <div><Icon.up size={18} /><b>{Number(tour.maxAlt).toLocaleString('uk-UA')} m</b><small>{t.tours.maxAlt}</small></div>
            <div><Icon.peak size={18} /><b><Level n={tour.level} /></b><small>{tr(tour.difficulty)}</small></div>
            <div><Icon.users size={18} /><b>{tour.group} {t.tours.group}</b><small>{tour.deposit ? `${t.tours.deposit}: €${tour.deposit}` : ' '}</small></div>
            <div><Icon.pin size={18} /><b>{t.tours.meet}</b><small>{tr(tour.meet)}</small></div>
          </div>

          <p className="tp-intro">{tr(tour.intro)}</p>

          {tour.highlights?.length > 0 && (
            <>
              <h2 className="h3">{t.pages.highlights}</h2>
              <ul className="highlights">
                {tour.highlights.map((h, i) => (
                  <motion.li key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Icon.peak size={16} /> {tr(h)}
                  </motion.li>
                ))}
              </ul>
            </>
          )}

          <h2 className="h3">{t.tours.route}</h2>
          <Profile route={tour.route || []} />
          <ol className="days">
            {(tour.route || []).map((d, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i, 6) * 0.05 }}>
                <span className="days__n">{i + 1}</span>
                <span className="days__t">{tr(d)}</span>
                {d.km ? <span className="days__m">{d.km} {t.tours.km} · ▲{d.up} ▼{d.down}</span> : null}
              </motion.li>
            ))}
          </ol>

          <div className="incl">
            <div><h3>{t.tours.incl}</h3><ul>{(tour.included?.[lang] || []).map((x) => <li key={x}><Icon.check size={16} />{x}</li>)}</ul></div>
            <div><h3>{t.tours.excl}</h3><ul className="no">{(tour.notIncluded?.[lang] || []).map((x) => <li key={x}><Icon.minus size={16} />{x}</li>)}</ul></div>
          </div>
        </div>

        <aside className="tp-side">
          <div className="booking">
            <Price tour={tour} big />
            <h3>{t.pages.departures}</h3>
            <ul className="deps">
              {deps.length ? deps.map((d) => (
                <li key={d.start} className={`dep dep--${d.status || 'open'}`}>
                  <Icon.calendar size={16} /> <span>{fmtRange(d, lang)}</span>
                  <em>{t.pages.status[d.status || 'open']}</em>
                </li>
              )) : <li className="muted">{t.pages.onRequest}</li>}
            </ul>
            <a href={links.telegram} target="_blank" rel="noopener" className="btn btn--full msg--tg"><Icon.telegram size={18} /> Telegram</a>
            <a href={links.waText(msg)} target="_blank" rel="noopener" className="btn btn--full msg--wa"><Icon.whatsapp size={18} /> WhatsApp</a>
            <a href="#book" className="btn btn--full btn--primary">{t.tours.book} <Icon.arrow size={18} /></a>
            <p className="note">{lang === 'uk' ? '* Дати орієнтовні — уточнюйте в месенджері.' : '* Dates are indicative — confirm in a messenger.'}</p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <Head eyebrow={t.pages.whereNext} title={t.pages.similar} />
            <div className="tours__grid">{similar.map((x, i) => <TourCard key={x.slug} tour={x} i={i} />)}</div>
          </div>
        </section>
      )}
      <div id="book"><Contacts presetTour={tr(tour.name)} key={slug + lang} /></div>
    </article>
  );
}
