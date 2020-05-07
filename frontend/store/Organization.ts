import { Module, VuexModule, Mutation } from "vuex-module-decorators";

@Module({
  name: "Organization",
  namespaced: true,
  stateFactory: true,
})
export default class Organization extends VuexModule {
  public selectedOrganization:
    | { id: string; name: string }
    | null
    | undefined = null;

  @Mutation
  setSelectedOrganization(
    organization: { id: string; name: string } | undefined,
  ) {
    this.selectedOrganization = organization;
  }
}
