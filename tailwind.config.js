/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: "x-",
    important: true,
    content: ["./**/*.{html,js,css,liquid}"],
    theme: {
      extend: {}
    },
    plugins: [
      require('daisyui'),
    ],
  }