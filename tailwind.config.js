module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#232946',         // fundo principal
          card: '#1a1f36',       // cards/sidebar
          accent: '#eebbc3',     // rosa/acento
          text: '#f4f4f6',       // texto claro
          green: '#3dd68c',
          red: '#ff6b6b',
          blue: '#00b4d8',
        },
        light: {
          bg: '#f4f4f6',         // fundo claro
          card: '#fff',          // cards/sidebar claros
          accent: '#232946',     // texto/acento escuro
          text: '#232946',       // texto escuro
        }
      },
      borderRadius: {
        xl: '1.5rem'
      }
    }
  }
}
