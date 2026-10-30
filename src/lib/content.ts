import type { Metadata } from 'next';
import { env } from './env';
import type { FaqItem, Section } from './content-types';
import pagesData from '@/data/pages.json';
import postsData from '@/data/posts.json';
import testimonialsData from '@/data/testimonials.json';
import faqsData from '@/data/faqs.json';

/** All site content is static JSON in src/data (exported from the former database); there is no server or database. */
export type PageType = 'SERVICE' | 'INDUSTRY' | 'CASE_STUDY' | 'TECHNOLOGY' | 'COMPANY' | 'LEGAL';

export interface ContentPage {
  path: string;
  type: PageType;
  navLabel: string;
  title: string;
  tagline: string | null;
  sections: Section[];
  faqs: FaqItem[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  coverImage: string | null;
  category: string | null;
  author: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  metaTitle: string | null;
  metaDescription: string | null;
}

const pages = pagesData as unknown as ContentPage[];
// Some legacy posts glue every word together with non-breaking spaces, so paragraphs never wrap and the page scrolls sideways.
const unglue = (html: string) => html.replace(/&nbsp;|&#160;| /gi, ' ');
const posts: BlogPost[] = (postsData as unknown as (Omit<BlogPost, 'publishedAt' | 'updatedAt'> & { publishedAt: string | null; updatedAt: string })[]).map(p => ({
  ...p, body: unglue(p.body), publishedAt: p.publishedAt ? new Date(p.publishedAt) : null, updatedAt: new Date(p.updatedAt),
}));

export const getAllPages = () => pages;
export const getPage = (path: string) => pages.find(p => p.path === path) ?? null;
export const getPagesByType = (type: PageType) => pages.filter(p => p.type === type);
export const getTestimonials = () => testimonialsData.map((t, i) => ({ id: String(i), ...t }));
export const getFaqs = () => faqsData;
export const getPosts = () => posts;
export const getPost = (slug: string) => posts.find(p => p.slug === slug) ?? null;

export const abs = (path: string) => (path.startsWith('http') ? path : env.siteUrl + path);
const stripTags = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export function buildMeta(o: { title: string; description?: string | null; path: string; image?: string | null; type?: 'website' | 'article' }): Metadata {
  const description = o.description ? stripTags(o.description).slice(0, 300) : undefined;
  const url = abs(o.path);
  return {
    title: { absolute: o.title },
    description,
    alternates: { canonical: url },
    openGraph: { title: o.title, description, url, type: o.type ?? 'website', siteName: 'AAHA Solutions', images: [{ url: abs(o.image || '/assets/images/logo.svg') }] },
    twitter: { card: 'summary_large_image', title: o.title, description },
  };
}

export const fmtDate = (d: Date | null) => (d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
