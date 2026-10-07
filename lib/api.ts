import type { Site } from './types';

// trailing slashes are removed so "https://x.vercel.app/" and "https://x.vercel.app" both work
export const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

export async function getSite(): Promise<Site> {
  const r = await fetch(`${API}/api/site`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`API responded ${r.status}`);
  return r.json();
}

// only allow safe URL schemes in links coming from the database
export const safe = (u?: string) => (u && /^(https?:|mailto:|tel:)/.test(u) ? u : '');