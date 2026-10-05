'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { call } from '@/lib/client';

type Summary = Record<string, number>;
const CARDS: [string, string, string][] = [
  ['projects', 'Projects', '/admin/projects'], ['skills', 'Skills', '/admin/skills'], ['experience', 'Experience', '/admin/experience'],
  ['posts', 'Blog posts', '/admin/posts'], ['sections', 'Sections', '/admin/sections'], ['unread', 'Unread messages', '/admin/messages'],
];

export default function Dashboard() {
  const [s, setS] = useState<Summary | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { call<Summary>('/api/admin/summary').then(setS).catch((e) => setErr(e.message)); }, []);
  return (
    <>
      <h1>Dashboard</h1>
      <p className="hint">Pick any block of your site to edit. Changes go live immediately.</p>
      {err && <p className="anote err">{err}</p>}
      <div className="dash">
        {CARDS.map(([k, label, href]) => <Link key={k} href={href}><b>{s ? s[k] : '–'}</b><span>{label}</span></Link>)}
      </div>
    </>
  );
}
