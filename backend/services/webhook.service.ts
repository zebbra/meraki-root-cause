import { Service, Action } from "moleculer-decorators";
import Moleculer, { Context } from "moleculer";
import { mapKeys } from "lodash";
import { schema } from "ts-transformer-json-schema";

import { deep, classifyMerakiAlert } from "./webhook/methods/utils";
import MerakiRootCause from "../types";

@Service({
  name: "alerts",

  settings: {
    rest: "alerts",
  },

  methods: {
    classifyMerakiAlert,
  },
})
export default class AlertsService extends Moleculer.Service {
  @Action({
    rest: "/meraki",
    params: schema<MerakiRootCause.IMerakiAlert>(),
  })
  async meraki(ctx: Context<MerakiRootCause.IMerakiAlert>) {
    const data = deep<MerakiRootCause.IMerakiAlert>(ctx.params, (x: any) => {
      return mapKeys(x, (_, key) => {
        return key.replace(/[$.]/g, "");
      });
    });

    if (
      process.env.MERAKI_WEBHOOK_SECRET &&
      ctx.params.sharedSecret !== process.env.MERAKI_WEBHOOK_SECRET
    ) {
      throw new Error("Invalid sharedSecret");
    }

    this.classifyMerakiAlert(data);

    return {
      status: "ok",
    };
  }
}
