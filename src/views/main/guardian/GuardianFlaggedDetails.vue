<template>
  <!-- Critical action modals for dailyreport delete operation -->
  <div>
    <CriticalAction
      :open="deleteReportOpen"
      title="Dokumentation löschen"
      message="Möchten Sie die Dokumentation wirklich löschen? Dieser Vorgang ist nicht mehr umzukehren."
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Dokumentation löschen"
      @close="closeDeleteReportModal"
      @confirmed="confirmedDelete"
    />
    <!-- Error modal -->
    <error-window
      v-if="deleteSuccess === 'error'"
      :title="'Löschung fehlgeschlagen'"
      :message="'Die Dokumentation konnte leider nicht gelöscht werden. Bitte stellen Sie eine stabile Internetverbindung sicher.'"
      :open="deleteSuccess === 'error'"
      @close="closeDeleteModals"
    />
    <!-- Success modal -->
    <success-window
      v-if="deleteSuccess === 'success'"
      title="Löschung erfolgreich"
      message="Die ausgewählte Dokumentation wurde erfolgreich gelöscht"
      :open="deleteSuccess === 'success'"
      @close="closeDeleteModals"
    />
  </div>
  <!-- modals for update success/error -->
  <div>
    <!-- Error modal -->
    <error-window
      v-if="createSuccess === 'error'"
      :title="'Dokumentation konnten nicht aktualisiert werden'"
      :message="'Während der Aktualisierung der Dokumentation ist ein Fehler aufgetreten.'"
      :open="createSuccess === 'error'"
      @close="closeTimesheetModals"
    />
    <!-- Success modal -->
    <success-window
      v-if="createSuccess === 'success'"
      title="Dokumentation aktualisiert"
      message="Die Dokumentation wurden erfolgreich aktualisiert."
      :open="createSuccess === 'success'"
      @close="closeTimesheetModals"
    />
  </div>
  <div class="w-full h-full flex flex-col">
    <div class="px-4 py-2">
      <!-- Title  -->
      <h3 class="text-lg font-medium leading-6 text-primaryText">
        Markierte Berichte
      </h3>
      <!-- description -->
      <p class="mt-1 max-w-2xl text-sm text-secondaryText">
        Die folgenden Berichte wurden zur Überarbeitung markiert. Bitte führen
        Sie eine Überarbeitung durch und bestätigen Sie die Richtigkeit mit
        Ihrer Unterschrift
      </p>
    </div>
    <!-- loading spinner -->
    <div
      v-if="isLoading"
      class="flex w-full justify-center p-2"
    >
      <LoadingSpinner size="h-12 w-12" />
    </div>
    <!-- grouped reports -->
    <div
      v-else
      class="flex flex-col gap-2 px-4 py-2"
    >
      <!-- report group by timesheet -->
      <div
        v-if="reportList.length > 0"
        v-for="report in reportList"
        :key="report.id"
        class="pt-2"
      >
        <ReportListItem
          v-if="report.reportType !== 'special'"
          :report="report"
          @delete-report="openDeleteReportModal"
        />
        <SpecialReportListItem
          v-else
          :report="report"
          :showSelectionInput="false"
          @delete-report="openDeleteReportModal"
        />
      </div>
      <div v-else>
        <p class="text-primaryText px-4 text-center">
          Keine Dokumente vorhanden!
        </p>
        <p class="text-primaryText px-4 text-center">
          Eine Unterschrift für den Nachweis ist trotzdem weiterhin erforderlich!
        </p>
      </div>
    </div>
    <div
      class="w-full lg:w-4/5 flex flex-col sm:divide-y divide-gray-200 py-2 px-4 gap-2"
      v-if="!isLoading"
    >
      <!-- signature field -->
      <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <div class="col-span-1 sm:col-span-2 md:col-span-1">
          <SignatureField
            ref="signatureField"
            @get-image="signatureProvided"
            class="mt-2"
          />
          <p
            v-if="reportType === 'special'"
            class="mt-2 text-xs text-secondaryText"
          >
            Zur Bestätigung der Anwesenheit des Teilhabeassistenten ist
            das Unterzeichnen notwendig. Diese Unterschrift dient zur Erstellung eines Sonderstundennachweises zum
            Ende jeden Monats.
          </p>
          <p
            v-else
            class="mt-2 text-xs text-secondaryText"
          >
            Zur Bestätigung der Anwesenheit des Teilhabeassistenten ist
            das Unterzeichnen der Klassenlehrer/innen notwendig. Diese
            Unterschrift dient zur Erstellung eines Stundennachweises zum
            Ende jeden Monats.
          </p>
          <p
            v-if="reportType !== 'special'"
            class="mt-2 text-xs text-secondaryText"
          >
            Im Anschluss wird über den Träger IMPULS GmbH der
            Stundenachweis an das zuständige Amt versendet.
          </p>
          <!-- truthfull button -->
          <div class="flex my-2 text-primaryText gap-2 items-center">
            <input
              @click="thruthfullButtonTapped"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
              type="checkbox"
              id="truthfull"
              value="truthfull"
            />
            <label for="truthfull">Ich versichere, dass die vorstehenden Angaben vollständig und
              wahrheitsgemäß sind.</label>
          </div>
          <!-- GDPR read button -->
          <div class="flex my-2 text-primaryText gap-2 items-center">
            <input
              @click="gdprConfirmButtonTapped"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
              type="checkbox"
              id="gdprConfirm"
              value="gdprConfirm"
            />
            <label for="gdprConfirm">Ich habe die <router-link
                :to="{ name: 'GuardianGDPR' }"
                class="text-blue-500"
              >Datenschutzbestimmungen</router-link> gelesen und erkläre mich mit
              Ihnen
              einverstanden</label>
          </div>
        </div>
      </div>
      <!-- Submit button section -->
      <div class="p-4">
        <StandardButton
          @button-tapped="confirmButtonTapped"
          title="Bestätigen"
          :enabled="signature !== null && truthfull && gdprConfirm"
          :isLoading="isLoading"
        />
      </div>
    </div>
    <div
      v-if="!isLoading && reportList.length <= 0"
      class="w-full"
    >
      <p class="mt-1 max-w-2xl text-gray-200 text-center">
        Keine offenen Dokumente
      </p>
    </div>
  </div>
</template>

<script>
// vue imports
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

// component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import ReportListItem from '@/components/Main/Guardian/Documents/ReportListItem.vue'
import SpecialReportListItem from '@/components/Main/Guardian/Documents/SpecialReportListItem.vue'
import SignatureField from '@/components/UIComponents/Inputs/SignatureField.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'

export default {
  components: {
    LoadingSpinner,
    ReportListItem,
    SpecialReportListItem,
    SignatureField,
    StandardButton,
    ErrorWindow,
    SuccessWindow,
    CriticalAction
  },
  setup() {
    // initialize refs
    const reportList = ref({})
    const reportType = ref(null)
    const isLoading = ref(true)
    const signature = ref(null)
    const truthfull = ref(false)
    const gdprConfirm = ref(false)
    const createSuccess = ref('none')
    const deleteSuccess = ref('none')
    const deleteReportOpen = ref(false)
    const reportToBeDeleted = ref(null)
    const invoiceId = ref(null)

    // Initialize Store
    const store = useStore()

    // initialize router
    const router = useRouter()

    // initialize route
    const route = useRoute()

    // get flagged reports from API
    async function getFlaggedreports() {
      try {
        // set loading state
        isLoading.value = true

        const response = await store.dispatch('getFlaggedReportsByTimesheet', {
          timesheetId: route.params.id
        })
        // get reports grouped by timesheet
        reportList.value = response.dailyReport.items
        // get timesheet reort type
        reportType.value = response.reportType
        // get invoice id
        invoiceId.value = response.invoiceID
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    // Callback when the user types in content for the signature
    function signatureProvided(event) {
      signature.value = event
    }

    // Callback when user selects truthfull button
    function thruthfullButtonTapped(event) {
      truthfull.value = event.target.checked
    }

    // Callback when user selects gdpr confirm button
    function gdprConfirmButtonTapped(event) {
      gdprConfirm.value = event.target.checked
    }

    async function confirmButtonTapped() {
      if (reportType.value === 'special') {
        await updateSpecialTimesheet()
      } else {
        await updateTimesheet()
      }
    }

    // delete selected dailyReport
    async function deleteDailyReport() {
      try {
        // set loading state
        isLoading.value = true
        // close modal to prevent double click
        deleteReportOpen.value = false
        // delete via store
        await store.dispatch('deleteDailyReport', {
          id: reportToBeDeleted.value.id
        })
        // set deletion success state
        deleteSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set deletion error state
        deleteSuccess.value = 'error'
      } finally {
        // set loading state
        isLoading.value = false
        // reset critical action modal
        closeDeleteReportModal()
        // repull reports
        getFlaggedreports()
      }
    }

    // Method to submit the report
    async function updateTimesheet() {
      if (signature.value !== null && truthfull.value) {
        try {
          // set loading state
          isLoading.value = true
          // update the timesheet/invoice in the backend via store
          const resp = await store.dispatch('updateFlaggedReports', {
            data: {
              timeSheetsDailyReportId: route.params.id,
              invoicesDailyReportId: invoiceId.value,
              signatureImage: signature.value
            }
          })
          // set success state
          createSuccess.value = 'success'
        } catch (error) {
          console.log(error)
          // set success state
          createSuccess.value = 'error'
          // reset signature state
          signature.value = null
        } finally {
          // set loading state
          isLoading.value = false
        }
      }
    }

    // Method to submit the report
    async function updateSpecialTimesheet() {
      if (signature.value !== null && truthfull.value) {
        try {
          // set loading state
          isLoading.value = true
          // update the timesheet/invoice in the backend via store
          const resp = await store.dispatch('updateFlaggedSpecialReports', {
            data: {
              timeSheetsDailyReportId: route.params.id,
              signatureImage: signature.value
            }
          })
          // set success state
          createSuccess.value = 'success'
        } catch (error) {
          console.log(error)
          // set success state
          createSuccess.value = 'error'
          // reset signature state
          signature.value = null
        } finally {
          // set loading state
          isLoading.value = false
        }
      }
    }

    // close function for dailyreport delete success/error modal
    function closeDeleteModals() {
      deleteSuccess.value = 'none'
    }

    // close function for dailyrepor update success/error modal --> push to overview
    function closeTimesheetModals() {
      router.push({ name: 'GuardianFlaggedOverview' })
    }

    // open function for critical action delete daily report modal
    function openDeleteReportModal(report) {
      reportToBeDeleted.value = report
      deleteReportOpen.value = true
    }

    // close function for critical action delete daily report modal
    function closeDeleteReportModal() {
      deleteReportOpen.value = false
      reportToBeDeleted.value = null
    }

    // deletion of report was confirmed
    async function confirmedDelete() {
      await deleteDailyReport()
    }

    // get flagged reports on mount
    onMounted(async () => {
      await getFlaggedreports()
    })

    return {
      reportList,
      isLoading,
      signature,
      truthfull,
      gdprConfirm,
      createSuccess,
      deleteSuccess,
      deleteReportOpen,
      reportType,
      confirmButtonTapped,
      signatureProvided,
      thruthfullButtonTapped,
      gdprConfirmButtonTapped,
      closeDeleteModals,
      confirmedDelete,
      openDeleteReportModal,
      closeDeleteReportModal,
      closeTimesheetModals
    }
  }
}
</script>