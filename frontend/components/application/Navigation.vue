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
    <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
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
  withContext,
  Ref,
  ref,
  computed,
} from "nuxt-composition-api";
import { list } from "~/composable/useOrganizations";
import { handleSelectedOrganization } from "~/composable/useNavigation";
import { organizationStore } from "~/store";
import { IOrganization } from "~/types";

export default defineComponent({
  name: "Navigation",
  setup(_, context) {
    const organizations: Ref<IOrganization[]> = ref([]);
    const selectedOrganization = computed(
      () => organizationStore.selectedOrganization,
    );

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

    withContext(async (context) => {
      organizations.value = await list<IOrganization[]>(context);
    });

    const onSelectOrganization = (id: string) => {
      const organization = organizations.value.find(
        (organization) => organization.id === id,
      );

      organizationStore.setSelectedOrganization(organization);
      handleSelectedOrganization(context);
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
