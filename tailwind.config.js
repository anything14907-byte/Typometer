/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#030508',
          900: '#05070A',
          850: '#090D14',
          800: '#0F172A',
          700: '#1E293B',
        },
        cyber: {
          cyan: '#00F0FF',
          blue: '#38BDF8',
          violet: '#A855F7',
          purple: '#C084FC',
          emerald: '#10B981',
          crimson: '#FF2A5F',
          amber: '#F59E0B',
          muted: '#64748B',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['Orbitron', '"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.45), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-violet': '0 0 15px rgba(168, 85, 247, 0.45), 0 0 30px rgba(168, 85, 247, 0.2)',
        'neon-crimson': '0 0 15px rgba(255, 42, 95, 0.45), 0 0 30px rgba(255, 42, 95, 0.2)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.45), 0 0 30px rgba(16, 185, 129, 0.2)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'spin-fast': 'spin 3s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

