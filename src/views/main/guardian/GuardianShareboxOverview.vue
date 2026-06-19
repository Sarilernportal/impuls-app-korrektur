<template>
  <div class="mx-auto max-w-4xl px-4 py-4 sm:px-6">
    <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p class="text-sm font-medium text-impuls-blue">Dateien</p>
      <h2 class="mt-1 text-2xl font-bold text-slate-900">Sharebox</h2>
      <p class="mt-2 text-sm text-slate-600">
        Hier finden Sie freigegebene Dokumente und Unterlagen für Ihre Arbeit.
      </p>
    </section>

    <section class="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div
        v-if="isLoading"
        class="flex w-full justify-center p-6"
      >
        <LoadingSpinner size="h-12 w-12" />
      </div>
      <div
        v-else-if="files.length <= 0"
        class="rounded-lg bg-slate-50 p-6 text-center"
      >
        <ArchiveBoxIcon
          class="mx-auto h-10 w-10 text-slate-400"
          aria-hidden="true"
        />
        <h3 class="mt-3 font-semibold text-slate-900">Keine Dateien vorhanden</h3>
        <p class="mt-1 text-sm text-slate-600">
          Sobald die Verwaltung Dokumente bereitstellt, erscheinen sie hier.
        </p>
      </div>
      <ShareboxTiles
        v-else
        :files="files"
        @download-file="downloadFileTapped"
      />
    </section>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { ArchiveBoxIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import ShareboxTiles from '@/components/UIComponents/Tiles/ShareboxTiles.vue'

export default {
  name: 'ShareboxOverview',
  components: {
    ArchiveBoxIcon,
    LoadingSpinner,
    ShareboxTiles
  },
  setup() {
    const files = ref([])
    const isLoading = ref(false)
    const store = useStore()

    async function getFiles() {
      try {
        isLoading.value = true

        const documentResponse = await store.dispatch('listGuardianSharebox')
        files.value = documentResponse
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    async function downloadFileTapped(file) {
      try {
        const shareboxItem = await store.dispatch('downloadFromSharebox', {
          key: file.key
        })

        var link = document.createElement('a')
        link.href = shareboxItem
        link.download = file.name
        link.click()
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(async () => {
      await getFiles()
    })

    return {
      files,
      isLoading,
      downloadFileTapped
    }
  }
}
</script>
