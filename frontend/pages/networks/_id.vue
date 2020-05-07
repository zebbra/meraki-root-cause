<template>
  <v-card>
    <v-card-title>
      <span class="info--text">{{ name }} - Network Topology</span>
    </v-card-title>
    <v-card-text>
      <network-topology />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
import NetworkTopology from "~/components/network/NetworkTopology.vue";
import { networkStore } from "~/store";

export default defineComponent({
  name: "Network",
  components: { NetworkTopology },
  setup() {
    return {
      name: networkStore.selectedNetwork!.name,
    };
  },
  head(this: any) {
    return {
      title: this.name,
    };
  },
});
</script>
