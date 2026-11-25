import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import { useContent, useLinks, publishedTours } from '../content.jsx';
import { Icon } from './Icons.jsx';
import { Head, fadeUp } from './Sections.jsx';
import GuideGirl from './GuideGirl.jsx';

const encode = (data) => Object.keys(data).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');

export default function Contacts({ presetTour = '' }) {
  const { t, tr } = useI18n();
  const { content } = useContent();
  const links = useLinks();
  const tours = publishedTours(content);
  const c = t.contacts;
  const [f, setF] = useState({ name: '', contact: '', tour: presetTour, people: '2', message: '' });
  const [state, setState] = useState({ s: 'idle', msg: '' });
  const tourNames = [...tours.map((x) => tr(x.name)), c.custom];
  const tourVal = f.tour || tourNames[0];
  const text = c.msgTpl.replace('{name}', f.name || '…').replace('{tour}', tourVal).replace('{people}', f.people).replace('{message}', f.message);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.contact.trim()) return setState({ s: 'err', msg: c.err });
    setState({ s: 'sending', msg: '' });
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'booking', ...f, tour: tourVal }),
      });
      if (!r.ok) throw new Error(r.status);
      setState({ s: 'ok', msg: c.ok });
      setF({ name: '', contact: '', tour: '', people: '2', message: '' });
    } catch (err) {
      setState({ s: 'err', msg: c.fallback });
    }
  };

  const copyAndOpenTg = () => {
    try { navigator.clipboard?.writeText(text); } catch (e) {}
  };

  const messengers = [
    { k: 'tg', href: links.telegram, icon: <Icon.telegram size={26} />, label: c.tg, sub: links.telegramLabel },
    { k: 'wa', href: links.whatsapp, icon: <Icon.whatsapp size={26} />, label: c.wa, sub: links.phonePretty },
    { k: 'vb', href: links.viber, icon: <Icon.viber size={26} />, label: c.viber, sub: links.phonePretty, self: true },
    { k: 'ph', href: links.phone, icon: <Icon.phone size={24} />, label: c.call, sub: links.phonePretty, self: true },
    { k: 'ig', href: links.instagram, icon: <Icon.instagram size={24} />, label: c.ig, sub: '@eliz_happytravel' },
    { k: 'ml', href: links.mail, icon: <Icon.mail size={24} />, label: c.mail, sub: links.email, self: true },
  ];

  return (
    <section className="section contacts" id="contacts">
      <div className="container contacts__grid">
        <div>
          <Head eyebrow={c.eyebrow} title={c.title} lead={c.text} center={false} camp={6} />
          <div className="messengers">
            {messengers.map((m, i) => (
              <motion.a key={m.k} href={m.href} target={m.self ? undefined : '_blank'} rel="noopener" className={`messenger msg--${m.k}`}
                variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -6 }} whileTap={{ scale: 0.95 }}>
                <span className="messenger__icon">{m.icon}</span>
                <span className="messenger__txt"><b>{m.label}</b><small>{m.sub}</small></span>
                <Icon.arrow size={18} className="messenger__go" />
              </motion.a>
            ))}
          </div>
        </div>

        <motion.form className="form" onSubmit={submit} name="booking" data-netlify="true" netlify-honeypot="bot-field"
          initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
          <div className="form__girl"><GuideGirl /></div>
          <h3>{c.formTitle}</h3>
          <input type="hidden" name="form-name" value="booking" />
          <p hidden><input name="bot-field" /></p>
          <label className="field"><input name="name" value={f.name} onChange={set('name')} placeholder=" " autoComplete="name" /><span>{c.name}</span></label>
          <label className="field"><input name="contact" value={f.contact} onChange={set('contact')} placeholder=" " /><span>{c.contact}</span></label>
          <div className="form__row">
            <label className="field field--select"><select name="tour" value={tourVal} onChange={set('tour')}>{tourNames.map((n) => <option key={n}>{n}</option>)}</select><span className="is-up">{c.tour}</span></label>
            <label className="field field--select field--sm"><select name="people" value={f.people} onChange={set('people')}>{['1', '2', '3', '4', '5+'].map((n) => <option key={n}>{n}</option>)}</select><span className="is-up">{c.people}</span></label>
          </div>
          <label className="field"><textarea name="message" rows="3" value={f.message} onChange={set('message')} placeholder=" " /><span>{c.message}</span></label>
          <button className="btn btn--primary btn--full" disabled={state.s === 'sending'}>
            {state.s === 'sending' ? '…' : c.send} <Icon.arrow size={18} />
          </button>
          <div className="form__alt">
            <a href={links.telegram} target="_blank" rel="noopener" onClick={copyAndOpenTg} className="msg--tg"><Icon.telegram size={16} />{c.sendTg}</a>
            <a href={links.waText(text)} target="_blank" rel="noopener" className="msg--wa"><Icon.whatsapp size={16} />{c.sendWa}</a>
          </div>
          {state.s === 'ok' && (
            <div className="summit-ok" aria-hidden="true">
              <svg viewBox="0 0 120 70"><path className="summit-ok__mtn" d="M4 66 L42 22 L58 40 L78 12 L116 66Z" /><g className="summit-ok__flag"><line x1="78" y1="12" x2="78" y2="-10" /><path d="M78 -10 L96 -5 L78 0Z" /></g></svg>
              <b>{t.summit}</b>
            </div>
          )}
          {state.msg && <motion.p className={`form__note is-${state.s}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{state.msg}</motion.p>}
        </motion.form>
      </div>
    </section>
  );
}
