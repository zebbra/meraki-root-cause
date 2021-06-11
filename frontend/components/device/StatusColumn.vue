<template>
  <span>
    <v-icon x-small color="success">mdi-circle</v-icon>
    <span>{{ item.statuses.online }}</span>
    <v-icon x-small color="warning">mdi-circle</v-icon>
    <span>{{ item.statuses.alerting }}</span>
    <v-icon x-small color="error">mdi-circle</v-icon>
    <span>{{ item.statuses.offline }}</span>
    <v-icon x-small color="grey darken-1">mdi-circle</v-icon>
    <span>{{ item.statuses.other }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DeviceStatusColumn",
  props: {
    item: Object,
  },
});
</script>
