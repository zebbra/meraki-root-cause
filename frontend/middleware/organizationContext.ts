import { Context } from "@nuxt/types";
export default function (context: Context) {
  if (context.isHMR) {
    return;
  }

  if (
    !context.store.state.Organization.selectedOrganization?.id &&
    context.route.name !== "index"
  ) {
    return context.redirect("/");
  } else if (
    context.store.state.Organization.selectedOrganization?.id &&
    context.route.name === "index"
  ) {
    return context.redirect("/networks");
  }
}
