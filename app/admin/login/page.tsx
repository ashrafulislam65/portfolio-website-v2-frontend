'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { call } from '@/lib/client';

function Eye({ off }: { off: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {off ? (
        <>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <path d="m2 2 20 20" />
        </>
      ) : (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

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
        <div>
          <label htmlFor="password">Password</label>
          <div className="pw">
            <input id="password" name="password" type={show ? 'text' : 'password'} required autoComplete="current-password" />
            <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} title={show ? 'Hide password' : 'Show password'}>
              <Eye off={show} />
            </button>
          </div>
        </div>
        {err && <p className="anote err">{err}</p>}
        <button className="abtn p" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}