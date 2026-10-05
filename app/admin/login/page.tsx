'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { call } from '@/lib/client';

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setErr('');
    try {
      const { token } = await call<{ token: string }>('/api/auth/login', 'POST', { email: f.get('email'), password: f.get('password') });
      localStorage.setItem('admin_token', token);
      router.replace('/admin');
    } catch (x: any) { setErr(x.message); setBusy(false); }
  };

  return (
    <div className="acard" style={{ maxWidth: 380, margin: '6rem auto' }}>
      <h1 style={{ fontSize: '1.6rem' }}>Admin sign in</h1>
      <form onSubmit={submit}>
        <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoFocus /></div>
        <div><label htmlFor="password">Password</label><input id="password" name="password" type="password" required /></div>
        {err && <p className="anote err">{err}</p>}
        <button className="abtn p" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
