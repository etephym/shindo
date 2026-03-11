<script setup lang="ts">
import { computed, ref } from 'vue'

type Profile = 'pvp' | 'war' | 'farm'

const profile = ref<Profile>('pvp')

const profileMeta = computed(() => {
  if (profile.value === 'war') {
    return {
      title: 'War / Teamfight',
      focus: 'AOE-контроль + выживаемость + safe engage',
      checks: ['Есть АОЕ-стан', 'Есть эскейп', 'Есть добив/pressure'],
    }
  }

  if (profile.value === 'farm') {
    return {
      title: 'Farm / Boss Loop',
      focus: 'Стабильный дпс + безопасный цикл + быстрое восстановление ресурса',
      checks: ['Есть burst по боссу', 'Есть мобильность', 'Есть sustain/chi'],
    }
  }

  return {
    title: 'PvP / Duel',
    focus: 'Pressure по блоку + антидодж + комфортный тайминг комбо',
    checks: ['Есть блокбрейкер', 'Есть антидодж', 'Есть end-combo reset'],
  }
})

const templateText = computed(() => {
  return [
    `Профиль: ${profileMeta.value.title}`,
    `Фокус: ${profileMeta.value.focus}`,
    '',
    'Core set:',
    '- Slot 1: [инициатор / opener]',
    '- Slot 2: [контроль / anti-dodge]',
    '- Slot 3: [урон / confirm]',
    '- Slot 4: [эскейп / reset]',
    '',
    'Проверка:',
    ...profileMeta.value.checks.map((item) => `- [ ] ${item}`),
  ].join('\n')
})

async function copyTemplate(): Promise<void> {
  if (!navigator?.clipboard) return
  await navigator.clipboard.writeText(templateText.value)
}
</script>

<template>
  <section class="build-board">
    <header class="build-board__header">
      <h3>Interactive Build Template</h3>
      <p>Выбери режим и скопируй заготовку под свой билд.</p>
    </header>

    <div class="build-board__switcher">
      <button :class="{ active: profile === 'pvp' }" @click="profile = 'pvp'">PvP</button>
      <button :class="{ active: profile === 'war' }" @click="profile = 'war'">War</button>
      <button :class="{ active: profile === 'farm' }" @click="profile = 'farm'">Farm</button>
    </div>

    <div class="build-board__content">
      <p><strong>Режим:</strong> {{ profileMeta.title }}</p>
      <p><strong>Фокус:</strong> {{ profileMeta.focus }}</p>
      <ul>
        <li v-for="item in profileMeta.checks" :key="item">{{ item }}</li>
      </ul>
      <button class="copy" @click="copyTemplate">Скопировать шаблон</button>
    </div>
  </section>
</template>

<style scoped>
.build-board {
  margin: 16px 0 24px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: linear-gradient(180deg, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent 40%), var(--vp-c-bg-soft);
}

.build-board__header h3 {
  margin: 0;
}

.build-board__header p {
  margin: 6px 0 12px;
  color: var(--vp-c-text-2);
}

.build-board__switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.build-board__switcher button,
.copy {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.build-board__switcher button.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.build-board__content {
  margin-top: 12px;
}
</style>
