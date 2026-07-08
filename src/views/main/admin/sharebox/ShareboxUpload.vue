<template>
  <div>
    <!-- Error modal -->
    <error-window
      v-if="uploadSuccess === 'error'"
      :title="'Upload fehlgeschlagen'"
      :message="'Der Upload Ihrer Dateien konnte leider nicht abgeschlossen werden. Bitte stellen Sie eine stabile Internetverbindung sicher.'"
      :open="uploadSuccess === 'error'"
      @close="closeUploadModals"
    />
    <!-- Success modal -->
    <success-window
      v-if="uploadSuccess === 'success'"
      title="Upload erfolgreich"
      message="Ihre Dateien wurden erfolgreich hochgeladen"
      :open="uploadSuccess === 'success'"
      @close="closeUploadModals"
    />
  </div>
  <div class="min-h-full bg-app-bg px-4 pb-24 pt-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft">
        <p class="text-sm font-semibold text-blue-100">Sharebox</p>
        <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Datei hochladen</h1>
        <p class="mt-2 max-w-2xl text-sm text-blue-50">
          Unterlagen direkt dem richtigen Arbeitsbereich zuordnen.
        </p>
      </section>

      <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="border-b border-slate-100 pb-4">
            <h2 class="text-lg font-semibold text-slate-900">Upload vorbereiten</h2>
            <p class="mt-1 text-sm text-slate-500">
              Erst Zielordner wählen, dann Dateien in das Feld ziehen oder auswählen.
            </p>
          </div>

          <div class="mt-5 grid gap-5">
            <SimpleDropdown
              title="Ordnerauswahl"
              :properties="['Admin', 'Betreuer']"
              defaultSelected="Admin"
              @selection="setUploadFolder"
            />

            <div class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              <DragDropField
                :uploadIsLoading="isLoading"
                @file-updated="setDocument"
                @upload-tapped="uploadFiles"
              />
            </div>
          </div>
        </div>

        <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Ablagehinweis</h2>
          <div class="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <span class="font-semibold text-slate-900">Admin</span><br />
              Interne Unterlagen, Abrechnung und Verwaltung.
            </p>
            <p>
              <span class="font-semibold text-slate-900">Betreuer</span><br />
              Vorlagen und Informationen für Mitarbeitende.
            </p>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// component imports
import DragDropField from '@/components/UIComponents/Inputs/DragDropField.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'

export default {
  components: {
    DragDropField,
    SimpleDropdown,
    ErrorWindow,
    SuccessWindow
  },
  setup() {
    // initialize refs
    const isLoading = ref(false)
    const uploadFolder = ref('admin')
    const files = ref([])
    const uploadSuccess = ref('none')

    // Initialze Store
    const store = useStore()

    // router initialization
    const router = useRouter()

    // set documents to ref
    function setDocument(docs) {
      console.log(docs)
      files.value = docs
    }

    // set upload folder name according to selection
    function setUploadFolder(selection) {
      if (selection === 'Admin') {
        uploadFolder.value = 'admin'
      } else if (selection === 'Betreuer') {
        uploadFolder.value = 'guardian'
      }
    }

    // reset opening states of success/error modals
    function closeUploadModals() {
      router.push({ name: 'ShareboxOverview' })
    }

    // upload documents to AWS
    async function uploadFiles() {
      try {
        isLoading.value = true
        var docs = []

        // each docs needs to be decoded into base64 for transportation to s3 controller
        for (let doc = 0; doc < files.value.length; doc++) {
          // encode to base64
          const tempFile = await fileToBase64(files.value[doc])
          // remove base64 information --> otherwise will throw error when opening the file later
          const clearTempFile = tempFile.substr(tempFile.indexOf(',') + 1)
          // save file as base64, name and type
          docs.push({
            name: files.value[doc].name,
            type: files.value[doc].type,
            data: clearTempFile
          })
        }

        // upload using store function
        if (files.value.length > 0) {
          const r = await store.dispatch('uploadShareboxItem', {
            folder: uploadFolder.value,
            files: docs
          })
        }

        // set success state
        uploadSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set error state
        uploadSuccess.value = 'error'
      } finally {
        isLoading.value = false
      }
    }

    const fileToBase64 = async (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (e) => reject(e)
      })

    return {
      isLoading,
      uploadSuccess,
      setDocument,
      closeUploadModals,
      setUploadFolder,
      uploadFiles
    }
  }
}
</script>
