import type { Metadata } from 'next';
import { getSite } from '@/lib/api';
import type { Site } from '@/lib/types';
import Chrome from '@/components/Chrome';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import GitHubSection from '@/components/GitHub';
import Contributions from '@/components/Contributions';
import { About, Blog, Block, Custom, Hero, Skills, Timeline } from '@/components/Sections';

export const dynamic = 'force-dynamic'; // always read the latest content from the API

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSite();
    return { title: s.profile ? `${s.profile.name} — ${s.profile.title}` : s.settings.siteTitle, description: s.profile?.tagline };
  } catch { return { title: 'Portfolio' }; }
}

const notice = (title: string, text: string) => (
  <main style={{ padding: '6rem 1.5rem', maxWidth: 640, margin: 'auto' }}><h1>{title}</h1><p style={{ color: 'var(--mu)', marginTop: '1rem' }}>{text}</p></main>
);

export default async function Home() {
  let site: Site;
  try { site = await getSite(); } catch { return notice('API is not reachable', 'Start the backend and check NEXT_PUBLIC_API_URL.'); }
  const { profile: p, stats, skills, projects, experience, posts, settings, github } = site;
  if (!p) return notice('No content yet', 'Run "npm run db:seed" in the backend, then reload.');

  // GitHub based sections only appear when GitHub data is available
  const hasCal = !!github && github.calendar.length > 0;
  const sections = site.sections.filter((s) => (s.key !== 'github' || github) && (s.key !== 'contributions' || hasCal));

  const content: Record<string, React.ReactNode> = {
    about: <About bio={p.bio} stats={stats} />,
    skills: <Skills skills={skills} />,
    projects: <Projects items={projects} />,
    experience: <Timeline items={experience} />,
    blogs: <Blog posts={posts} />,
    contact: <Contact p={p} />,
    github: github ? <GitHubSection g={github} /> : null,
    contributions: github && hasCal ? <Contributions initial={github.calendar} since={github.since} username={github.username} /> : null,
  };
  const ok = (c: string, d: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c : d);
  const logo = p.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`:root{--a:${ok(settings.accent, '#8b5cf6')};--b:${ok(settings.accent2, '#22d3ee')}}`}</style>
      <Chrome logo={logo} name={p.name} links={sections} />
      <main>
        <Hero p={p} info={{ projects: projects.length, skills: skills.length, posts: posts.length, sections: sections.length }} />
        {sections.map((s) => <Block key={s.id} s={s}>{content[s.key] ?? <Custom body={s.body} />}</Block>)}
      </main>
      <Footer p={p} sections={sections} settings={settings} />
    </>
  );
}