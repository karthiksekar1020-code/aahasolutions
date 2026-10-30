'use client';
import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface AccordionItem { id: string; question: string; answerHtml: string }

/** Accessible accordion (button + region, aria-expanded). One panel open at a time; animated height. */
export function Accordion({ items, dark = false }: { items: AccordionItem[]; dark?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();
  return (
    <div className="space-y-3">
      {items.map(it => {
        const isOpen = open === it.id;
        const hid = `${base}-h-${it.id}`;
        const pid = `${base}-p-${it.id}`;
        return (
          <div key={it.id} className={clsx('overflow-hidden rounded-card border transition-colors', dark ? 'border-white/10 bg-white/[0.04]' : 'border-ink/10 bg-white shadow-card', isOpen && (dark ? 'border-brand/40' : 'border-brand-600/40'))}>
            <h3>
              <button
                id={hid}
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className={clsx('flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold md:text-lg', dark ? 'text-white' : 'text-ink')}
              >
                <span>{it.question}</span>
                <ChevronDown aria-hidden className={clsx('h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300', isOpen && 'rotate-180')} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={pid}
                  role="region"
                  aria-labelledby={hid}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={clsx('faq-answer px-5 pb-5 text-[15px] leading-relaxed [&_a]:underline [&_li]:mt-1.5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5', dark ? 'text-white/75' : 'text-ink/75')}
                    dangerouslySetInnerHTML={{ __html: it.answerHtml }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
