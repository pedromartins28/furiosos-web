<template>
  <q-page class="q-pa-md">
    <NoticiasFeed :noticias="noticias" />
    <CalendarioJogos :jogos="jogos" />
    <InteressesDialog />
  </q-page>
</template>

<script setup>
import NoticiasFeed from 'components/NoticiasFeed.vue'
import CalendarioJogos from 'components/CalendarioJogos.vue'
import InteressesDialog from 'components/InteressesDialog.vue'

const noticias = [
  {
    titulo: 'FURIA vence campeonato internacional',
    data: '03/05/2025',
    resumo: 'A equipe dominou as finais com uma performance impecável.'
  },
  {
    titulo: 'Nova lineup da FURIA é anunciada',
    data: '01/05/2025',
    resumo: 'Conheça os novos jogadores que chegam para reforçar o time.'
  }
]

const jogos = [
  {
    evento: 'FURIA x Liquid',
    data: '10/05/2025',
    descricao: 'Jogo válido pelo Major de CS2 - Quartas de final.'
  },
  {
    evento: 'FURIA x NAVI',
    data: '15/05/2025',
    descricao: 'Amistoso internacional transmitido ao vivo.'
  }
]
</script>
