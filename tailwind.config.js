/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: "x-",
    important: true,
   content: [
        "./**/*.{html,liquid}",
        "./assets/*.css",
        "./assets/*.js"
    ],
    theme: {
      extend: {
        fontFamily: {
          'amandine': ['amandine', 'sans-serif'],
          'myriad-pro': ['myriad-pro', 'sans-serif'],
        },
        transitionProperty: {
          'collapse': 'height !important, margin !important'
        }
      },
      screens: {
        'xs': '425px',
        'sm': '640px',
        'md': '990px',
        'lg': '1280px',
        'xl': '1440px',
        '2xl': '1536px',
      }
    },
    plugins: [
      require('daisyui'),
    ],
  }
