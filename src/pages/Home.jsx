import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { useContent, publishedTours } from '../content.jsx';
import Hero from '../components/Hero.jsx';
import Stories from '../components/Stories.jsx';
import Gallery from '../components/Gallery.jsx';
import Contacts from '../components/Contacts.jsx';
import { TourCard } from '../components/Tours.jsx';
import { Manifesto, Stats, About, CtaBand, Reviews, Head } from '../components/Sections.jsx';
import { NewsCard } from './News.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Home({ ready, spotlight }) {
  const { t } = useI18n();
  const { content } = useContent();
  const tours = publishedTours(content);
  const featured = tours.filter((x) => x.featured).slice(0, 6);
  const news = [...content.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <>
      <Hero ready={ready} spotlight={spotlight} />
      <Manifesto />
      <Stats />
      <section className="section tours" id="tours">
        <div className="container">
          <Head eyebrow={t.tours.eyebrow} title={t.tours.title} lead={t.tours.lead} camp={1} />
          <div className="tours__grid" id="tours-grid">
            {(featured.length ? featured : tours.slice(0, 6)).map((tour, i) => <TourCard key={tour.slug} tour={tour} i={i} />)}
          </div>
          <div className="center">
            <Link to="/tours" className="btn btn--soft">{t.pages.allTours} ({tours.length}) <Icon.arrow size={18} /></Link>
            <Link to="/calendar" className="btn btn--ghost"><Icon.calendar size={18} /> {t.nav.calendar}</Link>
          </div>
        </div>
      </section>
      <Stories />
      <About />
      <CtaBand />
      <section className="section news-teaser">
        <div className="container">
          <Head eyebrow={t.nav.news} title={t.pages.latest} camp={4} />
          <div className="news__grid">
            {news.map((n, i) => <NewsCard key={n.slug} n={n} i={i} />)}
          </div>
          <div className="center"><Link to="/news" className="btn btn--soft">{t.pages.allNews} <Icon.arrow size={18} /></Link></div>
        </div>
      </section>
      <Gallery limit={12} />
      <Reviews />
      <Contacts />
    </>
  );
}
