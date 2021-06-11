<template>
  <v-list>
    <v-select
      :value="selectedOrganization"
      :items="organizations"
      item-text="name"
      item-value="id"
      label="MSP"
      filled
      solo
      clearable
      @input="onSelectOrganization"
    />
    <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router>
      <v-list-item-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  computed,
  useFetch,
  useContext,
} from "@nuxtjs/composition-api";
import { list } from "~/composable/useOrganizations";
import { handleSelectedOrganization } from "~/composable/useNavigation";
import { organizationStore } from "~/store";
import { IOrganization } from "~/types";

export default defineComponent({
  name: "Navigation",
  setup() {
    const {
      route,
      error,
      app: { router, $axios },
    } = useContext();
    const organizations: Ref<IOrganization[]> = ref([]);
    const selectedOrganization = computed({
      get: () => organizationStore.selectedOrganization,
      set: (value) => value && organizationStore.setSelectedOrganization(value),
    });

    const items = computed(() =>
      selectedOrganization.value
        ? [
            {
              icon: "mdi-lan",
              title: "Networks",
              to: "/networks",
            },
          ]
        : [],
    );

    useFetch(async () => {
      organizations.value = await list($axios, error);
    });

    const onSelectOrganization = (id: string) => {
      const organization = organizations.value.find(
        (organization) => organization.id === id,
      );

      organizationStore.setSelectedOrganization(organization);
      if (router) {
        handleSelectedOrganization(route, router);
      }
    };

    return {
      items,
      organizations,
      onSelectOrganization,
      selectedOrganization,
    };
  },
});
</script>
