'use client';
import { useEffect, useState } from 'react';
import { call } from '@/lib/client';
import type { Field, Res } from '@/lib/adminConfig';

type Row = Record<string, any>;
const VISIBLE: Field = { key: 'visible', label: 'Visible on site', type: 'bool' };

// arrays are edited as text; convert at the edges
const toForm = (fields: Field[], row: Row): Row => {
  const o = { ...row };
  for (const f of fields) if (f.type === 'csv' || f.type === 'lines') o[f.key] = Array.isArray(row[f.key]) ? row[f.key].join(f.type === 'lines' ? '\n' : ', ') : '';
  return o;
};
const toApi = (fields: Field[], row: Row): Row => {
  const o = { ...row };
  for (const f of fields) {
    const v = String(row[f.key] ?? '');
    if (f.type === 'csv') o[f.key] = v.split(',').map((x) => x.trim()).filter(Boolean);
    else if (f.type === 'lines') o[f.key] = v.split('\n').map((x) => x.trim()).filter(Boolean);
    else if (f.type === 'num') o[f.key] = Number(v) || 0;
  }
  return o;
};

function Input({ f, value, disabled, onChange }: { f: Field; value: any; disabled?: boolean; onChange: (v: any) => void }) {
  const cls = f.wide || f.type === 'area' ? 'wide' : '';
  if (f.type === 'bool')
    return <div className={cls}><label className="chk"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label></div>;
  return (
    <div className={cls}>
      <label>{f.label}</label>
      {f.type === 'area' || f.type === 'lines'
        ? <textarea rows={f.type === 'area' ? 4 : 5} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        : f.type === 'select'
          ? <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>{f.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select>
          : <input type={f.type === 'num' ? 'number' : f.type === 'color' ? 'color' : 'text'} value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

export default function Editor({ res }: { res: Res }) {
  return res.kind === 'messages' ? <Messages /> : <Form res={res} />;
}

function Form({ res }: { res: Res }) {
  const single = res.kind === 'single';
  const path = `/api/admin/${res.key}`;
  const fields = single ? res.fields : [...res.fields, VISIBLE];
  const [rows, setRows] = useState<Row[] | null>(null);
  const [notes, setNotes] = useState<Record<string, { t: string; err?: boolean }>>({});

  const note = (k: string | number, t: string, err = false) => setNotes((n) => ({ ...n, [k]: { t, err } }));
  useEffect(() => {
    call(path).then((d) => setRows((single ? [d ?? {}] : d).map((r: Row) => toForm(fields, r)))).catch((e) => note('top', e.message, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (i: number, k: string, v: any) => setRows((rs) => rs!.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const save = async (i: number) => {
    const r = rows![i];
    try {
      await call(single ? path : `${path}/${r.id}`, 'PUT', toApi(fields, r));
      note(i, 'Saved. Live on the site now.');
    } catch (e: any) { note(i, e.message, true); }
  };
  const add = async () => {
    try {
      const row = await call(path, 'POST', { ...res.defaults?.(), visible: true });
      setRows((rs) => [...rs!, toForm(fields, row)]);
    } catch (e: any) { note('top', e.message, true); }
  };
  const remove = async (i: number) => {
    if (!confirm('Delete this item permanently?')) return;
    try { await call(`${path}/${rows![i].id}`, 'DELETE'); setRows((rs) => rs!.filter((_, j) => j !== i)); }
    catch (e: any) { note(i, e.message, true); }
  };
  const move = async (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows!.length) return;
    const next = [...rows!];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    try { await call(`${path}/reorder`, 'POST', { ids: next.map((r) => r.id) }); } catch (e: any) { note('top', e.message, true); }
  };
  const syncGithub = async () => {
    note('gh', 'Syncing with GitHub… this can take 10-20 seconds');
    try {
      const r = await call<{ repos: number; stars: number; contributions: number; technologies: number }>('/api/admin/github/refresh', 'POST');
      note('gh', `Synced: ${r.repos} repos, ${r.stars} stars, ${r.contributions} contributions, ${r.technologies} technologies detected.`);
    } catch (e: any) { note('gh', e.message, true); }
  };

  return (
    <>
      <h1>{res.label}</h1>
      {res.hint && <p className="hint">{res.hint}</p>}
      {notes.top && <p className={`anote${notes.top.err ? ' err' : ''}`}>{notes.top.t}</p>}
      {!rows && !notes.top && <p className="hint">Loading…</p>}
      {rows?.map((r, i) => (
        <div className="acard" key={r.id ?? 'single'}>
          {!single && (
            <div className="arow">
              <b>{r.title || r.name || r.label || r.role || r.group || `Item ${i + 1}`}</b>
              <span>
                <button className="abtn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>{' '}
                <button className="abtn" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down">↓</button>{' '}
                {!res.protect?.includes(r.key) && <button className="abtn d" onClick={() => remove(i)}>Delete</button>}
              </span>
            </div>
          )}
          <div className="agrid">
            {fields.map((f) => <Input key={f.key} f={f} value={r[f.key]} disabled={f.ro} onChange={(v) => set(i, f.key, v)} />)}
          </div>
          <div className="arow" style={{ marginTop: '1rem' }}>
            <button className="abtn p" onClick={() => save(i)}>Save {single ? res.label.toLowerCase() : 'item'}</button>
            {notes[i] && <span className={`anote${notes[i].err ? ' err' : ''}`}>{notes[i].t}</span>}
          </div>
        </div>
      ))}
      {!single && rows && <button className="abtn p" onClick={add}>+ Add new</button>}
      {res.key === 'settings' && rows && (
        <div className="acard">
          <b>GitHub sync</b>
          <p className="hint" style={{ margin: '.3rem 0 1rem' }}>Save your username above, then refresh. Data is also refreshed automatically every 6 hours.</p>
          <button className="abtn p" onClick={syncGithub}>Refresh GitHub data</button>
          {notes.gh && <p className={`anote${notes.gh.err ? ' err' : ''}`}>{notes.gh.t}</p>}
        </div>
      )}
    </>
  );
}

type Msg = { id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string };

function Messages() {
  const [m, setM] = useState<Msg[] | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { call<Msg[]>('/api/admin/messages').then(setM).catch((e) => setErr(e.message)); }, []);
  const read = async (id: string) => { await call(`/api/admin/messages/${id}`, 'PATCH'); setM((x) => x!.map((i) => (i.id === id ? { ...i, read: true } : i))); };
  const del = async (id: string) => { if (confirm('Delete this message?')) { await call(`/api/admin/messages/${id}`, 'DELETE'); setM((x) => x!.filter((i) => i.id !== id)); } };
  return (
    <>
      <h1>Messages</h1>
      <p className="hint">Sent from the contact form on your site.</p>
      {err && <p className="anote err">{err}</p>}
      {m?.length === 0 && <p className="hint">No messages yet.</p>}
      {m?.map((x) => (
        <div key={x.id} className={`acard${x.read ? '' : ' unread'}`}>
          <div className="arow">
            <b>{x.name} <span style={{ color: 'var(--mu)', fontWeight: 400 }}>&lt;{x.email}&gt;</span></b>
            <small style={{ color: 'var(--mu)' }}>{new Date(x.createdAt).toLocaleString()}</small>
          </div>
          {x.subject && <b>{x.subject}</b>}
          <p style={{ whiteSpace: 'pre-wrap', margin: '.4rem 0 .8rem' }}>{x.message}</p>
          <a className="abtn" href={`mailto:${x.email}?subject=${encodeURIComponent('Re: ' + x.subject)}`}>Reply</a>{' '}
          {!x.read && <button className="abtn" onClick={() => read(x.id)}>Mark read</button>}{' '}
          <button className="abtn d" onClick={() => del(x.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}