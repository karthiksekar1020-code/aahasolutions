'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Counts up to a value like "2008" or "20+" when scrolled into view (shows the final value for reduced-motion visitors). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : 0;
  const suffix = m ? m[2] : '';
  const isNum = m !== null; // a boolean, not `m` itself: the match array is new every render and would restart the effect (and the count) endlessly
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(m && !reduce ? 0 : target);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isNum || reduce) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1600;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [isNum, reduce, target]);

  if (!m) return <span className={className}>{value}</span>;
  // The final value is laid out invisibly underneath so the width never jumps while the digits count up.
  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden className="inline-grid">
        <span className="invisible col-start-1 row-start-1">{target}{suffix}</span>
        <span className="col-start-1 row-start-1">{n}{suffix}</span>
      </span>
    </span>
  );
}
