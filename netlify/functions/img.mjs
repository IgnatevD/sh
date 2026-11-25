import { getStore } from '@netlify/blobs';

// Public image delivery from Netlify Blobs
export default async (req, context) => {
  const key = context.params?.key || new URL(req.url).pathname.split('/').pop();
  const store = getStore({ name: 'images' });
  const res = await store.getWithMetadata(key, { type: 'arrayBuffer' });
  if (!res) return new Response('Not found', { status: 404 });
  return new Response(res.data, {
    headers: {
      'content-type': res.metadata?.type || 'image/jpeg',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};

export const config = { path: '/api/img/:key' };
