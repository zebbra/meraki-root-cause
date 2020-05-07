import { SetupContext } from "nuxt-composition-api";
import { organizationStore } from "~/store";

export function handleSelectedOrganization(context: SetupContext) {
  if (context.root.$route.name === "index") {
    if (organizationStore.selectedOrganization?.id) {
      context.root.$router.push("/networks");
    }
  } else if (!organizationStore.selectedOrganization?.id) {
    context.root.$router.push("/");
  }
}
