'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { CardVideo } from './card-video';

export interface CaseView { title: string; text: string; href: string; img: string; tag: string; video?: string }

/** Case-study card. Always: spinning glow border, scanning light line over the media, pulsing tag. Hover: tilt toward the cursor + lift, cursor spotlight, light sweep, media zoom, title/arrow reactions. */
export function CaseCard({ c }: { c: CaseView }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`); el.style.setProperty('--my', `${py * 100}%`);
    el.style.setProperty('--ry', `${(px - 0.5) * 8}deg`); el.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
  }
  function onLeave() { const el = ref.current!; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); }

  return (
    <Link ref={ref} href={c.href} onPointerMove={onMove} onPointerLeave={onLeave} className="case-card group card-dark flex h-full flex-col overflow-hidden">
      <span aria-hidden className="case-spot" />
      <div className="case-media relative aspect-[16/9] overflow-hidden bg-ink-700">
        <Image src={c.img} alt={`${c.title} — project preview`} fill sizes="(min-width:1024px) 30vw, 90vw" className="case-zoom object-cover" />
        {c.video && <CardVideo src={c.video} poster={c.img} className="case-zoom absolute inset-0 h-full w-full object-cover" />}
        <span aria-hidden className="case-scan" />
        <span aria-hidden className="case-shine" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur-sm">
          <span aria-hidden className="case-dot" />{c.tag}
        </span>
      </div>
      <div className="relative flex flex-1 flex-col p-6">
        <h3 className="case-title font-display text-xl font-semibold">{c.title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-white/70">{c.text}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand">Read Case Study <ArrowRight aria-hidden className="case-arrow h-4 w-4" /></span>
      </div>
    </Link>
  );
}
