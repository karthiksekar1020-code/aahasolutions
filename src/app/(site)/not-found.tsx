import Link from 'next/link';
import { PageHero } from '@/components/ui/page-parts';

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" tagline="The page you are looking for may have moved or no longer exists." cta={false} />
      <section className="bg-light py-16">
        <div className="container text-center">
          <p className="font-display text-7xl font-semibold text-brand-700">404</p>
          <p className="mx-auto mt-4 max-w-md text-ink/70">Try one of these instead:</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">Back to home</Link>
            <Link href="/software-development-blog-in-pondicherry.php" className="btn btn-secondary">Read the blog</Link>
            <Link href="/contact/" className="btn btn-secondary">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
