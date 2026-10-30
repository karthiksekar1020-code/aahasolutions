'use client';
import { Children, useCallback, useState, type KeyboardEvent, type ReactNode } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

/**
 * Coverflow carousel (after the 21st.dev coverflow-carousel): the centre card sits flat and full-size,
 * neighbours tilt back in 3D and shrink. Click a side card, use the arrows/dots, press ←/→, or swipe to move.
 * Slides share one grid cell, so the carousel is as tall as its tallest card.
 */
export function CoverflowCarousel({ children, width = 380, label, dark = false, className }: { children: ReactNode; width?: number; label: string; dark?: boolean; className?: string }) {
  const items = Children.toArray(children);
  const n = items.length;
  const [active, setActive] = useState(Math.floor((n - 1) / 2));
  const go = useCallback((i: number) => setActive(Math.max(0, Math.min(n - 1, i))), [n]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };
  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(active + 1);
    else if (info.offset.x > 50 || info.velocity.x > 400) go(active - 1);
  };

  const btn = clsx('grid h-11 w-11 place-items-center rounded-full border transition-colors disabled:opacity-30', dark ? 'border-white/20 text-white hover:bg-white/10' : 'border-ink/15 text-ink hover:bg-ink/5');

  return (
    <div className={className} role="group" aria-roledescription="carousel" aria-label={label} tabIndex={0} onKeyDown={onKey}>
      <motion.div onPanEnd={onPanEnd} className="relative grid overflow-hidden py-14" style={{ perspective: 1400, touchAction: 'pan-y' }}>
        {items.map((child, i) => {
          const d = i - active;
          const a = Math.abs(d);
          const isActive = d === 0;
          return (
            <motion.div
              key={i}
              role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}
              animate={{
                x: `${d * 60 + Math.sign(d) * 14}%`,
                rotateY: Math.max(-58, Math.min(58, -d * 40)),
                scale: 1 - Math.min(a, 3) * 0.1,
                opacity: a > 2 ? 0 : 1, // solid cards: fading them lets neighbours' text show through
                filter: `brightness(${1 - Math.min(a, 3) * 0.13})`,
              }}
              transition={{ type: 'spring', stiffness: 170, damping: 24 }}
              style={{ gridArea: '1 / 1', justifySelf: 'center', width: `min(${width}px, 78vw)`, zIndex: 10 - a, pointerEvents: a > 2 ? 'none' : 'auto' }}
              className="relative"
            >
              <div className="h-full" inert={!isActive ? true : undefined}>{child}</div>
              {!isActive && (
                <button type="button" onClick={() => go(i)} aria-label={`Show slide ${i + 1} of ${n}`} className="absolute inset-0 z-20 cursor-pointer rounded-card" />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex items-center justify-center gap-4">
        <button type="button" className={btn} onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous"><ChevronLeft aria-hidden className="h-5 w-5" /></button>
        <div className="flex items-center gap-2" aria-hidden>
          {items.map((_, i) => (
            <button key={i} type="button" tabIndex={-1} onClick={() => go(i)} className={clsx('h-2 rounded-full transition-all duration-300', i === active ? 'w-7 bg-brand' : clsx('w-2', dark ? 'bg-white/30 hover:bg-white/60' : 'bg-ink/20 hover:bg-ink/40'))} />
          ))}
        </div>
        <button type="button" className={btn} onClick={() => go(active + 1)} disabled={active === n - 1} aria-label="Next"><ChevronRight aria-hidden className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
