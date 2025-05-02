<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Furiosos Web</q-toolbar-title>
        <q-btn flat label="Sair" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { supabase } from 'boot/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  supabase.auth.signOut().then(() => {
    router.push('/auth')
  })
}
</script>

<style scoped>
</style>
