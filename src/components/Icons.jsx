// Minimal inline icon set (stroke icons + brand marks)
const S = ({ children, size = 22, fill = 'none', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);

export const Icon = {
  telegram: (p) => (
    <svg width={p?.size || 22} height={p?.size || 22} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.3 13 1.5 11.5c-1-.3-1.1-1 .2-1.5L20.6 2.8c.9-.3 1.6.2 1.3 1.5z" /></svg>
  ),
  whatsapp: (p) => (
    <svg width={p?.size || 22} height={p?.size || 22} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z" /></svg>
  ),
  viber: (p) => (
    <svg width={p?.size || 22} height={p?.size || 22} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.4 1C8.6 1 3.3 1.5 2.1 6.3c-.6 2.4-.6 5-.6 6.6 0 1.6.1 4.6 2.9 5.9v2.6s0 1 .7.8c.6-.2 2.1-2 2.9-3 2.3.2 4.1.2 5.4 0 4-.6 7.5-1.8 8.1-8.2.6-6.7-.6-10.9-6.7-10.9h-3.4zm.3 2c3 0 5.5-.2 6.5 2.3.6 1.6.5 4.6.3 6-.5 4.3-2.7 5.2-6.2 5.8-1.3.2-3.3.1-4.6 0l-2.2 2.3v-2.4c-2.2-.9-2.3-3.1-2.3-4.5 0-1.5 0-3.5.5-5.4C4.6 3.4 8.6 3 11.7 3zm.6 2.2a.4.4 0 0 0 0 .8 5 5 0 0 1 5 5.1.4.4 0 1 0 .8 0 5.8 5.8 0 0 0-5.8-5.9zm-3.4.9c-.3 0-.6 0-.9.3-.6.6-1.3 1.3-1 2.3.6 1.8 2.6 4.7 5.6 6.2.9.4 1.6.6 2.2 0l.7-.7c.4-.4.3-1-.1-1.3l-1.4-1c-.4-.3-.9-.2-1.2.1l-.4.5c-.3.3-.8.2-1.3-.1-.9-.6-1.7-1.4-2.2-2.4-.3-.5-.2-.9.1-1.1l.5-.4c.3-.3.4-.8.1-1.2l-.9-1.4a.8.8 0 0 0-.8-.3zm3.6.6a.4.4 0 0 0 0 .8 2.6 2.6 0 0 1 2.6 2.7.4.4 0 1 0 .8 0 3.4 3.4 0 0 0-3.4-3.5zm.2 1.6a.4.4 0 0 0 0 .8.9.9 0 0 1 .9.9.4.4 0 1 0 .8 0 1.7 1.7 0 0 0-1.7-1.7z" /></svg>
  ),
  instagram: (p) => (<S {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></S>),
  facebook: (p) => (<S {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></S>),
  phone: (p) => (<S {...p}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" /></S>),
  mail: (p) => (<S {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></S>),
  arrow: (p) => (<S {...p}><path d="M5 12h14M13 6l6 6-6 6" /></S>),
  close: (p) => (<S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>),
  left: (p) => (<S {...p}><path d="m15 6-6 6 6 6" /></S>),
  right: (p) => (<S {...p}><path d="m9 6 6 6-6 6" /></S>),
  sun: (p) => (<S {...p}><circle cx="12" cy="12" r="4.5" /><path d="M12 1.5v2.5M12 20v2.5M4.2 4.2 6 6M18 18l1.8 1.8M1.5 12H4M20 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" /></S>),
  moon: (p) => (<S {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></S>),
  calendar: (p) => (<S {...p}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></S>),
  users: (p) => (<S {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5a3 3 0 0 1 0 6M18 14.6c2 .6 3 2.4 3 5.4" /></S>),
  pin: (p) => (<S {...p}><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></S>),
  route: (p) => (<S {...p}><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></S>),
  up: (p) => (<S {...p}><path d="M3 20 9 9l4 6 3-4 5 9z" /></S>),
  check: (p) => (<S {...p}><path d="m4 12 5 5L20 6" /></S>),
  minus: (p) => (<S {...p}><path d="M5 12h14" /></S>),
  chat: (p) => (<S {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z" /></S>),
  peak: (p) => (
    <svg width={p?.size || 18} height={p?.size || 18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 21 10 6l4 7 2-3 6 11z" /></svg>
  ),
};
