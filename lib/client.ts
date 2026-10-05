import { API } from './api';

export const token = () => (typeof window === 'undefined' ? null : localStorage.getItem('admin_token'));

export async function call<T = any>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const t = token();
  const r = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (r.status === 401 && path !== '/api/auth/login') {
    localStorage.removeItem('admin_token');
    location.href = '/admin/login';
    throw new Error('Session expired');
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Error ${r.status}`);
  return j as T;
}
