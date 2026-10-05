// The admin panel is generated from this config: add a field here and it appears in the editor.
export type Field = { key: string; label: string; type?: 'text' | 'area' | 'num' | 'bool' | 'color' | 'csv' | 'lines' | 'select'; options?: string[]; ro?: boolean; wide?: boolean };
export type Res = {
  key: string; label: string; kind: 'single' | 'list' | 'messages'; hint?: string;
  fields: Field[]; defaults?: () => Record<string, unknown>; protect?: string[];
};

export const RESOURCES: Res[] = [
  { key: 'profile', label: 'Profile', kind: 'single', hint: 'Name, headline, bio, photo and contact links.', fields: [
    { key: 'name', label: 'Full name' }, { key: 'title', label: 'Job title' },
    { key: 'roles', label: 'Typing roles (comma separated)', type: 'csv', wide: true },
    { key: 'tagline', label: 'Tagline', type: 'area', wide: true },
    { key: 'bio', label: 'About (one paragraph per line)', type: 'area', wide: true },
    { key: 'photo', label: 'Photo URL' }, { key: 'status', label: 'Availability text' },
    { key: 'location', label: 'Location' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' },
    { key: 'github', label: 'GitHub URL' }, { key: 'linkedin', label: 'LinkedIn URL' },
    { key: 'whatsapp', label: 'WhatsApp URL' }, { key: 'resume', label: 'Resume URL' },
  ] },
  { key: 'sections', label: 'Sections', kind: 'list', hint: 'Rename, reorder, hide, or add your own text sections.',
        protect: ['about', 'skills', 'projects', 'experience', 'blogs', 'contact', 'github', 'contributions'],
    defaults: () => ({ key: `custom-${Math.random().toString(36).slice(2, 8)}`, title: 'New section', subtitle: '', body: '' }),
    fields: [
      { key: 'key', label: 'Key (fixed)', ro: true }, { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' },
      { key: 'body', label: 'Text (used by custom sections)', type: 'area', wide: true },
    ] },
  { key: 'stats', label: 'Stats', kind: 'list', defaults: () => ({ label: 'New stat', value: 0 }),
    fields: [{ key: 'label', label: 'Label' }, { key: 'value', label: 'Number', type: 'num' }] },
  { key: 'skills', label: 'Skills', kind: 'list',
    hint: 'Set "Percentage source" to GitHub to calculate the percentage from your repositories automatically (manual % is the fallback).',
    defaults: () => ({ group: 'Frontend', name: 'New skill', level: 80, source: 'github', icon: '' }),
    fields: [
      { key: 'group', label: 'Group (Frontend, Backend…)' }, { key: 'name', label: 'Skill (e.g. React, Next.js)' },
      { key: 'source', label: 'Percentage source', type: 'select', options: ['github', 'manual'] },
      { key: 'level', label: 'Manual % (0-100)', type: 'num' },
      { key: 'icon', label: 'Icon slug (optional, e.g. nextjs, see devicon.dev)' },
    ] },
  { key: 'projects', label: 'Projects', kind: 'list',
    defaults: () => ({ title: 'New project', category: 'Full-Stack', year: String(new Date().getFullYear()), featured: false, description: '', image: '', tags: [], live: '', repo: '' }),
    fields: [
      { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'year', label: 'Year' },
      { key: 'featured', label: 'Featured (shown first)', type: 'bool' },
      { key: 'description', label: 'Description', type: 'area', wide: true }, { key: 'image', label: 'Image URL' },
      { key: 'tags', label: 'Tags (comma separated)', type: 'csv' }, { key: 'live', label: 'Live URL' }, { key: 'repo', label: 'Source URL' },
    ] },
  { key: 'experience', label: 'Experience', kind: 'list', defaults: () => ({ role: 'Role', org: 'Company or school', period: '2026', points: [] }),
    fields: [
      { key: 'role', label: 'Role / degree' }, { key: 'org', label: 'Company / school' }, { key: 'period', label: 'Period' },
      { key: 'points', label: 'Highlights (one per line)', type: 'lines', wide: true },
    ] },
  { key: 'posts', label: 'Blog', kind: 'list', defaults: () => ({ title: 'New post', date: new Date().toISOString().slice(0, 10), summary: '', link: '' }),
    fields: [{ key: 'title', label: 'Title' }, { key: 'date', label: 'Date' }, { key: 'summary', label: 'Summary', type: 'area', wide: true }, { key: 'link', label: 'Link URL' }] },
  { key: 'settings', label: 'Theme & site', kind: 'single', hint: 'Colors, site title, footer text and your GitHub username.', fields: [
    { key: 'accent', label: 'Accent color', type: 'color' }, { key: 'accent2', label: 'Second accent', type: 'color' },
    { key: 'siteTitle', label: 'Site title' }, { key: 'footer', label: 'Footer text' },
    { key: 'githubUsername', label: 'GitHub username (for the GitHub section and auto skills)', wide: true },
  ] },
  { key: 'messages', label: 'Messages', kind: 'messages', fields: [] },
];