module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        gray: {
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
};
