<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <application-navigation />
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <main>
      <v-main>
        <nuxt />
      </v-main>
    </main>
    <v-footer :fixed="fixed" app>
      <span>zebbra AG &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import ApplicationNavigation from "~/components/application/Navigation.vue";

export default defineComponent({
  name: "Default",
  components: { ApplicationNavigation },
  setup() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      miniVariant: false,
      title: "Meraki Root-Cause Detection",
    };
  },
});
</script>
