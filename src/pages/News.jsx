import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { photo, useContent, publishedTours } from '../content.jsx';
import { Icon } from '../components/Icons.jsx';
import { Head, fadeUp } from '../components/Sections.jsx';
import { fmtDate, TourCard } from '../components/Tours.jsx';
import PageHero from '../components/PageHero.jsx';
import NotFound from './NotFound.jsx';

export function NewsCard({ n, i = 0, big = false }) {
  const { tr, lang, t } = useI18n();
  return (
    <motion.article className={`newscard ${big ? 'newscard--big' : ''}`} variants={fadeUp} custom={i % 3} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <Link to={`/news/${n.slug}`} className="newscard__img">
        <img src={photo(n.photo)} alt="" loading="lazy" />
        <span className="newscard__date">{fmtDate(n.date, lang, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </Link>
      <div className="newscard__body">
        <div className="newscard__tags">{(n.tags || []).map((g) => <span key={g} className="tag">#{g}</span>)}</div>
        <h3><Link to={`/news/${n.slug}`}>{tr(n.title)}</Link></h3>
        <p>{tr(n.excerpt)}</p>
        <Link to={`/news/${n.slug}`} className="more">{t.pages.readMore} <Icon.arrow size={16} /></Link>
      </div>
    </motion.article>
  );
}

export default function NewsPage() {
  const { t } = useI18n();
  const { content } = useContent();
  const list = [...content.news].sort((a, b) => b.date.localeCompare(a.date));
  const [first, ...rest] = list;
  return (
    <>
      <PageHero title={t.pages.newsTitle} lead={t.pages.newsLead} img={first?.photo} />
      <section className="section">
        <div className="container">
          {first && <NewsCard n={first} big />}
          <div className="news__grid">
            {rest.map((n, i) => <NewsCard key={n.slug} n={n} i={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}

export function NewsPost() {
  const { slug } = useParams();
  const { t, tr, lang } = useI18n();
  const { content } = useContent();
  const { scrollYProgress } = useScroll();
  const n = content.news.find((x) => x.slug === slug);
  if (!n) return <NotFound />;
  const others = content.news.filter((x) => x.slug !== slug).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  // suggest tours that match the news tags
  const tags = (n.tags || []).join(' ').toLowerCase();
  const tours = publishedTours(content).filter((x) =>
    (tags.includes('mont blanc') && x.slug === 'tmb') || (tags.includes('matterhorn') && x.slug === 'zermatt-matterhorn') ||
    (tags.includes('madeira') && x.slug === 'madeira') || (tags.includes('morocco') && x.slug === 'toubkal-morocco')).slice(0, 2);
  return (
    <article className="post">
      <motion.div className="post__progress" style={{ scaleX: scrollYProgress }} />
      <PageHero title={tr(n.title)} lead={fmtDate(n.date, lang, { day: 'numeric', month: 'long', year: 'numeric' })} img={n.photo} small />
      <div className="container post__wrap">
        <Link to="/news" className="back"><Icon.left size={18} /> {t.pages.allNews}</Link>
        <p className="post__lead">{tr(n.excerpt)}</p>
        {tr(n.body).split(/\n\s*\n/).map((p, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>{p}</motion.p>
        ))}
        {n.source?.url && (
          <p className="post__source">{t.pages.source}: <a href={n.source.url} target="_blank" rel="noopener noreferrer">{n.source.name || n.source.url}</a></p>
        )}
      </div>
      {tours.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <Head eyebrow={t.pages.whereNext} title={t.pages.featured} />
            <div className="tours__grid">{tours.map((x, i) => <TourCard key={x.slug} tour={x} i={i} />)}</div>
          </div>
        </section>
      )}
      <section className="section section--tight">
        <div className="container">
          <Head eyebrow={t.nav.news} title={t.pages.latest} />
          <div className="news__grid">{others.map((x, i) => <NewsCard key={x.slug} n={x} i={i} />)}</div>
        </div>
      </section>
    </article>
  );
}
