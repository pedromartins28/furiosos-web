<!-- src/pages/AuthPage.vue -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-md" style="width: 400px;">
      <q-card-section>
        <div class="text-h6">Login / Cadastro</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="email" label="Email" type="email" required />
        <q-input v-model="password" label="Senha" type="password" required class="q-mt-md" />
      </q-card-section>

      <q-card-actions align="around">
        <q-btn label="Entrar" color="primary" @click="signIn" />
        <q-btn label="Cadastrar" color="secondary" @click="signUp" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'

const email = ref('')
const password = ref('')
const router = useRouter()

async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert('Erro ao entrar: ' + error.message)
    return
  }

  checkProfile()
}

async function signUp() {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert('Erro ao cadastrar: ' + error.message)
    return
  }

  checkProfile()
}

async function checkProfile() {
  const user = await supabase.auth.getUser()
  const userId = user.data.user.id

  const { data } = await supabase
    .from('users')
    .select('nome, interesses')
    .eq('id', userId)
    .single()

  if (!data?.nome) {
    router.push('/cadastro')
  } else if (!data?.interesses || data.interesses.length === 0) {
    router.push('/interesses')
  } else {
    router.push('/')
  }
}
</script>
