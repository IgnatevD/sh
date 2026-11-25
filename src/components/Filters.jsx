import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { Icon } from './Icons.jsx';

// Filter chips that wrap onto new lines (never scroll sideways).
// If they need more than `rows` lines, the rest folds away behind a "More" toggle.
export default function FilterChips({ options, value, onChange, rows = 2, center = false }) {
  const { lang } = useI18n();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(null);   // collapsed height in px
  const [hidden, setHidden] = useState(0);    // how many chips are folded away

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    const chips = [...el.querySelectorAll('.fchip')];
    if (!chips.length) return;
    const tops = [...new Set(chips.map((c) => c.offsetTop))].sort((a, b) => a - b);
    if (tops.length <= rows) { setLimit(null); setHidden(0); return; }
    const cutTop = tops[rows];
    setLimit(cutTop - 2);
    setHidden(chips.filter((c) => c.offsetTop >= cutTop).length);
  };

  useLayoutEffect(measure, [options.length, lang]); // eslint-disable-line
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    ref.current && ro.observe(ref.current);
    return () => ro.disconnect();
  }, []); // eslint-disable-line

  // keep the selected chip visible: unfold if it sits in a hidden row
  useEffect(() => {
    if (!limit || open) return;
    const on = ref.current?.querySelector('.fchip.is-on');
    if (on && on.offsetTop >= limit) setOpen(true);
  }, [value, limit]); // eslint-disable-line

  const collapsed = limit && !open;
  return (
    <div className={`fchips-wrap ${center ? 'is-center' : ''}`}>
      <div ref={ref} className="fchips" role="tablist" style={{ maxHeight: collapsed ? limit : limit ? 1000 : undefined }}>
        {options.map(([v, label, count]) => (
          <button key={v || 'all'} role="tab" aria-selected={value === v} className={`fchip ${value === v ? 'is-on' : ''}`} onClick={() => onChange(v)}>
            {value === v && <Icon.peak size={12} className="fchip__peak" />}
            <span>{label}</span>
            {count != null && <em>{count}</em>}
          </button>
        ))}
      </div>
      {limit && (
        <button className="fchips-more" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? (lang === 'uk' ? 'Згорнути' : 'Show less') : `${lang === 'uk' ? 'Ще' : 'More'} +${hidden}`}
          <span className={`fchips-more__arrow ${open ? 'is-up' : ''}`}>▾</span>
        </button>
      )}
    </div>
  );
}
