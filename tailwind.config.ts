import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lfg: {
          black: '#000000',
          orange: '#FE5500',
          yellow: '#EE9944',
          blue: '#79CAC4',
          cream: '#EBE3D0',
        },
      },
      fontFamily: {
        octarine: ['Octarine', 'system-ui', 'sans-serif'],
        'octarine-light': ['Octarine-Light', 'system-ui', 'sans-serif'],
        dm: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
