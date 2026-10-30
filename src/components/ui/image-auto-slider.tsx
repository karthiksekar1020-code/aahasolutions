import Image from 'next/image';

export interface SliderImage { src: string; alt: string }

/**
 * Infinite auto-scrolling image strip (after the 21st.dev image-auto-slider). Pure CSS: the list is rendered twice and the
 * track slides left by exactly half its width, so the loop is seamless. Pauses on hover/focus; static for reduced-motion.
 * The second copy is hidden from assistive tech so each image is announced once.
 */
export function ImageAutoSlider({ images, label }: { images: SliderImage[]; label: string }) {
  return (
    <div className="marquee-mask" role="group" aria-label={label}>
      <div className="marquee-track flex w-max gap-6">
        {[0, 1].map(copy => (
          <ul key={copy} className="flex shrink-0 gap-6" aria-hidden={copy === 1 ? true : undefined}>
            {images.map((im, n) => (
              <li key={im.src} className="marquee-item relative h-48 w-48 shrink-0 overflow-hidden rounded-xl bg-ink-700 shadow-2xl ring-1 ring-white/10 md:h-64 md:w-64 lg:h-72 lg:w-72" style={{ '--mq-d': `${-n * 0.55}s` } as React.CSSProperties}>
                <Image src={im.src} alt={copy === 0 ? im.alt : ''} fill sizes="(min-width:1024px) 288px, (min-width:768px) 256px, 192px" className="marquee-img object-cover" />
                <span aria-hidden className="marquee-shine" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
