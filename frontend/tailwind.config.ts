import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sandalwood: {
          50: '#FDFBF7',
          100: '#F7F2E7',
          200: '#EBE0CA',
          300: '#D6C29D',
          400: '#C29F6C',
          500: '#AB8043',
          600: '#8B6231',
          700: '#6F4B27',
          800: '#4D321A',
          900: '#2C1A0D',
          950: '#1A0D06',
        },
        gold: {
          300: '#FFE599',
          400: '#F3D079',
          500: '#D4AF37',
          600: '#AA8721',
          700: '#7F6213',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
