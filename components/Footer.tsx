import type { Profile, Section, Settings } from '@/lib/types';
import { safe } from '@/lib/api';
import UiIcon, { type IconName } from './UiIcon';

export default function Footer({ p, sections, settings }: { p: Profile; sections: Section[]; settings: Settings }) {
  const social: [IconName, string, string][] = [
    ['github', 'GitHub', safe(p.github)], ['linkedin', 'LinkedIn', safe(p.linkedin)],
    ['whatsapp', 'WhatsApp', safe(p.whatsapp)], ['mail', 'Email', p.email ? `mailto:${p.email}` : ''],
  ];
  return (
    <footer className="foot">
      <div className="fgrid">
        <div>
          <b className="fname">{p.name}</b>
          <p>{p.tagline}</p>
          {p.status && <div className="badge"><i />{p.status}</div>}
        </div>
        <div>
          <h4>Explore</h4>
          <div className="flinks">{sections.map((s) => <a key={s.id} href={`#${s.key}`}>{s.title}</a>)}</div>
        </div>
        <div>
          <h4>Connect</h4>
          <div className="fsoc">
            {social.filter((x) => x[2]).map(([icon, label, href]) => (
              <a key={label} href={href} aria-label={label} title={label} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                <UiIcon name={icon} size={18} />
              </a>
            ))}
          </div>
          <div className="fcon">
            {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
            {p.location && <span>{p.location}</span>}
          </div>
        </div>
      </div>
      <div className="fbar">
        <span>{settings.footer || `© ${new Date().getFullYear()} ${p.name}. All rights reserved.`}</span>
        <span>Built with Next.js, Express, Prisma &amp; PostgreSQL</span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}