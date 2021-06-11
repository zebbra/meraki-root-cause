import Moleculer, { Context } from "moleculer";
import { Service, Action } from "moleculer-decorators";
import { schema } from "ts-transformer-json-schema";
import { find } from "lodash";

import Meraki from "../mixins/meraki";

import { setOrganizationIdMeta } from "./globalHooks/company";
import { extract } from "./devices/methods/topology";
import MerakiRootCause from "../types";

@Service({
  name: "devices",

  mixins: [Meraki],

  settings: {
    rest: "",
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
export default class DevicesService extends Moleculer.Service {
  @Action({
    rest: "GET /organizations/:orgId/devices/statuses",
    cache: {
      ttl: 1000 * 60 * 30,
    },
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async statuses(
    ctx: Context<MerakiRootCause.IOrganizationId>,
  ): Promise<MerakiRootCause.IInventory[]> {
    return this._get(ctx, `organizations/${ctx.params.orgId}/devices/statuses`);
  }

  @Action({
    rest: "GET /organizations/:orgId/inventoryDevices",
    cache: {
      ttl: 1000 * 60 * 30,
    },
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async inventory(
    ctx: Context<MerakiRootCause.IOrganizationId>,
  ): Promise<MerakiRootCause.IInventory[]> {
    return this._get(ctx, `organizations/${ctx.params.orgId}/inventoryDevices`);
  }

  @Action({
    rest: "GET /organizations/:orgId/devices/summary",
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async summary(ctx: Context<MerakiRootCause.IOrganizationId>) {
    const deviceStatuses: MerakiRootCause.IStatus[] = await ctx.call(
      "devices.statuses",
      ctx.params,
    );
    const inventory: MerakiRootCause.IInventory[] = await ctx.call(
      "devices.inventory",
      ctx.params,
    );

    return deviceStatuses.map((device) => {
      const inventoryDevice = find(inventory, { mac: device.mac });

      if (inventoryDevice) {
        Object.assign(device, inventoryDevice);
      }

      return device as MerakiRootCause.IDeviceSummary;
    });
  }

  @Action({
    rest: "GET organizations/:orgId/networks/:netId/devices/:serial/neighbors",
    cache: {
      ttl: 1000 * 60 * 60,
    },
    params: schema<MerakiRootCause.INetworkId & { serial: string }>(),
  })
  async neighbors(
    ctx: Context<MerakiRootCause.INetworkId & { serial: string }>,
  ) {
    const info: MerakiRootCause.ILldpCdpPortsMap = await this._get(
      ctx,
      `networks/${ctx.params.netId}/devices/${ctx.params.serial}/lldp_cdp`,
      { timespan: 60 * 60 * 24 * 3 }, // three days back in case of weekend
    );

    return extract(info);
  }

  @Action({
    rest: "GET organizations/:orgId/devices/:serial",
    cache: {
      ttl: 1000 * 60 * 30,
    },
    params: schema<MerakiRootCause.IOrganizationId & { serial: string }>(),
  })
  async uplinks(
    ctx: Context<MerakiRootCause.IOrganizationId & { serial: string }>,
  ): Promise<MerakiRootCause.IUplink[]> {
    return this._get(ctx, `devices/${ctx.params.serial}/uplink`);
  }
}
