
<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="handleSubmit">
      <q-card class="q-pa-md q-mx-auto" style="max-width: 500px;" bordered>
        <q-inner-loading :showing="carregandoDocumento" label="Analisando documento..." />

        <q-card-section>
          <div class="text-h6">
            {{ etapa === 1 ? 'Informações Básicas' : 'Anexar Documento de Identidade' }}
          </div>
        </q-card-section>

        <transition name="fade" mode="out-in">
          <q-card-section v-if="etapa === 1" key="etapa1">
            <q-input v-model="form.nome" label="Nome" required />
            <q-input v-model="form.cpf" label="CPF" required class="q-mt-md" mask="###.###.###-##" fill-mask/>
            <q-input v-model="form.endereco" label="Endereço" class="q-mt-md" />
            <q-input v-model="form.data_nascimento" label="Data de Nascimento" type="date" class="q-mt-md" />
          </q-card-section>

          <q-card-section v-else key="etapa2">
            <q-file
              v-model="documento"
              label="Documento de Identidade (JPG/PNG)"
              class="q-mt-md"
              filled
              accept=".jpg,.jpeg,.png"
            />
            <q-banner v-if="documentoErro" class="q-mt-sm bg-red-1 text-red" dense rounded>
              {{ documentoErro }}
            </q-banner>
          </q-card-section>
        </transition>

        <q-card-actions align="right">
          <q-btn v-if="etapa === 1" label="Próximo" color="primary" @click="etapa = 2" />

          <q-btn v-if="etapa === 2" label="Voltar" flat @click="etapa = 1" />

          <q-btn v-if="etapa === 2" label="Prosseguir" color="primary" type="submit" />

          <q-btn
            v-if="etapa === 2 && documentoErro"
            label="Enviar Documento Depois"
            flat
            @click="pularDocumento"
          />
        </q-card-actions>
      </q-card>
    </q-form>

    <q-dialog v-model="documentoAprovado" persistent transition-show="fade" transition-hide="fade">
      <q-card class="bg-green text-white q-pa-lg">
        <q-card-section class="row items-center q-gutter-sm">
          <q-icon name="check_circle" size="40px" />
          <div class="text-h6">Documento aprovado com sucesso!</div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from 'boot/supabase'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const documentoAprovado = ref(false)
const etapa = ref(1)
const carregandoDocumento = ref(false)

const form = ref({
  nome: '',
  cpf: '',
  endereco: '',
  data_nascimento: ''
})

const documento = ref(null)
const documentoErro = ref('')
const documento_url = ref(null)

async function validarDocumentoComOCR(file, nome, cpf) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('nome', nome)
  formData.append('cpf', cpf)

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/analisar-documento`,
      formData,
      {
        headers: {
         
        }
      }
    )

    if (!data.valido) {
      throw new Error(data.erro)
    }
  } catch (error) {
    throw new Error(error.response?.data?.erro || 'Erro ao validar documento.')
  }
}

async function uploadDocumento(userId) {
  if (!documento.value) return null

  const file = documento.value

  const sanitizedFileName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')

  const { data, error } = await supabase.storage
    .from('documentos')
    .upload(`documentos/${userId}/${sanitizedFileName}`, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    throw new Error('Erro ao subir documento: ' + error.message)
  }

  const { data: urlData } = supabase.storage
    .from('documentos')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

async function handleSubmit() {
  documentoErro.value = ''

  const { data: userData, error: userError } = await supabase.auth.getUser()
  const user = userData?.user

  if (userError || !user) {
    alert('Usuário não autenticado.')
    return
  }

  const userId = user.id
  const email = user.email

  if (documento.value) {
    try {
      carregandoDocumento.value = true
      await validarDocumentoComOCR(documento.value, form.value.nome, form.value.cpf)
      documento_url.value = await uploadDocumento(userId)
      carregandoDocumento.value = false
    } catch (err) {
      carregandoDocumento.value = false
      documentoErro.value = err.message
      return
    }
  }

  const { error } = await supabase.from('users').upsert({
    id: userId,
    email,
    nome: form.value.nome,
    cpf: form.value.cpf,
    endereco: form.value.endereco,
    data_nascimento: form.value.data_nascimento,
    documento_url: documento_url.value
  })

  if (error) {
    alert('Erro ao salvar dados: ' + error.message)
  } else {
    documentoAprovado.value = true
      setTimeout(() => {
        router.push('/')
      }, 1800)
  }
}

function pularDocumento() {
  documento.value = null
  documentoErro.value = ''
  handleSubmit()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>