import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FOOTER_SERVICES, NAV, SITE } from '@/lib/site';

const company = [
  { label: 'About Us', href: '/software-developement-company-in-pondicherry.php' },
  { label: 'Careers', href: '/software-careers-in-pondicherry.php' },
  { label: 'Contact Us', href: '/contact/' },
  { label: 'Blog', href: '/software-development-blog-in-pondicherry.php' },
  { label: 'Case Studies', href: '/software-development-case-studies-in-pondicherry.php' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
];
const industries = [
  { label: 'Artificial Intelligence (AI)', href: '/ai-development-company-india/' },
  ...NAV.find(g => g.label === 'Industries')!.links,
  { label: 'E-Commerce', href: '/e-commerce-company-in-pondicherry.php' },
  { label: 'IoT', href: '/iot-development-company-in-pondicherry.php' },
  { label: 'Blockchain', href: '/blockchain-development-company-in-pondicherry.php' },
];

const Col = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div>
    <h2 className="ft-head text-sm font-semibold uppercase tracking-[0.14em] text-brand">{title}</h2>
    <ul className="mt-5 space-y-2.5">
      {links.map(l => (
        <li key={l.href + l.label} className="ft-li"><Link href={l.href} className="ft-link text-[15px] text-white/70">{l.label}</Link></li>
      ))}
    </ul>
  </div>
);

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="grid-fine pointer-events-none absolute inset-0 opacity-60" />
      <span aria-hidden className="ft-line" />
      <span aria-hidden className="ft-orb ft-orb-a" />
      <span aria-hidden className="ft-orb ft-orb-b" />
      <div className="container relative py-16">
        <div className="ft-rise grid gap-12 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/logo.svg" alt="AAHA Solutions" width={160} height={55} className="ft-logo h-12 w-auto" loading="lazy" />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">
              AI Development Company • Software Development Company • Cloud Consulting Company. Pondicherry, India • UK.
            </p>
            <p className="mt-6 flex items-center gap-3 text-[15px] text-white/75"><Mail aria-hidden className="h-4 w-4 text-brand" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social profiles">
              {SITE.social.map(s => (
                <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className="ft-social rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/75">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>
              ))}
            </ul>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Col title="About" links={company} />
            <Col title="Services & Support" links={FOOTER_SERVICES} />
            <Col title="Industries & Technologies" links={industries} />
            <div>
              <h2 className="ft-head text-sm font-semibold uppercase tracking-[0.14em] text-brand">Contact</h2>
              <address className="mt-5 space-y-6 text-[15px] not-italic text-white/70">
                {SITE.offices.slice(0, 2).map(o => (
                  <div key={o.country}>
                    <p className="flex items-center gap-2 font-semibold uppercase tracking-wide text-white"><MapPin aria-hidden className="ft-pin h-4 w-4 shrink-0 text-brand" />{o.country}</p>
                    <p className="mt-2 leading-relaxed">{o.address.join(' ')}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 text-white/60"><Phone aria-hidden className="h-3.5 w-3.5" />{o.phones.map((p, i) => (<span key={p}>{i > 0 && ' / '}<a href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-white">{p}</a></span>))}</p>
                  </div>
                ))}
              </address>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. Company No. {SITE.companyNo} · SIC {SITE.sic}</p>
          <p><Link href="/privacy-policy/" className="hover:text-white">Privacy Policy</Link></p>
        </div>
      </div>
    </footer>
  );
}
