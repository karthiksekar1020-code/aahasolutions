'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarClock } from 'lucide-react';
import clsx from 'clsx';
import { CtaButton } from '@/components/ui/enquiry';
import { HOME } from '@/lib/site';
import { SlideArt } from './slide-art';


export function Hero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { setPlaying(!reduce); }, [reduce]);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduce) v.pause(); else v.play().catch(() => {});
  }, [reduce]);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI(n => (n + 1) % HOME.slides.length), 6000);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <section className="bg-hero relative isolate overflow-hidden text-white" aria-label="Introduction">
      {/* Background video: decorative, muted, looping. Paused for prefers-reduced-motion. */}
      <video
        ref={videoRef}
        aria-hidden
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
      >
        <source src="/videos/hero-network.mp4" type="video/mp4" />
      </video>
      {/* Overlay keeps headline/body text at AA contrast over any frame */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/45" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink/80 to-transparent" />
      <div aria-hidden className="grid-fine pointer-events-none absolute inset-0 opacity-60" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-72 w-72 animate-drift rounded-full bg-brand/15 blur-3xl motion-reduce:animate-none" />
      <div className="container relative grid gap-10 pb-14 pt-8 md:pb-20 md:pt-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pb-20 lg:pt-8">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand"
          >
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand motion-reduce:hidden" />
              <span className="relative h-2 w-2 rounded-full bg-brand" />
            </span>
            {HOME.offices}
          </motion.p>

          <h1 className="h-display mt-6 text-[2.8rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]" aria-label="AAHA Solutions">
            <span aria-hidden className="inline-block whitespace-nowrap">
              {'AAHA'.split('').map((c, n) => (
                <motion.span
                  key={n}
                  className="inline-block bg-[linear-gradient(90deg,#75ae42,#c4e89a,#4f8a2a,#75ae42)] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-flow"
                  initial={reduce ? false : { opacity: 0, y: 40, rotateX: -80, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                  transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.1 + n * 0.08 }}
                  whileHover={reduce ? undefined : { y: -8, scale: 1.08 }}
                  style={{ transformPerspective: 600 }}
                >
                  {c}
                </motion.span>
              ))}
            </span>{' '}
            <span aria-hidden className="inline-block whitespace-nowrap">
              {'Solutions'.split('').map((c, n) => (
                <motion.span
                  key={n}
                  className="inline-block bg-[linear-gradient(110deg,#fff_35%,#bfe69a_50%,#fff_65%)] bg-[length:250%_100%] bg-clip-text text-transparent motion-safe:animate-sheen"
                  initial={reduce ? false : { opacity: 0, y: 40, rotateX: -80, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                  transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.45 + n * 0.05 }}
                  whileHover={reduce ? undefined : { y: -8, scale: 1.08 }}
                  style={{ transformPerspective: 600 }}
                >
                  {c}
                </motion.span>
              ))}
            </span>
            <motion.span
              aria-hidden
              className="mt-3 block h-1 rounded-full bg-gradient-to-r from-brand via-brand-300 to-transparent"
              initial={reduce ? false : { width: 0, opacity: 0 }}
              animate={{ width: '55%', opacity: 1 }}
              transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl"
          >
            {HOME.sub}
          </motion.p>

          {/* What-we-do switcher: click a message, or let it auto-advance (progress bar shows the timer) */}
          <div role="group" aria-label="What we do" className="mt-8 max-w-xl space-y-1.5">
            {HOME.slides.map((s, n) => {
              const active = i === n;
              return (
                <button
                  key={s.title}
                  type="button"
                  aria-pressed={active}
                  onClick={() => { setI(n); setPlaying(false); }}
                  className={clsx(
                    'group relative block w-full overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors duration-300',
                    active ? 'border-brand/40 bg-white/[0.07]' : 'border-transparent hover:border-white/15 hover:bg-white/[0.04]',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden className={clsx('grid h-7 w-7 shrink-0 place-items-center rounded-lg font-display text-xs font-semibold transition-colors', active ? 'bg-brand text-ink' : 'bg-white/10 text-white/70 group-hover:bg-white/15')}>{n + 1}</span>
                    <span className={clsx('font-display text-base font-semibold transition-colors sm:text-lg', active ? 'text-white' : 'text-white/70 group-hover:text-white')}>{s.title}</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        className="block overflow-hidden"
                      >
                        <span className="block pb-1 pl-10 pt-2 text-[15px] leading-relaxed text-white/75">{s.text}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {active && (
                    <motion.span
                      aria-hidden key={`bar-${i}-${playing}`} className="absolute bottom-0 left-0 h-[3px] rounded-full bg-gradient-to-r from-brand to-brand-400"
                      initial={{ width: playing && !reduce ? '0%' : '100%' }} animate={{ width: '100%' }} transition={{ duration: playing && !reduce ? 6 : 0.01, ease: 'linear' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3"
          >
            <CtaButton cta="Book a Free Consultation" className="cta-glow cta-primary !min-h-[52px] !px-7 text-base">Book a Free Consultation <ArrowRight aria-hidden className="h-4 w-4" /></CtaButton>
            <CtaButton cta="Get Project Estimate" variant="secondary-dark" className="cta-glow cta-ghost !min-h-[52px] !px-6 text-base">Get Project Estimate</CtaButton>
            <CtaButton cta="Schedule Discovery Call" variant="secondary-dark" className="group !min-h-[44px] !border-transparent !bg-transparent !px-1 text-[15px] hover:!bg-transparent">
              <CalendarClock aria-hidden className="h-4 w-4 text-brand" />
              <span className="underline decoration-white/30 underline-offset-4 transition-colors group-hover:decoration-brand">Schedule Discovery Call</span>
            </CtaButton>
          </motion.div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 shadow-glow sm:aspect-[16/11]">
            <AnimatePresence initial={false}>
              <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                <SlideArt index={i} />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
              <div role="group" aria-label="Choose slide" className="flex gap-2">
                {HOME.slides.map((s, n) => (
                  <button key={s.title} type="button" onClick={() => { setI(n); setPlaying(false); }} aria-label={`Show: ${s.title}`} aria-current={i === n} className="grid h-8 w-8 place-items-center">
                    <span className={clsx('h-1.5 rounded-full transition-all', i === n ? 'w-8 bg-brand' : 'w-4 bg-white/50 hover:bg-white/80')} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
