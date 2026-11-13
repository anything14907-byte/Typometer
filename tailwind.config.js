/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rocket: {
          thrust: '#FF5E00',
          flame: '#FF2A00',
          amber: '#FFB800',
          plasma: '#00F0FF',
          nebula: '#9D4EDD',
          boost: '#7928CA',
          hull: '#0B0F19',
          titanium: '#F1F5F9',
        },
        obsidian: {
          950: '#05070E',
          900: '#0A0F1D',
          850: '#0E172B',
          800: '#15213D',
          700: '#1E2F56',
        },
        cyber: {
          cyan: '#00F0FF',
          blue: '#0284C7',
          violet: '#A855F7',
          purple: '#C084FC',
          emerald: '#10B981',
          crimson: '#FF0055',
          amber: '#FFB800',
          muted: '#64748B',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['Orbitron', '"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'rocket-thrust': '0 0 20px rgba(255, 94, 0, 0.5), 0 0 40px rgba(255, 42, 0, 0.25)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5), 0 0 35px rgba(0, 240, 255, 0.25)',
        'neon-violet': '0 0 15px rgba(168, 85, 247, 0.5), 0 0 35px rgba(168, 85, 247, 0.25)',
        'neon-crimson': '0 0 15px rgba(255, 0, 85, 0.5), 0 0 35px rgba(255, 0, 85, 0.25)',
        'neon-gold': '0 0 15px rgba(255, 184, 0, 0.5), 0 0 35px rgba(255, 184, 0, 0.25)',
        'glass-panel': '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
        'glass-light': '0 10px 30px 0 rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 10s linear infinite',
        'spin-fast': 'spin 2.5s linear infinite',
        'flame-flicker': 'flame 0.4s ease-in-out infinite alternate',
        'thrust-pulse': 'thrust 1.5s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '0.9' },
          '100%': { transform: 'scale(1.15) translateY(-2px)', opacity: '1', filter: 'drop-shadow(0 0 12px #FF5E00)' },
        },
        thrust: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(0.98)' },
          '50%': { opacity: '1', transform: 'scale(1.04)', filter: 'drop-shadow(0 0 18px #00F0FF)' },
        }
      }
    },
  },
  plugins: [],
}
