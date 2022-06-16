<script setup lang="ts">
  import { GoogleMaps } from '@plugins/GoogleMaps';
  import { onMounted, reactive } from 'vue';
  import BasePlace from '@base/BasePlace.vue';

  const googleMaps = reactive(GoogleMaps.getInstance());

  // Hacky workaround for list not displaying, I know it's bad and I should't do it
  onMounted(() => {
    setTimeout(() => {
      googleMaps.reloadPlaces();
    }, 1000);
  });
</script>

<template>
  <div class="control-panel__places places">
    <BasePlace
      v-for="(place, index) in googleMaps.places"
      :key="'marker__' + index"
      :place="place"
    >
    </BasePlace>
  </div>
</template>

<style lang="postcss">
  .places {
    display: flex;
    flex-flow: column;
  }
</style>
