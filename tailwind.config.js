/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // For App Router
      './components/**/*.{js,ts,jsx,tsx}', // For components
    ],
    theme: {
      extend: {
        fontFamily: {
          poppins: ['Poppins', 'serif'],
          geist: ['var(--font-geist-sans)', 'sans-serif'],
          geistMono: ['var(--font-geist-mono)', 'monospace'],
        },
      },
    },
    plugins: [
      require('tailwind-scrollbar')
    ],
  }
  