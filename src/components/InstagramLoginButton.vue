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
import { supabase } from 'boot/supabase'

const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID
const redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI

const { data } = await supabase.auth.getUser()
const userId = data?.user?.id

const escopo = [
  'instagram_business_basic',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
  'instagram_business_content_publish',
  'instagram_business_manage_insights' 
].join(',')

function iniciarLoginInstagram() {

  const authUrl = `https://api.instagram.com/oauth/authorize` +
    `?enable_fb_login=0` +
    `&force_authentication=1` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(escopo)}` +
    `&state=${userId}`

  window.location.href = authUrl
}
</script>

