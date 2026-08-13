/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        goa: {
          bg: '#080c14',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.12)',
          amber: '#f97316',
          sunset: '#ec4899',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
          purple: '#8b5cf6',
          gold: '#eab308'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif']
      },
      backgroundImage: {
        'goa-gradient': 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #06b6d4 100%)',
        'goa-glow': 'radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.15), rgba(6, 182, 212, 0.05) 70%)',
        'dark-mesh': 'radial-gradient(at 0% 0%, rgba(236, 72, 153, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.12) 0px, transparent 50%)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-spin': 'glowSpin 10s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        glowSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
