/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Work Sans', 'sans-serif']
      },
      colors: {
        primary: '#DC2626',
        secondary: '#F87171',
        cta: '#CA8A04',
        background: '#FEF2F2',
        text: '#450A0A',
        border: '#FECACA'
      }
    },
  },
  plugins: [],
}
