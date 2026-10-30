import type { MetadataRoute } from 'next';
import { abs, getAllPages, getPosts } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs('/'), changeFrequency: 'weekly', priority: 1 },
    { url: abs('/contact/'), changeFrequency: 'monthly', priority: 0.8 },
    { url: abs('/software-development-blog-in-pondicherry.php'), changeFrequency: 'weekly', priority: 0.7 },
    ...getAllPages().map(p => ({ url: abs(p.path), changeFrequency: 'monthly' as const, priority: p.type === 'SERVICE' || p.type === 'INDUSTRY' ? 0.9 : 0.7 })),
    ...getPosts().map(p => ({ url: abs(`/blog/${p.slug}/`), lastModified: p.updatedAt, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ];
}
