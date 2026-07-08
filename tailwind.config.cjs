/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'impuls-blue': '#00376b',
        'impuls-red': '#d10019',
        // Warm-neutrale App-Fläche (DESIGN.md)
        'app-bg': '#f6f5f2',
        // Full brand-blue scale for new components.
        brand: {
          50: '#eef4fa',
          100: '#d9e4f0',
          200: '#a9c2dd',
          300: '#6f95bf',
          400: '#3f6fa3',
          500: '#14528a',
          600: '#00376b',
          700: '#042c54',
          800: '#04284b',
          900: '#021c36'
        },
        // Re-map Tailwind's default "indigo" to the Impuls brand blue so the
        // 160+ existing `indigo-*` utility classes across the app render in
        // the brand colour at once, without touching every component.
        indigo: {
          50: '#eef4fa',
          100: '#d9e4f0',
          200: '#a9c2dd',
          300: '#6f95bf',
          400: '#3f6fa3',
          500: '#14528a',
          600: '#00376b',
          700: '#042c54',
          800: '#04284b',
          900: '#021c36'
        },
        primary: '#ffffff',
        primaryText: '#1f2937',
        secondaryText: '#6b7280',
        tertiaryText: '#9ca3af'
      },
      fontFamily: {
        // Design-System (DESIGN.md): Body/Data = DM Sans, Display = Satoshi
        sans: [
          'DM Sans',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        display: [
          'Satoshi',
          'DM Sans',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ]
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
        soft: '0 10px 30px -12px rgba(0, 55, 107, 0.25)'
      },
      animation: {
        'ping-slow': 'ping 3s linear infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
