import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { EnquirySection, PageHero } from '@/components/ui/page-parts';
import { HoverCard, Reveal } from '@/components/ui/motion';
import { CardVideo } from '@/components/home/card-video';
import { buildMeta, getPage, getPagesByType } from '@/lib/content';
import { HOME } from '@/lib/site';

const PATH = '/software-development-case-studies-in-pondicherry.php';

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPage(PATH);
  return buildMeta({ title: p?.metaTitle || 'Project Case Studies | AAHA Solutions', description: p?.metaDescription || 'Case studies from AAHA Solutions: AI chatbot, cloud migration, e-commerce, change management and mobile learning projects.', path: PATH });
}

export default async function CaseStudies() {
  const [intro, studies] = await Promise.all([getPage(PATH), getPagesByType('CASE_STUDY')]);
  const meta = new Map(HOME.caseStudies.map(c => [c.href, c]));
  const introText = intro?.sections.flatMap(s => s.blocks).filter(b => b.t === 'p').map(b => (b as { html: string }).html.replace(/<[^>]+>/g, '')).find(t => t.length > 40);
  return (
    <>
      <PageHero title="Project Case Studies" tagline={introText ?? 'How we have engineered solutions that deliver measurable business results.'} crumbs={[{ label: 'Home', href: '/' }, { label: 'Case Studies' }]} cta={false} video="/videos/professionals-collaborating.mp4" />
      <section className="bg-light py-14 md:py-20" aria-label="Case studies">
        <div className="container">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studies.map((s, i) => {
              const m = meta.get(s.path);
              return (
                <li key={s.path}>
                  <Reveal scrub={i % 3} className="h-full">
                    <HoverCard className="h-full">
                      <Link href={s.path} className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
                        <div className="relative aspect-[16/9] bg-gradient-to-br from-ink to-ink-600">
                          {m && <Image src={m.img} alt="" fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
                          {m?.video && <CardVideo src={m.video} poster={m.img} className="absolute inset-0 h-full w-full object-cover" />}
                          {m && <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">{m.tag}</span>}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h2 className="font-display text-xl font-semibold text-ink">{s.title}</h2>
                          <p className="mt-2 flex-1 text-[15px] text-ink/70">{m?.text ?? s.tagline}</p>
                          <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-700">Read Case Study <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                        </div>
                      </Link>
                    </HoverCard>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <EnquirySection source="Case studies" />
    </>
  );
}
