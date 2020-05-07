import moleculer from "moleculer";
import { Service } from "moleculer-decorators";
import ApiGateway from "moleculer-web";

@Service({
  name: "api",
  mixins: [ApiGateway],
  settings: {
    port: process.env.PORT || 3001,

    logRequestParams: "info",
    logResponseData: "debug",

    cors: {
      origin: "*",
    },

    routes: [
      {
        path: "/api",

        // Automatically load all rest endpoints based on service settings
        autoAliases: true,

        whitelist: [
          // Access to any actions in all services under "/api" URL
          "**",
        ],
      },
    ],

    // Serve assets from "public" folder
    assets: {
      folder: "public",
    },
  },
})
export default class ApiService extends moleculer.Service {}
