import type { GitHub } from '@/lib/types';
import { safe } from '@/lib/api';
import { langColor } from '@/lib/icons';
import Icon from './Icon';

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n));

export default function GitHubSection({ g }: { g: GitHub }) {
  const stats: [string, string][] = [
    ['Repositories', fmt(g.repos)], ['Stars earned', fmt(g.stars)], ['Followers', fmt(g.followers)],
    ['Contributions (1 year)', fmt(g.contributions)], ['Current streak', `${g.streak.current} days`], ['Longest streak', `${g.streak.longest} days`],
  ];
  return (
    <div className="ghb">
      <div className="ghh">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {safe(g.avatar) && <img src={safe(g.avatar)} alt="" />}
        <div><b style={{ fontSize: '1.3rem' }}>{g.name || g.username}</b><div className="meta">@{g.username}{g.bio && ` · ${g.bio}`}</div></div>
        <a className="btn" href={safe(g.url)} target="_blank" rel="noopener noreferrer">View profile</a>
      </div>
      <div className="stats">{stats.map(([k, v]) => <div key={k}><b>{v}</b><span>{k}</span></div>)}</div>

      {g.languages.length > 0 && (
        <>
          <h3>Top languages</h3>
          <div className="lbar">{g.languages.map((l) => <i key={l.name} title={`${l.name} ${l.percent}%`} style={{ width: `${l.percent}%`, background: langColor(l.name) }} />)}</div>
          <ul className="llist">{g.languages.map((l) => <li key={l.name}><Icon name={l.name} size={20} />{l.name}<span>{l.percent}%</span></li>)}</ul>
        </>
      )}

      {g.topRepos.length > 0 && (
        <>
          <h3>Top repositories</h3>
          <div className="rgrid">
            {g.topRepos.map((r) => (
              <a key={r.name} className="rcard" href={safe(r.url)} target="_blank" rel="noopener noreferrer">
                <b>{r.name}</b>
                <p>{r.description || 'No description'}</p>
                <div className="meta">{r.language && <><Icon name={r.language} size={14} />{r.language} · </>}★ {r.stars}</div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}