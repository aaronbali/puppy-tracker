/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          500: '#8B4513',
          600: '#7B3F1E'
        },
        primary: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#F3F4F6',
          foreground: '#111827'
        }
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        "fade-in-90": {
          "0%": { opacity: 0 },
          "90%": { opacity: 0.9 },
          "100%": { opacity: 1 }
        },
        "slide-in-from-bottom-10": {
          "0%": { transform: "translateY(10%)" },
          "100%": { transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fade-in 200ms ease-in-out",
        "fade-in-90": "fade-in-90 200ms ease-in-out",
        "slide-in-from-bottom-10": "slide-in-from-bottom-10 200ms ease-in-out"
      }
    },
  },
  plugins: [],
}
