export type Profile = {
  name: string; title: string; roles: string[]; tagline: string; bio: string; photo: string;
  email: string; phone: string; location: string; github: string; linkedin: string; whatsapp: string; resume: string; status: string;
};
export type Section = { id: number; key: string; title: string; subtitle: string; body: string; visible: boolean; order: number };
export type Stat = { id: number; label: string; value: number };
export type Skill = { id: number; group: string; name: string; level: number; source: string; icon: string; auto?: boolean };
export type Project = { id: number; title: string; category: string; year: string; featured: boolean; description: string; image: string; tags: string[]; live: string; repo: string };
export type Experience = { id: number; role: string; org: string; period: string; points: string[] };
export type Post = { id: number; title: string; date: string; summary: string; link: string };
export type Settings = { accent: string; accent2: string; siteTitle: string; footer: string; githubUsername: string };
export type GitHub = {
  username: string; name: string; avatar: string; url: string; bio: string;
  since: number;
  followers: number; following: number; repos: number; stars: number; contributions: number;
  streak: { current: number; longest: number };
  calendar: { date: string; count: number; level: number }[];
  languages: { name: string; percent: number }[];
  topRepos: { name: string; description: string; stars: number; language: string; url: string }[];
  techUsage: Record<string, number>; fetchedAt: string;
};
export type Site = {
  profile: Profile | null; sections: Section[]; stats: Stat[]; skills: Skill[];
  projects: Project[]; experience: Experience[]; posts: Post[]; settings: Settings; github: GitHub | null;
};