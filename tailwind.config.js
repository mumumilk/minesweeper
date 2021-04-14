module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    boxShadow: {
      DEFAULT: '0px 2px 0px #9CA3AF',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
