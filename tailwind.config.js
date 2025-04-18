/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class',

  // ⬇️ гарантируем, что утилиты цвета будут в сборке
  safelist: [
    'text-green-500',    // зелёный ✓  
    'text-red-500',      // красный ✕
    'dark:text-green-400',
    'dark:text-red-400',
    '!text-green-500',   // важный ✓
    '!text-red-500',     // важный ✕
  ],

  // ⬇️ все утилиты Tailwind получат !important
  important: true,

  theme: {
    extend: {},
  },
  plugins: [],
}
