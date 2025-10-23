// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}
module.exports = {
  darkMode: 'class', // <== this is important!
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
