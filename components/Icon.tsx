'use client';
import { useState } from 'react';
import { iconSlug, INVERT } from '@/lib/icons';

// Technology icon from the Devicon CDN. Falls back to the plain variant, then to a letter badge.
export default function Icon({ name, slug, size = 22 }: { name: string; slug?: string; size?: number }) {
  const s = iconSlug(slug || name);
  const [t, setT] = useState(0);
  if (t > 1 || !s) return <span className="ic fb" style={{ width: size, height: size }}>{name[0]?.toUpperCase()}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`ic${INVERT.has(s) ? ' inv' : ''}`} width={size} height={size} alt="" loading="lazy"
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s}/${s}-${t ? 'plain' : 'original'}.svg`}
      onError={() => setT(t + 1)}
    />
  );
}