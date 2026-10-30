import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { EnquirySection } from '@/components/ui/page-parts';
import { abs, buildMeta, fmtDate, getPost, getPosts } from '@/lib/content';

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(decodeURIComponent((await params).slug));
  if (!post) return { title: 'Article not found', robots: { index: false } };
  return buildMeta({ title: post.metaTitle || `${post.title} | AAHA Solutions`, description: post.metaDescription || post.excerpt, path: `/blog/${post.slug}/`, image: post.coverImage, type: 'article' });
}

export default async function BlogPost({ params }: Props) {
  const post = getPost(decodeURIComponent((await params).slug));
  if (!post) notFound();
  const related = getPosts().filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.publishedAt?.toISOString(), dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: 'AAHA Solutions' }, publisher: { '@type': 'Organization', name: 'AAHA Solutions', logo: { '@type': 'ImageObject', url: abs('/assets/images/logo.svg') } },
    image: post.coverImage ? abs(post.coverImage) : undefined, mainEntityOfPage: abs(`/blog/${post.slug}/`),
  };
  return (
    <>
      <article>
        <header className="bg-hero relative overflow-hidden text-white">
          <div aria-hidden className="grid-fine pointer-events-none absolute inset-0" />
          <div className="container relative max-w-4xl py-14 md:py-20">
            <Link href="/software-development-blog-in-pondicherry.php" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft aria-hidden className="h-4 w-4" />Back to Blog</Link>
            {post.category && <p className="eyebrow eyebrow-dark mt-4">{post.category}</p>}
            <h1 className="h-display mt-3 text-3xl leading-tight md:text-5xl">{post.title}</h1>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/65">
              <span className="inline-flex items-center gap-1.5"><Calendar aria-hidden className="h-4 w-4 text-brand" />{fmtDate(post.publishedAt)}</span>
              {post.author && <span className="inline-flex items-center gap-1.5"><User aria-hidden className="h-4 w-4 text-brand" />{post.author}</span>}
            </p>
          </div>
        </header>
        <div className="bg-white-soft py-12 md:py-16">
          <div className="container max-w-3xl">
            {post.coverImage && (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-card bg-ink/5 shadow-card">
                <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width:768px) 48rem, 95vw" className="object-cover" />
              </div>
            )}
            <div className="prose-aaha" dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-mint py-14" aria-labelledby="related">
          <div className="container max-w-5xl">
            <h2 id="related" className="h-display text-2xl">More in {post.category}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map(r => (
                <li key={r.slug}><Link href={`/blog/${r.slug}/`} className="card block h-full p-5 font-display font-semibold hover:shadow-lift">{r.title}</Link></li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <EnquirySection source={`Blog: ${post.title}`.slice(0, 80)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
