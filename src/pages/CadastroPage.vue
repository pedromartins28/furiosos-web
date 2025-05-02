<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="handleSubmit">
      <q-card class="q-pa-md q-mx-auto" style="max-width: 500px;">
        <q-card-section>
          <div class="text-h6">
            {{ etapa === 1 ? 'Informações Básicas' : 'Anexar Documento de Identidade' }}
          </div>
        </q-card-section>

        <q-card-section v-if="etapa === 1">
          <q-input v-model="form.nome" label="Nome" required />
          <q-input v-model="form.cpf" label="CPF" required class="q-mt-md" />
          <q-input v-model="form.endereco" label="Endereço" class="q-mt-md" />
          <q-input v-model="form.data_nascimento" label="Data de Nascimento" type="date" class="q-mt-md" />
        </q-card-section>

        <q-card-section v-if="etapa === 2">
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

        <q-card-actions align="right">
          <q-btn v-if="etapa === 1" label="Próximo" color="primary" @click="etapa = 2" />
          <q-btn v-else label="Prosseguir" color="primary" type="submit" />
          <q-btn v-if="etapa === 2 && documentoErro" label="Enviar Documento Depois" flat @click="pularDocumento" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from 'boot/supabase'
import { useRouter } from 'vue-router'
import Tesseract from 'tesseract.js'
import { useQuasar } from 'quasar'

const router = useRouter()
const etapa = ref(1)

const form = ref({
  nome: '',
  cpf: '',
  endereco: '',
  data_nascimento: ''
})


const $q = useQuasar()
const documento = ref(null)
const documentoErro = ref('')
const documento_url = ref(null)

async function validarDocumentoComOCR(file, nome, cpf) {
  const result = await Tesseract.recognize(file, 'por', {
    logger: m => console.log(m)
  })

  const texto = result.data.text.toLowerCase()
  const nomeOk = texto.includes(nome.toLowerCase())
  const cpfOk = texto.includes(cpf.replace(/\D/g, ''))

  if (!nomeOk || !cpfOk) {
    throw new Error('Nome ou CPF não encontrados no documento.')
  }
}

async function uploadDocumento(userId) {
  if (!documento.value) return null

  const file = documento.value

  // Sanitiza nome do arquivo
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
      if ($q?.loading?.show) {
        $q.loading.show({ message: 'Processando documento com IA...' })
      }

      await validarDocumentoComOCR(documento.value, form.value.nome, form.value.cpf)
      documento_url.value = await uploadDocumento(userId)

      if ($q?.loading?.hide) {
        $q.loading.hide()
      }

    } catch (err) {
      if ($q?.loading?.hide) {
        $q.loading.hide()
      }
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
    router.push('/interesses')
  }
}

function pularDocumento() {
  documento.value = null
  documentoErro.value = ''
  handleSubmit()
}
</script>
