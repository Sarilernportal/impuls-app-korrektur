<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
07.11.2022

Scope:
Proof View
-->

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
  <div>
    <!-- Error modal -->
    <error-window
      v-if="createSuccess === 'error'"
      :title="'Stundennachweis konnte nicht erstellt werden'"
      :message="'Während der Erstellung des Stundennachweises ist ein Fehler aufgetreten.'"
      :open="createSuccess === 'error'"
      @close="closeTimesheetModals"
    />
    <!-- Success modal -->
    <success-window
      v-if="createSuccess === 'success'"
      title="Stundennachweis erstellt"
      message="Der Stundennachweis wurde erfolgreich übermittelt."
      :open="createSuccess === 'success'"
      @close="closeTimesheetModals"
    />
  </div>
  <div class="mx-auto max-w-3xl px-4 py-4 sm:px-6">
    <div class="space-y-8 divide-y divide-gray-200">
      <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div class="space-y-6 sm:space-y-5">
          <!-- Header -->
          <div v-if="transmitted">
            <!-- timesheet header -->
            <h3 class="font-display text-lg font-bold text-slate-900">
              Stundennachweise
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-secondaryText">
              Auflistung der Stundennachweise und den dazugehörigen
              Dokumentationen.
            </p>
          </div>
          <div v-else>
            <!-- reports header -->
            <h3 class="font-display text-lg font-bold text-slate-900">
              Stundennachweis erstellen
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-secondaryText">
              Erstellen Sie Stundennachweise für Ihre Klienten.
            </p>
          </div>
          <!-- selection for transmitted -->
          <TabSelection
            :tabs="tabs"
            @selected="tabSwitched"
          />
          <TabSelection
            v-if="!transmitted"
            :tabs="specialTabs"
            :useSmallText="true"
            @selected="specialTabSwitched"
          />
          <!-- loading spinner -->
          <div
            v-if="isLoading"
            class="w-full flex justify-center"
          >
            <LoadingSpinner size="h-12 w-12" />
          </div>
          <!-- Document list -->
          <div v-else>
            <template
              v-if="(transmitted && !showSpecialTimes) || (!transmitted && showSpecialTimes)"
            >
              <div
                v-for="document in documents"
                :key="document.id"
                class="pt-2"
              >
                <TimeSheetListItem
                  v-if="transmitted && !showSpecialTimes"
                  :report="document"
                />
                <SpecialReportListItem
                  v-if="!transmitted && showSpecialTimes"
                  :report="document"
                  :showSelectionInput="true"
                  @delete-report="openDeleteReportModal"
                  @special-report-selected="specialReportSelected"
                />
              </div>
            </template>
            <div
              v-else
              v-for="month in sortedReports"
              :key="month.month"
              class="mt-2 border-t border-slate-200"
            >
              <!-- month header -->
              <div class="py-2 flex flex-col items-center">
                <p class="text-primaryText text-lg font-semibold pb-2">{{ month.month }}</p>
                <div class="w-full flex justify-center gap-2">
                  <StandardButton
                    @button-tapped="selectAllMonth(month.reports)"
                    title="Alle auswählen"
                    :enabled="true"
                    :isLoading="false"
                  />
                  <StandardButton
                    @button-tapped="deselectAllMonth(month.reports)"
                    title="Alle abwählen"
                    :enabled="true"
                    :isLoading="false"
                  />
                </div>
              </div>
              <!-- reports -->
              <div
                v-for="report in month.reports" :key="report.id"
                class="pt-2"
              >
                <ReportListItem
                  :showSelectionInput="true"
                  :report="report"
                  :selected="report.selected"
                  @delete-report="openDeleteReportModal"
                  @report-selected="reportSelected"
                />
              </div>
            </div>
          </div>
          <!-- PDF viewer -->
          <div
            v-if="!isLoading && !transmitted && (!showSpecialTimes || isLocalAuthMode)"
            class="w-full"
          >
            <h3 class="font-display text-lg font-bold text-slate-900">
              Dokumentenvorschau
            </h3>
            <div
              v-if="!tempDocs"
              class="py-2"
            >
              <StandardButton
                @button-tapped="downloadTemporaryTimeSheet"
                title="Vorschau erstellen"
                :enabled="!tempIsLoading"
                :isLoading="tempIsLoading"
              />
            </div>
            <div
              class="flex flex-col gap-2 pt-2"
              v-if="!tempIsLoading && tempDocs"
            >
              <div
                v-for="doc of tempDocs"
                :key="doc.name"
                class="flex flex-1 items-center justify-between p-4 truncate rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                <p class="text-slate-600">{{ doc.name }}</p>
                <button
                  @click="downloadClicked(doc)"
                  type="button"
                  aria-label="Dokument herunterladen"
                  class="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-400 hover:text-secondaryText"
                >
                  <ArrowDownTrayIcon
                    class="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
          <!-- bottom section -->
          <div
            class="w-full flex flex-col sm:divide-y divide-gray-200 p-2 gap-2"
            v-if="!isLoading && !transmitted && documents.length > 0"
          >
            <!-- signature field -->
            <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5">
              <div class="col-span-1 sm:col-span-2 md:col-span-1">
                <SignatureField
                  ref="signatureField"
                  @get-image="signatureProvided"
                  class="mt-2"
                />
                <p
                  v-if="showSpecialTimes"
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
                  v-if="!showSpecialTimes"
                  class="mt-2 text-xs text-secondaryText"
                >
                  Im Anschluss wird über den Träger IMPULS GmbH der
                  Stundenachweis an das zuständige Amt versendet.
                </p>
                <!-- truthfull button -->
                <div class="flex my-2 text-primaryText gap-2 items-center">
                  <input
                    @click="thruthfullButtonTapped"
                    class="w-4 h-4 text-impuls-blue bg-white border-slate-300 rounded focus:ring-2 focus:ring-brand-200"
                    type="checkbox"
                    id="truthfull"
                    value="truthfull"
                  />
                  <label for="truthfull">Ich versichere, dass die vorstehenden Angaben vollständig
                    und wahrheitsgemäß sind.</label>
                </div>
                <!-- GDPR read button -->
                <div class="flex my-2 text-primaryText gap-2 items-center">
                  <input
                    @click="gdprConfirmButtonTapped"
                    class="w-4 h-4 text-impuls-blue bg-white border-slate-300 rounded focus:ring-2 focus:ring-brand-200"
                    type="checkbox"
                    id="gdprConfirm"
                    value="gdprConfirm"
                  />
                  <label for="gdprConfirm">Ich habe die <router-link
                      :to="{ name: 'GuardianGDPR' }"
                      class="text-impuls-blue underline"
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
                :enabled="canSubmit"
                :isLoading="isLoading"
              />
            </div>
          </div>
          <!-- info texts -->
          <div
            v-if="!isLoading && documents.length <= 0"
            class="w-full"
          >
            <p
              v-if="transmitted"
              class="mt-1 max-w-2xl text-primaryText text-center"
            >
              Keine Dokumente gefunden
            </p>
            <p
              v-else
              class="mt-1 max-w-2xl text-primaryText text-center"
            >
              Keine offenen Dokumente
            </p>
          </div>
          <!-- load more button -->
          <div
            v-if="transmitted && !isLoading && nextToken"
            class="w-full"
          >
            <StandardButton
              @button-tapped="loadMoreDocuments"
              title="Weitere Dokumente laden"
              :enabled="true"
              :isLoading="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vue imports
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { reportsReadyForProof, canSubmitProof } from '@/utilities/forms/submitGuards.js'
import { isLocalAuthMode } from '@/services/authService.js'
import { openTimesheetPdf } from '@/utilities/documents/timesheetPrint.js'
import { openSpecialTimesheetPdf } from '@/utilities/documents/specialTimesheetPrint.js'

// component imports
import TabSelection from '@/components/UIComponents/Selections/TabSelection.vue'
import ReportListItem from '@/components/Main/Guardian/Documents/ReportListItem.vue'
import SpecialReportListItem from '@/components/Main/Guardian/Documents/SpecialReportListItem.vue'
import TimeSheetListItem from '@/components/Main/Guardian/Documents/TimeSheetListItem.vue'
import SignatureField from '@/components/UIComponents/Inputs/SignatureField.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'
import NumberTextfield from '@/components/UIComponents/Inputs/NumberTextfield.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'

// icon imports
import { ArrowDownTrayIcon } from '@heroicons/vue/20/solid'

export default {
  components: {
    TabSelection,
    ReportListItem,
    SpecialReportListItem,
    TimeSheetListItem,
    SignatureField,
    StandardButton,
    LoadingSpinner,
    ErrorWindow,
    SuccessWindow,
    CriticalAction,
    NumberTextfield,
    ArrowDownTrayIcon,
    SwitchableInfo
  },
  setup() {
    // initialize refs
    const transmitted = ref(false)
    const tabs = ref([
      {
        name: 'Offen',
        current: true
      },
      {
        name: 'Abgeschickt',
        current: false
      }
    ])
    const specialTabs = ref([
      {
        name: 'Dokumentation',
        indicator: 0,
        current: true
      },
      {
        name: 'Sonderzeiten',
        indicator: 0,
        current: false
      }
    ])
    const isLoading = ref(false)
    const tempIsLoading = ref(false)
    const documents = ref([])
    const signature = ref(null)
    const truthfull = ref(false)
    const gdprConfirm = ref(false)
    const createSuccess = ref('none')
    const deleteSuccess = ref('none')
    const deleteReportOpen = ref(false)
    const reportToBeDeleted = ref(null)
    const tempDocs = ref(null)
    const showSpecialTimes = ref(false)
    const nextToken = ref(null)
    const selectedSpecialReports = ref([])
    const selectedReports = ref([])

    // Store initialization
    const store = useStore()

    // set transmitted filter for API call
    function setTransmittedFilter(value) {
      transmitted.value = value
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

    // change tab to user selection
    async function tabSwitched(event) {
      // reset selected tab
      for (const tab in tabs.value) {
        tabs.value[tab].current = false
      }

      // set current in selected tab to true
      tabs.value[event.tabindex].current = true

      // reset nextToken
      nextToken.value = null

      // reset selected reports
      selectedSpecialReports.value = []
      selectedReports.value = []

      // set transmitted value for filtering
      if (event.selection.name === 'Offen') {
        transmitted.value = false
        // reset show special times switch
        showSpecialTimes.value = false
        // get daily reports
        await getDailyReports()
        // get tab counts for standard/special
        await checkCreatedReportsCounts()
      } else if (event.selection.name === 'Abgeschickt') {
        transmitted.value = true
        // reset show special times switch
        showSpecialTimes.value = false
        // get timesheets
        await getTimesheets()
      }
      // reset signature
      signature.value = null
    }

    async function confirmButtonTapped() {
      if (showSpecialTimes.value) {
        await submitSpecialTimesheet()
      } else {
        await submitTimesheet()
      }
    }

    // Method to submit the report
    async function submitTimesheet() {
      if (signature.value !== null && truthfull.value) {
        try {
          // set loading state
          isLoading.value = true
          // Create the report in the backend via store
          const resp = await store.dispatch('createTimesheet', {
            data: {
              documents: selectedReports.value
            },
            signature: signature.value
          })
          // set success state
          createSuccess.value = 'success'
          // reset selected reports
          selectedReports.value = []
        } catch (error) {
          console.log(error)
          // set success state
          createSuccess.value = 'error'
          // reset signature state
          signature.value = null
        } finally {
          // set loading state
          isLoading.value = false
          // set transmitted state
          transmitted.value = true
          // update document list
          await tabSwitched({
            selection: { current: true, name: 'Abgeschickt' },
            tabindex: 1
          })
        }
      }
    }

    // Method to submit the report
    async function submitSpecialTimesheet() {
      if (signature.value !== null && truthfull.value) {
        try {
          // set loading state
          isLoading.value = true
          console.log(selectedSpecialReports.value)
          // Create the report in the backend via store
          const resp = await store.dispatch('createSpecialTimesheet', {
            data: {
              documents: selectedSpecialReports.value
            },
            signature: signature.value
          })
          // set success state
          createSuccess.value = 'success'
          // reset selected documents
          selectedSpecialReports.value = []
        } catch (error) {
          console.log(error)
          // set success state
          createSuccess.value = 'error'
          // reset signature state
          signature.value = null
        } finally {
          // set loading state
          isLoading.value = false
          // set transmitted state
          transmitted.value = true
          // update document list
          await tabSwitched({
            selection: { current: true, name: 'Abgeschickt' },
            tabindex: 1
          })
        }
      }
    }

    // get reports for guardian depending on
    async function getTimesheets() {
      try {
        // set loading state
        isLoading.value = true
        // get token status --> to see if we have to overwrite or append items
        const tokenStatus = nextToken.value === null
        // get documents from API
        const resp = await store.dispatch('getTimesheets', { nextToken: nextToken.value })
        // overwrite or append items depending on tokenStatus
        if (tokenStatus) {
          documents.value = resp.items.sort((a, b) =>
            new Date(a.documentDate) < new Date(b.documentDate)
              ? 1
              : new Date(b.documentDate) < new Date(a.documentDate)
                ? -1
                : 0
          )
        } else {
          documents.value = documents.value.concat(resp.items).sort((a, b) =>
            new Date(a.documentDate) < new Date(b.documentDate)
              ? 1
              : new Date(b.documentDate) < new Date(a.documentDate)
                ? -1
                : 0
          )
        }
        // save nextToken value
        nextToken.value = resp.nextToken
      } catch (error) {
        console.log(error)
      } finally {
        // set loading state
        isLoading.value = false
      }
    }

    // get reports for guardian
    async function getDailyReports() {
      try {
        // set loading state
        isLoading.value = true
        // get documents from API
        const resp = await store.dispatch('getDailyReports')
        documents.value = resp
      } catch (error) {
        console.log(error)
      } finally {
        // set loading state
        isLoading.value = false
      }
    }

    // sort dailyReports by month
    const sortedReports = computed(() => {
      try {
        var sortedList = {}
        // sort documents by month
        for (const report of documents.value) {
          // get month by number
          const docDate = new Date(report.documentDate).getMonth() + 1
          // add selected option for checkbox selecttion
          report.selected = false
          if (docDate in sortedList) {
            // append to existing month entry
            sortedList[docDate].reports.push(report)
          } else {
            // get month as string
            const months = {
              1: 'Januar',
              2: 'Februar',
              3: 'März',
              4: 'April',
              5: 'Mai',
              6: 'Juni',
              7: 'Juli',
              8: 'August',
              9: 'September',
              10: 'Oktober',
              11: 'November',
              12: 'Dezember'
            };
            // create new month entry
            sortedList[docDate] = { month: months[docDate] }
            sortedList[docDate].reports = [report]
          }
        }
        return sortedList
      } catch (error) {
        console.log(error)
        // fallback
        return {}
      }
    })

    // get special reports for guardian
    async function getSpecialDailyReports() {
      try {
        // set loading state
        isLoading.value = true
        // get token status --> to see if we have to overwrite or append items
        const tokenStatus = nextToken.value === null
        // get documents from API
        const resp = await store.dispatch('listSpecialDailyReportsByGuardian', { nextToken: nextToken.value })
        // overwrite or append items depending on tokenStatus
        if (tokenStatus) {
          documents.value = resp.items.sort((a, b) =>
            new Date(a.documentDate) < new Date(b.documentDate)
              ? 1
              : new Date(b.documentDate) < new Date(a.documentDate)
                ? -1
                : 0
          )
        } else {
          documents.value = documents.value.concat(resp.items).sort((a, b) =>
            new Date(a.documentDate) < new Date(b.documentDate)
              ? 1
              : new Date(b.documentDate) < new Date(a.documentDate)
                ? -1
                : 0
          )
        }
        // save nextToken value
        nextToken.value = resp.nextToken
      } catch (error) {
        console.log(error)
      } finally {
        // set loading state
        isLoading.value = false
      }
    }

    async function loadMoreDocuments() {
      try {
        if (showSpecialTimes.value) {
          await getSpecialDailyReports()
        } else if (!showSpecialTimes.value && transmitted.value) {
          getTimesheets()
        }
      } catch (error) {
        console.log(error)
      }
    }

    // Method for downloading temporary timesheet
    async function downloadTemporaryTimeSheet() {
      // Im Demo direkt die clientseitige Stundennachweis-Vorschau (PDF) öffnen,
      // statt das (nicht vorhandene) Lambda aufzurufen.
      if (isLocalAuthMode) {
        const reports = documents.value || []
        const first = reports[0] || {}
        const base = reports.length ? new Date(first.documentDate) : new Date()
        const monthNames = [
          'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
          'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ]
        if (showSpecialTimes.value) {
          // Sonder-Nachweis (Sonderzeiten)
          openSpecialTimesheetPdf({
            guardian: {
              name: first.guardian?.name || '',
              familyName: first.guardian?.familyName || ''
            },
            month: monthNames[base.getMonth()],
            documentYear: base.getFullYear(),
            documents: reports.map((report) => ({
              documentDate: report.documentDate,
              documentEndDate: report.documentEndDate,
              reportActivity: report.reportActivity,
              hourFrom: report.hourFrom,
              minuteFrom: report.minuteFrom,
              hourTo: report.hourTo,
              minuteTo: report.minuteTo
            })),
            signatureImage: null
          })
          return
        }
        openTimesheetPdf({
          preview: true,
          child: {
            data: {
              name: first.child?.name || '',
              familyName: first.child?.familyName || '',
              weeklyHours: first.child?.weeklyHours || 0,
              weeklyHoursByPlan: false
            },
            guardian: {
              name: first.guardian?.name || '',
              familyName: first.guardian?.familyName || ''
            },
            dateOfRegistration: ''
          },
          month: monthNames[base.getMonth()],
          documentYear: base.getFullYear(),
          documents: reports.map((report) => ({
            documentDate: report.documentDate,
            hourFrom: report.hourFrom,
            minuteFrom: report.minuteFrom,
            hourTo: report.hourTo,
            minuteTo: report.minuteTo,
            sick: report.sick,
            sickOnTime: report.sickOnTime,
            reportActivity: report.reportActivity
          }))
        })
        return
      }
      try {
        // set loading state
        tempIsLoading.value = true
        // Create the temporary report in the backend via store
        const docs = await store.dispatch('downloadTemporaryTimeSheet', {
          documents: documents.value
        })
        // save temporary docs
        tempDocs.value = docs
      } catch (error) {
        console.log(error)
      } finally {
        // set loading state
        tempIsLoading.value = false
      }
    }

    function downloadClicked(doc) {
      // create invisible href
      var link = document.createElement('a')
      // set attributes to href --> link  + file name
      link.href = doc.document
      link.download = doc.name
      // let JS click the download
      link.click()
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
        // update document list
        await tabSwitched({
          selection: { current: true, name: 'Offen' },
          tabindex: 0
        })
      }
    }

    // get coutns of created standard/special reports
    async function checkCreatedReportsCounts() {
      try {
        // get counts via store
        const countResponse = await store.dispatch('checkCreatedReportsCounts')
        // check which elements in array are standard/special
        const standardIndex = specialTabs.value.findIndex((tab) => tab.name === 'Dokumentation')
        const specialIndex = specialTabs.value.findIndex((tab) => tab.name === 'Sonderzeiten')
        // save counts in ref
        specialTabs.value[standardIndex].indicator = countResponse.standard
        specialTabs.value[specialIndex].indicator = countResponse.special
      } catch (error) {
        console.log(error)
      } finally {
        // set loading state
        isLoading.value = false
      }
    }

    // change tab to user selection
    async function specialTabSwitched(event) {
      // reset selected tab
      for (const tab in specialTabs.value) {
        specialTabs.value[tab].current = false
      }

      // set current in selected tab to true
      specialTabs.value[event.tabindex].current = true

      // reset nextToken
      nextToken.value = null
      // reset values
      truthfull.value = false
      gdprConfirm.value = false
      selectedSpecialReports.value = []
      selectedReports.value = []

      // set transmitted value for filtering
      if (event.selection.name === 'Dokumentation') {
        // dont show special times switch
        showSpecialTimes.value = false
        // get daily reports
        await getDailyReports()
      } else if (event.selection.name === 'Sonderzeiten') {
        // show special times switch
        showSpecialTimes.value = true
        // get special daily Reports
        await getSpecialDailyReports()
      }
      // reset signature
      signature.value = null
    }

    // change status for showing special times reports
    async function showSpecialTimesChanged(val) {
      try {
        // reset nextToken
        nextToken.value = null
        // update ref to display correct button status
        showSpecialTimes.value = val.specialTimes
        // reset values
        truthfull.value = false
        gdprConfirm.value = false
        selectedSpecialReports.value = []
        selectedReports.value.value = []

        if (!showSpecialTimes.value && transmitted.value) {
          // get timesheets
          await getTimesheets()
        } else if (!showSpecialTimes.value && !transmitted.value) {
          // get daily reports
          await getDailyReports()
        } else {
          // get special daily Reports
          await getSpecialDailyReports()
        }
      } catch (error) {
        console.log(error)
      }
    }

    // special report was selected/unselected
    function specialReportSelected(event) {
      try {
        if (event.value) {
          // append report to selected list
          selectedSpecialReports.value.push(event.report)
        } else {
          // find index of report and remove from array
          const reportIndex = selectedSpecialReports.value.findIndex(
            (report) => report.id === event.report.id
          )
          // remove from list by index
          selectedSpecialReports.value.splice(reportIndex, 1)
        }
      } catch (error) {
        console.log(error)
      }
    }

    // report was selected/unselected
    function reportSelected(event) {
      try {
        // add/remove from selected list
        if (event.value) {
          // append report to selected list
          selectedReports.value.push(event.report)
        } else {
          // find index of report and remove from array
          const reportIndex = selectedReports.value.findIndex(
            (report) => report.id === event.report.id
          )
          // remove from list by index
          selectedReports.value.splice(reportIndex, 1)
        }
        // update document object
        // find index of report and remove from array
        const docIndex = documents.value.findIndex(
          (report) => report.id === event.report.id
        )
        documents.value[docIndex].selected = event.value
      } catch (error) {
        console.log(error)
      }
    }

    // set selected values to true for chosen month
    function selectAllMonth(reports) {
      try {
        // filter for already selected reports --> avoid duplication
        const filteredReports = reports.filter((report) => {
          return !report.selected
        })
        // use reportSelected function to handle selection logic
        for (const report of filteredReports) {
          reportSelected({
            value: true, report: report
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    // set selected values to true for chosen month
    function deselectAllMonth(reports) {
      try {
        // use reportSelected function to handle selection logic
        for (const report of reports) {
          reportSelected({ value: false, report: report })
        }
      } catch (error) {
        console.log(error)
      }
    }

    // close function for dailyrepor create success/error modal
    function closeTimesheetModals() {
      createSuccess.value = 'none'
    }

    // close function for dailyreport delete success/error modal
    function closeDeleteModals() {
      deleteSuccess.value = 'none'
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

    // calculate overall validation
    const allValid = computed(() => {
      try {
        return reportsReadyForProof({
          documents: documents.value,
          showSpecialTimes: showSpecialTimes.value,
          selectedReports: selectedReports.value,
          selectedSpecialReports: selectedSpecialReports.value
        })
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // Nachweis nur absendbar mit Unterschrift + beiden Bestätigungen + gültiger Auswahl
    const canSubmit = computed(() =>
      canSubmitProof({
        signature: signature.value,
        truthfull: truthfull.value,
        gdprConfirm: gdprConfirm.value,
        ready: allValid.value
      })
    )

    onMounted(async () => {
      await getDailyReports()
      await checkCreatedReportsCounts()
    })

    return {
      isLocalAuthMode,
      transmitted,
      tabs,
      specialTabs,
      isLoading,
      documents,
      signature,
      truthfull,
      createSuccess,
      deleteSuccess,
      deleteReportOpen,
      tempDocs,
      tempIsLoading,
      allValid,
      canSubmit,
      showSpecialTimes,
      nextToken,
      gdprConfirm,
      sortedReports,
      setTransmittedFilter,
      confirmButtonTapped,
      submitTimesheet,
      signatureProvided,
      thruthfullButtonTapped,
      gdprConfirmButtonTapped,
      tabSwitched,
      specialTabSwitched,
      closeTimesheetModals,
      closeDeleteModals,
      confirmedDelete,
      openDeleteReportModal,
      closeDeleteReportModal,
      downloadTemporaryTimeSheet,
      downloadClicked,
      showSpecialTimesChanged,
      loadMoreDocuments,
      specialReportSelected,
      reportSelected,
      selectAllMonth,
      deselectAllMonth
    }
  }
}
</script>
