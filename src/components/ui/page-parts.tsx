import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock4, Crosshair, Globe2, Network, PencilRuler, UserCog, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import type { Block, FaqItem, Section } from '@/lib/content-types';
import { Reveal, ImageReveal, HoverCard, SplitHeading } from './motion';
import { FA_ICONS } from './fa-icons';
import { TILE_GRADIENTS, iconForTitle } from './card-icons';
import { techIcons } from './tech-icons';
import { CountUp } from './count-up';
import { ContentTabs } from './content-tabs';
import { CtaButton } from './enquiry';
import { Accordion } from './accordion';
import { EnquiryForm } from './enquiry';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumb-nav text-sm text-white/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.label} className="crumb-item flex items-center gap-1.5" style={{ animationDelay: `${i * 0.18}s` }}>
            {it.href ? <Link href={it.href} className="crumb-link hover:text-white">{it.label}</Link> : <span aria-current="page" className="crumb-current text-white/90">{it.label}</span>}
            {i < items.length - 1 && <ChevronRight aria-hidden className="crumb-chev h-3.5 w-3.5" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ title, tagline, crumbs, cta = true, video, animated = false, children }: { title: string; tagline?: string | null; crumbs?: { label: string; href?: string }[]; cta?: boolean; video?: string; animated?: boolean; children?: React.ReactNode }) {
  return (
    <section className="bg-hero relative isolate overflow-hidden text-white">
      {video && (
        <>
          <video aria-hidden tabIndex={-1} className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden" autoPlay muted loop playsInline preload="metadata" disablePictureInPicture>
            <source src={video} type="video/mp4" />
          </video>
          {/* Overlay keeps the title and tagline at AA contrast over any frame */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" />
        </>
      )}
      <div aria-hidden className="grid-fine pointer-events-none absolute inset-0" />
      <div className="container relative py-10 md:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <Reveal className="mt-6 max-w-3xl">
          {animated ? (
            <>
              <SplitHeading as="h1" text={title} className="h-display text-[2rem] leading-[1.1] sm:text-5xl md:text-[3.4rem]" />
              <span aria-hidden className="hero-bar mt-4 block h-1 w-24 rounded-full" />
              {tagline && <p className="hero-tag mt-5 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">{tagline}</p>}
            </>
          ) : (
            <>
              <h1 className="h-display text-[2rem] leading-[1.1] sm:text-5xl md:text-[3.4rem]">{title}</h1>
              {tagline && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">{tagline}</p>}
            </>
          )}
          {cta && (
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton cta="Book a Free Consultation">Talk to our team <ArrowRight aria-hidden className="h-4 w-4" /></CtaButton>
              <CtaButton cta="Get Project Estimate" variant="secondary-dark">Get Project Estimate</CtaButton>
            </div>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

type Group =
  | { k: 'cards'; items: Extract<Block, { t: 'card' }>[] }
  | { k: 'stats'; items: Extract<Block, { t: 'card' }>[] }
  | { k: 'chips'; items: string[] }
  | { k: 'prose'; blocks: Block[] }
  | { k: 'images'; items: Extract<Block, { t: 'img' }>[] }
  | { k: 'figures'; items: { src: string; alt: string; caption: string }[] }
  | { k: 'cta'; items: Extract<Block, { t: 'cta' }>[] }
  | { k: 'tabs'; block: Extract<Block, { t: 'tabs' }> };

const textOf = (h: string) => h.replace(/<[^>]*>/g, '').trim();

function group(blocks: Block[]): Group[] {
  const out: Group[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.t === 'card') {
      const items: Extract<Block, { t: 'card' }>[] = [];
      const stats: Extract<Block, { t: 'card' }>[] = [];
      while (i < blocks.length && blocks[i].t === 'card') { const c = blocks[i] as Extract<Block, { t: 'card' }>; if (c.text) items.push(c); else if (/^[0-9]/.test(c.title)) stats.push(c); i++; }
      if (items.length) out.push({ k: 'cards', items });
      if (stats.length) out.push({ k: 'stats', items: stats });
      continue;
    }
    if (b.t === 'img' && blocks[i + 1]?.t === 'p' && /^(<br>)?<a[^>]*><strong>[^<]{1,40}<\/strong><\/a>$/.test((blocks[i + 1] as { html: string }).html)) {
      const items: { src: string; alt: string; caption: string }[] = [];
      while (i < blocks.length && blocks[i].t === 'img') {
        const im = blocks[i] as Extract<Block, { t: 'img' }>;
        const next = blocks[i + 1];
        const cap = next?.t === 'p' && /^(<br>)?<a[^>]*><strong>[^<]{1,40}<\/strong><\/a>$/.test(next.html) ? textOf(next.html) : '';
        items.push({ src: im.src, alt: im.alt, caption: cap });
        i += cap ? 2 : 1;
      }
      out.push({ k: 'figures', items });
      continue;
    }
    if (b.t === 'img') { const items: Extract<Block, { t: 'img' }>[] = []; while (i < blocks.length && blocks[i].t === 'img') { items.push(blocks[i] as Extract<Block, { t: 'img' }>); i++; } out.push({ k: 'images', items }); continue; }
    if (b.t === 'tabs') { out.push({ k: 'tabs', block: b }); i++; continue; }
    if (b.t === 'cta') { const items: Extract<Block, { t: 'cta' }>[] = []; while (i < blocks.length && blocks[i].t === 'cta') { items.push(blocks[i] as Extract<Block, { t: 'cta' }>); i++; } out.push({ k: 'cta', items }); continue; }
    // run of short plain paragraphs -> chips
    if (b.t === 'p' && !b.html.startsWith('<strong>') && textOf(b.html).length <= 60) {
      let j = i; const run: string[] = [];
      while (j < blocks.length && blocks[j].t === 'p' && !(blocks[j] as { html: string }).html.startsWith('<strong>') && textOf((blocks[j] as { html: string }).html).length <= 60) { run.push(textOf((blocks[j] as { html: string }).html)); j++; }
      if (run.length >= 3) { out.push({ k: 'chips', items: run }); i = j; continue; }
    }
    const run: Block[] = [];
    while (i < blocks.length && ['p', 'ul'].includes(blocks[i].t)) { run.push(blocks[i]); i++; }
    if (!run.length) { i++; continue; }
    out.push({ k: 'prose', blocks: run });
  }
  return out;
}

const BG = ['bg-white-soft', 'bg-mint', 'bg-white-soft', 'bg-light'] as const;

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s, idx) => {
        const groups = group(s.blocks);
        if (!groups.length && !s.heading) return null;
        const hasImg = groups.some(g => g.k === 'images');
        const firstProse = groups.findIndex(g => g.k === 'prose');
        // Side-by-side only for a single illustration (e.g. "What we do"); several badges/diagrams stack under the paragraph instead.
        const imgCount = s.blocks.filter(b => b.t === 'img').length;
        const split = hasImg && imgCount === 1 && firstProse > -1 && groups.every(g => ['prose', 'images'].includes(g.k));
        // A lone picture straight after the opening text sits beside it (text left, picture right) instead of floating centred below.
        const lead = !split && groups[0]?.k === 'prose' && groups[1]?.k === 'images' && groups[1].items.length === 1;
        return (
          <section key={idx} className={clsx('relative py-14 md:py-20', BG[idx % BG.length])} aria-labelledby={s.heading ? `s-${idx}` : undefined}>
            {idx % 4 === 1 && <div aria-hidden className="dots-light pointer-events-none absolute inset-x-0 top-0 h-48" />}
            <div className="container relative">
              {s.heading && (
                <Reveal>
                  <h2 id={`s-${idx}`} className="h-display max-w-3xl text-[1.65rem] leading-tight text-ink md:text-4xl">{s.heading}</h2>
                  <div aria-hidden className="mt-4 h-1 w-12 rounded-full bg-brand" />
                </Reveal>
              )}
              <div className={clsx('mt-8 grid gap-10', split && 'lg:grid-cols-2 lg:items-center')}>
                {split ? (
                  <>
                    <div>{groups.filter(g => g.k === 'prose').map((g, i) => g.k === 'prose' && <Prose key={i} blocks={g.blocks} />)}</div>
                    <div className="space-y-6">{groups.filter(g => g.k === 'images').map((g, i) => g.k === 'images' && <Images key={i} items={g.items} />)}</div>
                  </>
                ) : (
                  <>
                  {lead && (
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                      <Prose blocks={(groups[0] as Extract<Group, { k: 'prose' }>).blocks} />
                      <Images items={(groups[1] as Extract<Group, { k: 'images' }>).items} />
                    </div>
                  )}
                  {groups.slice(lead ? 2 : 0).map((g, i) => {
                    if (g.k === 'cards') return <Cards key={i} items={g.items} />;
                    if (g.k === 'stats') return <Stats key={i} items={g.items} />;
                    if (g.k === 'chips') return <Chips key={i} items={g.items} />;
                    if (g.k === 'images') return <Images key={i} items={g.items} />;
                    if (g.k === 'figures') return <Figures key={i} items={g.items} />;
                    if (g.k === 'tabs') return <Reveal key={i}><ContentTabs tabs={g.block.tabs} side={g.block.side} /></Reveal>;
                    if (g.k === 'cta') return <div key={i} className="flex flex-wrap gap-3">{g.items.map(c => <Link key={c.href + c.label} href={c.href} className="btn btn-secondary">{c.label}</Link>)}</div>;
                    return <Prose key={i} blocks={g.blocks} />;
                  })}
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

/** "What we do" list items start with a keyword (MISSION / PROJECT ANALYSIS / PRODUCT DELIVERY): shown with a ringed icon and green heading. */
const KEYED: [string, LucideIcon][] = [['PROJECT ANALYSIS', Crosshair], ['PRODUCT DELIVERY', Clock4], ['MISSION', PencilRuler]];

function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <Reveal className="prose-aaha max-w-3xl">
      {blocks.map((b, i) =>
        b.t === 'p' ? <p key={i} dangerouslySetInnerHTML={{ __html: b.html }} />
        : b.t === 'ul' ? (
          <ul key={i} className="!list-none !pl-0">
            {b.items.map((it, j) => {
              const hit = KEYED.find(([k]) => it.startsWith(k));
              if (hit) {
                const [key, Icon] = hit;
                return (
                  <li key={j} className="key-item group flex items-center gap-5 !pl-0 !py-3">
                    <span aria-hidden className="key-ring grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-brand text-brand-600"><Icon className="h-7 w-7" strokeWidth={1.6} /></span>
                    <span>
                      <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">{key}</span>
                      <span className="mt-2 block" dangerouslySetInnerHTML={{ __html: it.slice(key.length).trim() }} />
                    </span>
                  </li>
                );
              }
              return (
              <li key={j} className="flex gap-3"><Check aria-hidden className="mt-1.5 h-4 w-4 shrink-0 text-brand-600" /><span dangerouslySetInnerHTML={{ __html: it }} /></li>
              );
            })}
          </ul>
        ) : null,
      )}
    </Reveal>
  );
}

function Cards({ items }: { items: Extract<Block, { t: 'card' }>[] }) {
  const cols = items.length === 1 ? '!grid-cols-1 mx-auto max-w-3xl' : items.length % 3 === 0 || items.length > 4 ? 'lg:grid-cols-3' : items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2';
  return (
    <ul className={clsx('grid gap-5 sm:grid-cols-2', cols)}>
      {items.map((c, i) => (
        <li key={c.title + i}>
          <Reveal scrub={i % 3} className="h-full">
            <HoverCard className="card group h-full p-6 transition-shadow hover:shadow-lift">
              {c.icon?.startsWith('/') ? (
                <div className="flex h-full flex-col items-center text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.icon} alt="" width={88} height={88} loading="lazy" className="h-20 w-20 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
                  <p className="mt-4 text-[15px] font-medium leading-relaxed text-ink/80">{c.text}</p>
                </div>
              ) : (
                <>
                  {(() => {
                    const CardIcon = (c.icon ? FA_ICONS[c.icon] : undefined) ?? iconForTitle(c.title);
                    return (
                      <span aria-hidden className={clsx('card-tile mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white', TILE_GRADIENTS[i % TILE_GRADIENTS.length])} style={{ '--k': i } as React.CSSProperties}>
                        <CardIcon className="h-7 w-7" strokeWidth={1.8} />
                      </span>
                    );
                  })()}
                  <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{c.text}</p>
                </>
              )}
            </HoverCard>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

const STAT_ICONS: LucideIcon[] = [CalendarDays, UserCog, Network, Globe2];

/** Dark numbers band ("2008 · 20+ · 50+ · 5+"): card titles are "<number> <label>". */
function Stats({ items }: { items: Extract<Block, { t: 'card' }>[] }) {
  return (
    <Reveal>
      <ul className="stats-band relative overflow-hidden grid grid-cols-2 gap-x-6 gap-y-8 rounded-card bg-[#2f3030] px-6 py-9 md:grid-cols-4 md:px-10">
        {items.map((c, i) => {
          const [num, ...rest] = c.title.split(/\s+/);
          const label = rest.join(' ').replace(/([a-z])(\d)/g, '$1 $2');
          const Icon = STAT_ICONS[i % STAT_ICONS.length];
          return (
            <li key={c.title} className="stat-item flex items-center justify-center gap-4" style={{ animationDelay: `${i * 0.12}s`, "--k": i } as React.CSSProperties}>
              <Icon aria-hidden className="stat-icon h-12 w-12 shrink-0 text-brand" strokeWidth={1.3} />
              <span>
                <CountUp value={num} className="stat-num block font-display text-4xl font-semibold leading-none text-white md:text-5xl" />
                <span className="mt-2 block max-w-[10rem] text-xs font-semibold uppercase tracking-[0.12em] text-white/85">{label}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {items.map((t, i) => {
        const icons = techIcons(t);
        return (
          <li key={t + i} className="chip-tech inline-flex items-center gap-2.5 rounded-full border border-brand-600/25 bg-white py-2 pr-4 text-[15px] font-medium text-ink shadow-sm" style={{ "--k": i, paddingLeft: icons.length ? "0.5rem" : "1rem" } as React.CSSProperties}>
            {icons.length ? (
              <span aria-hidden className="flex -space-x-1.5">
                {icons.map((f, k) => (
                  <span key={f} className="chip-logo grid h-8 w-8 place-items-center rounded-full bg-white p-1.5 ring-1 ring-ink/10" style={{ "--k": i + k } as React.CSSProperties}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/icon/${f}`} alt="" width={20} height={20} loading="lazy" className="h-5 w-5 object-contain" />
                  </span>
                ))}
              </span>
            ) : (
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
            )}
            {t}
          </li>
        );
      })}
    </ul>
  );
}


export function FaqSection({ faqs, title = 'Frequently Asked Questions', dark = false, html = false }: { faqs: FaqItem[]; title?: string; dark?: boolean; html?: boolean }) {
  if (!faqs.length) return null;
  return (
    <section className={clsx('py-16 md:py-24', dark ? 'bg-dark-soft text-white' : 'bg-light')} aria-labelledby="faq-title">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className={clsx('eyebrow', dark && 'eyebrow-dark')}>FAQ</p>
          <h2 id="faq-title" className="h-display mt-3 text-3xl md:text-4xl">{title}</h2>
          <p className={clsx('mt-4 max-w-sm', dark ? 'text-white/70' : 'text-ink/70')}>Quick answers to common questions. Can’t find yours? Talk to our team.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion dark={dark} items={faqs.map((f, i) => ({ id: String(i), question: f.q, answerHtml: html ? f.a : `<p>${esc(f.a)}</p>` }))} />
        </Reveal>
      </div>
    </section>
  );
}

export function EnquirySection({ source, title = 'Get a tailored project estimate', text = 'Tell us what you are building. Our solutions architects will reach out within 24 hours.' }: { source: string; title?: string; text?: string }) {
  return (
    <section id="enquire" className="bg-hero relative overflow-hidden py-16 text-white md:py-24" aria-labelledby="enq-title">
      <div aria-hidden className="grid-fine pointer-events-none absolute inset-0" />
      <div className="container relative grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="eyebrow eyebrow-dark">Get in touch</p>
          <SplitHeading id="enq-title" text={title} className="h-display mt-3 text-3xl md:text-4xl" />
          <p className="eq-text mt-4 max-w-md text-lg text-white/75">{text}</p>
          <ul className="mt-6 space-y-2.5 text-[15px] text-white/75">
            {['NDA before discussion', 'Offices in India and the UK', 'Response within 24 hours'].map((t, k) => (
              <li key={t} className="eq-li flex items-center gap-2.5" style={{ animationDelay: `${0.5 + k * 0.18}s` }}><Check aria-hidden className="eq-check h-4 w-4 text-brand" style={{ animationDelay: `${0.8 + k * 0.18}s` }} />{t}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="ef-card rounded-card border border-white/10 bg-white/[0.05] p-6 sm:p-8">
          <EnquiryForm source={source} dark />
        </Reveal>
      </div>
    </section>
  );
}

/** Badge-sized images sit in a grid; wide diagrams (e.g. the Strategic Business Units gears) get a full-width row of their own. */
const isWide = (im: { src: string }) => /StrategicBusinessUnits/i.test(im.src);

function Images({ items }: { items: Extract<Block, { t: 'img' }>[] }) {
  const small = items.filter(im => !isWide(im));
  const wide = items.filter(isWide);
  return (
    <div className="space-y-8">
      {small.length > 0 && (
        <div className={clsx('grid gap-6', small.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'mx-auto w-full max-w-sm')}>
          {small.map((im, i) => (
            <ImageReveal key={im.src + i}>
              <div className={clsx('aw-card relative overflow-hidden rounded-card bg-ink/5 shadow-card', small.length > 1 ? 'aspect-[4/3]' : /diagram/i.test(im.alt) ? 'aspect-square' : 'aspect-[16/10]')} style={{ '--k': i } as React.CSSProperties}>
                <Image src={im.src} alt={im.alt || ''} fill sizes="(min-width:1024px) 40vw, 90vw" className={clsx('aw-img object-contain', small.length > 1 ? 'p-3' : 'p-2')} />
                <span aria-hidden className="aw-shine" />
              </div>
            </ImageReveal>
          ))}
        </div>
      )}
      {wide.map((im, i) => (
        <ImageReveal key={im.src + i}>
          <div className="aw-wide relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-card bg-ink/5 shadow-card">
            {/* the Strategic Business Units diagram is the still frame; the looping video plays over it (decorative, hidden for reduced motion) */}
            <Image src={im.src} alt={im.alt || ""} fill sizes="(min-width:1024px) 672px, 95vw" className="object-contain p-4" />
            <video aria-hidden tabIndex={-1} className="absolute inset-0 z-10 h-full w-full object-cover motion-reduce:hidden" src="/videos/gears-data.mp4" poster={im.src} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture />
            <span aria-hidden className="aw-shine" />
          </div>
        </ImageReveal>
      ))}
    </div>
  );
}

/** Captioned picture cards, laid out in an even grid with the caption centred under each picture. */
function Figures({ items }: { items: { src: string; alt: string; caption: string }[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <li key={it.src + i}>
          <ImageReveal>
            <figure className="aw-card aw-still flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card" style={{ '--k': i } as React.CSSProperties}>
              <div className="relative aspect-[4/3] bg-ink/5">
                <Image src={it.src} alt={it.alt || it.caption} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" className="aw-img object-cover" />
                <span aria-hidden className="aw-shine" />
              </div>
              {it.caption && <figcaption className="px-4 py-4 text-center font-display text-lg font-semibold text-brand-700">{it.caption}</figcaption>}
            </figure>
          </ImageReveal>
        </li>
      ))}
    </ul>
  );
}
