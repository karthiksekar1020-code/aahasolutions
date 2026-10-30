'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight, Factory, GraduationCap, HeartPulse, ShoppingCart, Truck, type LucideIcon } from 'lucide-react';

const ICONS: [string, LucideIcon, boolean][] = [['Health', HeartPulse, false], ['Retail', ShoppingCart, true], ['Logistics', Truck, true], ['Manufacturing', Factory, true], ['Education', GraduationCap, true]];

/** Industry card with its own accent colour. Hover: cursor-following colour spotlight, 3D tilt toward the cursor, lift, light sweep, title/arrow/dot reactions. */
export function IndustryCard({ title, text, href, accent }: { title: string; text: string; href: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [, Icon, solid] = ICONS.find(([k]) => title.startsWith(k)) ?? [];

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * 10}deg`);
  }
  function onLeave() {
    const el = ref.current!;
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="card cf-card cf-hover flex h-full flex-col p-7"
      style={{ ['--accent' as string]: accent }}
    >
      <span aria-hidden className="cf-spot" />
      <span aria-hidden className="cf-shine" />
      <span aria-hidden className="cf-dot" />
      {Icon && <span aria-hidden className="cf-icon relative mb-4 grid h-14 w-14 place-items-center rounded-2xl"><Icon className="h-8 w-8" strokeWidth={solid ? 1.5 : 2.4} fill={solid ? "currentColor" : "none"} /></span>}
      <h3 className="cf-title relative font-display text-xl font-semibold text-ink">{title}</h3>
      <span aria-hidden className="cf-bar relative mt-3" />
      <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-ink/70">{text}</p>
      <Link href={href} className="cf-link relative mt-5 inline-flex min-h-[44px] items-center gap-1.5 font-semibold">
        Explore <span className="sr-only">{title}</span><ArrowRight aria-hidden className="cf-arrow h-4 w-4" />
      </Link>
    </div>
  );
}
