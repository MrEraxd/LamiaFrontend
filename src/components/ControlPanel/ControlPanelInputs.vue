<script setup lang="ts">
  import { useControlPanelStore } from '@store/ControlPanelStore';
  import BaseInput from '@base/BaseInput.vue';

  const ControlPanelStore = useControlPanelStore();
</script>

<template>
  <div class="control-panel-inputs">
    <BaseInput
      input-label="NAME"
      :callback="ControlPanelStore.setCurrentName"
      :default-value="ControlPanelStore.name"
    ></BaseInput>

    <BaseInput
      input-label="ADDRESS"
      :callback="ControlPanelStore.setCurrentVicinity"
      :default-value="ControlPanelStore.vicinity"
    ></BaseInput>

    <BaseInput
      input-label="LAT"
      :callback="ControlPanelStore.setCurrentLatitude"
      :default-value="ControlPanelStore.latitude.toString()"
    ></BaseInput>

    <BaseInput
      input-label="LNG"
      :callback="ControlPanelStore.setCurrentLongitude"
      :default-value="ControlPanelStore.longitude.toString()"
    ></BaseInput>
  </div>
</template>

<style lang="postcss">
  .control-panel-inputs {
    display: grid;
    gap: 16px;

    @media screen and (min-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
