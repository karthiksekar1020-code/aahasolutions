'use client';
import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

export interface TabItem { label: string; title?: string; paras?: string[]; img?: { src: string; alt: string }; video?: { src: string; poster?: string } }

/** Accessible tabs (arrow keys / Home / End) for the "Medical Diagnosis | Speech Recognition…" style content blocks. */
export function ContentTabs({ tabs, side }: { tabs: TabItem[]; side?: { src: string; alt: string; video?: string } }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, n: number) => {
    const last = tabs.length - 1;
    const next = e.key === 'ArrowRight' ? (n === last ? 0 : n + 1) : e.key === 'ArrowLeft' ? (n === 0 ? last : n - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
    if (next < 0) return;
    e.preventDefault(); setActive(next); refs.current[next]?.focus();
  };
  const t = tabs[active];
  const panel = (
    <div>
      <div role="tablist" aria-label="Topics" className="flex flex-wrap gap-2">
        {tabs.map((tab, n) => (
          <button
            key={tab.label} ref={el => { refs.current[n] = el; }} role="tab" type="button" id={`${base}-t${n}`} aria-selected={active === n} aria-controls={`${base}-p`} tabIndex={active === n ? 0 : -1}
            onClick={() => setActive(n)} onKeyDown={e => onKey(e, n)}
            style={{ '--k': n } as React.CSSProperties} className={clsx('ctab min-h-[44px] rounded-full border px-5 text-[15px] font-semibold', active === n ? 'ctab-on border-brand bg-brand text-ink' : 'border-ink/15 bg-white text-ink/80 hover:border-brand-600')}
          >{tab.label.trim()}</button>
        ))}
      </div>
      <div key={active} role="tabpanel" id={`${base}-p`} aria-labelledby={`${base}-t${active}`} className="ctab-panel mt-6 rounded-card p-6 shadow-card">
        <span aria-hidden className="ctab-sheen" />
        {t.title && <h3 style={{ "--k": 0 } as React.CSSProperties} className="ctab-p font-display text-xl font-semibold text-ink">{t.title}</h3>}
        {t.video && (
          <div style={{ '--k': 1 } as React.CSSProperties} className="ctab-p ctab-img relative mx-auto mt-4 aspect-video w-full max-w-xl overflow-hidden rounded-xl bg-ink">
            {/* decorative looping clip; paused for visitors who prefer reduced motion */}
            <video key={t.video.src} aria-hidden tabIndex={-1} className="motion-reduce:hidden absolute inset-0 h-full w-full object-cover" src={t.video.src} poster={t.video.poster} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture />
          </div>
        )}
        {t.img && (
          <div style={{ "--k": 1 } as React.CSSProperties} className="ctab-p ctab-img relative mx-auto mt-4 aspect-[16/10] w-full max-w-xl overflow-hidden rounded-xl bg-ink/5">
            <Image src={t.img.src} alt={t.img.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-contain p-2" />
          </div>
        )}
        {t.paras?.map((p, i) => <p key={i} style={{ "--k": i + 1 } as React.CSSProperties} className="ctab-p mt-3 text-[16px] leading-relaxed text-ink/80 first:mt-0" dangerouslySetInnerHTML={{ __html: p }} />)}
      </div>
    </div>
  );
  if (!side) return panel;
  return (
    <div className="grid gap-8 lg:items-start lg:grid-cols-[1.15fr_1fr]">
      <div className={clsx("relative mx-auto w-full overflow-hidden rounded-card bg-ink/5 shadow-card", side.video ? "aspect-video max-w-xl" : "aspect-[4/3] max-w-sm")}>
        {side.video && <video aria-hidden tabIndex={-1} className="absolute inset-0 z-10 h-full w-full object-contain motion-reduce:hidden" src={side.video} poster={side.src} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture />}
        <Image src={side.src} alt={side.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className={side.video ? "object-contain" : "object-cover"} />
      </div>
      {panel}
    </div>
  );
}
