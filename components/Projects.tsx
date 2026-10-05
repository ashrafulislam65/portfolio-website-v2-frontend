'use client';
import { useEffect, useState } from 'react';
import type { Project } from '@/lib/types';
import { safe } from '@/lib/api';

function Img({ p }: { p: Project }) {
  return <div className="pimg">{safe(p.image) ? <img loading="lazy" src={safe(p.image)} alt={p.title} /> : (p.title[0] || '?')}</div>;
}

export default function Projects({ items }: { items: Project[] }) {
  const cats = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<Project | null>(null);
  const list = items.filter((i) => cat === 'All' || i.category === cat).sort((a, b) => Number(b.featured) - Number(a.featured));

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  const tilt = (e: React.MouseEvent<HTMLElement>) => {
    const c = e.currentTarget, r = c.getBoundingClientRect();
    c.style.transform = `perspective(900px) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 5}deg) rotateX(${(0.5 - (e.clientY - r.top) / r.height) * 5}deg)`;
  };

  return (
    <div>
      {cats.length > 2 && (
        <div className="chips">
          {cats.map((c) => <button key={c} className={`chip${c === cat ? ' on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      )}
      {list.map((p) => (
        <article key={p.id} className="proj" onClick={() => setOpen(p)} onMouseMove={tilt} onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}>
          <Img p={p} />
          <div>
            <div className="meta">{[p.category, p.year].filter(Boolean).join(' · ')}{p.featured && ' · Featured'}</div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </div>
        </article>
      ))}
      {list.length === 0 && <p className="meta">No projects here yet.</p>}

      {open && (
        <div className="ov" onClick={() => setOpen(null)}>
          <div className="mod" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Img p={open} />
            <div className="body">
              <div className="meta">{[open.category, open.year].filter(Boolean).join(' · ')}</div>
              <h3>{open.title}</h3>
              <p style={{ color: 'var(--mu)' }}>{open.description}</p>
              <div className="tags">{open.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="cta">
                {safe(open.live) && <a className="btn p" href={safe(open.live)} target="_blank" rel="noopener noreferrer">Live site</a>}
                {safe(open.repo) && <a className="btn" href={safe(open.repo)} target="_blank" rel="noopener noreferrer">Source</a>}
                <button className="btn" onClick={() => setOpen(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
