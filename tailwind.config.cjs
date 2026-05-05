/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'impuls-blue': '#00376b',
        'impuls-red': '#d10019',
        primary: '#ffffff',
        primaryText: '#374151',
        secondaryText: '#6b7280',
        tertiaryText: '#9ca3af'
      },
      animation: {
        'ping-slow': 'ping 3s linear infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
