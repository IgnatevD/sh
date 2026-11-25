import { getStore } from '@netlify/blobs';
import { verify, json } from '../lib/auth.mjs';

// Single JSON document with all editable site content (tours, news, gallery, stories, texts, settings)
export default async (req) => {
  const store = getStore({ name: 'site', consistency: 'strong' });

  if (req.method === 'GET') {
    const data = await store.get('content', { type: 'json' });
    return json(data || null, 200, { 'cache-control': 'no-cache' });
  }

  if (req.method === 'PUT') {
    if (!verify(req)) return json({ error: 'unauthorized' }, 401);
    let data;
    try { data = await req.json(); } catch { return json({ error: 'bad_json' }, 400); }
    if (!data || typeof data !== 'object' || !Array.isArray(data.tours)) return json({ error: 'bad_shape' }, 400);
    // keep a backup of the previous version
    const prev = await store.get('content', { type: 'text' });
    if (prev) await store.set(`backup-${new Date().toISOString().slice(0, 10)}`, prev);
    data.updatedAt = new Date().toISOString();
    await store.setJSON('content', data);
    return json({ ok: true, updatedAt: data.updatedAt });
  }

  if (req.method === 'DELETE') {
    if (!verify(req)) return json({ error: 'unauthorized' }, 401);
    await store.delete('content');
    return json({ ok: true });
  }

  return json({ error: 'method' }, 405);
};

export const config = { path: '/api/content' };
