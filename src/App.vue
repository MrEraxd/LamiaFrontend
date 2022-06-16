<script setup lang="ts">
  /// <reference types="vite-svg-loader" />

  import './assets/styles/main.pcss';
  import Map from './components/GoogleMaps.vue';
  import ControlPanel from './components/ControlPanel/ControlPanel.vue';
</script>

<template>
  <Map></Map>
  <ControlPanel></ControlPanel>
</template>

<style lang="postcss">
  #app {
    display: flex;
    flex-flow: column;
    overflow: auto;

    @media screen and (min-width: 1280px) {
      flex-flow: row;
    }
  }
</style>
