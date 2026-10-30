import type { Metadata } from 'next';
import { Download, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/ui/page-parts';
import { EnquiryForm } from '@/components/ui/enquiry';
import { Reveal } from '@/components/ui/motion';
import { buildMeta } from '@/lib/content';
import { SITE } from '@/lib/site';

export const metadata: Metadata = buildMeta({
  title: 'Contact AAHA Solutions | Request a Free Quote',
  description: 'Contact AAHA Solutions in Pondicherry, India and the UK. Tell us about your project and get a free quote from our software experts.',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <>
      <PageHero title="Get in Touch With Us" tagline="Have a project in mind or need expert software consulting? Let's build something extraordinary together." crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} cta={false} />
      <section className="bg-light py-16 md:py-24" aria-labelledby="quote">
        <div className="container grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <Reveal className="card p-6 sm:p-9">
            <h2 id="quote" className="h-display text-2xl md:text-3xl">Request a Free Quote</h2>
            <p className="mt-2 mb-7 text-ink/70">Our experts are available to help you find the right solution to meet your specific needs.</p>
            <EnquiryForm source="Contact page" />
          </Reveal>

          <Reveal delay={0.08} className="space-y-5">
            <h2 className="h-display text-2xl md:text-3xl">Contact AAHA Solutions</h2>
            {SITE.offices.map(o => (
              <div key={o.country} className="card p-6">
                <h3 className="font-display text-lg font-semibold">{o.country}{o.city && <span className="text-ink/70"> · {o.city}</span>}</h3>
                {o.note && <p className="text-sm text-brand-700">{o.note}</p>}
                <div className="mt-3 space-y-2 text-[15px] text-ink/75">
                  <p className="flex gap-2.5"><MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-brand-700" /><span>{o.address.join(' ')}</span></p>
                  {o.phones.length > 0 && (
                    <p className="flex flex-wrap gap-2.5"><Phone aria-hidden className="mt-1 h-4 w-4 shrink-0 text-brand-700" />
                      {o.phones.map((p, i) => <span key={p}>{i > 0 && '/ '}<a href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-brand-700">{p}</a></span>)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold">General Enquiries</h3>
              <p className="mt-3 flex items-center gap-2.5 text-[15px]"><Mail aria-hidden className="h-4 w-4 text-brand-700" /><a href={`mailto:${SITE.email}`} className="hover:text-brand-700">{SITE.email}</a></p>
              <p className="mt-2 text-[15px] text-ink/70">{SITE.phones.india.join(' · ')}</p>
            </div>
            <div className="rounded-card bg-ink p-6 text-white">
              <p className="text-[15px] text-white/75">To view all services and technology details, download our company profile.</p>
              <a href={SITE.profilePdf} download className="btn btn-primary mt-4"><Download aria-hidden className="h-4 w-4" /> Download</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
