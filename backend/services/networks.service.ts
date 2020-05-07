import Moleculer, { Context } from "moleculer";
import { Service, Action } from "moleculer-decorators";
import { schema } from "ts-transformer-json-schema";
import { filter, partition } from "lodash";
import { Graph, json } from "@dagrejs/graphlib";

import Meraki from "../mixins/meraki";

import { setOrganizationIdMeta } from "./globalHooks/company";
import MerakiRootCause from "../types";
import { build, calcStatus } from "./devices/methods/topology";
import { getDegradedFirewallSerials } from "./networks/methods/topology";

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

  @Action({
    rest: "GET /:orgId/networks/:netId/devices",
    cache: true,
    params: schema<MerakiRootCause.INetworkId>(),
  })
  async devices(ctx: Context<MerakiRootCause.INetworkId, { orgId: string }>) {
    ctx.meta.orgId = ctx.params.orgId;
    return this._get(ctx, `networks/${ctx.params.netId}/devices`);
  }

  @Action({
    rest: "GET /:orgId/networks/:netId/topology",
    // cache: {
    //   ttl: 1000 * 60 * 30,
    // },
    params: schema<MerakiRootCause.INetworkId & { asJson: boolean }>(),
  })
  async topology(
    ctx: Context<MerakiRootCause.INetworkId & { asJson: boolean | string }>,
  ) {
    const deviceStatuses: MerakiRootCause.IStatus[] &
      MerakiRootCause.IDeviceSummary[] = await ctx.call("devices.summary", {
      orgId: ctx.params.orgId,
    });

    const networkDevices = filter(deviceStatuses, {
      networkId: ctx.params.netId,
    });

    const firewalls = filter(
      networkDevices,
      (device) =>
        device.model.startsWith("MX") || device.model.startsWith("vMX"),
    );

    const degradedFirewallSerials = getDegradedFirewallSerials(firewalls);

    await Promise.all(
      networkDevices.map(async (device) => {
        device.neighbors = await ctx.call("devices.neighbors", {
          ...ctx.params,
          serial: device.serial,
        });

        return device;
      }),
    );

    const g = new Graph({
      directed: true,
    });

    build(g, networkDevices, firewalls);
    calcStatus(g, degradedFirewallSerials);

    if (ctx.params.asJson) {
      return json.write(g) as MerakiRootCause.IJsonGraph;
    }
    return g;
  }
}
