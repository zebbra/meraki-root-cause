import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Context } from "@nuxt/types/app";

export async function summary(
  $axios: NuxtAxiosInstance,
  nuxtError: Context["error"],
) {
  const url = "/organizations/summary";

  try {
    return await $axios.$get(url);
  } catch (err) {
    nuxtError(err);
    return [];
  }
}

export async function list(
  $axios: NuxtAxiosInstance,
  nuxtError: Context["error"],
) {
  const url = "/organizations";

  try {
    return await $axios.$get(url);
  } catch (err) {
    nuxtError(err);
    return [];
  }
}
