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
        @click:row="onRowClicked"
      >
        <template v-slot:item.status="{ item }">
          <v-icon x-small :color="item.status === 'OK' ? 'success' : 'warning'"
            >mdi-circle</v-icon
          >
          <span>{{ item.status }}</span>
        </template>
        <template v-slot:item.statuses="{ item }">
          <device-status-column :item="item" />
        </template>
        <template v-slot:item.devices="{ item }">
          <device-device-column :item="item" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, withContext, ref, Ref } from "nuxt-composition-api";
import DeviceDeviceColumn from "~/components/device/DeviceColumn.vue";
import DeviceStatusColumn from "~/components/device/StatusColumn.vue";
import { summary } from "~/composable/useOrganizations";
import { handleSelectedOrganization } from "~/composable/useNavigation";
import { IOrganizationSummary } from "~/types";
import { organizationStore } from "~/store";

export default defineComponent({
  name: "Organizations",
  components: { DeviceDeviceColumn, DeviceStatusColumn },
  setup(_, context) {
    const organizations: Ref<IOrganizationSummary[]> = ref([]);

    withContext(async (context) => {
      organizations.value = await summary<IOrganizationSummary[]>(context);
    });

    function onRowClicked(organization: IOrganizationSummary) {
      organizationStore.setSelectedOrganization({
        id: organization.id,
        name: organization.name,
      });

      handleSelectedOrganization(context);
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
.v-data-table table tbody tr {
  cursor: pointer;
}
</style>
