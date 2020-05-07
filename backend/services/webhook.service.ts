import { Service, Action } from "moleculer-decorators";
import Moleculer, { Context } from "moleculer";
import _ from "lodash";
import Axios from "axios";

_.mixin({
  deep: (obj, mapper) => {
    return mapper(
      _.mapValues(obj, (v) => {
        // @ts-ignore
        return _.isPlainObject(v) ? _.deep(v, mapper) : v;
      }),
    );
  },
});

@Service({
  name: "alerts",

  settings: {
    rest: "alerts",
  },
})
export default class AlertsService extends Moleculer.Service {
  @Action({
    rest: "/meraki",
  })
  async meraki(ctx: Context) {
    // meraki sends keys with dot and $ in it which fails on mongodb
    // @ts-ignore
    const data = _.deep(ctx.params, (x: any) => {
      return _.mapKeys(x, (val, key) => {
        return key.replace(/[$.]/g, "");
      });
    });

    const params = {
      roomId:
        "Y2lzY29zcGFyazovL3VzL1JPT00vMjMwY2E0MDAtOGE0Yy0xMWVhLWI0ZDgtNDM3YjFiMTdiN2Ew",
      text: data,
    };

    try {
      await Axios.post("https://api.ciscospark.com/v1/messages", params, {
        headers: {
          Authorization:
            "Bearer YWY0YWEwZjktMmM0Yy00YWEwLWIxZTgtODg3ZDdjODY5MmYwNWYxODI4YjEtMDM3_PF84_8fc1ba79-8a32-4a6e-91db-a2b1a3b255ed",
          "Content-Type": ["application/json", "text/plain"],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
