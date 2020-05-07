import { Context } from "@nuxt/types";
import { NuxtApp } from "@nuxt/types/app";

export async function list<Data = unknown>(
  context: Context | NuxtApp,
  orgId: string,
): Promise<Data> {
  const url = `/organizations/${orgId}/networks`;

  try {
    return await context.$axios.$get(url);
  } catch (error) {
    context.error(error);
    return <any>[];
  }
}

export async function summary<Data = unknown>(
  context: Context | NuxtApp,
  orgId: string,
): Promise<Data> {
  const url = `/organizations/${orgId}/networks/summary`;

  try {
    return await context.$axios.$get(url);
  } catch (error) {
    context.error(error);
    return <any>[];
  }
}

export function topology<Data = unknown>(
  context: Context | NuxtApp,
  orgId: string,
  netId: string,
) {
  const url = `/organizations/${orgId}/networks/${netId}/topology`;

  try {
    return context.$axios.$get(url);
  } catch (error) {
    context.error(error);
    return <Data>{};
  }
}
