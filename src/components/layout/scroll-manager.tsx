'use client';
import { useEffect } from 'react';

/**
 * Pairs with the inline "pagehide" script in app/layout.tsx.
 *
 * When the homepage document was unloaded (a reload), its history entry is 'manual', so the reloaded page opens at the
 * top instead of the browser restoring the old offset. The browser attempts any restoration shortly after load, so we must
 * not flip back immediately: we return the mode to 'auto' the first time the visitor interacts (wheel / touch / pointer /
 * key). From then on client-side navigation and Back/Forward behave normally.
 *
 * This component never scrolls anything itself and does nothing on re-renders or route changes.
 */
export function ScrollManager() {
  useEffect(() => {
    if (window.history.scrollRestoration !== 'manual') return;
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    const restore = () => {
      window.history.scrollRestoration = 'auto';
      events.forEach(e => window.removeEventListener(e, restore));
    };
    events.forEach(e => window.addEventListener(e, restore, { passive: true, once: true }));
    return () => events.forEach(e => window.removeEventListener(e, restore));
  }, []);
  return null;
}
