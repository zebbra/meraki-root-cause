import { partition, chain, without } from "lodash";
import MerakiRootCause from "../../..//types";

function getDegradedFirewallSerials(
  firewalls: MerakiRootCause.IDeviceSummary[],
) {
  const [onlineFirewalls, offlineFirewalls] = partition(firewalls, {
    status: "online",
  });
  const onlineFirewallSerials = onlineFirewalls.map(
    (firewall) => firewall.serial,
  );
  return chain(offlineFirewalls)
    .filter(
      (firewall) => without(onlineFirewallSerials, firewall.serial).length,
    )
    .map("serial")
    .value();
}

export { getDegradedFirewallSerials };
