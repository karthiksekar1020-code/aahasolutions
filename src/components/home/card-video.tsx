'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Muted looping card video. Plays only while on screen, and not at all for visitors who prefer reduced motion (the poster image shows instead). */
export function CardVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden tabIndex={-1} disablePictureInPicture disableRemotePlayback controlsList="nodownload nofullscreen noremoteplayback" onContextMenu={e => e.preventDefault()} />;
}
