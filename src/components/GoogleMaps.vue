<script setup lang="ts"></script>

<template>
  <div class="google-maps"></div>
</template>

<style lang="postcss">
  .google-maps {
    width: 100%;
    height: 80vh;
    flex-shrink: 0;

    @media screen and (min-width: 1280px) {
      height: 100%;
      flex-shrink: 1;
    }
  }
</style>
