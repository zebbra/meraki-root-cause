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
} from "nuxt-composition-api";
import { summary } from "~/composable/useNetworks";
import { organizationStore } from "~/store";
import { INetwork } from "~/types";

export default defineComponent({
  name: "Networks",
  setup(_, context) {
    const networks: Ref<INetwork[]> = ref([]);
    const selectedOrganization = computed(
      () => organizationStore.selectedOrganization,
    );

    watch(selectedOrganization, async (organization) => {
      if (organization) {
        networks.value = await summary<INetwork[]>(
          context.root.$nuxt,
          organization.id,
        );
      }
    });

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
    };
  },
  head(): any {
    return {
      title: "Networks",
    };
  },
});
</script>
