<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">{{ pageNotFound }}</h1>
    <h1 v-else>{{ otherError }}</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";

export default defineComponent({
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup({ error }) {
    const otherError =
      error.response && Array.isArray(error.response?.data)
        ? JSON.stringify(error.response.data)
        : (error.response && error.response.data?.message) ||
          "An error occurred";

    return {
      pageNotFound: "404 Not Found",
      otherError,
    };
  },
  head(this: any): any {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
});
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
