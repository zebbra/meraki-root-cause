import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import OrganizationModule from "~/store/Organization";

// eslint-disable-next-line import/no-mutable-exports
let organizationStore: OrganizationModule;

function initialiseStores(store: Store<any>): void {
  organizationStore = getModule(OrganizationModule, store);
}

export { initialiseStores, organizationStore };
