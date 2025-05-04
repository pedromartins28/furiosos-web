<!-- src/components/ValidarPerfilForm.vue -->
<template>
  <div>
    <q-input
      v-model="url"
      label="Cole aqui o link do seu perfil"
      filled
      class="q-mb-md"
    />

    <q-btn label="Validar" @click="validarPerfil" color="deep-purple" :loading="loading" />

    <div v-if="resultado !== null" class="q-mt-md">
      <q-banner
        v-if="resultado"
        class="bg-green-1 text-green-9"
        dense
      >
        ✅ O conteúdo do link é relevante aos seus interesses!
      </q-banner>

      <q-banner
        v-else
        class="bg-red-1 text-red-9"
        dense
      >
        ⚠️ O conteúdo parece não estar relacionado aos seus interesses.
      </q-banner>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

const props = defineProps({
  userId: String
})

const url = ref('')
const resultado = ref(null)
const loading = ref(false)
const interesses = ref([])

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

onMounted(async () => {
  if (props.userId) {
    const { data, error } = await supabase
      .from('users')
      .select('interesses')
      .eq('id', props.userId)
      .single()

    if (error) {
      console.error('Erro ao buscar interesses:', error.message)
    } else {
      interesses.value = data?.interesses || []
    }
  }
})

const validarPerfil = async () => {
  resultado.value = null
  loading.value = true

  try {
    const apiUrl = import.meta.env.VITE_API_URL
    const res = await axios.post(`${apiUrl}/api/validar-perfil.js`, {
      url: url.value,
      interesses: interesses.value
    })

    resultado.value = res.data.relevante
  } catch (err) {
    console.error('Erro ao validar:', err)
    alert('Ocorreu um erro ao validar o perfil. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>
