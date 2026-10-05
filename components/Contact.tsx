'use client';
import { useState } from 'react';
import { API, safe } from '@/lib/api';
import type { Profile } from '@/lib/types';
import UiIcon, { type IconName } from './UiIcon';

export default function Contact({ p }: { p: Profile }) {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    try {
      const r = await fetch(`${API}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const j = await r.json().catch(() => ({}));
      say(r.ok ? 'Message sent. Thank you!' : j.error || 'Could not send. Try again.');
      if (r.ok) form.reset();
    } catch { say('Network error. Try again.'); }
    setBusy(false);
  };

  const rows: [IconName, string, string, string][] = [
    ['mail', 'Email', p.email, p.email ? `mailto:${p.email}` : ''],
    ['phone', 'Phone', p.phone, p.phone ? `tel:${p.phone}` : ''],
    ['github', 'GitHub', p.github, safe(p.github)],
    ['linkedin', 'LinkedIn', p.linkedin, safe(p.linkedin)],
    ['whatsapp', 'WhatsApp', p.whatsapp, safe(p.whatsapp)],
  ];
  return (
    <div className="cgrid">
      <div className="cinfo">
        <p>Have a project or role in mind? Send a message and I will reply within a day or two.</p>
        {rows.filter((r) => r[2] && r[3]).map(([icon, k, v, h]) => (
          <a key={k} className="l" href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
            <span className="ci"><UiIcon name={icon} size={18} /></span>{k}
            <span className="val">{v.replace(/^https?:\/\/(www\.)?/, '')}</span>
          </a>
        ))}
        {p.location && (
          <div className="l"><span className="ci"><UiIcon name="pin" size={18} /></span>Location<span className="val">{p.location}</span></div>
        )}
      </div>
      <form onSubmit={submit}>
        <div className="two">
          <input name="name" placeholder="Name" required maxLength={80} />
          <input name="email" type="email" placeholder="Email" required />
        </div>
        <input name="subject" placeholder="Subject" maxLength={120} />
        <textarea name="message" rows={5} placeholder="Message" required minLength={5} />
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" />
        <button className="btn p" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
      </form>
      <div id="toast" className={toast ? 'on' : ''} role="status">{toast}</div>
    </div>
  );
}