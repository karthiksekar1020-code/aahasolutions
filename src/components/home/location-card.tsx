'use client';
import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { MapPin } from 'lucide-react';

/** Location card: slide-in entrance, pulsing pin, cursor spotlight, dark-fill hover. */
export function LocationCard({ place, role, index }: { place: string; role: string; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(180px circle at ${x}% ${y}%, rgba(148,181,62,0.30), transparent 70%)`;

  return (
    <motion.li
      ref={ref}
      initial={reduce ? false : { opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { x: 8, scale: 1.02 }}
      onPointerMove={e => {
        const r = ref.current!.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width) * 100); y.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="group relative flex cursor-default items-center gap-4 overflow-hidden rounded-card border border-ink/10 bg-paper p-4 transition-[background-color,border-color,box-shadow] duration-300 hover:border-brand/60 hover:bg-ink hover:shadow-glow"
    >
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-brand to-brand-400 transition-transform duration-500 group-hover:scale-y-100" />
      <span className="relative grid h-11 w-11 shrink-0 place-items-center">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-xl bg-brand/40 [animation-duration:2.4s] motion-reduce:hidden" />
        <span aria-hidden className="relative grid h-11 w-11 place-items-center rounded-xl bg-ink text-brand ring-1 ring-brand/30 transition-all duration-300 group-hover:bg-brand group-hover:text-ink">
          <MapPin className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
        </span>
      </span>
      <span className="relative">
        <span className="block font-display font-semibold text-ink transition-colors duration-300 group-hover:text-white">{place}</span>
        <span className="block text-sm text-ink/70 transition-colors duration-300 group-hover:text-white/75">{role}</span>
      </span>
    </motion.li>
  );
}
