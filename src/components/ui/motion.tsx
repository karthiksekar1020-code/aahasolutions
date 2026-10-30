'use client';
import { MotionConfig, motion, useReducedMotion, useMotionTemplate, useScroll, useSpring, useTransform, type HTMLMotionProps, type MotionValue } from 'framer-motion';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';

/** Heading that rises letter by letter out of a mask when scrolled into view, then ripples a green wave through the letters; letters pop on hover. */
export function SplitHeading({ text, id, className, as = 'h2' }: { text: string; id?: string; className?: string; as?: 'h1' | 'h2' }) {
  const reduce = useReducedMotion();
  const Tag = as;
  if (reduce) return <Tag id={id} className={className}>{text}</Tag>;
  const MotionTag = as === 'h1' ? motion.h1 : motion.h2;
  let n = 0;
  return (
    /* the heading itself is the single in-view trigger; letters inherit it through variants (a per-letter trigger would sit inside the clipped word box and never fire) */
    <MotionTag id={id} className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
      {text.split(' ').map((word, w) => (
        <span key={w} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
          {word.split('').map((ch, c) => {
            const i = n++;
            return (
              <motion.span
                key={c} className="inline-block"
                variants={{ hidden: { y: '115%', rotate: 8, opacity: 0 }, show: { y: 0, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.1 + i * 0.04 } } }}
              >
                <span className="wave-char inline-block" style={{ ['--i' as string]: i }}>{ch}</span>
              </motion.span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}

/** Scroll-linked word-by-word text: each word brightens as the paragraph crosses the viewport. */
export function TextReveal({ text, parts, className }: { text?: string; parts?: { text: string; href?: string }[]; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] });
  const segs = parts ?? [{ text: text ?? '' }];
  const plain = segs.map(s => s.text).join('');
  if (reduce) return <p className={className}>{segs.map((s, i) => (s.href ? <Link key={i} href={s.href} className="link-sweep font-semibold text-brand-700">{s.text}</Link> : s.text))}</p>;
  const total = segs.reduce((n, s) => n + s.text.split(' ').filter(Boolean).length, 0);
  let n = 0;
  return (
    <p ref={ref} className={className} aria-label={plain}>
      {segs.map((s, k) => {
        const words = s.text.split(' ').filter(Boolean).map(w => {
          const i = n++;
          return <Word key={i} progress={scrollYProgress} range={[i / total, (i + 1) / total]}>{w}</Word>;
        });
        return s.href
          ? <Link key={k} href={s.href} className="link-sweep font-semibold text-brand-700">{words}</Link>
          : <span key={k} aria-hidden>{words}</span>;
      })}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [10, 0]);
  const blur = useTransform(progress, range, [4, 0]);
  const filter = useTransform(blur, b => `blur(${b}px)`);
  return <motion.span aria-hidden style={{ opacity, y, filter }} className="mr-[0.25em] inline-block">{children}</motion.span>;
}

/** Vertical rule that draws itself downward as its container scrolls through view. */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <div ref={ref} aria-hidden className={className}>
      <motion.div style={{ scaleY }} className="h-full w-full origin-top bg-gradient-to-b from-brand via-brand to-brand/20 shadow-[0_0_14px_rgba(117,174,66,0.7)]" />
    </div>
  );
}

/** Bar that grows from the left when scrolled into view. */
export function GrowBar({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden className={className}
      initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ originX: 0 }}
    />
  );
}

/** Gentle parallax: content drifts by `distance` px while it crosses the viewport. */
export function Parallax({ children, distance = 40, className }: { children: ReactNode; distance?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>{children}</motion.div>;
}

/** Wrap the app once: honours the visitor's prefers-reduced-motion setting everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Scroll-triggered reveal. Content is visible without JS (initial state applied only after hydration via whileInView). */
export function Reveal({ children, delay = 0, y = 18, from = 'up', scrub, className, ...rest }: { children: ReactNode; delay?: number; y?: number; from?: 'up' | 'left' | 'right' | 'zoom'; scrub?: number; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const reduce = useReducedMotion();
  if (scrub !== undefined) return <ScrollCard col={scrub} className={className}>{children}</ScrollCard>;
  const start = from === 'left' ? { opacity: 0, x: -60, filter: 'blur(8px)' }
    : from === 'right' ? { opacity: 0, x: 60, filter: 'blur(8px)' }
    : from === 'zoom' ? { opacity: 0, scale: 0.9, filter: 'blur(8px)' }
    : { opacity: 0, y, filter: 'blur(6px)' };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : start}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-linked card entrance: rises, un-tilts, scales up and sharpens as it scrolls into view (reverses scrolling back up). `col` staggers cards in a row. */
export function ScrollCard({ children, col = 0, className }: { children: ReactNode; col?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const c = col % 4;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 108%', `start ${80 - c * 5}%`] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.5 });
  const y = useTransform(p, [0, 1], [80 + c * 16, 0]);
  const opacity = useTransform(p, [0, 0.6], [0, 1]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const rotateX = useTransform(p, [0, 1], [20, 0]);
  const blur = useTransform(p, [0, 0.7], [8, 0], { clamp: true });
  const filter = useMotionTemplate`blur(${blur}px)`;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div className={className} style={{ perspective: 900 }}>
      <motion.div ref={ref} className="h-full" style={{ y, opacity, scale, rotateX, filter, transformOrigin: '50% 100%' }}>{children}</motion.div>
    </div>
  );
}

/** Image reveal: soft scale-down + fade (no layout shift: wrapper keeps its box). */
export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Subtle hover lift for cards. */
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      {children}
    </motion.div>
  );
}
