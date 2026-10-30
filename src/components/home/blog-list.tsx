'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { HoverCard, Reveal } from '@/components/ui/motion';

export interface PostCard { slug: string; title: string; excerpt: string | null; coverImage: string | null; category: string | null; date: string }

const PAGE_SIZE = 12;
const BASE = '/software-development-blog-in-pondicherry.php';

/** Reads ?category= / ?page= in the browser (a static site has no server to do it). Same URLs as before. */
export function BlogList({ posts }: { posts: PostCard[] }) {
  const sp = useSearchParams();
  return <BlogListView posts={posts} category={sp.get('category') ?? ''} pageParam={Number(sp.get('page')) || 1} />;
}

/** Pure view. Also rendered at build time (category "", page 1) so the HTML already contains the article links. */
export function BlogListView({ posts, category, pageParam }: { posts: PostCard[]; category: string; pageParam: number }) {
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))] as string[];
  const filtered = category ? posts.filter(p => p.category === category) : posts;
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, pageParam));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const q = (p: number, c = category) => `?${new URLSearchParams({ ...(c ? { category: c } : {}), ...(p > 1 ? { page: String(p) } : {}) }).toString()}`.replace(/\?$/, '');
  const pill = (on: boolean) => `bpill rounded-full border px-4 py-2 text-sm font-medium ${on ? 'bpill-on border-brand bg-brand text-ink' : 'border-ink/15 bg-white hover:border-brand-600'}`;

  return (
    <>
      <nav aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
        <Link href={BASE} aria-current={!category ? 'true' : undefined} className={pill(!category)}>All</Link>
        {categories.map((c, n) => (
          <Link key={c} href={`${BASE}${q(1, c)}`} aria-current={category === c ? 'true' : undefined} className={pill(category === c)} style={{ animationDelay: `${(n + 1) * 0.04}s` }}>{c}</Link>
        ))}
      </nav>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <li key={p.slug}>
            <Reveal scrub={i % 3} className="h-full">
              <HoverCard className="h-full">
                <Link href={`/blog/${p.slug}/`} className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-ink to-ink-600">
                    {p.coverImage && <Image src={p.coverImage} alt="" fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 95vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      {p.category && <span className="rounded-full bg-brand-100 px-2.5 py-1 font-semibold text-brand-800">{p.category}</span>}
                      <span className="inline-flex items-center gap-1 text-ink/70"><Calendar aria-hidden className="h-3.5 w-3.5" />{p.date}</span>
                    </div>
                    <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">{p.title}</h2>
                    {p.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-[15px] text-ink/70">{p.excerpt}</p>}
                    <span className="mt-4 font-semibold text-brand-700">Read Article →</span>
                  </div>
                </Link>
              </HoverCard>
            </Reveal>
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, n) => n + 1).map(n => (
            <Link key={n} href={`${BASE}${q(n)}`} aria-current={n === page ? 'page' : undefined} className={`grid h-11 min-w-11 place-items-center rounded-ctl border px-3 font-medium ${n === page ? 'border-brand bg-brand text-ink' : 'border-ink/15 bg-white hover:border-brand-600'}`}>{n}</Link>
          ))}
        </nav>
      )}
    </>
  );
}
