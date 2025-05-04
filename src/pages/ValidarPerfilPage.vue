<!-- src/pages/ValidarPerfilPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Validar perfil de e-sports</div>

    <div v-if="userId">
      <ValidarPerfilForm :user-id="userId" />
    </div>

    <q-spinner v-else class="q-mt-md" color="primary" size="md" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ValidarPerfilForm from 'src/components/ValidarPerfilForm.vue'
import { supabase } from 'boot/supabase'

const userId = ref(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (user) {
    userId.value = user.id
  }
})
</script>
