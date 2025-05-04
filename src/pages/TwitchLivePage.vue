<!-- src/pages/TwitchLivePage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Transmissão Ao Vivo - FURIA</div>
    <div class="q-mb-md">
      <iframe
        :src="twitchSrc"
        height="480"
        width="100%"
        frameborder="0"
        allowfullscreen
        scrolling="no"
        class="rounded-borders"
      ></iframe>
    </div>
  </q-page>
</template>

<script setup>
const twitchSrc = `https://player.twitch.tv/?channel=furia&parent=${import.meta.env.VITE_TWITCH_PARENT}`
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
