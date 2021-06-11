<template>
  <network-topology />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Network",
  head(this: any) {
    return {
      title: this.name,
    };
  },
});
</script>
