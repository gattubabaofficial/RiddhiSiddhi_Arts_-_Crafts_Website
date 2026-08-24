import type { Config } from "tailwindcss";

const navyScale = {
  50: '#F0F3F9',
  100: '#DCE4F2',
  200: '#B8C9E6',
  300: '#89A6D4',
  400: '#527EBC',
  500: '#2D5EA3',
  600: '#1D4685',
  700: '#13346A',
  800: '#0A2454',
  900: '#021D62', // R2 G29 B98 from docPalette.xml
  950: '#010F34', // Midnight Indigo from docPalette.xml (C98 M84 Y23 K60)
};

const goldScale = {
  50: '#FDF9F2',
  100: '#FAF0DE',
  200: '#F3DFC0',
  300: '#E8C795',
  400: '#DCAD67',
  500: '#C0883B', // R192 G136 B59 from docPalette.xml
  600: '#A67129',
  700: '#82541C',
  800: '#643E15',
  900: '#4A2C0D',
  950: '#2E1805',
};

const sandalwoodScale = {
  50: '#FDFBF7', // Linen craft ivory
  100: '#F7F2E7',
  200: '#EBE0CA',
  300: '#D6C29D',
  400: '#C29F6C',
  500: '#AB8043',
  600: '#8B6231',
  700: '#6F4B27',
  800: '#4D321A',
  900: '#2C1A0D',
  950: '#180E06',
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nested structure: brand.navy, brand.gold, brand.sandalwood
        brand: {
          navy: navyScale,
          gold: goldScale,
          sandalwood: sandalwoodScale,
        },
        // Flat aliases
        'brand-navy': navyScale,
        'brand-gold': goldScale,
        'brand-sandalwood': sandalwoodScale,
        navy: navyScale,
        gold: goldScale,
        sandalwood: sandalwoodScale,
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        cinzel: ['var(--font-cinzel)', 'Cinzel', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
