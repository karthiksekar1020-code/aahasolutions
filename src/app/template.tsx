'use client';
import { motion, useReducedMotion } from 'framer-motion';

/** Page entrance transition (re-mounts on every navigation). Opacity-only so it never shifts layout. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}
