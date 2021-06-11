require("dotenv").config();

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "server",
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Meraki Root Cause",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  loading: { color: "red", heigth: "5px" },

  router: {
    middleware: ["organizationContext"],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://composition-api.nuxtjs.org/
    "@nuxtjs/composition-api/module",
    // https://github.com/nuxt-community/fontawesome-module
    "@nuxtjs/vuetify",
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // https://axios.nuxtjs.org/
    "@nuxtjs/axios",
    // https://github.com/Developmint/nuxt-webfontloader
    "nuxt-webfontloader",
  ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    headers: {
      common: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },

    prefix: "/api",
    proxy: true,
    debug: true,
  },

  // https://github.com/nuxt-community/proxy-module
  proxy: {
    "/api/": process.env.API_PROXY_URL || "http://localhost:3001",
  },

  // https://github.com/Developmint/nuxt-webfontloader
  webfontloader: {
    custom: {
      families: ["Roboto Condensed", "Eczar"],
      urls: [
        // for each Google Fonts add url + options you want
        // here add font-display option
        "https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap",
        "https://fonts.googleapis.com/css?family=Eczar&display=swap",
      ],
    },
  },

  // vuetify module configuration https://github.com/nuxt-community/vuetify-module
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    optionsPath: "~/vuetify.options.ts",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Do not send anonymous telemetry data: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-telemetry
  telemetry: false,
};
