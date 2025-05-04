// quasar.config.js
import { defineConfig } from '#q-app/wrappers'

export default defineConfig(() => {
  return {
    boot: ['supabase'],

    css: ['app.scss'],

    extras: [
      'roboto-font',
      'material-icons',
      'fontawesome-v6' 
    ],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      vueRouterMode: 'hash',
      vitePlugins: [
        ['vite-plugin-checker', {
          eslint: {
            lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{js,mjs,cjs,vue}"',
            useFlatConfig: true
          }
        }, { server: false }]
      ]
    },

    devServer: {
      open: true
    },

    framework: {
      config: {
        brand: {
          primary: '#ffffff',
          secondary: '#a045f5',
          accent: '#ff00e5',
          dark: '#000000',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037'
        },
        dark: true
      },
      plugins: []
    },

    htmlVariables: {
      headFontLink: `<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">`
    },

    animations: [],

    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false
    },

    pwa: {
      workboxMode: 'GenerateSW'
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      builder: {
        appId: 'furiosos-web'
      }
    },

    bex: {
      extraScripts: []
    }
  }
})
