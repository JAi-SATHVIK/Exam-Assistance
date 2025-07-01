module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: '#1E3231',
        paynesgray: '#485665',
        mountbatten: '#8E7C93',
        pinklavender: '#D0A5C0',
        orchidpink: '#F6C0D0',
        fire1: '#01021A', // dark navy
        fire2: '#23010A', // deep burgundy
        fire3: '#4B0712', // dark red
        fire4: '#7A0C17', // red
        fire5: '#B10F13', // true red
        fire6: '#E03A0B', // orange-red
        fire7: '#F36A0A', // orange
        fire8: '#F89C0E', // gold
        fire9: '#FFC20A', // yellow
      },
    },
  },
  plugins: [],
}; 