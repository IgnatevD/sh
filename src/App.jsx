import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, Preloader, Altimeter, FloatingContact, Footer } from './components/Chrome.jsx';
import GuideBuddy from './components/GuideBuddy.jsx';
import ClickBurst from './components/ClickBurst.jsx';
import Home from './pages/Home.jsx';
import ToursPage, { TourPage } from './pages/Tours.jsx';
import CalendarPage from './pages/Calendar.jsx';
import NewsPage, { NewsPost } from './pages/News.jsx';
import { AboutPage, GalleryPage, ContactsPage } from './pages/Simple.jsx';
import NotFound from './pages/NotFound.jsx';

const Admin = lazy(() => import('./admin/Admin.jsx'));

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('eht-theme', theme); } catch (e) {}
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

// Which "spot" the guide should comment on
function useSpot(pathname) {
  const [section, setSection] = useState('top');
  useEffect(() => {
    if (pathname !== '/') return;
    setSection('top');
    const ids = ['top', 'tours', 'stories', 'about', 'gallery', 'reviews', 'contacts'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setSection(e.target.id));
    }, { rootMargin: '-40% 0px -55% 0px' });
    const t = setTimeout(() => ids.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); }), 300);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [pathname]);
  if (pathname === '/') return ['top', 'tours', 'contacts'].includes(section) ? section : 'home';
  if (pathname === '/tours') return 'tours';
  if (pathname.startsWith('/tours/')) return 'tour';
  if (pathname === '/calendar') return 'calendar';
  if (pathname === '/contacts') return 'contacts';
  if (pathname === '/news') return 'news';
  if (pathname.startsWith('/news/')) return 'post';
  if (pathname === '/about') return 'about';
  if (pathname === '/gallery') return 'gallery';
  return 'lost';
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const loc = useLocation();
  const [theme, toggleTheme] = useTheme();
  const isAdmin = loc.pathname.startsWith('/admin');
  const [loading, setLoading] = useState(() => !isAdmin && !sessionStorage.getItem('eht-loaded'));
  const [spotlight, setSpotlight] = useState(false);
  const done = useCallback(() => { setLoading(false); try { sessionStorage.setItem('eht-loaded', '1'); } catch (e) {} }, []);
  const spot = useSpot(loc.pathname);

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="admin-loading">…</div>}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <>
      <AnimatePresence>{loading && <Preloader key="pre" onDone={done} />}</AnimatePresence>
      <ScrollManager />
      <ClickBurst />
      <Header theme={theme} setTheme={toggleTheme} />
      <Altimeter />
      <AnimatePresence mode="wait">
        <motion.main key={loc.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <Routes location={loc}>
            <Route path="/" element={<Home ready={!loading} spotlight={spotlight} />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tours/:slug" element={<TourPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsPost />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </motion.main>
      </AnimatePresence>
      <GuideBuddy spot={spot} ready={!loading} onSpotlight={setSpotlight} />
      <FloatingContact />
    </>
  );
}
