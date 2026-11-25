import { timingSafeEqual } from 'node:crypto';
import { sign, json } from '../lib/auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass || !process.env.ADMIN_SECRET) return json({ error: 'not_configured' }, 500);
  let body = {};
  try { body = await req.json(); } catch {}
  const a = Buffer.from(String(body.password || ''));
  const b = Buffer.from(pass);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return json({ error: 'wrong_password' }, 401);
  }
  return json({ token: sign(12) });
};

export const config = { path: '/api/login' };
