<template>
  <div>
    <div class="text-h5 q-mb-md">Missões da Semana</div>

    <q-card v-for="missao in missoes" :key="missao.titulo" class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <div>
            <div class="text-subtitle1">{{ missao.titulo }}</div>
            <div class="text-caption text-grey">{{ missao.descricao }}</div>
          </div>
          <q-chip color="deep-purple-14" text-color="white">
            +{{ missao.pontos }} pts
          </q-chip>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          outline
          color="primary"
          :label="missao.completa ? 'Concluída' : 'Fazer Agora'"
          :disable="missao.completa"
          @click="realizarMissao(missao)"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const missoes = ref([ 
  { titulo: 'Responder uma pesquisa rápida', descricao: 'Responda um formulário em 5 minutos.', pontos: 50, completa: false },
  { titulo: 'Curtir 3 posts no Instagram', descricao: 'Interaja com conteúdos da FURIA.', pontos: 50, completa: false },
  { titulo: 'Assistir a uma live por 40 minutos', descricao: 'Ficar logado na aba “Ao Vivo”.', pontos: 100, completa: false },
  { titulo: 'Ler 2 notícias da semana', descricao: 'Clique e leia as notícias.', pontos: 40, completa: false },
  { titulo: 'Convidar um amigo', descricao: 'Compartilhe seu link de convite.', pontos: 150, completa: false }
])

function realizarMissao(missao) {
  // Aqui você pode marcar como completa e, futuramente, enviar para o Supabase
  missao.completa = true
  // Exemplo: somar pontos, salvar progresso, etc.
}
</script>
