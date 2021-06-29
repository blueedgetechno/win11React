const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        eblue: {
          '100': '#dee3ed',
          '200': '#c3cad2',
          '300': '#C9C9DB',
          '400': '#a0afbe',
          '500': '#256fff',
          '600': '#1783f1',
          '700': '#2969E5',
          '800': '#245FD3',
          '900': '#2969E5',
        },
        eblack: {
          '100': '#6a6a6a',
          '200': '#4a4a4a',
          '300': '#3b3b3b',
          '400': '#2f2f2f',
          '500': '#2a2a2a',
          '600': '#242424',
          '700': '#1b1b1b',
          '800': '#131313',
          '900': '#0b0b0b',
        },
      },
      screens: {
        mb: {max: '768px'},
      },
      spacing: {
        '18': '4.5rem',
        '30': '7.5rem',
        '30.5': '7.625rem',
        '42': '10.5rem',
        '66': '16.5rem',
        '80': '20rem',
        '82': '20.5rem',
        '84': '21rem',
        '86': '21.5rem',
        '88': '22rem',
        '90': '22.5rem',
        '128': '32rem',
        '144': '36rem',
        '152': '38rem',
        '160': '38rem',
        '0/10': '0%',
        '1/20': '5%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%'
      },
      fontSize: {
        xts: '8px',
        xss: '10px'
      },
      animation: {
        'bounce-slow': 'bounceSlow 5s infinite linear'
      },
      keyframes: {
        bounceSlow: {
          '0%': { transform: 'translateY(-10%)'},
          '50%': { transform: 'translateY(0%)'},
          '100%': { transform: 'translateY(-10%)'}
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
