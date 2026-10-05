'use client';
import { notFound } from 'next/navigation';
import Editor from '@/components/Editor';
import { RESOURCES } from '@/lib/adminConfig';

export default function ResourcePage({ params }: { params: { resource: string } }) {
  const res = RESOURCES.find((r) => r.key === params.resource);
  if (!res) return notFound();
  return <Editor key={res.key} res={res} />;
}
