import Moleculer, { Context } from "moleculer";
import { Service, Action } from "moleculer-decorators";
import { schema } from "ts-transformer-json-schema";
import { filter, partition } from "lodash";
import { Graph, json } from "@dagrejs/graphlib";

import Meraki from "../mixins/meraki";

import { setOrganizationIdMeta } from "./globalHooks/company";
import MerakiRootCause from "../types";
import { build, calcStatus } from "./devices/methods/topology";
import {
  getDegradedFirewallSerials,
  detectRoots,
} from "./networks/methods/topology";

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
    cache: {
      ttl: 1000 * 60 * 30,
    },
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async list(
    ctx: Context<MerakiRootCause.IOrganizationId>,
  ): Promise<MerakiRootCause.INetwork[]> {
    return this._get(ctx, `organizations/${ctx.params.orgId}/networks`);
  }

  @Action({
    rest: "GET /:orgId/networks/summary",
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
    cache: {
      ttl: 1000 * 60 * 30,
    },
    params: schema<MerakiRootCause.INetworkId>(),
  })
  async devices(ctx: Context<MerakiRootCause.INetworkId, { orgId: string }>) {
    ctx.meta.orgId = ctx.params.orgId;
    return this._get(ctx, `networks/${ctx.params.netId}/devices`);
  }

  @Action({
    rest: "GET /:orgId/networks/:netId/topology",
    cache: {
      ttl: 1000 * 60 * 30,
    },
    params: schema<MerakiRootCause.INetworkId>(),
  })
  async topology(ctx: Context<MerakiRootCause.INetworkId>) {
    const devices: MerakiRootCause.IStatus[] &
      MerakiRootCause.IDeviceSummary[] = await ctx.call("devices.summary", {
      orgId: ctx.params.orgId,
    });

    const networkDevices = filter(devices, {
      networkId: ctx.params.netId,
    });

    await Promise.all(
      networkDevices.map(async (device) => {
        device.neighbors = await ctx.call("devices.neighbors", {
          ...ctx.params,
          serial: device.serial,
        });

        return device;
      }),
    );

    const firewalls = filter(
      networkDevices,
      (device) =>
        device.model.startsWith("MX") || device.model.startsWith("vMX"),
    );
    const degradedFirewallSerials = getDegradedFirewallSerials(firewalls);
    // const roots = detectRoots(networkDevices);

    const g = new Graph({
      directed: true,
    });

    // build(g, networkDevices, roots.length === 0 ? firewalls : roots);
    build(g, networkDevices, firewalls);
    calcStatus(g, degradedFirewallSerials);

    return json.write(g) as MerakiRootCause.IJsonGraph;
  }
}
