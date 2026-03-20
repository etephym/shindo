<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRouter } from 'vitepress'

const { site, lang } = useData()
const router = useRouter()
const isRu   = computed(() => lang.value === 'ru-RU')

function goHome(): void {
  router.go(site.value.base)
}
</script>

<template>
  <div class="NotFound">
    <p class="code">404</p>
    <h1 class="title">{{ isRu ? '🐸 Страница не найдена' : '🐸 Page not found' }}</h1>
    <div class="divider" />
    <blockquote class="quote">
      {{
        isRu
          ? 'Похоже, эта страница потерялась в тумане войны. Жаба тоже не знает где она.'
          : "Looks like this page got lost in the fog of war. The frog doesn't know where it is either."
      }}
    </blockquote>
    <div class="action">
      <a class="link" @click.prevent="goHome" href="#">
        {{ isRu ? '← Вернуться на главную' : '← Back to home' }}
      </a>
    </div>
  </div>
</template>
