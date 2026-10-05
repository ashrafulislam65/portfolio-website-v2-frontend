'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RESOURCES } from '@/lib/adminConfig';
import { token } from '@/lib/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const isLogin = path === '/admin/login';

  useEffect(() => {
    if (isLogin) { setOk(false); return; }
    if (!token()) router.replace('/admin/login'); else setOk(true);
  }, [isLogin, path, router]);

  if (isLogin) return <div className="adm">{children}</div>;
  if (!ok) return null;

  const logout = () => { localStorage.removeItem('admin_token'); router.replace('/admin/login'); };
  return (
    <div className="adm side">
      <aside>
        <h2>Admin</h2>
        <Link href="/admin" className={path === '/admin' ? 'on' : ''}>Dashboard</Link>
        {RESOURCES.map((r) => <Link key={r.key} href={`/admin/${r.key}`} className={path === `/admin/${r.key}` ? 'on' : ''}>{r.label}</Link>)}
        <div className="sp" />
        <a href="/" target="_blank" rel="noopener noreferrer">View site</a>
        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Log out</a>
      </aside>
      <section className="amain">{children}</section>
    </div>
  );
}
