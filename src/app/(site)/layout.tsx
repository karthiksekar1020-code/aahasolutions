import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollManager } from '@/components/layout/scroll-manager';
import { BackToTop } from '@/components/layout/back-to-top';
import { EnquiryProvider } from '@/components/ui/enquiry';
import { env } from '@/lib/env';
import { SITE } from '@/lib/site';
import { abs } from '@/lib/content';

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  legalName: SITE.legalName,
  url: env.siteUrl,
  logo: abs('/assets/images/logo.svg'),
  email: SITE.email,
  sameAs: SITE.social.map(s => s.href),
  address: [
    { '@type': 'PostalAddress', streetAddress: 'No.27, 3rd Cross, Brindavan', addressLocality: 'Puducherry', postalCode: '605013', addressCountry: 'IN' },
    { '@type': 'PostalAddress', streetAddress: '54 HollyHill Road', addressLocality: 'Erith', postalCode: 'DA8 1QD', addressCountry: 'GB' },
  ],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <ScrollManager />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <BackToTop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
    </EnquiryProvider>
  );
}
