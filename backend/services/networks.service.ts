import Moleculer, { Context } from "moleculer";
import { Service, Action } from "moleculer-decorators";
import { schema } from "ts-transformer-json-schema";
import { filter, partition } from "lodash";

import Meraki from "../mixins/meraki";

import { setOrganizationIdMeta } from "./globalHooks/company";
import MerakiRootCause from "../@types";

@Service({
  name: "networks",

  mixins: [Meraki],

  settings: {
    rest: "organizations",
  },

  hooks: {
    before: {
      "*": ["setOrganizationIdMeta"],
    },
  },

  methods: {
    setOrganizationIdMeta,
  },
})
export default class NetworksService extends Moleculer.Service {
  @Action({
    rest: "GET /:orgId/networks",
    cache: true,
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async list(
    ctx: Context<MerakiRootCause.IOrganizationId>,
  ): Promise<MerakiRootCause.INetwork[]> {
    return this._get(ctx, `organizations/${ctx.params.orgId}/networks`);
  }

  @Action({
    rest: "GET /:orgId/networks/summary",
    cache: true,
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async summary(ctx: Context<MerakiRootCause.IOrganizationId>) {
    const [networks, statuses] = await Promise.all<
      MerakiRootCause.INetwork[],
      MerakiRootCause.IStatus[]
    >([
      ctx.call("networks.list", ctx.params),
      ctx.call("devices.statuses", ctx.params),
    ]);

    return networks.map((network) => {
      const devices = filter(statuses, { networkId: network.id });
      const [online, offline] = partition(devices, { status: "online" });
      return {
        id: network.id,
        name: network.name,
        tags: network.tags,
        type: network.type,
        online: online.length,
        offline: offline.length,
      };
    });
  }
}
