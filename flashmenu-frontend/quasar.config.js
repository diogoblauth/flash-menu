// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file

import { defineConfig } from '#q-app/wrappers'

export default defineConfig((ctx) => {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-webpack/boot-files
    boot: ['axios'],

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file#build
    build: {
      env: {
        // Em produção lê a URL da API da env var configurada no projeto Vercel (API_URL).
        API: ctx.prod ? process.env.API_URL : 'http://localhost:5000',
      },

      // publicPath: '/',
      vueRouterMode: 'history', // available values: 'hash', 'history'

      esbuildTarget: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file#devserver
    devServer: {
      server: {
        type: 'http',
      },
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file#framework
    framework: {
      config: {
        notify: {},
        loading: {},
      },

      // Quasar plugins
      plugins: ['Notify', 'Dialog', 'LocalStorage', 'Loading'],
    },

    // https://quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false,
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW',
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
    cordova: {},

    // https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'flashmenu-frontend',
      },
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-browser-extensions/configuring-bex
    bex: {
      extraScripts: [],
    },
  }
})
