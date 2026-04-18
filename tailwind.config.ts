import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens (CSS-var backed)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        // İyiBiri design tokens — "Premium × Warm"
        ink: {
          DEFAULT: '#1A1612',
          900: '#24201B',
          800: '#2E2923',
          700: '#36302A',
          600: '#3F3830',
          500: '#574E42',
          400: '#7A6F5E',
          300: '#A89E8A',
          200: '#CEC5B2',
          100: '#E6DEC9',
        },
        cream: '#F4EEDF',
        gold: {
          DEFAULT: '#E8C268',
          dim: '#B58F3D',
        },
        clay: '#C8553D',
        success: '#6B8E4E',
        domain: {
          nature: '#10B981',
          education: '#3B82F6',
          social: '#F43F5E',
          financial: '#F59E0B',
          animals: '#F97316',
          culture: '#A855F7',
        },
        // Legacy aliases (keeps existing pages from breaking)
        primary: {
          DEFAULT: '#E8C268',
          dark: '#B58F3D',
          light: '#FDE68A',
          foreground: '#24201B',
        },
        'text-primary': '#F4EEDF',
        'text-muted': '#A89E8A',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-headline)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '10px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        pill: '9999px',
      },
      animation: {
        'bounce-sm': 'bounce-sm 0.4s ease-in-out',
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'bounce-sm': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
