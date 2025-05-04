<template>
  <q-dialog v-model="dialogVisivel" persistent>
    <q-card class="bg-white text-black" style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 text-center text-weight-bold">Selecione seus interesses</div>
      </q-card-section>

      <q-card-section>
        <div v-for="(itens, categoria) in interessesPorCategoria" :key="categoria" class="q-mb-md">
          <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ categoria }}</div>
          <q-checkbox
            v-for="item in itens"
            :key="item"
            v-model="selecionados"
            :label="item"
            :val="item"
            class="q-ml-md"
            color="black"
            keep-color
          />
        </div>

        <q-banner
          v-if="erroMinimo"
          class="q-mt-md"
          rounded
          dense
          color="red-1"
          text-color="negative"
          icon="warning"
        >
          Selecione pelo menos 3 interesses para continuar.
        </q-banner>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn
          label="Salvar"
          color="black"
          text-color="white"
          @click="salvar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'

const dialogVisivel = ref(false)
const selecionados = ref([])
const interessesPorCategoria = ref({})
const erroMinimo = ref(false)

onMounted(async () => {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id

  if (!userId) return

  const { data: perfil } = await supabase
    .from('users')
    .select('interesses')
    .eq('id', userId)
    .single()

  if (perfil?.interesses?.length >= 3) return

  dialogVisivel.value = true

  const { data: opcoesData } = await supabase
    .from('interesses_opcoes')
    .select('descricao, categoria_id')

  const { data: categoriasData } = await supabase
    .from('categorias_interesse')
    .select('id, nome')

  const categoriasMap = {}
  categoriasData?.forEach(c => {
    categoriasMap[c.id] = c.nome
  })

  const agrupado = {}
  opcoesData?.forEach(item => {
    const nomeCategoria = categoriasMap[item.categoria_id] || 'Outros'
    if (!agrupado[nomeCategoria]) agrupado[nomeCategoria] = []
    agrupado[nomeCategoria].push(item.descricao)
  })

  interessesPorCategoria.value = agrupado

  if (perfil?.interesses) {
    selecionados.value = perfil.interesses
  }
})

async function salvar() {
  erroMinimo.value = false

  if (selecionados.value.length < 3) {
    erroMinimo.value = true
    return
  }

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id
  if (!userId) return

  await supabase.from('users').update({ interesses: selecionados.value }).eq('id', userId)
  dialogVisivel.value = false
}
</script>
