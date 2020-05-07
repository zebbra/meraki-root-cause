<template>
  <span>
    <v-icon x-small color="info">mdi-security</v-icon>
    <span>{{ item.devices.mx }}</span>
    <v-icon x-small color="info">mdi-server</v-icon>
    <span>{{ item.devices.ms }}</span>
    <v-icon x-small color="info">mdi-wifi</v-icon>
    <span>{{ item.devices.mr }}</span>
    <v-icon x-small color="info">mdi-server-network</v-icon>
    <span>{{ item.devices.mv }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";

export default defineComponent({
  name: "DeviceDeviceColumn",
  props: {
    item: Object,
  },
});
</script>
