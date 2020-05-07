import Moleculer, { Context } from "moleculer";
import { Service, Action } from "moleculer-decorators";
import { schema } from "ts-transformer-json-schema";
import { find } from "lodash";

import Meraki from "../mixins/meraki";

import { setOrganizationIdMeta } from "./globalHooks/company";
import MerakiRootCause from "../@types";

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
    cache: true,
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async statuses(
    ctx: Context<MerakiRootCause.IOrganizationId>,
  ): Promise<MerakiRootCause.IInventory[]> {
    return this._get(ctx, `organizations/${ctx.params.orgId}/deviceStatuses`);
  }

  @Action({
    rest: "GET /organizations/:orgId/devices/inventory",
    cache: true,
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async inventory(
    ctx: Context<MerakiRootCause.IOrganizationId>,
  ): Promise<MerakiRootCause.IInventory[]> {
    return this._get(ctx, `organizations/${ctx.params.orgId}/inventory`);
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

      return device;
    });
  }
}
