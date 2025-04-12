/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    preflight: false, // avoids conflict with PrimeNG's base styles
  },
  safelist: [
    { pattern: /^cursor-.*/ },
    { pattern: /^overflow-.*/ },
    { pattern: /^h-.*/ },
  ],
};
