import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Download, Globe2, LineChart, Shield, Workflow } from 'lucide-react';
import { Hero } from '@/components/home/hero';
import { ServiceCard } from '@/components/home/service-card';
import { IndustryCard } from '@/components/home/industry-card';
import { CoverflowCarousel } from '@/components/ui/coverflow';
import { CaseCard } from '@/components/home/case-card';
import { ImageAutoSlider } from '@/components/ui/image-auto-slider';
import { LocationCard } from '@/components/home/location-card';
import { AiConsultant, TechStack, Testimonials } from '@/components/home/interactive';
import { CtaButton } from '@/components/ui/enquiry';
import { EnquirySection, FaqSection } from '@/components/ui/page-parts';
import { GrowBar, HoverCard, ImageReveal, Reveal, ScrollLine, SplitHeading, TextReveal } from '@/components/ui/motion';
import { buildMeta, getFaqs, getTestimonials } from '@/lib/content';
import { HOME, SITE } from '@/lib/site';


export const metadata: Metadata = buildMeta({
  title: 'Software Development Company in Pondicherry & India | AAHA Solutions',
  description: 'AAHA Solutions is a premier software company delivering custom AI systems, SaaS platforms, cloud migration, ERP solutions, and web and mobile apps globally.',
  path: '/',
});

const industryAccents = ['#e0457b', '#2f9e8f', '#3b82f6', '#f59e0b', '#8b5cf6', '#75ae42'];
const workImages = [
  { src: '/assets/images/chatbot.webp', alt: 'AI chatbot conversation on a phone' },
  { src: '/assets/images/ecommerce-platform-preview.jpg', alt: 'E-commerce analytics dashboard on a laptop' },
  { src: '/assets/images/healthcare.webp', alt: 'Healthcare software' },
  { src: '/assets/images/IOTCARS.webp', alt: 'IoT connected vehicles' },
  { src: '/assets/images/elearning-mobile-app-preview.jpg', alt: 'E-learning mobile app on phones and tablets' },
  { src: '/assets/images/blockchain.webp', alt: 'Blockchain solutions' },
  { src: '/assets/images/automation.webp', alt: 'Process automation' },
  { src: '/assets/images/Manufacturing-Machine-Learning.webp', alt: 'Machine learning in manufacturing' },
  { src: '/assets/images/E-Commerce-ML.webp', alt: 'Machine learning for e-commerce' },
  { src: '/assets/images/efficeint.webp', alt: 'Efficient delivery and operations' },
];
const whyIcons = [Globe2, Shield, LineChart, Workflow];

function Heading({ eyebrow, title, text, dark = false, center = false, split = false }: { eyebrow: string; title: string; text?: string; dark?: boolean; center?: boolean; split?: boolean }) {
  const cls = `h-display mt-3 text-3xl md:text-[2.6rem] md:leading-[1.12] ${dark ? 'text-white' : 'text-ink'}`;
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`eyebrow ${dark ? 'eyebrow-dark' : ''} ${center ? 'justify-center' : ''}`}>{eyebrow}</p>
      {split ? <SplitHeading text={title} className={cls} /> : <h2 className={cls}>{title}</h2>}
      {text && <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-ink/70'}`}>{text}</p>}
    </Reveal>
  );
}

export default async function HomePage() {
  const [testimonials, faqs] = await Promise.all([getTestimonials(), getFaqs()]);

  return (
    <>
      <Hero />

      {/* Who we are + service highlights */}
      <section className="bg-gradient-to-b from-[#dcebc9] to-[#eef4e7] py-16 md:py-24" aria-labelledby="who">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
            <Reveal from="left" className="lg:sticky lg:top-28">
              <p className="eyebrow">About</p>
              <SplitHeading id="who" text={HOME.who.title} className="h-display mt-3 text-4xl md:text-5xl md:leading-[1.08]" />
              <GrowBar className="mt-5 h-1 w-14 rounded-full bg-brand" />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { place: 'London, UK', role: 'Onshore consulting & delivery' },
                  { place: 'Pondicherry, India', role: 'Offshore Development Center' },
                ].map((o, i) => (
                  <LocationCard key={o.place} place={o.place} role={o.role} index={i} />
                ))}
              </ul>
            </Reveal>
            <div className="relative pl-6 md:pl-10">
              <ScrollLine className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-brand/15" />
              <TextReveal text={HOME.who.text} className="text-[17px] leading-[1.85] text-ink/80 md:text-lg" />
              <TextReveal
                className="mt-5 text-[17px] leading-[1.85] text-ink/80 md:text-lg"
                parts={[
                  { text: 'Whether you need to partner with a dedicated ' },
                  { text: 'AI Development Company in India', href: '/ai-development-company-india/' },
                  { text: ', or require custom software engineering and cloud migration services, we have the expertise to scale with your business.' },
                ]}
              />
              <Reveal from="right" delay={0.1}>
                <a href={SITE.profilePdf} className="btn btn-secondary btn-download mt-6" download><Download aria-hidden className="h-5 w-5" /><span>Download company profile (PDF)</span></a>
              </Reveal>
            </div>
          </div>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME.services.map((s, i) => (
              <ServiceCard key={s.title} title={s.title} href={s.href} icon={s.icon} bg={(s as { bg?: string }).bg} index={i} />
            ))}
          </ul>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-mint relative py-16 md:py-24" aria-labelledby="industries">
        <div aria-hidden className="grid-fine-light pointer-events-none absolute inset-x-0 top-0 h-64" />
        <div className="container relative">
          <Heading split eyebrow="Industries" title="Industries We Serve" text={HOME.industriesIntro} />
          <CoverflowCarousel className="mt-8" label="Industries we serve" width={400}>
            {[
              ...HOME.industries.map((ind, i) => (
                <IndustryCard key={ind.title} title={ind.title} text={ind.text} href={ind.href} accent={industryAccents[i % industryAccents.length]} />
              )),
              <div key="challenging" className="cf-dark flex h-full flex-col justify-between rounded-card p-7 text-white">
                <p className="font-display text-xl font-semibold">{HOME.challenging.title}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">{HOME.challenging.text}</p>
                <CtaButton cta="Book a Free Consultation" className="mt-5 self-start">Talk to our team</CtaButton>
              </div>,
            ]}
          </CoverflowCarousel>
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-dark-soft py-16 text-white md:py-24" aria-labelledby="cases">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading split dark eyebrow="Case studies" title="Case Studies" text="Explore how we have engineered solutions that deliver measurable business results, from startups to enterprises." />
            <Link href="/software-development-case-studies-in-pondicherry.php" className="btn btn-secondary-dark">All case studies <ArrowRight aria-hidden className="h-4 w-4" /></Link>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {HOME.caseStudies.map((c, i) => (
              <li key={c.title} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
                <Reveal scrub={i % 3} className="h-full">
                  <CaseCard c={c} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why AAHA */}
      <section className="bg-white-soft py-16 md:py-24" aria-labelledby="why">
        <div className="container">
          <Heading eyebrow="Why choose us" title="Why AAHA Solutions" text="We combine global consulting presence with high-quality offshore execution to deliver premium digital products." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOME.why.map((w, i) => {
              const Icon = whyIcons[i];
              return (
                <li key={w.title}>
                  <Reveal scrub={i} className="h-full">
                    <div className="card why-card h-full !bg-none !bg-[#0f1c18] !border-brand/25 p-7 text-white" style={{ '--why-d': `${-i * 1.1}s` } as React.CSSProperties}>
                      <span aria-hidden className="why-orb" />
                      <span aria-hidden className="why-sheen" />
                      <span aria-hidden className="why-icon grid h-12 w-12 place-items-center rounded-xl bg-brand/15 text-brand"><Icon className="h-6 w-6" /></span>
                      <h3 className="mt-5 font-display text-lg font-semibold text-white">{w.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-white/70">{w.text}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Work in motion: auto-scrolling image strip */}
      <section className="bg-dark-soft overflow-hidden py-16 text-white md:py-24" aria-labelledby="work-strip">
        <div className="container">
          <Heading dark center eyebrow="Our work" title="Solutions We Build" text="AI, cloud, mobile, e-commerce, IoT and enterprise software — delivered from London and Pondicherry." />
        </div>
        <div className="mt-12">
          <ImageAutoSlider label="Examples of our work" images={workImages} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-mint py-16 md:py-24" aria-labelledby="testimonials">
        <div className="container">
          <Heading center eyebrow="Testimonials" title="Testimonials" />
          <Reveal className="mt-12"><Testimonials items={testimonials.map(t => ({ id: t.id, quote: t.quote, body: t.body, name: t.name, role: t.role, location: t.location }))} /></Reveal>
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-dark relative overflow-hidden py-16 text-white md:py-24" aria-labelledby="tech">
        <div aria-hidden className="grid-fine pointer-events-none absolute inset-0 opacity-70" />
        <div className="container relative">
          <Heading center dark eyebrow="Technology" title="Our Technology Stack" text={HOME.techIntro} />
          <Reveal className="mt-12"><TechStack /></Reveal>
        </div>
      </section>

      {/* Awards */}
      <section className="bg-light py-16 md:py-20" aria-labelledby="awards">
        <div className="container">
          <Heading center eyebrow="Recognition" title="Recognition And Awards" text={HOME.awardsIntro} />
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {SITE.reviewProfiles.map((p, k) => (
              <li key={p.label} className="award-li" style={{ "--k": k } as React.CSSProperties}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="card award-card flex h-44 w-72 items-center justify-center p-6 transition-shadow hover:shadow-lift md:h-52 md:w-80" aria-label={`AAHA Solutions on ${p.label} (opens in a new tab)`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.label} loading="lazy" className="award-img max-h-32 w-auto max-w-full object-contain md:max-h-40" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center"><CtaButton cta="Book a Free Consultation" variant="secondary" className="btn-power">Talk to our team</CtaButton></div>
        </div>
      </section>

      {/* Interactive AI Consultant */}
      <section id="ai-consultant" className="bg-dark-soft py-16 text-white md:py-24" aria-labelledby="ai">
        <div className="container">
          <Heading dark eyebrow="Ask us anything" title="Interactive AI Consultant" text={HOME.consultant.intro} />
          <Reveal className="mt-10"><AiConsultant /></Reveal>
        </div>
      </section>

      <FaqSection faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} html />
      <EnquirySection source="Homepage" title="Get In Touch" text="Our experts are here to find the solution for your specific needs. Please complete the form to get a call from us." />
    </>
  );
}
