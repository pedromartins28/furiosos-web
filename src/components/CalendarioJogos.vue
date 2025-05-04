<!-- src/components/CalendarioJogos.vue -->
<template>
  <div class="q-mt-xl">
    <div class="text-h6 q-mb-md">Calendário de Jogos</div>

    <q-timeline color="black">
      <q-timeline-entry
        v-for="jogo in jogos"
        :key="jogo.data"
        :title="jogo.evento"
        :subtitle="jogo.data"
        icon="sports_esports"
      >
        {{ jogo.descricao }}
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
defineProps({
  jogos: {
    type: Array,
    required: true
  }
})
</script>
