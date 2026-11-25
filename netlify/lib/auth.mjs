import { createHmac, timingSafeEqual } from 'node:crypto';

const secret = () => process.env.ADMIN_SECRET || '';

export function sign(hours = 12) {
  const exp = Date.now() + hours * 3600 * 1000;
  const sig = createHmac('sha256', secret()).update(String(exp)).digest('hex');
  return `${exp}.${sig}`;
}

export function verify(req) {
  if (!secret()) return false;
  const h = req.headers.get('authorization') || '';
  const token = h.replace(/^Bearer\s+/i, '');
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = createHmac('sha256', secret()).update(exp).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(good, 'hex'));
  } catch {
    return false;
  }
}

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', ...headers } });
