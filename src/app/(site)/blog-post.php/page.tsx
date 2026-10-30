'use client';
import { useEffect } from 'react';
import Link from 'next/link';

/** Legacy URL kept alive on a static site: /blog-post.php?id=<slug> forwards to /blog/<slug>/. */
export default function LegacyBlogPost() {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    window.location.replace(id ? `/blog/${encodeURIComponent(id)}/` : '/software-development-blog-in-pondicherry.php');
  }, []);
  return (
    <div className="container py-24 text-center">
      <p className="text-ink/70">Redirecting to the article…</p>
      <p className="mt-4"><Link href="/software-development-blog-in-pondicherry.php" className="font-semibold text-brand-700 underline underline-offset-4">Go to the blog</Link></p>
    </div>
  );
}
