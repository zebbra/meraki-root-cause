import { mapValues, isPlainObject } from "lodash";
import MerakiRootCause from "../../../types";

export function deep<Data = unknown>(
  obj: object,
  mapper: (x: any) => Data,
): Data {
  return mapper(
    mapValues(obj, (v) => {
      return isPlainObject(v) ? deep(v, mapper) : v;
    }),
  );
}

export async function classifyMerakiAlert(alert: MerakiRootCause.IMerakiAlert) {
  const { organizationId, networkId } = alert;

  switch (alert.alertType.toLowerCase()) {
    case "aps went down":
    case "aps came up":
    case "switches went down":
    case "switches came up":
    case "applicanes went down":
    case "applicanes came up":
    case "switch port connected":
    case "switch port disconnected":
      await this.broker.cacher.clean([
        `networks.topology:orgId|${organizationId}|netId|${networkId}`,
        `devices.neighbors:orgId|${organizationId}|netId|${networkId}|serial|*`,
      ]);
      break;

    case "aps went down":
    case "aps came up":
    case "switches went down":
    case "switches came up":
    case "applicanes went down":
    case "applicanes came up":
      await this.broker.cacher.clean([
        `devices.statuses:orgId|${organizationId}`,
      ]);
      break;

    case "settings changed":
      await this.broker.cacher.clean([
        "organizations.list:",
        `organizations.license:orgId|${organizationId}`,
        `networks.list:orgId|${organizationId}`,
        `devices.inventory:orgId|${organizationId},`,
      ]);
      break;

    default:
      break;
  }
}
