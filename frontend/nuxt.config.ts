require("dotenv").config();

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - Meraki Hackathon",
    title: "Organizations",
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
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "red", heigth: "5px" },
  router: {
    middleware: ["organizationContext"],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    // Doc: https://github.com/nuxt-community/stylelint-module
    "@nuxtjs/stylelint-module",
    "@nuxtjs/vuetify",
    // Doc: https://github.com/nuxt-community/composition-api
    "nuxt-composition-api",
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://www.npmjs.com/package/nuxt-lazy-load/v/latest
    "nuxt-lazy-load",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    // Doc: https://github.com/Developmint/nuxt-webfontloader
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
    baseUrl:
      process.env.NODE_ENV === "production"
        ? "https://meraki-root-cause.k8s.zebbra.ch/api/"
        : process.env.API_URL,
  },
  typescript: {
    typeCheck: {
      eslint: true,
    },
  },
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
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    optionsPath: "~/vuetify.options.ts",
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend() {},
  },
};
