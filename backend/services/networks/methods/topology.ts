import { partition, chain, without, find, filter, each } from "lodash";
import MerakiRootCause from "../../../types";

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
      (firewall) => without(onlineFirewallSerials, firewall.serial).length > 0,
    )
    .map("serial")
    .value();
}

function detectRoots(networkDevices: MerakiRootCause.IDeviceSummary[]) {
  const roots: MerakiRootCause.IDeviceSummary[] = [];

  networkDevices.forEach((networkDevice) => {
    if (networkDevice.neighbors) {
      each(
        filter(
          networkDevice.neighbors,
          (neighbor) => neighbor.mac !== networkDevice.mac, // filter circles to itself
        ),
        (neighbor) => {
          // is there a neighbor which is not part of the current network?
          // if yes, we consider this device as a root
          if (!find(networkDevices, { mac: neighbor.mac })) {
            roots.push(networkDevice);
            return false; // break loop
          }

          return true;
        },
      );
    }
  });

  return roots;
}

export { getDegradedFirewallSerials, detectRoots };
