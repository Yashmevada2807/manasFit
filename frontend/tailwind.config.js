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
        // MongoDB Green Neo-Brutalist Palette
        mongo: {
          50: '#E6F4EA',   // Light mint green (background highlights)
          100: '#C8E6D0',  // Lighter green
          200: '#A3D9B1',  // Light green
          300: '#7FCC92',  // Medium light green
          400: '#5ABF73',  // Medium green
          500: '#13AA52',  // MongoDB main green (primary)
          600: '#116149',  // Dark green (accent)
          700: '#0F5A42',  // Darker green
          800: '#0D4D38',  // Very dark green
          900: '#0A3D2C',  // Darkest green
        },
        // Brutalist accent colors
        brutal: {
          black: '#000000',     // Secondary black (text, borders)
          yellow: '#FFD600',    // Accent yellow (CTA highlights)
          grey: '#F2F2F2',      // Neutral grey (background blocks)
          red: '#FF3B3B',       // Error/Alert red (brutalist alerts)
          white: '#FFFFFF',     // Pure white
        },
        // Dark mode colors
        dark: {
          bg: '#0A0A0A',        // Dark background
          surface: '#1A1A1A',   // Dark surface
          card: '#2A2A2A',      // Dark card background
          border: '#404040',    // Dark border
          text: '#FFFFFF',      // Dark text
          textSecondary: '#A0A0A0', // Secondary dark text
          accent: '#13AA52',    // Keep MongoDB green for accents
        },
        // Keep existing structure for compatibility
        primary: {
          50: '#E6F4EA',
          100: '#C8E6D0',
          200: '#A3D9B1',
          300: '#7FCC92',
          400: '#5ABF73',
          500: '#13AA52',
          600: '#116149',
          700: '#0F5A42',
          800: '#0D4D38',
          900: '#0A3D2C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutalist': '4px 4px 0px 0px #000000',
        'brutalist-lg': '8px 8px 0px 0px #000000',
        'brutalist-hover': '2px 2px 0px 0px #000000',
      },
    },
  },
  plugins: [],
}
