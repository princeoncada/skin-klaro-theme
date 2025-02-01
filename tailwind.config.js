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
          'garamond-premier-pro': ['garamond-premier-pro', 'serif'],
          'garamond-premier-pro-display': ['garamond-premier-pro-display', 'serif'],
          'minion-pro-display': ['minion-pro-display', 'serif'],
          'contralto-small': ['contralto-small', 'sans-serif'],
          'century-gothic': ['century-gothic', 'sans-serif'],
          'minion-pro': ['minion-pro', 'serif'],
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
