import SiteLayout from './(site)/layout';
import NotFound from './(site)/not-found';

/** Global 404 (unmatched routes outside the site group) keeps the site chrome. Built as 404.html. */
export default function GlobalNotFound() {
  return (
    <SiteLayout>
      <NotFound />
    </SiteLayout>
  );
}
