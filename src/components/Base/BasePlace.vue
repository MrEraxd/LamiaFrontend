<script setup lang="ts">
  import { IPlace } from '@plugins/GoogleMaps';
  import { reactive } from 'vue';
  import { GoogleMaps } from '@plugins/GoogleMaps';
  import IconMap from '@svg/icon-map.svg?component';
  import IconRemove from '@svg/icon-remove.svg?component';

  const googleMaps = reactive(GoogleMaps.getInstance());

  interface Props {
    place: IPlace;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="base-place">
    <div class="base-place__top-bar">
      <div class="base-place__name headline headline--6">
        {{ props.place.name }}
      </div>

      <div class="base-place__icons">
        <button
          class="base-place__btn"
          @click="googleMaps.centerMap(place.lat, place.lng)"
        >
          <IconMap class="base-place__icon base-place__icon--map"></IconMap>
        </button>

        <button
          class="base-place__btn"
          @click="googleMaps.removePlace(props.place)"
        >
          <IconRemove
            class="base-place__icon base-place__icon--remove"
          ></IconRemove>
        </button>
      </div>
    </div>

    <div class="base-place__address body-txt body-txt--2">
      {{ props.place.vicinity }}
    </div>

    <div v-if="props.place.isOpen != null" class="base-place__bottom-bar">
      <div
        class="base-place__is-open caption"
        :class="{
          'base-place__is-open--red': !props.place.isOpen,
          'base-place__is-open--green': props.place.isOpen,
        }"
      >
        Currently {{ props.place.isOpen ? 'Open' : 'Closed' }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
  .base-place {
    padding: 12px;
    transition: background-color 0.2s;

    &:hover {
      background-color: hsl(var(--color-cc-grey-60));
    }

    &__top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__btn {
      background-color: transparent;
      border: none;
      padding: 0;
      margin: 0;

      &:hover {
        cursor: pointer;
      }
    }

    &__is-open {
      &--red {
        color: hsl(var(--color-cc-red-50));
      }

      &--green {
        color: hsl(122, 39%, 49%);
      }
    }

    &__icons {
      display: flex;
      column-gap: 4px;
    }

    &__icon {
      width: 16px;
      height: 16px;

      &--map {
        &:hover path {
          stroke: hsl(var(--color-cc-blue-30));
        }

        path {
          stroke: hsl(var(--color-cc-blue-50));
          transition: stroke 0.2s;
        }
      }

      &--remove {
        &:hover path {
          fill: hsl(var(--color-cc-red-30));
        }

        path {
          fill: hsl(var(--color-cc-red-50));
          transition: fill 0.2s;
        }
      }
    }
  }
</style>
