<template>
  <q-card class="q-mb-md" bordered>
    <q-card-section horizontal>
      <q-img :src="item.imagem" style="width: 150px;" />

      <q-card-section class="q-ml-md">
        <div class="text-h6">{{ item.nome }}</div>
        <div class="text-caption text-grey-7 q-mt-xs">{{ item.descricao }}</div>
        <div class="text-subtitle2 q-mt-md text-deep-purple-14">
          <q-icon name="military_tech" class="q-mr-xs" /> {{ item.preco }} FP
        </div>
        <q-btn
          label="Comprar"
          color="deep-purple"
          text-color="white"
          class="q-mt-sm"
          :disable="furiaPoints < item.preco"
          @click="emitirCompra"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  item: Object,
  furiaPoints: Number
})

const emit = defineEmits(['comprar'])

function emitirCompra() {
  emit('comprar', props.item)
}
</script>
