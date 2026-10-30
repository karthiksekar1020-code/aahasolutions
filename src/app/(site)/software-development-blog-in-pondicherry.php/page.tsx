import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/page-parts';
import { BlogList, BlogListView } from '@/components/home/blog-list';
import { buildMeta, fmtDate, getPosts } from '@/lib/content';

export const metadata: Metadata = buildMeta({
  title: 'Blogs & Insights | Software Development Blog | AAHA Solutions',
  description: 'Articles and insights on AI, machine learning, web and mobile development, cloud, IoT and software engineering from AAHA Solutions.',
  path: '/software-development-blog-in-pondicherry.php',
});

export default function BlogIndex() {
  const posts = getPosts().map(p => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, coverImage: p.coverImage, category: p.category, date: fmtDate(p.publishedAt) }));
  return (
    <>
      <PageHero title="Blogs & Insights" tagline="Perspectives on AI, cloud, mobile, web and software engineering from our team." crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} cta={false} video="/videos/wireframe-brain.mp4" animated />
      <section className="bg-light py-14 md:py-20" aria-label="Articles">
        <div className="container">
          <Suspense fallback={<BlogListView posts={posts} category="" pageParam={1} />}>
            <BlogList posts={posts} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
