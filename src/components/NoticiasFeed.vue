<!-- src/components/NoticiasFeed.vue -->
<template>
  <div>
    <div class="text-h5 q-mb-md">Notícias da FURIA</div>

    <q-card v-for="noticia in noticias" :key="noticia.titulo" class="q-mb-md">
      <q-card-section>
        <div class="text-h6">{{ noticia.titulo }}</div>
        <div class="text-subtitle2 text-grey-7">{{ noticia.data }}</div>
        <p class="q-mt-sm">{{ noticia.resumo }}</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  noticias: {
    type: Array,
    required: true
  }
})
</script>
