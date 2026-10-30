'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, Quote } from 'lucide-react';
import clsx from 'clsx';
import { HOME, CONSULTANT_FACTS } from '@/lib/site';
import { useEnquiry } from '@/components/ui/enquiry';

/* ---------------- Testimonials ---------------- */
export interface TestimonialView { id: string; quote: string; body: string; name: string; role: string; location: string | null }

/** Photo framing below is tuned for a 48px avatar; the avatar is 72px, so px() scales every px value by 1.5. */
const px = (s: string) => s.replace(/-?\d+(\.\d+)?px/g, m => `${parseFloat(m) * 1.5}px`);

/** Reviewer photos by name (framed for the 48px avatar circle); anyone not listed shows initials. */
const PHOTOS: Record<string, { src: string; pos: string; size?: string }> = {
  'Daniel Schaefer': { src: '/assets/images/testimonials/daniel-schaefer.png', pos: '-28px -20px' },
  'Bohus Pollak': { src: '/assets/images/testimonials/bohus-pollak.png', pos: '-24px -20px' },
  'Claude-Yves JESU DUCHATEL': { src: '/assets/images/testimonials/claude-yves-duchatel.png', pos: '-27px -20px', size: '145px auto' },
};

export function Testimonials({ items }: { items: TestimonialView[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = setTimeout(() => setI(n => (n + 1) % items.length), 6500);
    return () => clearTimeout(id);
  }, [i, paused, items.length]);
  if (!items.length) return null;
  const t = items[i];
  const go = (d: number) => setI(n => (n + d + items.length) % items.length);
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <figure key={t.id} className="card tm-card relative mx-auto max-w-3xl p-8 text-center md:p-12" aria-live="polite">
        <span aria-hidden className="tm-orb" />
        <span aria-hidden className="tm-sheen" />
        <Quote aria-hidden className="tm-quote relative mx-auto mb-5 h-12 w-12 text-brand/40" />
        <blockquote>
          <p className="tm-up font-display text-2xl font-semibold leading-snug text-ink md:text-3xl" style={{ animationDelay: '0.1s' }}>“{t.quote}”</p>
          <p className="tm-up mt-5 text-[16px] leading-relaxed text-ink/70" style={{ animationDelay: '0.25s' }}>{t.body}</p>
        </blockquote>
        <figcaption className="tm-up mt-7 flex flex-col items-center gap-3" style={{ animationDelay: '0.4s' }}>
          <span
            aria-hidden className="tm-avatar grid h-[72px] w-[72px] shrink-0 text-xl place-items-center rounded-full bg-brand-100 font-display font-semibold text-brand-800 ring-2 ring-brand/60 ring-offset-2 ring-offset-white"
            style={PHOTOS[t.name] ? { backgroundImage: `url(${PHOTOS[t.name].src})`, backgroundSize: px(PHOTOS[t.name].size ?? '118px auto'), backgroundPosition: px(PHOTOS[t.name].pos), backgroundRepeat: 'no-repeat' } : undefined}
          >{!PHOTOS[t.name] && t.name.split(/[\s-]+/).slice(0, 2).map(p => p[0]).join('')}</span>
          <span>
            <span className="block font-semibold text-ink">{t.name}</span>
            <span className="block text-sm text-ink/70">{t.role}</span>
            {t.location && <span className="block text-sm text-ink/70">{t.location}</span>}
          </span>
        </figcaption>
        {items.length > 1 && <span aria-hidden className="tm-progress" style={{ animationPlayState: paused ? 'paused' : 'running' }} />}
      </figure>
      {items.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white hover:border-brand-600"><ArrowLeft aria-hidden className="h-4 w-4" /></button>
          <div role="group" aria-label="Choose testimonial" className="flex">
            {items.map((x, n) => (
              <button key={x.id} type="button" onClick={() => setI(n)} aria-label={`Testimonial ${n + 1} of ${items.length}`} aria-current={n === i} className="grid h-8 w-6 place-items-center">
                <span className={clsx('h-2 rounded-full transition-all', n === i ? 'w-6 bg-brand-600' : 'w-2 bg-ink/25')} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white hover:border-brand-600"><ArrowRight aria-hidden className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Technology stack tabs ---------------- */
export function TechStack() {
  const [tab, setTab] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, n: number) => {
    const last = HOME.tech.length - 1;
    const next = e.key === 'ArrowRight' ? (n === last ? 0 : n + 1) : e.key === 'ArrowLeft' ? (n === 0 ? last : n - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
    if (next < 0) return;
    e.preventDefault(); setTab(next); refs.current[next]?.focus();
  };
  const g = HOME.tech[tab];
  return (
    <div>
      <div role="tablist" aria-label="Technology categories" className="flex flex-wrap justify-center gap-2">
        {HOME.tech.map((t, n) => (
          <button
            key={t.group} ref={el => { refs.current[n] = el; }} role="tab" id={`${base}-t${n}`} aria-selected={tab === n} aria-controls={`${base}-p${n}`} tabIndex={tab === n ? 0 : -1}
            onClick={() => setTab(n)} onKeyDown={e => onKey(e, n)}
            className={clsx('tab-pill min-h-[44px] rounded-full border px-5 text-[15px] font-medium', tab === n ? 'tab-pill-on border-brand bg-brand text-ink' : 'border-white/15 bg-white/5 text-white/80 hover:border-brand/60 hover:text-white')}
            style={{ animationDelay: `${n * 0.12}s` }}
          >
            {t.group}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-p${tab}`} aria-labelledby={`${base}-t${tab}`} className="mt-10">
        <ul className="flex flex-wrap justify-center gap-4">
          {g.items.map(([name, icon], k) => (
            <li key={name} style={{ "--k": k } as React.CSSProperties} className="card-dark tech-item flex w-[calc(50%-0.5rem)] flex-col items-center gap-3 p-5 text-center transition-colors hover:border-brand/40 sm:w-[calc(33.333%-0.7rem)] lg:w-[calc(16.666%-0.85rem)]">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-white p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icon/${icon}`} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 object-contain" />
              </span>
              <span className="text-sm font-medium text-white">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Interactive AI Consultant ---------------- */
type Msg = { role: 'user' | 'assistant'; content: string };

export function AiConsultant() {
  const { open } = useEnquiry();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the newest message visible by scrolling ONLY the chat log's own container. (scrollIntoView would scroll the
  // whole window to this section on mount — that was the cause of the homepage auto-scrolling down.)
  useEffect(() => {
    const el = logRef.current;
    if (!el || msgs.length === 0) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [msgs]);

  // Only the five vetted quick answers (verbatim company copy) — never invented text. There is no server, so no live AI.
  function ask(q: string, key: string) {
    setMsgs(m => [...m, { role: 'user', content: q }, { role: 'assistant', content: CONSULTANT_FACTS[key] ?? 'Please submit the enquiry form and our team will reply.' }]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.4fr]">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Quick Questions</h3>
        <ul className="mt-4 space-y-2.5">
          {HOME.consultant.quick.map(q => (
            <li key={q.key}>
              <button type="button" onClick={() => ask(q.q, q.key)} className="w-full rounded-ctl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-[15px] text-white/85 transition-colors hover:border-brand/50 hover:bg-white/[0.07]">
                {q.q}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-h-[26rem] flex-col overflow-hidden rounded-card border border-white/10 bg-ink-800">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
          <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-brand/15 text-brand"><Bot className="h-5 w-5" /></span>
          <div>
            <p className="font-display text-[15px] font-semibold text-white">AAHA Intelligent Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-white/60">
              <span aria-hidden className="h-2 w-2 rounded-full bg-brand" />
              Instant answers
            </p>
          </div>
        </div>
        <div ref={logRef} className="flex-1 space-y-4 overflow-y-auto p-5" role="log" aria-live="polite" aria-label="Conversation">
          {msgs.length === 0 && <p className="text-[15px] text-white/60">Click one of the quick questions on the left to get instant answers.</p>}
          {msgs.map((m, n) => (
            <div key={n} className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <p className={clsx('max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed', m.role === 'user' ? 'bg-brand text-ink' : 'bg-white/[0.07] text-white/90')}>{m.content}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 p-4 text-sm text-white/65">
          Have a different question? <button type="button" onClick={() => open('Book a Free Consultation')} className="font-semibold text-brand underline underline-offset-4">Send us your question</button> and our team will reply.
        </div>
      </div>
    </div>
  );
}
