<template>
  <q-dialog
    v-model="mostrarDica"
    transition-show="slide-down"
    transition-hide="slide-up"
    persistent
    :dark="false"
  >
    <q-card class="bg-warning text-black q-pa-md">
      <q-card-section class="text-subtitle2">
        Verifique se o nome e o CPF estão visíveis e legíveis na imagem. <br>
        Tente enviar uma foto com melhor iluminação e nitidez.
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-page class="q-pa-md flex flex-center">
    <div class="column items-center">
      <img src="assets/logo.png" alt="Logo" class="q-mb-md logo-img" />

      <q-form @submit.prevent="handleSubmit">
        <q-card class="q-pa-md q-mx-auto" style="max-width: 500px;" bordered>
          <q-card-section>
            <div class="text-h6 text-center text-weight-bold">
              {{ etapa === 1 ? 'Informações Básicas' : 'Anexar Documento de Identidade' }}
            </div>
          </q-card-section>

          <transition name="fade" mode="out-in">
            <q-card-section v-if="etapa === 1" key="etapa1">
              <q-input v-model="form.nome" label="Nome" required />
              <q-input v-model="form.cpf" label="CPF" required class="q-mt-md" mask="###.###.###-##" fill-mask />
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
                :loading="carregandoDocumento"
              />
              <q-banner
                v-if="documentoErro"
                class="q-mt-md"
                rounded
                dense
                dark
                color="red-10"
                text-color="white"
                icon="warning"
              >
                Erro ao validar o documento.
              </q-banner>
            </q-card-section>
          </transition>

          <q-card-actions align="right">
            <q-btn
              v-if="etapa === 1"
              label="Próximo"
              color="black"
              text-color="white"
              @click="etapa = 2"
            />
            <q-btn v-if="etapa === 2" label="Voltar" flat @click="etapa = 1" />
            <q-btn
              v-if="etapa === 2"
              label="Prosseguir"
              color="black"
              text-color="white"
              type="submit"
            />
            <q-btn
              v-if="etapa === 2 && documentoErro"
              label="Enviar Documento Depois"
              flat
              @click="pularDocumento"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>

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
const mostrarDica = ref(false)

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
  formData.append('file', file, file.name)
  formData.append('nome', nome)
  formData.append('cpf', cpf)

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/analisar-documento.js`,
      formData
    )
    if (!data.valido) throw new Error(data.erro)
  } catch (error) {
    throw new Error(
      error.response?.data?.erro ||
        'Não foi possível validar o documento. Verifique se o nome e o CPF estão visíveis e legíveis na imagem. Tente enviar uma foto com melhor iluminação e nitidez.'
    )
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

  if (error) throw new Error('Erro ao subir documento: ' + error.message)

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
      mostrarDica.value = true
      setTimeout(() => {
        mostrarDica.value = false
      }, 5000)
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
.logo-img {
  height: 80px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
:deep(.q-dialog__inner) {
  top: 16px !important;
  right: 16px !important;
  left: auto !important;
  bottom: auto !important;
  position: fixed !important;
  justify-content: flex-end;
  align-items: flex-start;
  pointer-events: none; /* evita clique fora do card fechar */
}

:deep(.q-dialog__inner > *) {
  pointer-events: all; /* reativa o clique dentro do card */
}

</style>
