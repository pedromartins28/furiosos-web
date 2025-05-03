<!-- src/pages/InstaLogin.vue -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <q-btn
      color="primary"
      label="Vincular conta do Instagram"
      @click="iniciarLoginInstagram"
    />
  </q-page>
</template>

<script setup>
const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID
const redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI

// Escopo completo corrigido
const escopo = [
  'instagram_business_basic',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
  'instagram_business_content_publish',
  'instagram_business_manage_insights' // ✅ corrigido: com "s"
].join(',')

function iniciarLoginInstagram() {
  console.log('clientId:', clientId)
  console.log('redirectUri:', redirectUri)

  const authUrl = `https://www.instagram.com/oauth/authorize` +
    `?enable_fb_login=0` +
    `&force_authentication=1` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(escopo)}`

  window.location.href = authUrl
}
</script>

