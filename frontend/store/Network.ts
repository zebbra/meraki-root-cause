import { Module, VuexModule, Mutation } from "vuex-module-decorators";

@Module({
  name: "Network",
  namespaced: true,
  stateFactory: true,
})
export default class Network extends VuexModule {
  public selectedNetwork: { id: string; name: string } | null | undefined =
    null;

  @Mutation
  setSelectedNetwork(network: { id: string; name: string } | undefined) {
    this.selectedNetwork = network;
  }
}
