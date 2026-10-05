'use client';
import { useEffect, useState } from 'react';

type Props = { logo: string; name: string; links: { key: string; title: string }[] };

export default function Chrome({ logo, name, links }: Props) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved) root.dataset.theme = saved;

    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(100, p + 5);
      setPct(p);
      if (p === 100) {
        clearInterval(timer);
        setTimeout(() => { setDone(true); document.body.classList.add('ready'); }, 250);
      }
    }, 30);

    const onScroll = () => {
      const el = document.getElementById('bar');
      if (el) el.style.width = `${(scrollY / Math.max(1, root.scrollHeight - innerHeight)) * 100}%`;
    };
    const onMove = (e: PointerEvent) => {
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('pointermove', onMove);

    // reveal blocks, animate skill bars and stat counters when they enter the viewport
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const t = en.target as HTMLElement;
      t.classList.add('in');
      io.unobserve(t);
      t.querySelectorAll<HTMLElement>('[data-w]').forEach((i) => { i.style.width = `${i.dataset.w}%`; });
      t.querySelectorAll<HTMLElement>('[data-n]').forEach((n) => {
        const end = Number(n.dataset.n) || 0, st = performance.now();
        const f = (now: number) => {
          const k = Math.min(1, (now - st) / 1200);
          n.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
      });
    }), { threshold: 0.15 });
    document.querySelectorAll('.rv').forEach((e) => io.observe(e));

    const spy = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50%' });
    document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

    return () => {
      clearInterval(timer); removeEventListener('scroll', onScroll); removeEventListener('pointermove', onMove);
      io.disconnect(); spy.disconnect();
    };
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  return (
    <>
      <div id="loader" className={done ? 'out' : ''}><span id="pct">{pct}</span></div>
      <div id="bar" />
      <div id="glow" />
      <header id="nav">
        <a className="logo" href="#home"><span className="lg">{logo}</span><span className="nm2">{name}</span></a>
        <nav id="links">
          {links.map((l) => <a key={l.key} href={`#${l.key}`} className={active === l.key ? 'on' : ''}>{l.title}</a>)}
        </nav>
        <button id="theme" aria-label="Toggle theme" onClick={toggle}>◐</button>
      </header>
    </>
  );
}