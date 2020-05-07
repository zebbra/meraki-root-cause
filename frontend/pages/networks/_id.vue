<template>
  <network-topology />
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
import NetworkTopology from "~/components/network/NetworkTopology.vue";

export default defineComponent({
  name: "Network",
  components: { NetworkTopology },
  head(this: any) {
    return {
      title: this.name,
    };
  },
});
</script>
