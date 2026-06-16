<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionList from '~/components/feature/CpSessionList.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'

const { data } = await useFetch('/api/session')
const route = useRoute()
const isSessionNotFound = ref(false)

const manualSelectedDay = ref<string | null>(null)
const days = computed(() => Object.keys(data?.value ?? {}).sort())

const selectedDay = computed({
  get: () => manualSelectedDay.value ?? days.value[0] ?? null,
  set: (value) => void (manualSelectedDay.value = value),
})

provide('setSessionNotFound', (value: boolean) => {
  isSessionNotFound.value = value
})

watch(() => route.params.id, (newId) => {
  if (!newId) {
    isSessionNotFound.value = false
  }
})

prerenderRoutes(
  Object.values(data.value ?? {})
    .flat()
    .map((s) => `/session/${s.id}`),
)

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  twitterTitle: () => t('meta.title'),
  twitterDescription: () => t('meta.description'),
})

definePageMeta({
  layout: 'session-table',
})
</script>

<template>
  <main>
    <NuxtPage />

    <ClientOnly>
      <template #fallback>
        <div
          v-if="!isSessionNotFound"
          class="flex flex-col-reverse sm:flex-col"
        >
          <!-- DaySelector -->
          <div class="px-6 pb-4 pt-3 flex w-screen justify-center">
            <div class="rounded-full bg-gray-200 h-12 w-1/2 animate-pulse" />
          </div>

          <!-- Session -->
          <div class="rounded-xl bg-gray-200 h-screen w-[var(--viewport-width,100vw)] animate-pulse" />
        </div>
      </template>

      <template v-if="selectedDay && !isSessionNotFound">
        <div class="flex flex-col-reverse sm:flex-col">
          <CpSessionDaySelector
            v-model="selectedDay"
            class="w-screen bottom-0 left-0 sticky z-10 sm:bottom-auto"
            :days="days"
          />

          <CpSessionList
            class="sm:hidden"
            :sessions="data?.[selectedDay] ?? []"
          />
          <CpSessionTable
            class="hidden sm:grid"
            :column-width="200"
            :day="selectedDay"
            :interval="5"
            :row-height="50"
            :sessions="data?.[selectedDay] ?? []"
            :time-range="['09:00', '17:30']"
          />
        </div>
      </template>
    </ClientOnly>
  </main>
</template>

<i18n lang="yaml">
  en:
    noSession: 'Not announced yet, stay tuned.'
    meta:
      title: 'Sessions'
      description: 'Browse the full session schedule for COSCUP 2026 x UbuCon Asia.'
  zh:
    noSession: '尚未公布，敬請期待。'
    meta:
      title: '議程'
      description: '瀏覽 COSCUP 2026 x UbuCon Asia 的完整議程時間表。'
</i18n>
