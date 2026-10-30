'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { NAV } from '@/lib/site';
import { useEnquiry } from '@/components/ui/enquiry';

function isActive(pathname: string, href: string) {
  return pathname === href || pathname === href.replace(/\/$/, '');
}

export function Header() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { open } = useEnquiry();
  const id = useId();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });

  useEffect(() => { setOpenGroup(null); setMobile(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!openGroup) return;
    const onDoc = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpenGroup(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenGroup(null); };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [openGroup]);

  return (
    <>
    <header className={clsx('sticky top-0 z-40 border-b transition-colors duration-300', scrolled ? 'border-white/10 bg-ink/95 backdrop-blur-sm' : mobile ? 'border-white/10 bg-ink' : 'border-transparent bg-ink')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-ctl focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">Skip to content</a>
      <div className="container flex h-[68px] items-center justify-between gap-6">
        <Link href="/" aria-label="AAHA Solutions — home" className="hd-logo-wrap relative shrink-0 overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo.svg" alt="AAHA Solutions" width={138} height={48} className="hd-logo h-10 w-auto" />
          <span aria-hidden className="hd-logo-shine" />
        </Link>

        <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 rounded-full border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
            {NAV.map((g, i) => {
              const isOpen = openGroup === g.label;
              const panelId = `${id}-${g.label}`;
              const wide = g.links.length > 8;
              return (
                <motion.li
                  key={g.label} className="relative"
                  initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 + i * 0.07 }}
                  onMouseEnter={() => setOpenGroup(g.label)} onMouseLeave={() => setOpenGroup(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenGroup(isOpen ? null : g.label)}
                    className={clsx('nav-link relative isolate flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-[color,transform] duration-300 hover:-translate-y-0.5', isOpen ? 'text-brand' : 'text-white/85 hover:text-white')}
                  >
                    {/* highlight pill that glides from one menu group to the next */}
                    {isOpen && <motion.span layoutId="nav-pill" aria-hidden className="absolute inset-0 -z-10 rounded-full bg-brand/15 shadow-[0_0_18px_-4px_rgba(117,174,66,0.7)] ring-1 ring-brand/40" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    {g.label}
                    <ChevronDown aria-hidden className={clsx('h-4 w-4 transition-transform duration-300', isOpen && 'rotate-180')} />
                    {/* glowing underline that draws out from the centre on hover/open */}
                    <span aria-hidden className={clsx('nav-underline', isOpen && 'nav-underline-on')} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: 0.18 }}
                        className={clsx('absolute left-0 top-full pt-2', wide ? 'w-[34rem]' : 'w-64')}
                      >
                        <motion.ul
                          variants={{
                            hidden: { opacity: 0, scale: 0.94, rotateX: -14 },
                            show: { opacity: 1, scale: 1, rotateX: 0, transition: { type: 'spring', stiffness: 380, damping: 28, staggerChildren: 0.035, delayChildren: 0.05 } },
                          }}
                          initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
                          style={{ transformOrigin: 'top left', transformPerspective: 900 }}
                          className={clsx('relative grid gap-0.5 overflow-hidden rounded-card border border-white/10 bg-ink-800 p-2 shadow-lift', wide && 'grid-cols-2')}
                        >
                          <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
                          {g.links.map(l => {
                            const current = isActive(pathname, l.href);
                            return (
                              <motion.li key={l.href + l.label} variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 420, damping: 30 } } }}>
                                <Link href={l.href} aria-current={current ? 'page' : undefined} className={clsx('group relative flex items-center justify-between overflow-hidden rounded-lg px-3 py-2.5 text-[15px] transition-colors duration-200', current ? 'text-brand' : 'text-white/85 hover:text-white')}>
                                  {/* accent bar + light sweep + nudge + arrow on hover */}
                                  <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] origin-center scale-y-0 rounded-full bg-brand transition-transform duration-300 group-hover:scale-y-100 group-focus-visible:scale-y-100" style={current ? { transform: 'scaleY(1)' } : undefined} />
                                  <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-brand/25 via-brand/10 to-transparent transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0" />
                                  <span className="relative transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2">{l.label}</span>
                                  <ArrowRight aria-hidden className="relative h-4 w-4 -translate-x-3 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
                                </Link>
                              </motion.li>
                            );
                          })}
                        </motion.ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact/" className="btn btn-primary hd-contact relative hidden overflow-hidden !min-h-[40px] !rounded-full !px-5 !py-2 sm:inline-flex">Contact Us</Link>
          <button type="button" onClick={() => setMobile(true)} aria-label="Open menu" aria-expanded={mobile} aria-controls={`${id}-drawer`} className="rounded-ctl p-2.5 text-white lg:hidden">
            <Menu aria-hidden className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* scroll progress bar riding the header's bottom edge */}
      <motion.div aria-hidden style={{ scaleX: progress }} className="nav-progress absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-gradient-to-r from-brand/40 via-brand to-white" />
    </header>
    {/* Rendered outside <header>: the header's backdrop-blur would otherwise become the containing block of this fixed drawer and shrink it to the 68px bar. */}
    <MobileDrawer id={`${id}-drawer`} open={mobile} onClose={() => setMobile(false)} onCta={() => { setMobile(false); open('Book a Free Consultation'); }} pathname={pathname} />
    </>
  );
}

const ITEM = { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } } };

function MobileDrawer({ id, open, onClose, onCta, pathname }: { id: string; open: boolean; onClose: () => void; onCta: () => void; pathname: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const trap = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab' || !ref.current) return;
    const f = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    document.addEventListener('keydown', trap);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', trap); prev?.focus?.(); };
  }, [open, trap]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id} ref={ref} role="dialog" aria-modal="true" aria-label="Site menu"
          initial={{ opacity: 0, clipPath: 'circle(0% at 92% 4%)' }} animate={{ opacity: 1, clipPath: 'circle(150% at 92% 4%)' }} exit={{ opacity: 0, clipPath: 'circle(0% at 92% 4%)' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="drawer-bg fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink lg:hidden"
        >
          <span aria-hidden className="drawer-orb drawer-orb-a" />
          <span aria-hidden className="drawer-orb drawer-orb-b" />
          <div className="container flex h-[68px] shrink-0 items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/logo.svg" alt="AAHA Solutions" width={138} height={48} className="drawer-logo h-10 w-auto" />
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="drawer-close rounded-ctl p-2.5 text-white"><X aria-hidden className="h-6 w-6" /></button>
          </div>
          <nav aria-label="Mobile" className="container flex-1 pb-8">
            <motion.ul
              initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
              className="divide-y divide-white/10 border-y border-white/10"
            >
              <motion.li variants={ITEM}><Link href="/" className={clsx('drawer-link block py-4 text-lg font-medium', pathname === '/' ? 'text-brand' : 'text-white')}>Home</Link></motion.li>
              {NAV.map(g => {
                const isOpen = expanded === g.label;
                return (
                  <motion.li key={g.label} variants={ITEM}>
                    <button type="button" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : g.label)} className={clsx('drawer-link flex w-full items-center justify-between py-4 text-left text-lg font-medium', isOpen ? 'text-brand' : 'text-white')}>
                      {g.label}<ChevronDown aria-hidden className={clsx('h-5 w-5 text-brand transition-transform duration-300', isOpen && 'rotate-180')} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3">
                          {g.links.map((l, n) => (
                            <motion.li key={l.href + l.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.05 + n * 0.04 } }}>
                              <Link href={l.href} className={clsx('drawer-sub block rounded-lg py-3 pl-3 text-base', isActive(pathname, l.href) ? 'text-brand' : 'text-white/80')}>{l.label}</Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
              <motion.li variants={ITEM}><Link href="/contact/" className="drawer-link block py-4 text-lg font-medium text-white">Contact Us</Link></motion.li>
            </motion.ul>
            <motion.button
              type="button" onClick={onCta} initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.8 }}
              className="btn btn-primary drawer-cta mt-8 w-full"
            >Book a Free Consultation</motion.button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
