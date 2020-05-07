import Moleculer, { Context } from "moleculer";
import { Service, Action } from "moleculer-decorators";
import { schema } from "ts-transformer-json-schema";
import { get, set, pick } from "lodash";

import Meraki from "../mixins/meraki";

import { setOrganizationIdMeta } from "./globalHooks/company";
import MerakiRootCause from "../@types";

@Service({
  name: "organizations",

  mixins: [Meraki],

  settings: {
    rest: "organizations",
  },

  hooks: {
    before: {
      license: ["setOrganizationIdMeta"],
    },
  },

  methods: {
    setOrganizationIdMeta,
  },
})
export default class OrganizationsService extends Moleculer.Service {
  @Action({
    rest: "GET /",
    cache: true,
  })
  async list(ctx: Context): Promise<MerakiRootCause.IOrganization[]> {
    const organizations: MerakiRootCause.IOrganization[] = await this._get(
      ctx,
      "organizations",
    );
    return organizations.map((org) => pick(org, ["id", "name"]));
  }

  @Action({
    rest: "GET /:orgId/license",
    cache: true,
    params: schema<MerakiRootCause.IOrganizationId>(),
  })
  async license(
    ctx: Context<MerakiRootCause.IOrganizationId>,
  ): Promise<MerakiRootCause.ILicense> {
    return this._get(ctx, `organizations/${ctx.params.orgId}/licenseState`);
  }

  @Action({
    rest: "GET /summary",
  })
  async summary(ctx: Context) {
    const organizations: MerakiRootCause.IOrganization[] = await ctx.call(
      "organizations.list",
    );

    const promises = organizations.map(async (org) => {
      const [networks, license, devicesSummary] = await Promise.all<
        MerakiRootCause.INetwork[],
        MerakiRootCause.ILicense,
        MerakiRootCause.IInventory[]
      >([
        ctx.call("networks.list", {
          orgId: org.id,
        }),
        ctx.call("organizations.license", {
          orgId: org.id,
        }),
        ctx.call("devices.summary", {
          orgId: org.id,
        }),
      ]);

      const result = {
        id: org.id,
        name: org.name,
        networks: networks.length,
        status: license.status,
        expirationDate: license.expirationDate,
        deviceCount: devicesSummary.length,
        statuses: {
          online: 0,
          alerting: 0,
          offline: 0,
          other: 0,
        },
        devices: {
          mx: 0,
          ms: 0,
          mr: 0,
          mv: 0,
        },
      };

      devicesSummary.forEach((device) => {
        if (device.status in result.statuses) {
          set(
            result,
            `statuses.${device.status}`,
            get(result, `statuses.${device.status}`) + 1,
          );
        } else {
          result.statuses.other++;
        }

        const deviceType = device.model.substring(0, 2).toLowerCase();
        if (deviceType in result.devices) {
          set(
            result,
            `devices.${deviceType}`,
            get(result, `devices.${deviceType}`) + 1,
          );
        }
      });

      return result;
    });

    return Promise.all(promises);
  }
}
