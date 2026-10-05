'use client';
import { useEffect, useState } from 'react';

export default function Typed({ words }: { words: string[] }) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!words.length) return;
    let i = 0, j = 0, del = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const w = words[i];
      setText(w.slice(0, j));
      if (!del) {
        if (j === w.length) { del = true; t = setTimeout(tick, 1400); return; }
        j++;
      } else if (j === 0) { del = false; i = (i + 1) % words.length; } else j--;
      t = setTimeout(tick, del ? 35 : 70);
    };
    tick();
    return () => clearTimeout(t);
  }, [words]);
  return <div className="typed">{text}</div>;
}
