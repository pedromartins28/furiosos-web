<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="column items-center">
      <img src="assets/logo.png" alt="Logo" class="q-mb-md logo-img" />

      <q-card class="q-pa-md" style="width: 400px;">
        <q-card-section>
          <div class="text-h6 text-center text-weight-bold">Login / Cadastro</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="email" label="Email" type="email" required />
          <q-input v-model="password" label="Senha" type="password" required class="q-mt-md" />
        </q-card-section>

        <q-card-actions vertical align="center">
          <q-btn
            label="Entrar"
            icon="login"
            color="black"
            text-color="white"
            @click="signIn"
            class="full-width q-mb-sm"
          />
          <q-btn
            label="Cadastrar"
            icon="person_add"
            color="grey-8"
            text-color="white"
            @click="signUp"
            class="full-width"
          />
        </q-card-actions>
      </q-card>
    </div>
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
    password: password.value,
    options: {
      emailRedirectTo: 'https://furiosos-web.vercel.app/cadastro'
    }
  })

  if (error) {
    alert('Erro ao cadastrar: ' + error.message)
    return
  }

  alert('Cadastro realizado! Verifique seu e-mail para confirmar sua conta.')
}

async function checkProfile() {
  const { data: userData, error } = await supabase.auth.getUser()

  if (error || !userData?.user) {
    alert('Usuário não autenticado. Faça login para continuar.')
    router.push('/auth')
    return
  }

  const userId = userData.user.id

  const { error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (selectError && selectError.code === 'PGRST116') {
    await supabase.from('users').insert({
      id: userId,
      email: userData.user.email
    })
  }

  const { data: userInfo } = await supabase
    .from('users')
    .select('nome, interesses')
    .eq('id', userId)
    .single()

  if (!userInfo?.nome) {
    router.push('/cadastro')
  } else if (!userInfo?.interesses || userInfo.interesses.length === 0) {
    router.push('/')
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.logo-img {
  height: 80px;
}
</style>
