<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="bg-white text-black header-custom">
      <q-toolbar class="q-px-md q-gutter-md items-center" style="height: 100%; position: relative;">
        <div class="logo-container">
          <img src="/src/assets/logo-furia.svg" alt="Logo FURIA" height="30" />
        </div>
        <q-space />
        <q-btn
          flat
          round
          icon="logout"
          @click="logout"
          class="text-black"
          aria-label="Sair"
        />
      </q-toolbar>
    </q-header>

    <!-- MENU LATERAL -->
    <q-drawer
      show-if-above
      side="left"
      bordered
      class="bg-black drawer-custom shadow-2"
      :width="drawerExpanded ? 240 : 60"
      @mouseover="drawerExpanded = true"
      @mouseleave="drawerExpanded = false"
    >
    <div class="q-pa-md text-center" v-if="drawerExpanded">
        <q-avatar size="80px" class="q-mb-sm">
          <img :src="userAvatar" alt="User avatar" />
        </q-avatar>
        <div class="text-subtitle1 text-weight-bold">{{ userName }}</div>
        <div class="text-caption text-grey-8">Nível {{ userLevel }} - {{ userXP }} XP</div>
        <div class="text-caption text-deep-purple-14 q-mt-xs">
          <q-icon name="military_tech" class="q-mr-xs" /> {{ furiaPoints }} FURIA Points
        </div>
      </div>
      <q-list padding>
        <q-item clickable v-for="item in secoes" :key="item.label" @click="navegarOuExecutar(item)">
          <q-item-section avatar>
            <q-icon :name="item.icon" color="white" />
          </q-item-section>
          <q-item-section v-if="drawerExpanded">
            <span class="text-white">{{ item.label }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- CONTEÚDO PRINCIPAL -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'

const router = useRouter()
const drawerExpanded = ref(false)
const userName = ref('')
const userAvatar = ref('/src/assets/no_user.png')
const userLevel = 12
const userXP = 2450
const furiaPoints = 1340
const userId = ref(null)

function logout() {
  supabase.auth.signOut().then(() => {
    router.push('/auth')
  })
}

function navegarOuExecutar(item) {
  if (item.onClick) {
    item.onClick()
  } else if (item.route) {
    router.push(item.route)
  }
}

const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID
const redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI

const escopo = [
  'instagram_business_basic',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
  'instagram_business_content_publish',
  'instagram_business_manage_insights'
].join(',')

function iniciarLoginInstagram() {
  const authUrl = `https://api.instagram.com/oauth/authorize` +
    `?enable_fb_login=0` +
    `&force_authentication=1` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(escopo)}` +
    `&state=${userId.value}`

  window.location.href = authUrl
}

const secoes = [  
  { label: 'Home', icon: 'home', route: '/' },
  { label: 'Perfil', icon: 'person', route: '/' },
  { label: 'Missões', icon: 'flag', route: '/missoes' },
  { label: 'Loja', icon: 'shopping_cart', route: '/loja' },
  { label: 'Calendário', icon: 'event', route: '/' },
  { label: 'Configurações', icon: 'settings', route: '/' },
  { label: 'Ao Vivo', icon: 'live_tv', route: '/ao-vivo' },
  { label: 'Instagram', icon: 'fab fa-instagram', onClick: iniciarLoginInstagram }
]

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) return
  userId.value = user.id

  const { data: userProfile } = await supabase.from('users').select('nome, imagem_url').eq('id', user.id).single()
  if (userProfile?.nome) {
    userName.value = userProfile.nome.split(' ').slice(0, 2).join(' ')
  }
  if (userProfile?.imagem_url) userAvatar.value = userProfile.imagem_url
})
</script>

<style scoped>
.header-custom {
  height: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.drawer-custom {
  transition: width 0.2s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.4);
}
</style>
