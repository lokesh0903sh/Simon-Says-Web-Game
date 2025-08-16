/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      colors: {
        'game-red': '#d95980',
        'game-yellow': '#f99b45',
        'game-green': '#63aac0',
        'game-purple': '#819ff9',
        'dark-bg': '#0a0a0a',
        'dark-card': '#1a1a1a',
        'dark-border': '#333333',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        }
      },
      fontFamily: {
        'game': ['Orbitron', 'monospace'],
      },
      boxShadow: {
        'game': '0 0 20px rgba(129, 159, 249, 0.3)',
        'game-hover': '0 0 30px rgba(129, 159, 249, 0.5)',
        'neon-red': '0 0 20px rgba(217, 89, 128, 0.6)',
        'neon-yellow': '0 0 20px rgba(249, 155, 69, 0.6)',
        'neon-green': '0 0 20px rgba(99, 172, 192, 0.6)',
        'neon-purple': '0 0 20px rgba(129, 159, 249, 0.6)',
      }
    },
  },
  plugins: [],
}
