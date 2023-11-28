/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            }
          }
        }
      },
      animation: {
        blob: "blob 45s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "scale(1)" },
          "33%": { transform: "scale(1.1)" },
          "66%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        }
      },
      colors: {
        // brand colours
        'cf-blue': {
          50: '#ADC5FF',
          100: '#6E98FF',
          200: '#3973FF',
          300: '#0D54FF',
          400: '#094BEA',
          500: '#023CC7',
          600: '#0033AD',
          900: '#030321',
        },
        'cf-gray': {
          50: '#CDCDCD',
          100: '#999999',
          200: '#7B7B7B',
          300: '#595959',
          400: '#3E3E3E',
          500: '#1F1F1F',
          600: '#61787B',
        },
        'cf-red': {
          50: '#FFE5E5',
          100: '#FFCFCF',
          200: '#FFAAAA',
          300: '#FF8C8C',
          400: '#FF7878',
          500: '#FF6C6C',
          600: '#FF5454',
        },
        'cf-green': {
          50: '#D1FFF4',
          100: '#A3FAE6',
          200: '#93EFD9',
          300: '#84E1CB',
          400: '#79D3BE',
          500: '#71C7B2',
          600: '#68B8A5',
          700: '#39937f',
        },
        'cf-yellow': {
          50: '#FFF5E4',
          100: '#FEE7C3',
          200: '#FFE0AE',
          300: '#FFD693',
          400: '#FFC668',
          500: '#FEB439',
          600: '#F3A31D',
        },
        // one off colours
        'cf-offwhite': '#FBFBFB',
        'cf-neutral-gray': '#61787B',
      }
    },
  },
  safelist: [
    'bg-white/10',
    'ring-gray-100/10',
    'text-slate-300',
    'bg-cf-green-600/30',
    'ring-cf-green-600/30',
    'text-green-600',
    'bg-cf-red-600/20',
    'ring-cf-red-600/20',
    'text-red-600',
    'bg-cf-yellow-600/20',
    'ring-cf-yellow-600/20',
    'text-yellow-600',
    'bg-cf-blue-600/30',
    'ring-cf-blue-600/30',
    'text-blue-600',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
