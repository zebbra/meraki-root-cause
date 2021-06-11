import { Context } from "@nuxt/types";
import { NuxtAxiosInstance } from "@nuxtjs/axios";

export async function list(
  $axios: NuxtAxiosInstance,
  nuxtError: Context["error"],
  orgId: string,
) {
  const url = `/organizations/${orgId}/networks`;

  try {
    return await $axios.$get(url);
  } catch (err) {
    nuxtError(err);
    return [];
  }
}

export async function summary(
  $axios: NuxtAxiosInstance,
  nuxtError: Context["error"],
  orgId: string,
) {
  const url = `/organizations/${orgId}/networks/summary`;

  try {
    return await $axios.$get(url);
  } catch (err) {
    nuxtError(err);
    return [];
  }
}

export function topology(
  $axios: NuxtAxiosInstance,
  nuxtError: Context["error"],
  orgId: string,
  netId: string,
) {
  const url = `/organizations/${orgId}/networks/${netId}/topology`;

  try {
    return $axios.$get(url);
  } catch (err) {
    nuxtError(err);
    return {};
  }
}
