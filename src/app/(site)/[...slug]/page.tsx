import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EnquirySection, FaqSection, PageHero, Sections } from '@/components/ui/page-parts';
import { abs, buildMeta, getAllPages, getPage } from '@/lib/content';

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string[] }> };

/** Pages that have their own dedicated route and must not also be built by this catch-all. */
const DEDICATED = new Set(['/', '/contact/', '/blog-post.php', '/software-development-blog-in-pondicherry.php', '/software-development-case-studies-in-pondicherry.php']);
/** Pages whose hero plays a looping background video. */
const PAGE_VIDEOS: Record<string, string> = { '/software-company-industrial-visit-pondicherry.php': '/videos/industrial-visit.mp4' };

export function generateStaticParams() {
  return getAllPages()
    .map(p => p.path)
    .filter(path => !DEDICATED.has(path))
    .map(path => ({ slug: path.split('/').filter(Boolean) }));
}

function resolve(slug: string[]) {
  const joined = '/' + slug.map(decodeURIComponent).join('/');
  // Legacy URLs: directories end with "/", .php pages do not.
  return getPage(joined.includes('.') ? joined : joined + '/') ?? getPage(joined) ?? getPage(joined + '/');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await resolve((await params).slug);
  if (!page) return { title: 'Page not found', robots: { index: false } };
  return buildMeta({ title: page.metaTitle || `${page.title} | AAHA Solutions`, description: page.metaDescription || page.tagline, path: page.path, image: page.ogImage?.replace(/^https?:\/\/(www\.)?aahasolutions\.com/, '') });
}

const CRUMB: Record<string, { label: string; href?: string }> = {
  SERVICE: { label: 'Services' }, TECHNOLOGY: { label: 'Technology' }, INDUSTRY: { label: 'Industries' }, CASE_STUDY: { label: 'Case Studies', href: '/software-development-case-studies-in-pondicherry.php' },
  COMPANY: { label: 'Company' }, LEGAL: { label: 'Legal' },
};

export default async function ContentPage({ params }: Props) {
  const page = await resolve((await params).slug);
  if (!page) notFound();
  const crumbs = [{ label: 'Home', href: '/' }, ...(page.type === 'CASE_STUDY' ? [CRUMB.CASE_STUDY] : page.type === 'LEGAL' || page.type === 'COMPANY' ? [] : [CRUMB[page.type]]), { label: page.navLabel }];
  const isLegal = page.type === 'LEGAL';

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: page.title, url: abs(page.path), description: page.metaDescription ?? undefined },
      { '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: abs(c.href) } : {}) })) },
      ...(page.faqs.length ? [{ '@type': 'FAQPage', mainEntity: page.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
    ],
  };

  return (
    <>
      <PageHero title={page.title} tagline={page.tagline} crumbs={crumbs} cta={!isLegal} video={PAGE_VIDEOS[page.path]} />
      {/* The FAQ is rendered once, as the accordion below, when structured FAQs exist. */}
      <Sections sections={page.faqs.length ? page.sections.filter(s => !/frequently asked/i.test(s.heading ?? '')) : page.sections} />
      <FaqSection faqs={page.faqs} />
      {!isLegal && <EnquirySection source={page.navLabel} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
