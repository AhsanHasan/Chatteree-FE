/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.custom-border-radius-43': {
          'border-radius': '43px',
        },
        '.custom-button': {
          'border-radius': '32px',
          'padding': '12px 24px 12px 24px',
          'gap': '10px',
          'background-color': '#101C26',
          'color': '#F7E353',
          'font-size': '15px',
          'font-weight': '400',
        },
        '.custom-button-yellow': {
          'border-radius': '32px',
          'padding': '12px 24px 12px 24px',
          'gap': '10px',
          'background-color': '#F7E353',
          'color': '#101C26',
          'font-size': '15px',
          'font-weight': '400',
        },
        '.custom-social-button': {
          'border-radius': '32px',
          'padding': '12px 24px 12px 24px',
          'gap': '16px',
          'background-color': '#FFFFFF',
          'color': '#101C26',
          'font-size': '15px',
          'font-weight': '400',
          'border': '1px solid #F1F1F1',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}

