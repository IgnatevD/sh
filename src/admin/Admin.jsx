import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent, photo } from '../content.jsx';
import { seed } from '../data/seed.js';
import { EDITABLE_TEXTS, getText } from '../i18n.jsx';
import { galleryCats } from '../data/photos.js';
import { Icon } from '../components/Icons.jsx';

/* ------------------------------------------------------------------ API */
const TOKEN_KEY = 'eht-admin-token';
const getToken = () => sessionStorage.getItem(TOKEN_KEY) || '';
async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: { authorization: `Bearer ${getToken()}`, ...(opts.headers || {}) } });
  let data = null;
  try { data = await r.json(); } catch (e) {}
  if (!r.ok) throw Object.assign(new Error(data?.error || r.status), { status: r.status });
  return data;
}

// Downscale big photos in the browser before upload (max 2000px, JPEG 85%)
async function resizeImage(file, max = 2000) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), 'image/jpeg', 0.85));
}
async function uploadFile(file) {
  const blob = await resizeImage(file);
  const r = await api('/api/upload', { method: 'POST', headers: { 'content-type': blob.type || 'image/jpeg' }, body: blob });
  return r.url;
}

const slugify = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').slice(0, 60) || `item-${Date.now().toString(36)}`;
const clone = (o) => structuredClone(o);
const L = () => ({ uk: '', en: '' });

/* ------------------------------------------------------------------ fields */
function Field({ label, hint, children, wide }) {
  return (
    <label className={`af ${wide ? 'af--wide' : ''}`}>
      <span className="af__label">{label}</span>
      {children}
      {hint && <small className="af__hint">{hint}</small>}
    </label>
  );
}
const Txt = ({ label, value, onChange, hint, type = 'text', wide, placeholder }) => (
  <Field label={label} hint={hint} wide={wide}>
    <input type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)} />
  </Field>
);
function Bi({ label, value, onChange, area, rows = 3, hint, placeholder }) {
  const v = value || L();
  const Tag = area ? 'textarea' : 'input';
  return (
    <div className="af af--wide">
      <span className="af__label">{label}</span>
      <div className="bi">
        {['uk', 'en'].map((l) => (
          <div key={l} className="bi__col">
            <em>{l === 'uk' ? 'UA' : 'EN'}</em>
            <Tag rows={area ? rows : undefined} value={v[l] || ''} placeholder={placeholder?.[l] || ''} onChange={(e) => onChange({ ...v, [l]: e.target.value })} />
          </div>
        ))}
      </div>
      {hint && <small className="af__hint">{hint}</small>}
    </div>
  );
}
const Sel = ({ label, value, onChange, options }) => (
  <Field label={label}>
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </Field>
);
const Check = ({ label, value, onChange }) => (
  <label className="acheck"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {label}</label>
);

function ImageField({ label, value, onChange, library, compact }) {
  const [busy, setBusy] = useState(false);
  const [pick, setPick] = useState(false);
  const ref = useRef();
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadFile(f)); } catch (err) { alert('Не вдалося завантажити фото: ' + err.message); }
    setBusy(false);
    e.target.value = '';
  };
  return (
    <div className={`aimg ${compact ? 'aimg--compact' : ''}`}>
      {label && <span className="af__label">{label}</span>}
      <div className="aimg__row">
        <div className="aimg__prev">{value ? <img src={photo(value)} alt="" /> : <span>немає фото</span>}{busy && <i className="aimg__busy">⏳</i>}</div>
        <div className="aimg__ctrl">
          <button type="button" className="abtn abtn--primary" onClick={() => ref.current.click()} disabled={busy}>⬆ {value ? 'Замінити' : 'Завантажити'}</button>
          {library?.length > 0 && <button type="button" className="abtn" onClick={() => setPick(!pick)}>🖼 З медіатеки</button>}
          {!compact && <input className="aimg__url" value={value || ''} placeholder="або вставте URL фото" onChange={(e) => onChange(e.target.value.trim())} />}
          <input ref={ref} type="file" accept="image/*" hidden onChange={onFile} />
        </div>
      </div>
      {pick && (
        <div className="aimg__lib">
          {library.map((u) => <button type="button" key={u} onClick={() => { onChange(u); setPick(false); }}><img src={u} alt="" loading="lazy" /></button>)}
        </div>
      )}
    </div>
  );
}

// Generic list editor with add / remove / reorder
function ListEd({ title, items, onChange, make, render, addLabel = '+ Додати', compact }) {
  const list = items || [];
  const set = (i, v) => onChange(list.map((x, k) => (k === i ? v : x)));
  const move = (i, d) => {
    const n = [...list]; const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };
  return (
    <div className="alist">
      {title && <h4>{title} <small>({list.length})</small></h4>}
      {list.map((it, i) => (
        <div className={`alist__item ${compact ? 'alist__item--compact' : ''}`} key={i}>
          <div className="alist__body">{render(it, (v) => set(i, v), i)}</div>
          <div className="alist__ctrl">
            <button type="button" onClick={() => move(i, -1)} title="Вгору">↑</button>
            <button type="button" onClick={() => move(i, 1)} title="Вниз">↓</button>
            <button type="button" className="danger" onClick={() => confirm('Видалити?') && onChange(list.filter((_, k) => k !== i))} title="Видалити">✕</button>
          </div>
        </div>
      ))}
      <button type="button" className="abtn" onClick={() => onChange([...list, make()])}>{addLabel}</button>
    </div>
  );
}

function MultiUpload({ onUploaded, label = '⬆ Завантажити кілька фото' }) {
  const ref = useRef();
  const [busy, setBusy] = useState(0);
  const onFiles = async (e) => {
    const files = [...(e.target.files || [])];
    setBusy(files.length);
    const urls = [];
    for (const f of files) {
      try { urls.push(await uploadFile(f)); } catch (err) { alert(`${f.name}: ${err.message}`); }
      setBusy((b) => b - 1);
    }
    onUploaded(urls);
    e.target.value = '';
  };
  return (
    <>
      <button type="button" className="abtn abtn--primary" onClick={() => ref.current.click()} disabled={busy > 0}>{busy > 0 ? `Завантаження… (${busy})` : label}</button>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={onFiles} />
    </>
  );
}

/* ------------------------------------------------------------------ editors */
const REGIONS = [['alps', 'Альпи'], ['dolomites', 'Доломіти'], ['balkans', 'Балкани'], ['scandinavia', 'Скандинавія'], ['morocco', 'Марокко'], ['islands', 'Острови'], ['carpathians', 'Карпати й Татри'], ['iberia', 'Іспанія']];

function newTour() {
  const base = clone(seed.tours[0]);
  return {
    ...base, slug: `tour-${Date.now().toString(36)}`, status: 'draft', featured: false, isNew: true,
    name: L(), tag: L(), countries: L(), photo: '', gallery: [], intro: L(), highlights: [], route: [], departures: [],
    price: null, deposit: null, meet: L(), difficulty: L(),
  };
}

function TourEditor({ tour, set, library }) {
  const u = (k) => (v) => set({ ...tour, [k]: v });
  const lines = (o) => ({ uk: (o?.uk || []).join('\n'), en: (o?.en || []).join('\n') });
  const unlines = (v) => ({ uk: v.uk.split('\n').map((s) => s.trim()).filter(Boolean), en: v.en.split('\n').map((s) => s.trim()).filter(Boolean) });
  return (
    <div className="aform">
      <div className="agrid">
        <Txt label="Адреса сторінки (slug)" value={tour.slug} onChange={(v) => u('slug')(slugify(v))} hint={`/tours/${tour.slug}`} />
        <Sel label="Статус" value={tour.status || 'published'} onChange={u('status')} options={[['published', '✅ Опубліковано'], ['draft', '📝 Чернетка (не видно на сайті)']]} />
        <Sel label="Регіон" value={tour.region} onChange={u('region')} options={REGIONS} />
        <Sel label="Складність" value={String(tour.level)} onChange={(v) => u('level')(Number(v))} options={[['1', '1 — дуже легко'], ['2', '2 — легко'], ['3', '3 — середньо'], ['4', '4 — вище середнього'], ['5', '5 — складно']]} />
      </div>
      <div className="arow">
        <Check label="Показувати на головній" value={tour.featured} onChange={u('featured')} />
        <Check label="Мітка «Новинка»" value={tour.isNew} onChange={u('isNew')} />
      </div>
      <Bi label="Назва туру" value={tour.name} onChange={u('name')} />
      <Bi label="Мітка на фото" value={tour.tag} onChange={u('tag')} />
      <Bi label="Країни" value={tour.countries} onChange={u('countries')} />
      <ImageField label="Головне фото" value={tour.photo} onChange={u('photo')} library={library} />
      <div className="alist">
        <h4>Галерея туру <small>({(tour.gallery || []).length})</small></h4>
        <div className="athumbs">
          {(tour.gallery || []).map((g, i) => (
            <div key={g + i} className="athumbs__it">
              <img src={photo(g)} alt="" />
              <button type="button" onClick={() => u('gallery')(tour.gallery.filter((_, k) => k !== i))}>✕</button>
            </div>
          ))}
        </div>
        <MultiUpload onUploaded={(urls) => u('gallery')([...(tour.gallery || []), ...urls])} />
      </div>
      <div className="agrid">
        <Txt label="Днів" type="number" value={tour.days} onChange={u('days')} />
        <Txt label="Ходових днів" type="number" value={tour.hikingDays} onChange={u('hikingDays')} />
        <Txt label="Дистанція, км" type="number" value={tour.km} onChange={u('km')} />
        <Txt label="Набір висоти, м" type="number" value={tour.gain} onChange={u('gain')} />
        <Txt label="Макс. висота, м" type="number" value={tour.maxAlt} onChange={u('maxAlt')} />
        <Txt label="Група (напр. 4–10)" value={tour.group} onChange={u('group')} />
        <Txt label="Ціна, € (порожньо = «за запитом»)" type="number" value={tour.price} onChange={u('price')} />
        <Txt label="Передоплата, €" type="number" value={tour.deposit} onChange={u('deposit')} />
      </div>
      <Bi label="Місце зустрічі" value={tour.meet} onChange={u('meet')} />
      <Bi label="Складність (текст)" value={tour.difficulty} onChange={u('difficulty')} />
      <Bi label="Опис туру" value={tour.intro} onChange={u('intro')} area rows={6} />

      <ListEd title="📅 Дати виїздів (для календаря)" items={tour.departures} onChange={u('departures')} compact
        make={() => ({ start: '', end: '', status: 'open' })}
        render={(d, s) => (
          <div className="agrid agrid--3">
            <Txt label="Початок" type="date" value={d.start} onChange={(v) => s({ ...d, start: v })} />
            <Txt label="Кінець" type="date" value={d.end} onChange={(v) => s({ ...d, end: v })} />
            <Sel label="Місця" value={d.status} onChange={(v) => s({ ...d, status: v })} options={[['open', 'Є місця'], ['few', 'Мало місць'], ['full', 'Немає місць']]} />
          </div>
        )} />

      <ListEd title="⭐ Родзинки" items={tour.highlights} onChange={u('highlights')} make={L} render={(h, s) => <Bi label="Пункт" value={h} onChange={s} />} />

      <ListEd title="🗺 Маршрут по днях" items={tour.route} onChange={u('route')} make={() => ({ uk: '', en: '' })}
        render={(d, s, i) => (
          <>
            <Bi label={`День ${i + 1}`} value={d} onChange={(v) => s({ ...d, ...v })} />
            <div className="agrid agrid--3">
              <Txt label="км" type="number" value={d.km} onChange={(v) => s({ ...d, km: v })} />
              <Txt label="▲ набір, м" type="number" value={d.up} onChange={(v) => s({ ...d, up: v })} />
              <Txt label="▼ скид, м" type="number" value={d.down} onChange={(v) => s({ ...d, down: v })} />
            </div>
          </>
        )} />

      <Bi label="Включено (кожен пункт з нового рядка)" value={lines(tour.included)} onChange={(v) => u('included')(unlines(v))} area rows={5} />
      <Bi label="Не включено (кожен пункт з нового рядка)" value={lines(tour.notIncluded)} onChange={(v) => u('notIncluded')(unlines(v))} area rows={4} />
    </div>
  );
}

function NewsEditor({ n, set, library }) {
  const u = (k) => (v) => set({ ...n, [k]: v });
  return (
    <div className="aform">
      <div className="agrid">
        <Txt label="Адреса (slug)" value={n.slug} onChange={(v) => u('slug')(slugify(v))} hint={`/news/${n.slug}`} />
        <Txt label="Дата" type="date" value={n.date} onChange={u('date')} />
        <Txt label="Теги (через кому)" value={(n.tags || []).join(', ')} onChange={(v) => u('tags')(v.split(',').map((s) => s.trim()).filter(Boolean))} />
      </div>
      <Bi label="Заголовок" value={n.title} onChange={u('title')} />
      <Bi label="Короткий опис" value={n.excerpt} onChange={u('excerpt')} area rows={2} />
      <Bi label="Текст новини (абзаци розділяйте порожнім рядком)" value={n.body} onChange={u('body')} area rows={10} />
      <ImageField label="Фото" value={n.photo} onChange={u('photo')} library={library} />
      <div className="agrid">
        <Txt label="Джерело — назва" value={n.source?.name} onChange={(v) => u('source')({ ...(n.source || {}), name: v })} />
        <Txt label="Джерело — посилання" value={n.source?.url} onChange={(v) => u('source')({ ...(n.source || {}), url: v })} />
      </div>
    </div>
  );
}

// master list + detail editor for tours / news
function Collection({ items, onChange, make, title, label, renderEditor, sortBy }) {
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState('');
  const list = items.map((x, i) => ({ x, i })).filter(({ x }) => !q || JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));
  if (sortBy) list.sort((a, b) => sortBy(a.x, b.x));
  const cur = sel != null ? items[sel] : null;
  return (
    <div className="acoll">
      <div className="acoll__list">
        <div className="acoll__top">
          <input placeholder="Пошук…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="abtn abtn--primary" onClick={() => { onChange([make(), ...items]); setSel(0); }}>+ {title}</button>
        </div>
        {list.map(({ x, i }) => (
          <button key={i} className={`acoll__it ${sel === i ? 'is-on' : ''}`} onClick={() => setSel(i)}>
            {x.photo ? <img src={photo(x.photo)} alt="" /> : <span className="acoll__ph" />}
            <span><b>{label(x)}</b><small>{x.status === 'draft' ? '📝 чернетка' : x.date || x.region || ''}</small></span>
          </button>
        ))}
      </div>
      <div className="acoll__edit">
        {cur ? (
          <>
            <div className="acoll__bar">
              <h3>{label(cur) || 'Без назви'}</h3>
              <div>
                <button className="abtn" onClick={() => { const c = clone(cur); c.slug = `${c.slug}-copy`; onChange([...items.slice(0, sel + 1), c, ...items.slice(sel + 1)]); }}>⎘ Дублювати</button>
                <button className="abtn danger" onClick={() => { if (confirm('Видалити назавжди?')) { onChange(items.filter((_, k) => k !== sel)); setSel(null); } }}>🗑 Видалити</button>
              </div>
            </div>
            {renderEditor(cur, (v) => onChange(items.map((x, k) => (k === sel ? v : x))))}
          </>
        ) : <p className="aempty">← Оберіть елемент зі списку або створіть новий</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ tabs */
function MediaTab({ library, reload, draft, setDraft }) {
  const [busy, setBusy] = useState('');
  const isWeblium = (s) => typeof s === 'string' && /^[a-f0-9]{24}$/.test(s);
  const collect = (o, acc = new Set()) => {
    if (typeof o === 'string') { if (isWeblium(o)) acc.add(o); }
    else if (Array.isArray(o)) o.forEach((x) => collect(x, acc));
    else if (o && typeof o === 'object') Object.values(o).forEach((x) => collect(x, acc));
    return acc;
  };
  const replaceDeep = (o, map) => {
    if (typeof o === 'string') return map[o] || o;
    if (Array.isArray(o)) return o.map((x) => replaceDeep(x, map));
    if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, replaceDeep(v, map)]));
    return o;
  };
  const external = [...collect(draft)];
  const importAll = async () => {
    if (!confirm(`Перенести ${external.length} фото з сайту Weblium у сховище вашого сайту? Це займе кілька хвилин.`)) return;
    const map = {};
    let i = 0;
    for (const id of external) {
      setBusy(`Перенесення ${++i} / ${external.length}…`);
      try {
        const r = await api('/api/upload', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fromUrl: photo(id) }) });
        map[id] = r.url;
      } catch (e) { console.warn(id, e); }
    }
    setDraft(replaceDeep(draft, map));
    setBusy(`Готово: перенесено ${Object.keys(map).length}. Не забудьте натиснути «Зберегти».`);
    reload();
  };
  const del = async (key) => {
    if (!confirm('Видалити фото зі сховища? Якщо воно використовується на сайті — там зникне картинка.')) return;
    await api(`/api/upload?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
    reload();
  };
  return (
    <div className="aform">
      <p className="ainfo">Тут усі фото, завантажені у сховище сайту. Їх можна обирати в будь-якому полі «Фото» кнопкою «З медіатеки».</p>
      <div className="arow"><MultiUpload onUploaded={() => reload()} /></div>
      {external.length > 0 && (
        <div className="ainfo ainfo--warn">
          <b>{external.length} фото</b> зараз завантажуються з сайту-донора (Weblium). Якщо той сайт видалять — фото зникнуть.
          <button className="abtn abtn--primary" onClick={importAll} disabled={!!busy}>Перенести всі у своє сховище</button>
        </div>
      )}
      {busy && <p className="ainfo">{busy}</p>}
      <div className="amedia">
        {library.map((u) => (
          <div key={u} className="amedia__it">
            <img src={u} alt="" loading="lazy" />
            <div><button onClick={() => navigator.clipboard?.writeText(location.origin + u)}>🔗</button><button className="danger" onClick={() => del(u.split('/').pop())}>✕</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab({ draft, setDraft, library }) {
  const g = draft.gallery;
  const set = (v) => setDraft({ ...draft, gallery: v });
  return (
    <div className="aform">
      <div className="arow"><MultiUpload label="⬆ Додати фото в галерею" onUploaded={(urls) => set([...urls.map((id) => ({ id, cat: 'alps' })), ...g])} /></div>
      <div className="agal">
        {g.map((it, i) => (
          <div className="agal__it" key={it.id + i}>
            <ImageField value={it.id} onChange={(v) => set(g.map((x, k) => (k === i ? { ...x, id: v } : x)))} library={library} compact />
            <select value={it.cat} onChange={(e) => set(g.map((x, k) => (k === i ? { ...x, cat: e.target.value } : x)))}>
              {galleryCats.filter((c) => c !== 'all').map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="agal__ctrl">
              <button onClick={() => { if (i > 0) { const n = [...g]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; set(n); } }}>←</button>
              <button onClick={() => { if (i < g.length - 1) { const n = [...g]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; set(n); } }}>→</button>
              <button className="danger" onClick={() => confirm('Прибрати з галереї?') && set(g.filter((_, k) => k !== i))}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoriesTab({ draft, setDraft, library }) {
  return (
    <div className="aform">
      <ListEd items={draft.stories} onChange={(v) => setDraft({ ...draft, stories: v })} addLabel="+ Нова сторіз"
        make={() => ({ key: `s-${Date.now().toString(36)}`, title: L(), cover: '', slides: [] })}
        render={(s, set) => (
          <>
            <Bi label="Назва кружечка" value={s.title} onChange={(v) => set({ ...s, title: v })} />
            <ImageField label="Обкладинка" value={s.cover} onChange={(v) => set({ ...s, cover: v })} library={library} />
            <ListEd title="Слайди" items={s.slides} onChange={(v) => set({ ...s, slides: v })} make={() => ({ id: '', text: L() })} compact
              render={(sl, ss) => (
                <div className="agrid agrid--img">
                  <ImageField value={sl.id} onChange={(v) => ss({ ...sl, id: v })} library={library} compact />
                  <Bi label="Підпис" value={sl.text} onChange={(v) => ss({ ...sl, text: v })} />
                </div>
              )} />
          </>
        )} />
    </div>
  );
}

function HomeTab({ draft, setDraft, library }) {
  const st = draft.settings;
  const setS = (v) => setDraft({ ...draft, settings: { ...st, ...v } });
  const ph = st.photos;
  const names = { aboutMain: 'Про мене — головне фото', aboutB: 'Про мене — фото 2', aboutC: 'Про мене — фото 3', cta: 'Банер «Твоя вершина чекає»', aboutHero: 'Фон сторінки «Про мене»', aboutPortrait: 'Портрет Лізи на сторінці «Про мене»', contactsHero: 'Фон сторінки «Контакти»', galleryHero: 'Фон сторінки «Галерея»', reviewSveta: 'Відгук 1 — фото', reviewMikhail: 'Відгук 2 — фото', reviewLeonid: 'Відгук 3 — фото' };
  return (
    <div className="aform">
      <div className="alist">
        <h4>Слайди першого екрана <small>({st.heroSlides.length})</small></h4>
        <div className="athumbs athumbs--big">
          {st.heroSlides.map((s, i) => (
            <div key={s + i} className="athumbs__it">
              <img src={photo(s)} alt="" />
              <button onClick={() => setS({ heroSlides: st.heroSlides.filter((_, k) => k !== i) })}>✕</button>
              {i > 0 && <button className="athumbs__l" onClick={() => { const n = [...st.heroSlides]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setS({ heroSlides: n }); }}>←</button>}
            </div>
          ))}
        </div>
        <MultiUpload label="⬆ Додати слайди" onUploaded={(urls) => setS({ heroSlides: [...st.heroSlides, ...urls] })} />
      </div>
      <div className="agrid agrid--2">
        {Object.keys(names).map((k) => (
          <ImageField key={k} label={names[k]} value={ph[k]} onChange={(v) => setS({ photos: { ...ph, [k]: v } })} library={library} />
        ))}
      </div>
    </div>
  );
}

function TextsTab({ draft, setDraft }) {
  const tx = draft.texts || { uk: {}, en: {} };
  const set = (path, v) => setDraft({ ...draft, texts: { uk: { ...tx.uk, [path]: v.uk }, en: { ...tx.en, [path]: v.en } } });
  return (
    <div className="aform">
      <p className="ainfo">Залиште поле порожнім — і на сайті буде стандартний текст (показаний сірим).</p>
      {EDITABLE_TEXTS.map((p) => (
        <Bi key={p} label={p} value={{ uk: tx.uk?.[p] || '', en: tx.en?.[p] || '' }} onChange={(v) => set(p, v)}
          area={/sub|p1|p2|quote|text|tip|Lead/.test(p)} rows={3} placeholder={{ uk: getText('uk', p), en: getText('en', p) }} />
      ))}
    </div>
  );
}

function ContactsTab({ draft, setDraft }) {
  const c = draft.settings.contacts;
  const set = (k) => (v) => setDraft({ ...draft, settings: { ...draft.settings, contacts: { ...c, [k]: v } } });
  return (
    <div className="aform agrid agrid--2">
      <Txt label="Телефон (для дзвінків, Viber, WhatsApp)" value={c.phone} onChange={set('phone')} placeholder="+380..." />
      <Txt label="Telegram username (без @)" value={c.telegram} onChange={set('telegram')} hint="Порожньо — відкриється чат за номером телефону" />
      <Txt label="WhatsApp посилання" value={c.whatsapp} onChange={set('whatsapp')} />
      <Txt label="Email" value={c.email} onChange={set('email')} />
      <Txt label="Instagram" value={c.instagram} onChange={set('instagram')} />
      <Txt label="Facebook" value={c.facebook} onChange={set('facebook')} />
    </div>
  );
}

function BackupTab({ draft, setDraft }) {
  const ref = useRef();
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }));
    a.download = `eliz-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  const upload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try { const d = JSON.parse(await f.text()); if (!Array.isArray(d.tours)) throw new Error('bad file'); setDraft(d); alert('Імпортовано. Натисніть «Зберегти», щоб опублікувати.'); } catch (err) { alert('Невірний файл'); }
  };
  return (
    <div className="aform">
      <p className="ainfo">Кожне збереження автоматично робить резервну копію попередньої версії на сервері (одна на день). Тут можна завантажити копію собі.</p>
      <div className="arow">
        <button className="abtn abtn--primary" onClick={download}>⬇ Завантажити копію (JSON)</button>
        <button className="abtn" onClick={() => ref.current.click()}>⬆ Імпортувати з файлу</button>
        <input ref={ref} type="file" accept="application/json" hidden onChange={upload} />
        <button className="abtn danger" onClick={() => confirm('Повернути весь контент до початкового? Ваші зміни буде замінено (після «Зберегти»).') && setDraft(clone(seed))}>↺ Скинути до початкового</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shell */
function Login({ onIn }) {
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: p }) });
      const ct = r.headers.get('content-type') || '';
      if (!ct.includes('json')) throw new Error('no_api');
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      sessionStorage.setItem(TOKEN_KEY, d.token);
      onIn();
    } catch (e2) {
      setErr(e2.message === 'wrong_password' ? 'Невірний пароль' : e2.message === 'not_configured' ? 'На Netlify не задані ADMIN_PASSWORD та ADMIN_SECRET' : e2.message === 'no_api' ? 'Сервер адмінки недоступний. Адмінка працює на Netlify (або локально через «netlify dev»).' : 'Помилка: ' + e2.message);
    }
    setBusy(false);
  };
  return (
    <div className="alogin">
      <form onSubmit={go}>
        <svg viewBox="0 0 44 30" className="alogin__logo"><path d="M2 28 L15 8 L21 17 L28 4 L42 28Z" /></svg>
        <h1>Адмінка</h1>
        <p>Eliz Happy Travel</p>
        <input type="password" placeholder="Пароль адміністратора" value={p} onChange={(e) => setP(e.target.value)} autoFocus />
        <button className="abtn abtn--primary" disabled={busy}>{busy ? '…' : 'Увійти'}</button>
        {err && <p className="alogin__err">{err}</p>}
        <Link to="/">← на сайт</Link>
      </form>
    </div>
  );
}

const TABS = [
  ['tours', '🏔 Тури'], ['news', '📰 Новини'], ['gallery', '🖼 Галерея'], ['stories', '⭕ Сторіз'],
  ['home', '🏠 Головна і фото'], ['texts', '✏️ Тексти'], ['contacts', '📞 Контакти'], ['media', '📁 Медіатека'], ['backup', '💾 Копії'],
];

export default function Admin() {
  const { content, setContent } = useContent();
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState('tours');
  const [draft, setDraftRaw] = useState(() => clone(content));
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [library, setLibrary] = useState([]);
  const [menu, setMenu] = useState(false);

  useEffect(() => { document.title = 'Адмінка — Eliz Happy Travel'; }, []);
  // load latest live content when entering
  useEffect(() => {
    if (!authed) return;
    fetch('/api/content').then((r) => r.json()).then((d) => { if (d && Array.isArray(d.tours) && !dirty) { setContent(d); setDraftRaw(clone({ ...content, ...d })); } }).catch(() => {});
    reloadLib();
  }, [authed]); // eslint-disable-line

  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    addEventListener('beforeunload', warn);
    return () => removeEventListener('beforeunload', warn);
  }, [dirty]);

  const reloadLib = () => api('/api/upload').then((l) => setLibrary(l.map((x) => x.url))).catch((e) => { if (e.status === 401) logout(); });
  const setDraft = (d) => { setDraftRaw(d); setDirty(true); setStatus(''); };
  const logout = () => { sessionStorage.removeItem(TOKEN_KEY); setAuthed(false); };

  const save = async () => {
    // basic validation
    const slugs = draft.tours.map((t) => t.slug);
    const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
    if (dup) return setStatus(`❌ Дві сторінки з однаковою адресою: ${dup}`);
    setStatus('Збереження…');
    try {
      await api('/api/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(draft) });
      setContent(draft);
      setDirty(false);
      setStatus('✅ Збережено — зміни вже на сайті');
    } catch (e) {
      if (e.status === 401) { setStatus('Сесія завершилась — увійдіть знову'); logout(); }
      else setStatus('❌ Помилка збереження: ' + e.message);
    }
  };

  if (!authed) return <Login onIn={() => setAuthed(true)} />;

  return (
    <div className="adm">
      <aside className={`adm__side ${menu ? 'is-open' : ''}`}>
        <div className="adm__brand"><svg viewBox="0 0 44 30"><path d="M2 28 L15 8 L21 17 L28 4 L42 28Z" /></svg> Адмінка</div>
        <nav>
          {TABS.map(([k, l]) => <button key={k} className={tab === k ? 'is-on' : ''} onClick={() => { setTab(k); setMenu(false); }}>{l}</button>)}
        </nav>
        <div className="adm__side-foot">
          <Link to="/" target="_blank">↗ Відкрити сайт</Link>
          <button onClick={logout}>Вийти</button>
        </div>
      </aside>
      <div className="adm__main">
        <header className="adm__top">
          <button className="adm__burger" onClick={() => setMenu(!menu)}>☰</button>
          <h2>{TABS.find((x) => x[0] === tab)[1]}</h2>
          <span className="adm__status">{status || (dirty ? '● Є незбережені зміни' : '')}</span>
          <button className="abtn abtn--primary abtn--save" onClick={save} disabled={!dirty}>💾 Зберегти</button>
        </header>
        <div className="adm__body">
          {tab === 'tours' && (
            <Collection items={draft.tours} onChange={(v) => setDraft({ ...draft, tours: v })} make={newTour} title="Тур" label={(x) => x.name?.uk || x.slug}
              renderEditor={(cur, set) => <TourEditor tour={cur} set={set} library={library} />} />
          )}
          {tab === 'news' && (
            <Collection items={draft.news} onChange={(v) => setDraft({ ...draft, news: v })} title="Новина" label={(x) => x.title?.uk || x.slug}
              sortBy={(a, b) => (b.date || '').localeCompare(a.date || '')}
              make={() => ({ slug: `news-${Date.now().toString(36)}`, date: new Date().toISOString().slice(0, 10), title: L(), excerpt: L(), body: L(), photo: '', tags: [], source: { name: '', url: '' } })}
              renderEditor={(cur, set) => <NewsEditor n={cur} set={set} library={library} />} />
          )}
          {tab === 'gallery' && <GalleryTab draft={draft} setDraft={setDraft} library={library} />}
          {tab === 'stories' && <StoriesTab draft={draft} setDraft={setDraft} library={library} />}
          {tab === 'home' && <HomeTab draft={draft} setDraft={setDraft} library={library} />}
          {tab === 'texts' && <TextsTab draft={draft} setDraft={setDraft} />}
          {tab === 'contacts' && <ContactsTab draft={draft} setDraft={setDraft} />}
          {tab === 'media' && <MediaTab library={library} reload={reloadLib} draft={draft} setDraft={setDraft} />}
          {tab === 'backup' && <BackupTab draft={draft} setDraft={setDraft} />}
        </div>
      </div>
    </div>
  );
}
