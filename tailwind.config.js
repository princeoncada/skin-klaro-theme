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
        animation: {
            "loop": "loop 15s linear infinite"
        },
        keyframes: {
            loop: {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(calc(-50% - 20px))" },
            },
        },
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
