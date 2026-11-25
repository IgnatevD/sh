import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seed } from './data/seed.js';

const CDN = 'https://res2.weblium.site/res/65cb5fe063b9d7000f1ece66/';

// Resolve any stored photo reference: full URL, site path (/api/img/..), or a Weblium id
export const photo = (src) => {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) return src;
  return `${CDN}${src}_optimized`;
};

const Ctx = createContext(null);

// Fill in anything missing in saved content from the seed (so new fields keep working)
function withDefaults(c) {
  if (!c || !Array.isArray(c.tours)) return seed;
  return {
    ...seed,
    ...c,
    settings: {
      ...seed.settings,
      ...(c.settings || {}),
      photos: { ...seed.settings.photos, ...(c.settings?.photos || {}) },
      contacts: { ...seed.settings.contacts, ...(c.settings?.contacts || {}) },
    },
    texts: { uk: {}, en: {}, ...(c.texts || {}) },
    news: c.news || seed.news,
    gallery: c.gallery || seed.gallery,
    stories: c.stories || seed.stories,
  };
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(seed);
  const [source, setSource] = useState('seed'); // 'seed' | 'live'
  useEffect(() => {
    let alive = true;
    fetch('/api/content', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null))
      .then((data) => {
        if (alive && data && Array.isArray(data.tours)) {
          setContent(withDefaults(data));
          setSource('live');
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const value = useMemo(() => ({ content, setContent: (c) => setContent(withDefaults(c)), source }), [content, source]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);

export const publishedTours = (content) => content.tours.filter((t) => t.status !== 'draft');

export function useLinks() {
  const { content } = useContent();
  const c = content.settings.contacts;
  const digits = (c.phone || '').replace(/[^\d]/g, '');
  const pretty = digits.length === 12 ? `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}` : c.phone;
  const wa = c.whatsapp || `https://wa.me/${digits}`;
  return {
    phonePretty: pretty,
    email: c.email,
    telegram: c.telegram ? `https://t.me/${c.telegram.replace(/^@/, '')}` : `https://t.me/+${digits}`,
    telegramLabel: c.telegram ? `@${c.telegram.replace(/^@/, '')}` : pretty,
    whatsapp: wa,
    waText: (text) => `https://wa.me/${digits}?text=${encodeURIComponent(text)}`,
    viber: `viber://chat?number=%2B${digits}`,
    phone: `tel:+${digits}`,
    mail: `mailto:${c.email}`,
    instagram: c.instagram,
    facebook: c.facebook,
  };
}
