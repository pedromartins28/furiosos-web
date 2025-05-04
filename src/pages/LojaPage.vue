<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Loja FURIA</div>
    <div class="text-subtitle2 q-mb-lg text-grey-7">
      Você possui <strong>{{ furiaPoints }}</strong> FURIA Points
    </div>

    <LojaItemCard
      v-for="item in itens"
      :key="item.nome"
      :item="item"
      :furiaPoints="furiaPoints"
      @comprar="comprarItem"
    />

    <q-dialog v-model="compraConfirmada">
      <q-card>
        <q-card-section class="text-h6">Compra realizada com sucesso!</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import LojaItemCard from 'components/LojaItemCard.vue'

const furiaPoints = 1340
const compraConfirmada = ref(false)

const itens = [
  {
    nome: 'Camisa Exclusiva FURIA',
    descricao: 'Camiseta preta oficial da FURIA com edição limitada.',
    preco: 1000,
    imagem: 'https://via.placeholder.com/150?text=Camisa'
  },
  {
    nome: 'Adesivo para PC',
    descricao: 'Adesivo holográfico para colar no seu setup gamer.',
    preco: 300,
    imagem: 'https://via.placeholder.com/150?text=Adesivo'
  },
  {
    nome: 'Wallpaper Animado',
    descricao: 'Download exclusivo de wallpaper animado da FURIA.',
    preco: 150,
    imagem: 'https://via.placeholder.com/150?text=Wallpaper'
  }
]

function comprarItem(item) {
  furiaPoints.value -= item.preco
  compraConfirmada.value = true
}
</script>
