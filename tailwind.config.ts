import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', md: '2rem' }, screens: { '2xl': '1240px' } },
    extend: {
      colors: {
        // Brand — sampled from the official logo (#75AE42 mark, #94B53E highlight, white wordmark)
        brand: { DEFAULT: '#75AE42', 50: '#F3F8EC', 100: '#E4F0D3', 200: '#C9E1A8', 300: '#A9CE78', 400: '#94B53E', 500: '#75AE42', 600: '#5C8C32', 700: '#46692A', 800: '#385424', 900: '#2A3F1C' },
        ink: { DEFAULT: '#0A1512', 900: '#0A1512', 800: '#0F1C18', 700: '#15271F', 600: '#1D332A', 500: '#2C4A3D' },
        paper: { DEFAULT: '#F6F8F4', 100: '#FFFFFF', 200: '#F6F8F4', 300: '#ECF0E8' },
        line: 'rgba(255,255,255,0.10)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '1.125rem', ctl: '0.75rem' },
      boxShadow: {
        card: '0 1px 2px rgba(10,21,18,.06), 0 8px 24px -8px rgba(10,21,18,.12)',
        lift: '0 2px 4px rgba(10,21,18,.06), 0 18px 40px -12px rgba(10,21,18,.22)',
        glow: '0 0 0 1px rgba(117,174,66,.35), 0 12px 40px -10px rgba(117,174,66,.35)',
      },
      keyframes: {
        drift: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-18px,0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        flow: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
        sheen: { '0%,55%': { backgroundPosition: '150% 0' }, '100%': { backgroundPosition: '-50% 0' } },
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        flow: 'flow 5s linear infinite',
        sheen: 'sheen 5s ease-in-out infinite',
        bob: 'bob 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
