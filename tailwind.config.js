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
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            maxWidth: '100%',
            h1: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              marginBottom: '1.5rem',
            },
            h2: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              lineHeight: '1.75',
            },
            a: {
              color: '#10a37f',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            ul: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.625rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            code: {
              color: '#111827',
              backgroundColor: '#f7f7f8',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            pre: {
              backgroundColor: '#f7f7f8',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
          },
        },
      },
    },
  },
  plugins: [],
}
