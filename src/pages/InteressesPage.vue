<!-- src/pages/InteressesPage.vue -->
<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mx-auto" style="max-width: 500px;">
      <q-card-section>
        <div class="text-h6">Quais seus interesses em e-sports?</div>
      </q-card-section>

      <q-card-section>
        <q-select
          filled
          v-model="interesses"
          :options="opcoes"
          label="Interesses"
          use-chips
          multiple
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Salvar" color="primary" @click="salvarInteresses" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from 'boot/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const interesses = ref([])
const opcoes = [
  'CS:GO', 'Valorant', 'League of Legends', 'Fortnite', 'FIFA',
  'FURIA', 'CBLOL', 'Streams', 'Eventos presenciais', 'Conteúdo técnico'
]

async function salvarInteresses() {
  const user = await supabase.auth.getUser()
  const userId = user.data.user.id

  const { error } = await supabase
    .from('users')
    .update({ interesses: interesses.value })
    .eq('id', userId)

  if (error) {
    alert('Erro ao salvar interesses: ' + error.message)
  } else {
    router.push('/') // ou para o dashboard
  }
}
</script>
