import { ServiceSchema, Context } from "moleculer";
import Axios, { AxiosError } from "axios";
import SingletonBottleneck from "../lib/bottleneck";
import JsonBigInt from "json-bigint";
import { get } from "lodash";

import { delay } from "../lib/utils";

const jsonBigInt = JsonBigInt({ storeAsString: true });

const MerakiMixin: ServiceSchema = {
  name: "merakiMixin",

  created() {
    const instance = Axios.create({
      baseURL: "https://api.meraki.com/api/v1/",
      headers: {
        common: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERAKI_API_KEY}`,
        },
      },
      timeout: 1000 * 60,
      transformResponse: [handleBigInt],
    });
    instance.interceptors.response.use((res) => res.data, this._errorHandler);

    this.instance = instance;
    this.group = new SingletonBottleneck(this.broker.logger).getInstance();
  },

  methods: {
    async _get(
      ctx: Context,
      url: string,
      params: object | null | undefined,
      priority = 5,
    ) {
      return this._exec(ctx, "GET", url, params, null, priority);
    },

    async _post(
      ctx: Context,
      url: string,
      data: object | null | undefined,
      priority = 1,
    ) {
      return this._exec(ctx, "POST", url, null, data, priority);
    },

    async _put(
      ctx: Context,
      url: string,
      data: object | null | undefined,
      priority = 1,
    ) {
      return this._exec(ctx, "PUT", url, null, data, priority);
    },

    async delete(
      ctx: Context,
      url: string,
      data: object | null | undefined,
      priority = 1,
    ) {
      return this._exec(ctx, "DELETE", url, null, data, priority);
    },

    async _exec(
      ctx: Context<unknown, { orgId: string }>,
      method: "GET" | "POST" | "PUT" | "DELETE",
      url: "string",
      params: object | null | undefined,
      data: object | null | undefined,
      priority: number,
    ) {
      const organization = ctx.meta.orgId || "default";

      if (priority < 0) {
        priority = 0;
      } else if (priority > 9) {
        priority = 9;
      }

      return this.group.key(organization).schedule({ priority }, () => {
        this.broker.logger.info(
          method,
          url,
          params ? params : "",
          data ? data : "",
        );

        return this.instance({
          method,
          headers: {
            "H-AUTH-ORGANIZATION": organization,
          },
          maxRedirects: method === "GET" ? 5 : 0,
          url,
          params,
          data,
        });
      });
    },

    async _errorHandler(error: AxiosError) {
      const organization = error.config.headers["H-AUTH-ORGANIZATION"];

      switch (error.response.status) {
        case 301:
        case 302:
        case 307:
        case 308:
          if (error.response.headers.location) {
            error.response.config.url = error.response.headers.location;

            return this.group
              .key(organization)
              .schedule({ priority: 1 }, this.instance, error.config);
          }

          throw error;

        case 429:
          const seconds = Number(get(error, "response.headers.retry-after", 1));
          const message = `${error.response.config.method.toUpperCase()}: ${
            error.response.config.url
          } return 429, going to back off ${seconds} seconds`;
          this.broker.logger.warn(message);
          await delay(seconds * 1000);

          return this.group.key(organization).schedule({ priority: 1 }, () => {
            this.broker.logger.info(
              error.response.config.method.toUpperCase(),
              error.response.config.url,
              error.response.config.params ? error.response.config.params : "",
              error.response.config.data ? error.response.config.data : "",
            );
            return this.instance(error.config);
          });

        default:
          throw error;
      }
    },
  },
};

function handleBigInt(data: any) {
  try {
    return jsonBigInt.parse(data);
  } catch (error) {
    return data;
  }
}

export default MerakiMixin;
