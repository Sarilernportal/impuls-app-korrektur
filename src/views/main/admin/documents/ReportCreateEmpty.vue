<template>
  <div>
    <!-- Error modal -->
    <error-window
      v-if="createSuccess === 'error'"
      :title="'Dokumentation konnte nicht erstellt werden'"
      :message="'Während der Erstellung der Dokumentation ist ein Fehler aufgetreten.'"
      :open="createSuccess === 'error'"
      @close="closeErrorModal"
    />
    <!-- Success modal -->
    <success-window
      v-if="createSuccess === 'success'"
      title="Dokumentation erstellt"
      message="Die Dokumentation wurde erfolgreich erstellt."
      :open="createSuccess === 'success'"
      @close="closeSuccessModal"
    />
  </div>
  <div class="min-h-full bg-slate-50 px-4 pb-24 pt-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft">
        <p class="text-sm font-semibold text-blue-100">Dokumentation</p>
        <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Doku erstellen</h1>
        <p class="mt-2 max-w-2xl text-sm text-blue-50">
          Eine fehlende Tagesdokumentation für Mitarbeitende vorbereiten.
        </p>
      </section>

      <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="border-b border-slate-100 pb-4">
            <h2 class="text-lg font-semibold text-slate-900">Daten auswählen</h2>
            <p class="mt-1 text-sm text-slate-500">
              Betreuer, Klient, Gesundheitsstatus und Tag in einem Ablauf erfassen.
            </p>
          </div>

          <div class="mt-5 grid gap-5">
            <div class="grid gap-2">
              <input-label
                elementID="guardian"
                labelText="Betreuer auswählen*"
              />
              <DocumentGuardianSelection
                :enableAddButton="true"
                :selectedGuardian="guardian"
                @guardian-selected="guardianSelected"
              />
            </div>

            <div class="grid gap-2">
              <input-label
                elementID="client"
                labelText="Klient auswählen*"
              />
              <DocumentChildByGuardianSelection
                v-if="guardian"
                :enableAddButton="true"
                :selectedChild="child"
                :guardianId="guardian.id"
                @child-selected="selectChild"
              />
              <p
                v-else
                class="rounded-lg bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-500"
              >
                Erst Betreuer auswählen, dann erscheint die Klientenauswahl.
              </p>
              <div v-if="carrierErrorStatus">
                <p class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  Klient ist mit keinem Trägerkontakt verbunden oder der verbundene Trägerkontakt ist keinem Träger zugewiesen.
                </p>
              </div>
            </div>

            <div class="grid gap-2">
              <input-label
                elementID="sick"
                labelText="Krankheitsstatus auswählen*"
              />
              <SwitchableInfo
                title="Krankheitsstatus"
                propertyKey="sick"
                :isActive="sick"
                :value="sick ? 'Krank' : 'Gesund'"
                @button-toggled="sickChanged"
                :isLoading="false"
              />
            </div>

            <div class="grid gap-2">
              <input-label
                elementID="date"
                labelText="Tag auswählen*"
              />
              <div class="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CalendarUnlimited
                  class="mx-auto"
                  :showTimeSelection="false"
                  @date-selected="dateSelected"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span class="text-sm font-medium text-slate-500">* Pflichtangabe</span>
            <div class="w-full sm:w-64">
              <StandardButton
                @click="createEmptyReport"
                title="Dokumentation erstellen"
                :enabled="inputsValid"
                :isLoading="isLoading"
              />
            </div>
          </div>
        </div>

        <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Prüfung</h2>
          <div class="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <span class="font-semibold text-slate-900">1. Zuordnung</span><br />
              Betreuer und Klient müssen zusammengehören.
            </p>
            <p>
              <span class="font-semibold text-slate-900">2. Trägerdaten</span><br />
              Ohne Trägerkontakt kann die Abrechnung später nicht sauber laufen.
            </p>
            <p>
              <span class="font-semibold text-slate-900">3. Datum</span><br />
              Der Tag bestimmt, in welchem Nachweis die Doku später erscheint.
            </p>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from "vue"
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// component imports
import DocumentGuardianSelection from '@/components/Main/Admin/Documents/DocumentGuardianSelection.vue'
import DocumentChildByGuardianSelection from '@/components/Main/Admin/Documents/DocumentChildByGuardianSelection.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'
import CalendarUnlimited from '@/components/UIComponents/Inputs/CalendarUnlimited.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'

export default {
  components: {
    DocumentGuardianSelection,
    DocumentChildByGuardianSelection,
    SimpleDropdown,
    SwitchableInfo,
    CalendarUnlimited,
    StandardButton,
    InputLabel,
    ErrorWindow,
    SuccessWindow
  },
  setup() {
    // initialize refs
    const guardian = ref(null)
    const child = ref(null)
    const sick = ref(false)
    const documentDate = ref(null)
    const isLoading = ref(false)
    const createSuccess = ref('none')
    const carrierErrorStatus = ref(false)

    // initialize store
    const store = useStore()

    // initialize router
    const router = useRouter()

    // save selected guardian
    async function guardianSelected(val) {
      // set guardian to ref
      guardian.value = val
    }

    // save selected child
    function selectChild(val) {
      // set child to ref
      child.value = val
      // check carrier status
      checkCarrierStatus()
    }

    // update sick status
    function sickChanged(val) {
      sick.value = val.sick
    }

    // save selected date
    function dateSelected(val) {
      documentDate.value = val
    }

    // check carrier status of selected child
    function checkCarrierStatus() {
      // check if child is linked to carrier contact and that carrier contact is linked to a carrier
      if (child.value.carrierContact && child.value.carrierContact.carrierCarrierContactsId) {
        carrierErrorStatus.value = false
      } else {
        carrierErrorStatus.value = true
      }
    }

    // create empty report for guardian
    async function createEmptyReport() {
      try {
        // set loading state
        isLoading.value = true
        // create params object
        const params = {
          child: JSON.stringify(child.value),
          documentDate: documentDate.value,
          guardian: JSON.stringify(guardian.value),
          sick: sick.value
        }
        // create empty report via store
        const documentResponse = await store.dispatch('createEmptyReport', params)
        // set success state
        createSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set error state
        createSuccess.value = 'error'
      } finally {
        // reset loading state
        isLoading.value = false
      }
    }

    // reset error state
    function closeErrorModal() {
      createSuccess.value = 'none'
    }

    // redirect user after successful operation
    function closeSuccessModal() {
      router.push({ name: 'Reports' })
    }

    // compute overall validation status
    const inputsValid = computed(() => {
      try {
        if (guardian.value && child.value && documentDate.value && !carrierErrorStatus.value) {
          return true
        }
        return false
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    return {
      guardian,
      child,
      sick,
      inputsValid,
      isLoading,
      createSuccess,
      carrierErrorStatus,
      guardianSelected,
      selectChild,
      sickChanged,
      dateSelected,
      createEmptyReport,
      closeErrorModal,
      closeSuccessModal
    }
  }
}
</script>
