'use client';
import { useState } from 'react';
import { API } from '@/lib/api';
import type { GitHub } from '@/lib/types';

type Day = GitHub['calendar'][number];
const S = 11, G = 3, LEFT = 32, TOP = 18; // cell size, gap, left label width, top label height
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Contributions({ initial, since, username }: { initial: Day[]; since: number; username: string }) {
  const now = new Date().getFullYear();
  const first = since || now - 3;
  const years = Array.from({ length: Math.min(5, Math.max(1, now - first + 1)) }, (_, i) => String(now - i));
  const [sel, setSel] = useState('last');
  const [days, setDays] = useState<Day[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (y: string) => {
    if (y === sel || busy) return;
    setErr('');
    if (y === 'last') { setSel(y); setDays(initial); return; }
    setBusy(true);
    try {
      const r = await fetch(`${API}/api/github/calendar?year=${y}`);
      if (!r.ok) throw new Error('bad response');
      const j = await r.json();
      setDays(j.days);
      setSel(y);
    } catch { setErr('Could not load that year. Try again.'); }
    setBusy(false);
  };

  const pad = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0; // empty cells before the first day
  const cells: (Day | null)[] = [...Array<null>(pad).fill(null), ...days];
  const weeks = Math.ceil(cells.length / 7);
  const total = days.reduce((a, d) => a + d.count, 0);

  // month labels above the grid
  const labels: { x: number; m: string }[] = [];
  let lastM = -1, lastX = -10;
  for (let w = 0; w < weeks; w++) {
    const d = cells.slice(w * 7, w * 7 + 7).find(Boolean);
    if (!d) continue;
    const m = new Date(`${d.date}T00:00:00Z`).getUTCMonth();
    if (m !== lastM) { lastM = m; if (w - lastX >= 3) { labels.push({ x: w, m: MONTHS[m] }); lastX = w; } }
  }
  const W = LEFT + weeks * (S + G), H = TOP + 7 * (S + G);

  return (
    <div className="cg">
      <div className="cgh">
        <h3>{total.toLocaleString()} contributions {sel === 'last' ? 'in the last year' : `in ${sel}`}</h3>
        <div className="cgy">
          {['last', ...years].map((y) => (
            <button key={y} className={`chip${y === sel ? ' on' : ''}`} onClick={() => pick(y)} disabled={busy}>{y === 'last' ? 'Last year' : y}</button>
          ))}
        </div>
      </div>

      <div className={`cgs${busy ? ' busy' : ''}`}>
        <svg width={W} height={H} role="img" aria-label="GitHub contribution calendar">
          {labels.map((l) => <text key={l.x} x={LEFT + l.x * (S + G)} y={10}>{l.m}</text>)}
          {[1, 3, 5].map((r) => <text key={r} x={0} y={TOP + r * (S + G) + S - 1}>{['Mon', 'Wed', 'Fri'][(r - 1) / 2]}</text>)}
          {cells.map((c, i) => c && (
            <rect key={i} x={LEFT + Math.floor(i / 7) * (S + G)} y={TOP + (i % 7) * (S + G)} width={S} height={S} rx={2} className={`lv${Math.min(4, c.level)}`}>
              <title>{`${c.count} contribution${c.count === 1 ? '' : 's'} on ${c.date}`}</title>
            </rect>
          ))}
        </svg>
      </div>

      {err && <p className="anote err">{err}</p>}
      <div className="cgf">
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">@{username} on GitHub</a>
        <span className="cgl">
          Less
          {[0, 1, 2, 3, 4].map((l) => <svg key={l} width={S} height={S}><rect width={S} height={S} rx={2} className={`lv${l}`} /></svg>)}
          More
        </span>
      </div>
    </div>
  );
}