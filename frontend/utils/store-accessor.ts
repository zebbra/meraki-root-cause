import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import OrganizationModule from "~/store/Organization";
import NetworkModule from "~/store/Network";

/* eslint-disable import/no-mutable-exports */
let organizationStore: OrganizationModule;
let networkStore: NetworkModule;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  organizationStore = getModule(OrganizationModule, store);
  networkStore = getModule(NetworkModule, store);
}

export { initialiseStores, organizationStore, networkStore };
