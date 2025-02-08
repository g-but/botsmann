/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sohne)', 'system-ui', 'sans-serif'],
      },
      colors: {
        'openai-green': '#10a37f',
        'openai-gray': '#374151',
        'openai-light': '#f7f7f8',
      },
    },
  },
  plugins: [],
}
