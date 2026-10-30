import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { env } from '@/lib/env';
import { MotionProvider } from '@/components/ui/motion';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: 'AAHA Solutions — Software Development Company in Pondicherry & India', template: '%s' },
  description: 'AAHA Solutions delivers custom AI systems, SaaS platforms, cloud migration, ERP solutions, and web and mobile apps globally.',
  icons: { icon: '/assets/images/favicon2.png' },
};
export const viewport: Viewport = { themeColor: '#0A1512', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* Chromium decides whether to restore the old scroll offset when a RELOAD commits, so the history entry must already be
            "manual" by then. When the homepage document is unloaded (reload, typed URL, external link — not client-side Next
            navigation, which never unloads it) mark its entry manual so a refresh reopens at the hero. <ScrollManager/> returns
            the mode to "auto" on the next interaction. Hash URLs are left alone. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{addEventListener('pagehide',function(){if(location.pathname==='/'&&!location.hash){history.scrollRestoration='manual';}});}catch(e){}})();",
          }}
        />
      </head>
      <body className="font-sans">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
