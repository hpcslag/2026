import { useRoute } from 'vue-router'

export function useRealtime() {
  const route = useRoute()

  let interval: ReturnType<typeof setInterval> | null = null

  const time = ref(new Date())

  onMounted(() => {
    const isTest = !!route.query.test

    if (isTest) {
      const testDate = route.query.test as string

      if (!Number.isNaN(Date.parse(testDate))) {
        time.value = new Date(testDate)
      } else {
        time.value = new Date('2026-08-09T09:00:00')
      }
    }

    interval = isTest
      ? setInterval(() => {
          time.value = new Date(time.value.getTime() + 10_000)
        }, 200)
      : setInterval(() => {
          time.value = new Date()
        }, 1000)
  })

  onBeforeUnmount(() => {
    if (interval) {
      clearInterval(interval)
    }
  })

  return { time }
}
