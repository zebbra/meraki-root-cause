<template>
  <v-card :loading="loading">
    <v-card-title>
      <span class="info--text">{{ name }} - Network Topology</span>
    </v-card-title>
    <v-card-text>
      <svg class="svg-network-topology"></svg>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, withContext, ref } from "nuxt-composition-api";
import { graphlib, render as Renderer } from "dagre-d3";
import * as d3 from "d3";

import { topology } from "~/composable/useNetworks";
import { organizationStore, networkStore } from "~/store";

export default defineComponent({
  name: "NetworkTopology",
  setup() {
    const loading = ref(true);

    withContext(async (context) => {
      const data = await topology(
        context,
        organizationStore.selectedOrganization!.id,
        networkStore.selectedNetwork!.id,
      );
      loading.value = false;

      const graph = graphlib.json.read(data).setGraph({
        ranksep: 100,
        marginx: 20,
        marginy: 20,
        align: "UL",
        rankdir: "TB",
      });

      graph.nodes().forEach((v) => {
        const node: any = graph.node(v);
        node.rx = node.ry = 5;

        let color = "success";

        switch (node.techStatus) {
          case "up":
            color = "success";
            break;
          case "degraded":
          case "alarming":
            color = "warning";
            break;
          case "down":
            color = "error";
            break;

          default:
            color = "grey";
            break;
        }

        node.labelType = "html";
        node.label = `
          <v-card>
            <v-card-title>
              <span class="info--text">${node.model} ${node.name}</span>
            </v-card-title>
            <v-card-subtitle>
              <div>
                <span>Tech Status: </span><span class="${color}--text">${node.techStatus}</span>
              </div>
            </v-card-subtitle>
            <v-card-text>
              <div>
              <span>Serial: </span><span>${node.serial}</span>
              </div>
            </v-card-text>
          </v-card>
        `;
      });

      const svg = d3.select(".svg-network-topology");
      const inner: any = svg.append("g");

      const zoom = d3.zoom().on("zoom", () => {
        inner.attr("transform", d3.event.transform);
      });

      // @ts-ignore
      svg.call(zoom);
      const renderer = new Renderer();
      renderer(inner, graph);
    });

    return {
      name: networkStore.selectedNetwork!.name,
      loading,
    };
  },
});
</script>

<style>
svg.svg-network-topology {
  width: 100%;
  height: 100%;
  overflow: scroll;
  min-height: 900px;
}

.edgePath path {
  stroke: #1eb980;
  fill: #1eb980;
  stroke-width: 2px;
}

.node rect,
.node circle,
.node ellipse,
.node polygon {
  fill: rgb(51, 51, 61);
}
</style>
