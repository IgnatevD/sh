import { getStore } from '@netlify/blobs';
import { verify, json } from '../lib/auth.mjs';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX = 5.5 * 1024 * 1024;

// POST image bytes (Content-Type: image/*)  -> stores in Netlify Blobs
// POST JSON {fromUrl}                      -> server downloads an external photo and stores it (import from Weblium etc.)
// GET  (auth)                              -> list uploaded images
// DELETE ?key=...                          -> remove an image
export default async (req) => {
  if (!verify(req)) return json({ error: 'unauthorized' }, 401);
  const store = getStore({ name: 'images', consistency: 'strong' });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const { blobs } = await store.list();
    return json(blobs.map((b) => ({ key: b.key, url: `/api/img/${b.key}` })).reverse());
  }

  if (req.method === 'DELETE') {
    const key = url.searchParams.get('key');
    if (!key) return json({ error: 'key' }, 400);
    await store.delete(key);
    return json({ ok: true });
  }

  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  let type = (req.headers.get('content-type') || '').split(';')[0];
  let buf;
  if (type === 'application/json') {
    const { fromUrl } = await req.json();
    if (!/^https:\/\//.test(fromUrl || '')) return json({ error: 'bad_url' }, 400);
    const r = await fetch(fromUrl);
    if (!r.ok) return json({ error: 'fetch_failed', status: r.status }, 502);
    type = (r.headers.get('content-type') || 'image/jpeg').split(';')[0];
    buf = await r.arrayBuffer();
  } else {
    buf = await req.arrayBuffer();
  }
  if (!ALLOWED.includes(type)) return json({ error: 'type', type }, 415);
  if (buf.byteLength > MAX) return json({ error: 'too_big' }, 413);

  const ext = type.split('/')[1].replace('jpeg', 'jpg');
  const key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await store.set(key, buf, { metadata: { type } });
  return json({ key, url: `/api/img/${key}` });
};

export const config = { path: '/api/upload' };
