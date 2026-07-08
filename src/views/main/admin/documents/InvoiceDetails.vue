<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
23.02.2023

Scope:
Invoice Details
-->

<template>
  <div>
    <!-- Critical action modal for invoice confirm operation -->
    <CriticalActionFriendly
      :open="confirmInvoiceOpen"
      title="Rechnung freigeben"
      message="Möchten Sie die Rechnung wirklich freigeben?"
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Freigeben"
      @close="resetConfirmInvoiceOpen"
      @confirmed="confirmInvoice"
    />
    <!-- Error modal -->
    <error-window
      v-if="confirmSuccess === 'error'"
      title="Freigabe fehlgeschlagen"
      message="Die Rechnung konnte leider nicht freigegeben werden. Bitte stellen Sie eine stabile Internetverbindung sicher und überprüfen sie den Status aller verknüpften Dokumentationen."
      :open="confirmSuccess === 'error'"
      @close="resetConfirmSuccesss"
    />
    <!-- Success modal -->
    <success-window
      v-if="confirmSuccess === 'success'"
      title="Freigabe erfolgreich"
      message="Die ausgewählte Rechnung wurde erfolgreich freigegeben"
      :open="confirmSuccess === 'success'"
      @close="resetConfirmSuccesss"
    />
    <!-- Critical action modal for regenerating invoice operation -->
    <CriticalActionFriendly
      :open="regenerateInvoiceOpen"
      title="Rechnung erneut generieren"
      message="Möchten Sie die Rechnung wirklich erneut generieren lassen?"
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Generieren"
      @close="resetRegenerateInvoiceOpen"
      @confirmed="regenerateInvoice"
    />
    <!-- Error modal -->
    <error-window
      v-if="regenerateSuccess === 'error'"
      title="Generierung fehlgeschlagen"
      message="Die Rechnung konnte leider nicht generiert werden. Bitte stellen Sie eine stabile Internetverbindung sicher."
      :open="regenerateSuccess === 'error'"
      @close="resetRegenerateSuccesss"
    />
    <!-- Success modal -->
    <success-window
      v-if="regenerateSuccess === 'success'"
      title="Generierung erfolgreich"
      message="Die ausgewählte Rechnung wurde erfolgreich neu generiert"
      :open="regenerateSuccess === 'success'"
      @close="resetRegenerateSuccesss"
    />
  </div>
  <div class="flex flex-col w-full h-full items-center bg-app-bg px-4 py-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex items-center justify-between w-full">
      <button
        class="bg-impuls-blue hover:bg-brand-700 transition rounded-lg text-white p-2 shadow-card"
        @click="goToPrevious"
      >
        <ArrowLeftIcon class="h-6 w-6" />
      </button>
      <h1 class="font-display text-2xl font-black tracking-tight text-primaryText">
        Rechnung Details
      </h1>
      <button
        class="bg-impuls-blue hover:bg-brand-700 transition rounded-lg text-white p-2 shadow-card"
        @click="goToNext"
      >
        <ArrowRightIcon class="h-6 w-6" />
      </button>
    </div>
    <!-- Main content container -->
    <div class="flex md:flex-row flex-col grow w-full h-full mt-4 sm:flex">
      <!-- PDF viewer -->
      <div class="mb-4 w-full h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card sm:mb-0 sm:mr-4">
        <iframe
          id="printf"
          name="printf"
          :src="pdf"
          class="w-full h-full"
        ></iframe>
      </div>
      <!-- carrier information + invoice confirmation -->
      <div class="flex w-full flex-col gap-4 md:w-1/3 mt-4 md:mt-0">
        <!-- Carrier section -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 class="font-display font-bold text-primaryText">
            Kostenträgerinformation
          </h2>
          <!-- carrier information -->
          <div
            v-if="carrier"
            class="flex flex-col w-full gap-4 pt-3"
          >
            <!-- name -->
            <div
              v-if="carrier.name"
              class="text-primaryText"
            >
              <div class="text-secondaryText text-sm">Name</div>
              <div>{{ carrier.name }}</div>
            </div>
            <div v-else>Nicht angegeben</div>
            <!-- email -->
            <div
              v-if="carrier.email"
              class="text-primaryText"
            >
              <div class="text-secondaryText text-sm">Email</div>
              <div>{{ carrier.email }}</div>
            </div>
            <div v-else>Keine Email verfügbar</div>
            <!-- automatic email status -->
            <div class="flex flex-col text-primaryText">
              <div class="text-secondaryText text-sm">Automatische E-mail</div>
              <div :class="[
                carrier.allowAutoInvoice
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700',
                'p-1 rounded-lg text-center mt-2 font-semibold'
              ]">
                {{ carrier.allowAutoInvoice ? 'Zugelassen' : 'Abgelehnt' }}
              </div>
            </div>
          </div>
        </div>
        <!-- invoice section -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 class="font-display font-bold text-primaryText">
            Freigabe der Rechnung
          </h2>
          <!-- confirm section-->
          <div
            v-if="carrier"
            class="flex flex-col w-full gap-4 pt-3"
          >
            <div
              v-if="!document.charged"
              class="text-secondaryText text-xs"
            >
              Sonfern der Kostenträger das automatische Versenden von E-mails erlaubt
              und eine gültige E-mail hinterlegt ist, wird durch die Bestätigung
              die Rechnung an den Kostenträger verschickt.
            </div>
            <!-- status for already confirmed -->
            <div
              v-if="document.charged"
              class="p-1 rounded-lg text-center mt-2 bg-emerald-50 text-emerald-700 font-semibold"
            >
              Freigegeben
            </div>
            <!-- status for daily reports in revise state -->
            <div
              v-if="reportsFlagged && !document.charged"
              class="p-1 rounded-lg text-center mt-2 bg-red-50 text-red-700 font-semibold"
            >
              Markierte Berichte gefunden
            </div>
            <!-- confirm invoice button -->
            <standard-button
              v-if="!reportsFlagged && !document.charged"
              @button-tapped="confirmButtonTapped"
              :title="automaticEmailAllowed ? 'E-mail versenden' : 'Freigeben'"
              :isLoading="isLoading"
              :enabled="true"
            />
            <!-- info text if no automatic email is possible -->
            <div
              v-if="!automaticEmailAllowed && !document.charged"
              class="text-secondaryText text-xs"
            >
              Für diese Rechnung kann keine automatische E-mail verschickt werden.
            </div>
          </div>
        </div>
        <!-- regenerate section -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 class="font-display font-bold text-primaryText">
            Rechnung anpassen
          </h2>
          <div class="flex flex-col w-full gap-4 pt-3">
            <!-- regenerate invoice button -->
            <input
              v-model.trim="invoiceNumber"
              type="text"
              class="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:z-10 focus:border-impuls-blue focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Rechnungsnummer"
            />
            <input
              v-model.number="extraHours"
              type="number"
              class="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 tabular-nums placeholder-slate-400 focus:z-10 focus:border-impuls-blue focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Leistungsstunden"
            />
            <input
              v-model.number="extraHourRate"
              type="number"
              class="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 tabular-nums placeholder-slate-400 focus:z-10 focus:border-impuls-blue focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Stundensatz"
            />
            <input
              v-model.trim="extraDescription"
              type="text"
              class="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:z-10 focus:border-impuls-blue focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Bezeichnung"
            />
            <standard-button
              @button-tapped="regenerateButtonTapped"
              title="Rechnung erneut generieren"
              :isLoading="isLoading"
              :enabled="true"
            />
            <!-- year/month selection -->
            <div class="flex flex-col gap-4 w-full">
              <SimpleDropdown
                class="w-full"
                title="Neues Rechnungsjahr"
                :properties="[new Date().getFullYear(), new Date().getFullYear() - 1]"
                :defaultSelected="newInvoiceYear"
                @selection="setInvoiceYear"
              />
              <SimpleDropdown
                class="w-full"
                title="Neuer Rechnungsmonat"
                :properties="months"
                :defaultSelected="newInvoiceMonth"
                @selection="setInvoiceMonth"
              />
            </div>
            <div
              v-if="!document.charged"
              class="text-secondaryText text-xs flex flex-col gap-2"
            >
              <p>
                Die Rechnung wird mit den vorhandenen Daten erneut als PDF generiert und im Anschluss angezeigt. Dieser
                Vorgang kann einige Minuten in Anspruch nehmen.
              </p>
              <p>
                Die Änderung des Rechnungsjahres und/oder Rechnungsmonats verändert dabei nicht die zugewiesene
                Rechnungsnummer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// Vue imports
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

// component imports
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import CriticalActionFriendly from '@/components/UIComponents/Modals/CriticalActionFriendly.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    StandardButton,
    CriticalActionFriendly,
    ErrorWindow,
    SuccessWindow,
    SimpleDropdown,
    ArrowLeftIcon,
    ArrowRightIcon
  },
  props: {
    id: {
      type: String,
      required: true
    },
    invoicesIds: {
      type: Array,
    },
    currentIndex: {
      type: Number,
      default: null
    }
  },
  setup(props) {
    // Ref initialization
    const pdf = ref(null)
    const document = ref({})
    const carrier = ref(null)
    const isLoading = ref(false)
    const confirmInvoiceOpen = ref(false)
    const confirmSuccess = ref('none')
    const regenerateInvoiceOpen = ref(false)
    const regenerateSuccess = ref('none')
    const newInvoiceMonth = ref(new Date().toLocaleString('de', { month: 'long' }))
    const newInvoiceYear = ref(new Date().getFullYear().toString())
    const extraHours = ref(null);
    const extraHourRate = ref(null);
    const extraDescription = ref("")
    const invoiceNumber = ref("")
    const months = ref([
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember'
    ])
    const route = useRoute()

    const invoicesIds = computed(() => {
      const invoicesData = props.invoicesIds ?? route.query.invoicesIds
      try {
        return typeof invoicesData === 'string' ? JSON.parse(invoicesData) : invoicesData
      } catch {
        return []
      }
    })
    const currentIndex = ref(props.currentIndex ?? Number(route.query.currentIndex))
    const id = ref(props.id)

    // Store initialization
    const store = useStore()

    watch(id, async (newId) => {
      await getInvoice(newId)
    })

    // Mounted hook to perform action on mounting the component
    onMounted(async () => {
      await getInvoice(id.value)
    })

    // Get the invoice from the database
    async function getInvoice(id) {
      try {
        // set loading state
        isLoading.value = true
        // Get the response from the database within the invoice object
        const response = await store.dispatch('getSingleInvoice', { id })
        // Fetch the pdf
        document.value = response
        // get carrier values
        carrier.value = response.carrier

        await getPDF(response.key)
      } catch (err) {
        console.log('Err'.err)
      } finally {
        // reset loading state
        isLoading.value = false
      }
    }

    // Fetch the pdf from the storage on the backend
    async function getPDF(key) {
      try {
        // get document from API
        const resp = await store.dispatch('downloadSingleDocument', {
          key: key,
          userPath: document.value.carrier.id
        })
        // Get the object url to push it to the pdf iframe
        pdf.value = resp
      } catch (err) {
        console.log('Error', err)
      }
    }

    // setter method for selecting the year for regenerating the invoice
    function setInvoiceYear(year) {
      newInvoiceYear.value = year
    }

    // setter method for selecting the month for regenerating the invoice
    function setInvoiceMonth(month) {
      newInvoiceMonth.value = month
    }

    // compute status for automatic email
    const automaticEmailAllowed = computed(() => {
      try {
        return carrier.value.email && carrier.value.allowAutoInvoice
      } catch (error) {
        console.log(error)
        return false
      }
    })

    // compute status of connected daily report flags
    const reportsFlagged = computed(() => {
      try {
        // check if any dailyReport is in revise status
        for (const report of document.value.dailyReport.items) {
          if (report.flag === 'revise') {
            return true
          }
        }
        return false
      } catch (error) {
        console.log(error)
        return false
      }
    })

    function resetConfirmSuccesss() {
      // check previous state since we only want to print if the opeartion was successful
      const checkPrint = confirmSuccess.value === 'success'
      confirmSuccess.value = 'none'

      // check if operation was successful and carrier has no email or does not allow automatic emailing
      if (
        checkPrint &&
        (!carrier.value.email || !carrier.value.allowAutoInvoice)
      ) {
        // target iframe with name/id "printf"
        window.frames['printf'].print()
      }
    }

    function resetRegenerateSuccesss() {
      regenerateSuccess.value = 'none'
    }

    function resetConfirmInvoiceOpen() {
      confirmInvoiceOpen.value = false
    }

    function resetRegenerateInvoiceOpen() {
      regenerateInvoiceOpen.value = false
    }

    async function confirmInvoice() {
      try {
        // set loading state
        isLoading.value = true

        // reset critical action windows status
        confirmInvoiceOpen.value = false

        // Get the invoice id from the route
        const id = route.params.id

        // update invoice and send email if possible
        const response = await store.dispatch('confirmInvoice', { id })
        console.log(response)

        // set success status
        confirmSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set error state
        confirmSuccess.value = 'error'
      } finally {
        // reset loading state
        isLoading.value = false
        // Get the invoice id from the route
        const id = route.params.id
        // Get the invoice
        await getInvoice(id)
      }
    }

    function confirmButtonTapped() {
      confirmInvoiceOpen.value = true
    }

    function regenerateButtonTapped() {
      regenerateInvoiceOpen.value = true
    }

    async function regenerateInvoice() {
      try {
        // set loading state
        isLoading.value = true

        // close critical action modal
        regenerateInvoiceOpen.value = false

        // Get the invoice id from the route
        const id = route.params.id

        await store.dispatch('adminRegenerateInvoice', {
          id,
          invoiceYear: newInvoiceYear.value,
          invoiceMonth: newInvoiceMonth.value,
          invoiceNumber: invoiceNumber.value,
          extraHours: extraHours.value !== null && extraHours.value !== '' ? extraHours.value : null,
          extraHourRate: extraHourRate.value !== null && extraHourRate.value !== '' ? extraHourRate.value : null,
          extraDescription: extraDescription?.value.length > 0 ? extraDescription.value : ''
        })

        // set success state
        regenerateSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set error state
        regenerateSuccess.value = 'error'
      } finally {
        // reset loading state
        isLoading.value = false
        // Get the invoice id from the route
        const id = route.params.id
        // Get the invoice
        await getInvoice(id)
      }
    }

    // Go to previous report
    function goToPrevious() {
      if (currentIndex.value > 0) {
        id.value = invoicesIds.value[currentIndex.value - 1]
        currentIndex.value = currentIndex.value - 1
      }
    }

    // Go to next report
    function goToNext() {
      if (currentIndex.value < invoicesIds.value.length - 1) {
        id.value = invoicesIds.value[currentIndex.value + 1]
        currentIndex.value = currentIndex.value + 1
      }
    }

    // Return the setup object
    return {
      document,
      carrier,
      pdf,
      automaticEmailAllowed,
      isLoading,
      confirmInvoiceOpen,
      confirmSuccess,
      regenerateInvoiceOpen,
      regenerateSuccess,
      reportsFlagged,
      newInvoiceMonth,
      months,
      newInvoiceYear,
      invoiceNumber,
      extraHours,
      extraHourRate,
      extraDescription,
      resetConfirmSuccesss,
      resetConfirmInvoiceOpen,
      regenerateButtonTapped,
      resetRegenerateSuccesss,
      resetRegenerateInvoiceOpen,
      regenerateInvoice,
      confirmInvoice,
      confirmButtonTapped,
      setInvoiceYear,
      setInvoiceMonth,
      goToNext,
      goToPrevious
    }
  }
}
</script>
