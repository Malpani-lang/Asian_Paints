/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1D1033', 2: '#3A2E52', 3: '#6A6180', 4: '#9A93AB' },
        aubergine: { DEFAULT: '#2A0F4F', 2: '#3B1670', deep: '#170830' },
        violet: { DEFAULT: '#6B2FD6', soft: '#EFE8FC', line: '#DCCFF7' },
        saffron: { DEFAULT: '#F6A623', soft: '#FFF4DF' },
        vermilion: { DEFAULT: '#E3342F', soft: '#FDE9E8' },
        tangerine: '#F2711C',
        paper: { DEFAULT: '#FAF8FD', 2: '#F3EFF9', line: '#E6E0F0' },
        st: {
          intro: '#7C3AED', growth: '#2563EB', maturity: '#0F8A73', decline: '#EA580C', exit: '#C21E2B', hold: '#7E7892',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        lift: '0 1px 2px rgba(29,16,51,.06), 0 8px 24px -12px rgba(42,15,79,.25)',
        pop: '0 20px 50px -20px rgba(42,15,79,.45)',
      },
    },
  },
  plugins: [],
};
