'use client';
import { createContext, useCallback, useContext, useId, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import clsx from 'clsx';
import { SITE } from '@/lib/site';

type Fields = 'firstName' | 'email' | 'phone' | 'message';
const CTA_COPY: Record<string, { title: string; desc: string }> = {
  'Book a Free Consultation': { title: 'Book a Free Consultation', desc: 'Our technical consultants are ready to discuss your software engineering needs. Please fill out the form below.' },
  'Get Project Estimate': { title: 'Get Project Estimate', desc: 'Tell us about your project requirements and budget to receive a detailed cost estimate from our team.' },
  'Schedule Discovery Call': { title: 'Schedule Discovery Call', desc: 'Complete the form below to set up a discovery call with our engineering architects.' },
  default: { title: 'Get In Touch', desc: 'Our experts are here to find the solution for your specific needs. Please complete the form to get a call from us.' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The shared enquiry form. There is no server: after checking the fields it opens the visitor's email app with the enquiry pre-filled. */
export function EnquiryForm({ source = 'Website', dark = false, compact = false, onDone }: { source?: string; dark?: boolean; compact?: boolean; onDone?: () => void }) {
  const uid = useId();
  const [state, setState] = useState<'idle' | 'done'>('idle');
  const [error, setError] = useState('');
  const [mailto, setMailto] = useState('');
  const [fields, setFields] = useState<Partial<Record<Fields | '_', string>>>({});

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setFields({});
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? '').trim();
    const first = v('firstName'), last = v('lastName'), email = v('email'), phone = v('phone'), message = v('message');
    const bad: Partial<Record<Fields, string>> = {};
    if (!first) bad.firstName = 'Please enter your first name.';
    if (!EMAIL_RE.test(email)) bad.email = 'Please enter a valid email address.';
    if (phone.replace(/\D/g, '').length < 7) bad.phone = 'Please enter a valid phone number.';
    if (message.length < 10) bad.message = 'Please tell us a little more (at least 10 characters).';
    if (Object.keys(bad).length) { setFields(bad); setError('Please correct the highlighted fields.'); return; }

    const body = [
      `Name: ${`${first} ${last}`.trim()}`, `Email: ${email}`, `Phone: ${phone}`,
      ...(v('company') ? [`Company: ${v('company')}`] : []), ...(v('jobTitle') ? [`Job title: ${v('jobTitle')}`] : []),
      `Source: ${source}`, '', message,
    ].join('\n');
    const href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Website enquiry from ${`${first} ${last}`.trim()}`)}&body=${encodeURIComponent(body)}`;
    setMailto(href);
    setState('done');
    window.location.href = href;
  }

  const field = clsx('field', dark && 'field-dark');
  const lbl = clsx('label', dark && '!text-white/80');
  const err = (k: string) => (fields as Record<string, string>)[k];

  if (state === 'done') {
    return (
      <div role="status" className={clsx('rounded-card p-8 text-center', dark ? 'bg-white/5 text-white' : 'bg-brand-50 text-ink')}>
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-brand-600" />
        <h3 className="mt-4 font-display text-xl font-semibold">Your email is ready to send.</h3>
        <p className={clsx('mt-2 text-[15px]', dark ? 'text-white/70' : 'text-ink/70')}>We opened your email app with your enquiry filled in. Press <strong>Send</strong> and our team will reply within 24 hours.</p>
        <p className={clsx('mt-3 text-sm', dark ? 'text-white/60' : 'text-ink/60')}>Nothing opened? <a href={mailto} className="font-semibold text-brand-700 underline underline-offset-4">Click here</a> or write to <a href={`mailto:${SITE.email}`} className="font-semibold text-brand-700 underline underline-offset-4">{SITE.email}</a>.</p>
        {onDone && <button type="button" onClick={onDone} className="btn btn-primary mt-6">Close</button>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-describedby={error ? `${uid}-err` : undefined} className={clsx('space-y-4', dark && 'ef-dark')}>
      <div className={clsx('grid gap-4', !compact && 'sm:grid-cols-2')}>
        <div>
          <label htmlFor={`${uid}-fn`} className={lbl}>First name *</label>
          <input id={`${uid}-fn`} name="firstName" required autoComplete="given-name" maxLength={50} className={field} aria-invalid={!!err('firstName')} aria-describedby={err('firstName') ? `${uid}-fn-e` : undefined} />
          {err('firstName') && <p id={`${uid}-fn-e`} className="mt-1 text-sm text-red-500">{err('firstName')}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-ln`} className={lbl}>Last name</label>
          <input id={`${uid}-ln`} name="lastName" autoComplete="family-name" maxLength={50} className={field} />
        </div>
        <div>
          <label htmlFor={`${uid}-em`} className={lbl}>Email *</label>
          <input id={`${uid}-em`} name="email" type="email" required autoComplete="email" className={field} aria-invalid={!!err('email')} aria-describedby={err('email') ? `${uid}-em-e` : undefined} />
          {err('email') && <p id={`${uid}-em-e`} className="mt-1 text-sm text-red-500">{err('email')}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-ph`} className={lbl}>Phone *</label>
          <input id={`${uid}-ph`} name="phone" type="tel" required autoComplete="tel" className={field} aria-invalid={!!err('phone')} aria-describedby={err('phone') ? `${uid}-ph-e` : undefined} />
          {err('phone') && <p id={`${uid}-ph-e`} className="mt-1 text-sm text-red-500">{err('phone')}</p>}
        </div>
        {!compact && (
          <>
            <div>
              <label htmlFor={`${uid}-co`} className={lbl}>Company</label>
              <input id={`${uid}-co`} name="company" autoComplete="organization" maxLength={150} className={field} />
            </div>
            <div>
              <label htmlFor={`${uid}-jt`} className={lbl}>Job title (optional)</label>
              <input id={`${uid}-jt`} name="jobTitle" autoComplete="organization-title" maxLength={120} className={field} />
            </div>
          </>
        )}
      </div>
      <div>
        <label htmlFor={`${uid}-msg`} className={lbl}>Tell us about your requirement *</label>
        <textarea id={`${uid}-msg`} name="message" required rows={compact ? 4 : 5} maxLength={4000} className={clsx(field, 'resize-y')} aria-invalid={!!err('message')} aria-describedby={err('message') ? `${uid}-msg-e` : undefined} />
        {err('message') && <p id={`${uid}-msg-e`} className="mt-1 text-sm text-red-500">{err('message')}</p>}
      </div>
      {error && <p id={`${uid}-err`} role="alert" className="rounded-ctl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary w-full sm:w-auto">Send enquiry by email</button>
    </form>
  );
}

/* ---------- Dialog + context so any CTA can open the enquiry modal ---------- */
const Ctx = createContext<{ open: (cta?: string) => void } | null>(null);
export const useEnquiry = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useEnquiry outside provider');
  return c;
};

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [cta, setCta] = useState('default');
  const [nonce, setNonce] = useState(0);
  const open = useCallback((c?: string) => { setCta(c && CTA_COPY[c] ? c : 'default'); setNonce(n => n + 1); ref.current?.showModal(); }, []);
  const close = useCallback(() => ref.current?.close(), []);
  const copy = CTA_COPY[cta];
  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby="enquiry-title"
        onClick={e => { if (e.target === ref.current) close(); }}
        className="enq-dialog w-[min(40rem,calc(100vw-1.5rem))] max-h-[92dvh] overflow-hidden rounded-card border border-brand/40 bg-paper p-0 text-ink shadow-glow backdrop:backdrop-blur-[3px]"
      >
        <div className="max-h-[92dvh] overflow-y-auto">
          <div className="enq-head relative overflow-hidden px-6 pb-7 pt-6 text-white sm:px-8">
            <span aria-hidden className="enq-orb -right-6 -top-10 h-32 w-32" />
            <span aria-hidden className="enq-orb -bottom-12 left-1/3 h-24 w-24 opacity-20 [animation-delay:-3s]" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                  <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" /> AAHA Solutions
                </span>
                <h2 id="enquiry-title" className="mt-3 font-display text-2xl font-semibold sm:text-[1.7rem]">{copy.title}</h2>
                <p className="mt-1.5 text-[15px] text-white/80">{copy.desc}</p>
              </div>
              <button type="button" onClick={close} aria-label="Close dialog" className="-mr-2 -mt-1 rounded-full p-2 text-white/80 transition-transform duration-300 hover:rotate-90 hover:bg-white/10 hover:text-white"><X aria-hidden className="h-5 w-5" /></button>
            </div>
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-brand via-brand-300 to-transparent" />
          </div>
          <div className="enq-form p-6 sm:p-8">
            <EnquiryForm key={nonce} source={cta === 'default' ? 'Website modal' : cta} onDone={close} />
          </div>
        </div>
      </dialog>
    </Ctx.Provider>
  );
}

export function CtaButton({ cta, children, variant = 'primary', className }: { cta?: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'secondary-dark'; className?: string }) {
  const { open } = useEnquiry();
  return (
    <button type="button" onClick={() => open(cta)} className={clsx('btn', variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-secondary-dark', className)}>
      {children}
    </button>
  );
}
