<template>
  <v-card>
    <v-card-title>
      <span class="info--text"
        >{{ organizations ? organizations.length : 0 }} Companies</span
      >
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="organizations"
        :sort-by="['name']"
        :search="search"
        class="organizations-data-table"
        :loading="organizations.length === 0"
        @click:row="onRowClicked"
      >
        <template #item.status="{ item }">
          <v-icon x-small :color="item.status === 'OK' ? 'success' : 'warning'"
            >mdi-circle</v-icon
          >
          <span>{{ item.status }}</span>
        </template>
        <template #item.statuses="{ item }">
          <device-status-column :item="item" />
        </template>
        <template #item.devices="{ item }">
          <device-device-column :item="item" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  useContext,
  useFetch,
} from "@nuxtjs/composition-api";

import DeviceDeviceColumn from "~/components/device/DeviceColumn.vue";
import DeviceStatusColumn from "~/components/device/StatusColumn.vue";
import { summary } from "~/composable/useOrganizations";
import { handleSelectedOrganization } from "~/composable/useNavigation";
import { IOrganizationSummary } from "~/types";
import { organizationStore } from "~/store";

export default defineComponent({
  name: "Organizations",
  components: { DeviceDeviceColumn, DeviceStatusColumn },
  setup() {
    const {
      route,
      error,
      app: { router, $axios },
    } = useContext();
    const organizations: Ref<IOrganizationSummary[]> = ref([]);

    useFetch(async () => {
      organizations.value = await summary($axios, error);
    });

    function onRowClicked(organization: IOrganizationSummary) {
      organizationStore.setSelectedOrganization({
        id: organization.id,
        name: organization.name,
      });

      if (router) {
        handleSelectedOrganization(route, router);
      }
    }

    return {
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "License Expiration",
          value: "expirationDate",
        },
        {
          text: "Networks",
          value: "networks",
        },
        {
          text: "Devices",
          value: "deviceCount",
        },
        {
          text: "Types",
          value: "devices",
        },
        {
          text: "Statuses",
          value: "statuses",
        },
      ],
      organizations,
      search: "",
      onRowClicked,
    };
  },
});
</script>

<style>
.organizations-data-table table tbody tr {
  cursor: pointer;
}
</style>
