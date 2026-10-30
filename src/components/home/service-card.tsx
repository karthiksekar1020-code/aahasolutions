'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const DISC = 64; // arrow disc, px (the notch geometry lives in .svc-notch in globals.css)

/** Notched dark card: rounded cover with the arrow nested in a bite out of the bottom-right corner, cursor glow, subtle tilt, staggered entrance. */
export function ServiceCard({ title, href, icon, bg, index }: { title: string; href: string; icon: string; bg?: string; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const liRef = useRef<HTMLLIElement>(null);
  const col = index % 3;
  const { scrollYProgress } = useScroll({ target: liRef, offset: ['start 108%', `start ${78 - col * 6}%`] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.5 });
  const enterY = useTransform(p, [0, 1], [90 + col * 20, 0]);
  const enterOpacity = useTransform(p, [0, 0.6], [0, 1]);
  const enterScale = useTransform(p, [0, 1], [0.88, 1]);
  const enterTilt = useTransform(p, [0, 1], [24, 0]);
  const enterBlur = useTransform(p, [0, 0.7], [8, 0], { clamp: true });
  const enterFilter = useMotionTemplate`blur(${enterBlur}px)`;
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(0, { stiffness: 220, damping: 20 });
  const ry = useSpring(0, { stiffness: 220, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, rgba(148,181,62,0.28), transparent 70%)`;

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100); my.set(py * 100);
    if (!reduce) { ry.set((px - 0.5) * 8); rx.set((0.5 - py) * 8); }
  }
  function onLeave() { rx.set(0); ry.set(0); mx.set(50); my.set(50); }

  return (
    <motion.li
      ref={liRef}
      /* scroll-linked entrance: the card rises, un-tilts, scales up and sharpens as it scrolls into view (and reverses on the way back up) */
      style={reduce ? { perspective: 900 } : { perspective: 900, y: enterY, opacity: enterOpacity, scale: enterScale, rotateX: enterTilt, filter: enterFilter, transformOrigin: '50% 100%' }}
      className="h-full"
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} whileTap={{ scale: 0.98 }} className="h-full">
        <Link
          ref={ref}
          href={href}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="svc-card-wrap group relative block h-full rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
        >
          {/* the cover */}
          <div className="svc-notch relative flex h-full min-h-[12.5rem] flex-col justify-between gap-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-ink-700 via-ink-800 to-ink p-6 pb-7 text-white">
            {bg && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bg} alt="" aria-hidden loading="lazy" className="svc-bg pointer-events-none absolute inset-0 h-full w-full object-cover" />
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/20" />
              </>
            )}
            {/* cursor spotlight */}
            <motion.span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
            {/* light sweep */}
            <span aria-hidden className="pointer-events-none absolute -inset-y-4 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100 motion-reduce:hidden" />
            {/* icon: floats, wears a spinning light ring, pulses outward + wiggles on hover */}
            <span className="svc-icon relative h-16 w-16 shrink-0" style={{ transform: 'translateZ(30px)', animationDelay: `${(index % 6) * -0.7}s` }}>
              <span aria-hidden className="absolute -inset-[3px] overflow-hidden rounded-[1.15rem]">
                <span className="svc-halo absolute -inset-[70%]" />
              </span>
              <span aria-hidden className="svc-ring absolute inset-0 rounded-2xl border-2 border-brand opacity-0" />
              <span className="svc-tile relative grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-[0_0_0_3px_rgba(10,21,18,0.9)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transform-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon} alt="" width={36} height={36} loading="lazy" className="svc-glyph h-9 w-9 object-contain" />
              </span>
            </span>
            <span className="relative max-w-[calc(100%-5rem)] font-display text-xl font-semibold leading-snug" style={{ transform: 'translateZ(20px)' }}>{title}</span>
          </div>

          {/* the arrow, nested in the notch (the notch itself is cut out of the cover with a CSS mask, so it is truly transparent) */}
          <span
            aria-hidden
            className="svc-disc absolute bottom-0 right-0 grid place-items-center rounded-full bg-brand text-ink transition-[background-color,scale] duration-300 group-hover:scale-105 group-hover:bg-brand-400"
            style={{ width: DISC, height: DISC }}
          >
            <ArrowUpRight className="svc-arrow h-5 w-5" />
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
}
