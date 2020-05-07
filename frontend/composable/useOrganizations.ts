import { Context } from "@nuxt/types";
import { NuxtApp } from "@nuxt/types/app";

export async function summary<Data = unknown>(
  context: Context | NuxtApp,
): Promise<Data> {
  const url = "/organizations/summary";

  try {
    return await context.$axios.$get(url);
  } catch (error) {
    context.error(error);
    return <any>[];
  }
}

export async function list<Data = unknown>(
  context: Context | NuxtApp,
): Promise<Data> {
  const url = "/organizations";

  try {
    return await context.$axios.$get(url);
  } catch (error) {
    context.error(error);
    return <any>[];
  }
}
