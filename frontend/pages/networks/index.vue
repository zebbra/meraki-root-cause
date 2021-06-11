<template>
  <v-card>
    <v-card-title>
      <span class="info--text">{{ networks.length }} Networks</span>
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
        :items="networks"
        :sort-by="['name']"
        :search="search"
        class="networks-data-table"
        :loading="networks.length === 0"
        @click:row="onRowClicked"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  watch,
  useContext,
  useFetch,
  // onUnmounted,
} from "@nuxtjs/composition-api";
import { summary } from "~/composable/useNetworks";
import { organizationStore, networkStore } from "~/store";
import { INetwork } from "~/types";

export default defineComponent({
  name: "Networks",
  setup() {
    const {
      error,
      app: { $axios, router },
    } = useContext();
    const networks: Ref<INetwork[]> = ref([]);
    const selectedOrganization = computed(
      () => organizationStore.selectedOrganization,
    );

    if (selectedOrganization.value) {
      useFetch(async () => {
        networks.value = await summary(
          $axios,
          error,
          selectedOrganization.value!.id,
        );
      });
    }

    watch(selectedOrganization, async (organization) => {
      if (organization) {
        networks.value = await summary($axios, error, organization.id);
      }
    });

    function onRowClicked(network: INetwork) {
      networkStore.setSelectedNetwork({ id: network.id, name: network.name });
      if (router) {
        router.push(`/networks/${network.id}`);
      }
    }

    // onUnmounted(() => {
    //   networkStore.setSelectedNetwork(undefined);
    // });

    return {
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Tags",
          value: "tags",
        },
        {
          text: "Network type",
          value: "type",
        },
        {
          text: "Devices",
          value: "online",
        },
        {
          text: "Offline Devices",
          value: "offline",
        },
      ],
      networks,
      search: "",
      onRowClicked,
    };
  },
  head(): any {
    return {
      title: "Networks",
    };
  },
});
</script>

<style>
.networks-data-table table tbody tr {
  cursor: pointer;
}
</style>
