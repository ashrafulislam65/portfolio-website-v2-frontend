import type { Experience, Post, Profile, Section, Skill, Stat } from '@/lib/types';
import { safe } from '@/lib/api';
import Typed from './Typed';
import Icon from './Icon';

export function Hero({ p, info }: { p: Profile; info: Record<string, string | number> }) {
  const parts = p.name.split(' ');
  const mid = Math.ceil(parts.length / 2);
  const photo = safe(p.photo);
  const resume = safe(p.resume);
  return (
    <section id="home" className="hero">
      <div>
        <div className="badge"><i />{p.status}{p.location && ` · ${p.location}`}</div>
        <h1>
          <span><b>{parts.slice(0, mid).join(' ')}</b></span>
          <span><b className="grad">{parts.slice(mid).join(' ') || '\u00a0'}</b></span>
        </h1>
        <Typed words={p.roles} />
        <p className="lead">{p.tagline}</p>
        <div className="cta">
          <a className="btn p" href="#projects">See my work</a>
          <a className="btn" href="#contact">Let&apos;s talk</a>
          {resume && <a className="btn" href={resume} target="_blank" rel="noopener noreferrer">Resume</a>}
        </div>
      </div>
      <div className="term">
        <div className="top"><i /><i /><i /></div>
        <div className="ph" style={photo ? { backgroundImage: `url(${JSON.stringify(photo)})` } : undefined}>{photo ? '' : p.name[0]}</div>
        <pre><b>GET</b> /api/site <em>200 OK</em>{'\n'}{Object.entries(info).map(([k, v]) => `${k.padEnd(10)} ${v}\n`).join('')}</pre>
      </div>
    </section>
  );
}

// wrapper for every section: title, subtitle, order and visibility all come from the database
export function Block({ s, children }: { s: Section; children: React.ReactNode }) {
  return (
    <section id={s.key} className="sec">
      <h2 className="rv">{s.title}{s.subtitle && <small>{s.subtitle}</small>}</h2>
      <div className="rv">{children}</div>
    </section>
  );
}

const paras = (t: string) => t.split('\n').map((x) => x.trim()).filter(Boolean);

export function About({ bio, stats }: { bio: string; stats: Stat[] }) {
  return (
    <div className="about">
      {paras(bio).map((t, i) => <p key={i}>{t}</p>)}
      {stats.length > 0 && (
        <div className="stats">
          {stats.map((s) => <div key={s.id}><b data-n={s.value}>0</b><span>{s.label}</span></div>)}
        </div>
      )}
    </div>
  );
}

export function Skills({ skills }: { skills: Skill[] }) {
  const groups = Array.from(new Set(skills.map((s) => s.group)));
  return (
    <div className="sk">
      {groups.map((g) => (
        <div key={g}>
          <h3>{g}</h3>
          {skills.filter((s) => s.group === g).map((s) => (
            <div className="row" key={s.id}>
              <div>
                <span className="nm"><Icon name={s.name} slug={s.icon} />{s.name}</span>
                <span title={s.auto ? 'Share of my GitHub repositories that use this' : undefined}>
                  {s.level}%{s.auto && <em className="gb">GitHub</em>}
                </span>
              </div>
              <div className="track"><i data-w={Math.min(100, s.level)} /></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <div className="tl">
      {items.map((e) => (
        <article key={e.id}>
          <h3>{e.role}</h3>
          <div className="meta">{e.org} · {e.period}</div>
          <ul>{e.points.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </article>
      ))}
    </div>
  );
}

export function Blog({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.map((b) => {
        const inner = (<><div><h3>{b.title}</h3><p>{b.summary}</p></div><time>{b.date}</time></>);
        const link = safe(b.link);
        return link
          ? <a key={b.id} className="blog" href={link} target="_blank" rel="noopener noreferrer">{inner}</a>
          : <div key={b.id} className="blog">{inner}</div>;
      })}
    </div>
  );
}

export function Custom({ body }: { body: string }) {
  return <div className="about">{paras(body).map((t, i) => <p key={i}>{t}</p>)}</div>;
}