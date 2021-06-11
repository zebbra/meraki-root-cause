import { Ref } from "@nuxtjs/composition-api";
import { Route } from "vue-router";
import { VueRouter } from "vue-router/types/router";
import { organizationStore } from "~/store";

export function handleSelectedOrganization(
  route: Ref<Route>,
  router: VueRouter,
) {
  if (route.value.name === "index") {
    if (organizationStore.selectedOrganization?.id) {
      router.push("/networks");
    }
  } else if (!organizationStore.selectedOrganization?.id) {
    router.push("/");
  }
}
