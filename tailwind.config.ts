import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',  // Roxo Tailwind
        secondary: '#10B981', // Verde
      },
    },
  },
  plugins: [],
};

export default config;