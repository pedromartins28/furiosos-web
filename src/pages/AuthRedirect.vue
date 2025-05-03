<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'

const router = useRouter()

onMounted(async () => {
  const { error } = await supabase.auth.getSession()

  // Aguarda sessão ativa antes de redirecionar
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    router.push('/cadastro')
  } else {
    console.error(error)
    router.push('/') // fallback
  }
})
</script>

<template>
  <div class="q-pa-md">Verificando login...</div>
</template>
