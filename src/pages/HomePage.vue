<!-- src/pages/HomePage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h5">Bem-vindo à Home</div>
    <p>Conteúdo da página inicial vai aqui...</p>
    <InstagramLoginButton />
    <InteressesDialog />
  </q-page>
</template>

<script setup>
import InteressesDialog from 'components/InteressesDialog.vue'
import InstagramLoginButton from 'components/InstagramLoginButton.vue'
</script>
