<script setup lang="ts">
  import { GoogleMaps } from '@plugins/GoogleMaps';
  import { useControlPanelStore } from '@store/ControlPanelStore';
  import { reactive, ref } from 'vue';
  import BaseButton from '@base/BaseButton.vue';
  import ControlPanelPlaces from './ControlPanelPlaces.vue';
  import ControlPanelInputs from './ControlPanelInputs.vue';

  const googleMaps = reactive(GoogleMaps.getInstance());
  const ControlPanelStore = useControlPanelStore();
  const feedback = reactive({
    isError: false,
    message: '',
  });

  const addPlace = () => {
    let exceptionThrown = false;

    try {
      googleMaps.addPlace({
        marker: null,
        id: null,
        name: ControlPanelStore.name,
        lat: ControlPanelStore.latitude,
        lng: ControlPanelStore.longitude,
        isOpen: null,
        vicinity: ControlPanelStore.vicinity,
      });
    } catch (err: any) {
      feedback.isError = true;
      feedback.message = err.message;
      exceptionThrown = true;
    }

    if (!exceptionThrown) {
      feedback.isError = false;
      feedback.message = 'Place added';
    }

    setTimeout(() => {
      feedback.isError = false;
      feedback.message = '';
    }, 3000);
  };
</script>

<template>
  <div class="control-panel">
    <div class="control-panel__top-bar">
      <div class="control-panel__title">Lamia Frotend Map</div>
    </div>

    <div class="control-panel__content">
      <ControlPanelInputs></ControlPanelInputs>

      <div
        v-if="feedback.message != ''"
        class="control-panel__feedback"
        :class="feedback.isError ? 'control-panel__feedback--error' : ''"
      >
        {{ feedback.message }}
      </div>

      <div class="control-panel__add-place">
        <BaseButton button-name="ADD MARKER" @click="addPlace()"></BaseButton>

        <BaseButton
          button-name="REMOVE ALL PLACES"
          @click="googleMaps.removeAllPlaces()"
        ></BaseButton>

        <BaseButton
          button-name="LOAD NEARBY PLACES"
          @click="googleMaps.loadNearbyPlaces()"
        ></BaseButton>
      </div>

      <div class="control-panel__places-wrapper">
        <ControlPanelPlaces></ControlPanelPlaces>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
  .control-panel {
    padding: 32px;
    row-gap: 24px;
    display: flex;
    flex-direction: column;
    color: hsl(var(--color-cc-white));
    background-color: hsl(var(--color-cc-grey-70));

    @media screen and (min-width: 1280px) {
      border-left: 1px solid hsl(var(--color-cc-white));
    }

    &__top-bar {
      padding-bottom: 24px;
      display: flex;
      justify-content: center;
    }

    &__add-place {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      row-gap: 16px;
      column-gap: 12px;
    }

    &__places-wrapper {
      overflow: auto;
      flex: 1;
      max-height: 500px;
      padding-right: 16px;
    }

    &__feedback {
      padding: 8px;

      background-color: hsl(122, 39%, 49%);

      &--error {
        background-color: hsl(var(--color-cc-red-50));
      }
    }

    &__content {
      display: grid;
      align-items: start;
      gap: 24px;

      @media screen and (min-width: 1280px) {
        display: flex;
        flex-flow: column;
        align-items: unset;
      }
    }
  }
</style>
