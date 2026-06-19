<template>
  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <!-- Kopf -->
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung · THA · § 35a SGB VIII</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Abrechnungszentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Nachweise prüfen, fehlende Unterlagen erkennen, Rechnungen an die Jugendämter erstellen.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="selectedRows.length === 0"
              @click="openBatch"
            >
              Ausgewählte abrechnen<span v-if="selectedRows.length"> ({{ selectedRows.length }})</span>
            </button>
            <button
              class="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              @click="navigate('Invoices')"
            >
              Rechnungen öffnen
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="localAuthMode && hasOnlyDemoData"
        class="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
      >
        Lokale Vorschau: Es werden Demo-Abrechnungsdaten angezeigt. Produktiv lädt diese Zentrale echte Dokus,
        Nachweise und Rechnungen aus AWS.
      </section>

      <!-- Kennzahl-/Filter-Karten -->
      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <button
          v-for="card in statusCards"
          :key="card.status"
          :data-testid="'filter-' + card.status"
          @click="setFilter(card.status)"
          :class="[
            'group rounded-xl border bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover',
            activeFilter === card.status ? 'border-blue-300 ring-1 ring-blue-200' : 'border-slate-200 hover:border-blue-200'
          ]"
        >
          <div class="flex items-center justify-between">
            <span :class="['rounded-full px-2 py-0.5 text-xs font-semibold', card.cardClass]">
              {{ card.label }}
            </span>
            <CheckCircleIcon v-if="activeFilter === card.status" class="h-4 w-4 text-impuls-blue" aria-hidden="true" />
          </div>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{{ card.count }}</p>
          <p class="mt-0.5 text-xs text-slate-500">Filter auf diesen Status</p>
        </button>
      </section>

      <!-- Abrechnungstabelle -->
      <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Abrechnungsprüfung</h2>
            <p class="text-sm text-slate-500">Pro Klient · Mitarbeiter:in · Monat — was ist abrechenbar?</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="activeFilter"
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
              @click="setFilter(null)"
            >
              Filter zurücksetzen
            </button>
            <button
              data-testid="batch-invoice-btn"
              class="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="selectedRows.length === 0"
              @click="openBatch"
            >
              <DocumentTextIcon class="h-4 w-4" aria-hidden="true" /> Ausgewählte abrechnen
            </button>
          </div>
        </div>

        <!-- Ladezustand -->
        <div v-if="isLoading" class="divide-y divide-slate-100">
          <div v-for="n in 4" :key="n" class="flex items-center gap-3 px-5 py-4">
            <div class="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-slate-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 w-1/3 animate-pulse rounded bg-slate-200"></div>
              <div class="h-3 w-1/2 animate-pulse rounded bg-slate-100"></div>
            </div>
          </div>
        </div>

        <!-- Leerzustand -->
        <div v-else-if="groupedRows.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <BanknotesIcon class="h-6 w-6 text-slate-400" aria-hidden="true" />
          </span>
          <p class="mt-3 text-sm font-semibold text-slate-900">Keine Abrechnungsdaten für diesen Filter</p>
          <p class="mt-1 text-sm text-slate-500">Passen Sie den Statusfilter an oder prüfen Sie die Dokumentationen.</p>
        </div>

        <!-- Tabelle -->
        <div v-else class="overflow-x-auto">
          <table data-testid="billing-table" class="w-full min-w-[1080px] border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                <th class="px-4 py-3">
                  <input type="checkbox" data-testid="select-all" :checked="allSelected" @change="toggleSelectAll" class="h-4 w-4 rounded border-slate-300 text-impuls-blue focus:ring-brand-200" />
                </th>
                <th class="px-3 py-3">Klient / Fachkraft</th>
                <th class="px-3 py-3">Jugendamt</th>
                <th class="px-3 py-3">Monat</th>
                <th class="px-3 py-3 text-right">h/Wo</th>
                <th class="px-3 py-3 text-right">Soll</th>
                <th class="px-3 py-3 text-right">Geleistet</th>
                <th class="px-3 py-3 text-right">Überhang</th>
                <th class="px-3 py-3 text-right">Abrechenbar</th>
                <th class="px-3 py-3 text-right">Betrag</th>
                <th class="px-3 py-3">Unterschriften</th>
                <th class="px-3 py-3">Status / Aktion</th>
              </tr>
            </thead>
            <tbody v-for="group in groupedRows" :key="group.key" class="border-b border-slate-100">
              <!-- Gruppenkopf je Klient -->
              <tr class="bg-slate-50/70">
                <td class="px-4 py-2.5">
                  <input
                    type="checkbox"
                    :checked="groupSelected(group)"
                    :disabled="group.selectableIds.length === 0"
                    @change="toggleGroupSelect(group)"
                    class="h-4 w-4 rounded border-slate-300 text-impuls-blue focus:ring-brand-200 disabled:opacity-40"
                  />
                </td>
                <td class="px-3 py-2.5" colspan="2">
                  <button class="flex items-center gap-2 text-left" @click="toggleGroup(group.key)">
                    <ChevronRightIcon :class="['h-4 w-4 text-slate-400 transition', isExpanded(group.key) ? 'rotate-90' : '']" aria-hidden="true" />
                    <InitialsAvatar :name="group.client" size-class="h-8 w-8 text-xs" />
                    <span class="min-w-0">
                      <span class="block font-semibold text-slate-900">{{ group.client }}</span>
                      <span class="block truncate text-xs text-slate-500">{{ group.employee }}</span>
                    </span>
                  </button>
                </td>
                <td class="px-3 py-2.5 text-xs text-slate-500" colspan="6">{{ group.rows.length }} Nachweis(e)</td>
                <td class="px-3 py-2.5 text-right font-semibold text-slate-800">{{ group.amountLabel }}</td>
                <td class="px-3 py-2.5" colspan="2"></td>
              </tr>
              <!-- Detailzeilen je Nachweis -->
              <template v-if="isExpanded(group.key)">
                <tr v-for="row in group.rows" :key="row.id" class="text-slate-700">
                  <td class="px-4 py-3 align-top">
                    <input
                      type="checkbox"
                      :checked="!!selectedIds[row.id]"
                      :disabled="!isSelectable(row)"
                      @change="toggleSelect(row)"
                      class="h-4 w-4 rounded border-slate-300 text-impuls-blue focus:ring-brand-200 disabled:opacity-40"
                    />
                  </td>
                  <td class="px-3 py-3 align-top">
                    <span class="flex items-center gap-1.5 text-xs text-slate-500">
                      <ArrowDownRightIcon class="h-3.5 w-3.5 text-slate-300" aria-hidden="true" /> Nachweis
                    </span>
                  </td>
                  <td class="px-3 py-3 align-top text-slate-600">{{ row.document.carrier?.name || '–' }}</td>
                  <td class="px-3 py-3 align-top">{{ rowMonth(row) }}</td>
                  <td class="px-3 py-3 align-top text-right tabular-nums">{{ row.display.weeklyHours }}</td>
                  <td class="px-3 py-3 align-top text-right tabular-nums">
                    <span :class="row.display.sollProvisional ? 'text-slate-400' : ''" :title="row.display.sollProvisional ? 'Vorläufig – Schulkalender folgt' : ''">
                      {{ row.display.soll }}<span v-if="row.display.sollProvisional">*</span>
                    </span>
                  </td>
                  <td class="px-3 py-3 align-top text-right tabular-nums">{{ row.display.worked }}</td>
                  <td class="px-3 py-3 align-top text-right tabular-nums" :class="row.hasOverhang ? 'font-semibold text-amber-700' : 'text-slate-300'">
                    {{ row.display.overhang }}
                  </td>
                  <td class="px-3 py-3 align-top text-right font-medium tabular-nums">{{ row.display.billable }}</td>
                  <td class="px-3 py-3 align-top text-right font-semibold tabular-nums">{{ row.display.amount }}</td>
                  <td class="px-3 py-3 align-top">
                    <SignatureTrafficLight data-testid="signatures" :signatures="row.signatures" />
                  </td>
                  <td class="px-3 py-3 align-top">
                    <div class="flex flex-wrap items-center gap-2">
                      <span :class="['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', row.statusMeta.badgeClass]">
                        {{ row.statusMeta.label }}
                      </span>
                      <button
                        v-if="row.hasOverhang"
                        data-testid="overhang-correct"
                        class="inline-flex items-center gap-1 rounded-md border border-amber-300 px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        @click="openCorrection(row)"
                      >
                        <PencilSquareIcon class="h-3.5 w-3.5" aria-hidden="true" /> korrigieren
                      </button>
                    </div>
                    <p v-if="row.correction" class="mt-1 text-[11px] text-slate-400">
                      Korrektur: {{ correctionLabel(row.correction) }}
                    </p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Erklär-Box (Ablauf) -->
        <div class="m-5 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
          <p>
            <span class="font-semibold text-slate-700">Soll</span> = bewilligte h/Woche × Schulwochen im Monat (Ferien rausgerechnet).
            <span class="font-semibold text-slate-700">Geleistet</span> aus den Leistungsnachweisen. Liegt geleistet über dem Soll, wird der
            <span class="font-semibold text-amber-700">Überhang</span> sichtbar; standardmäßig ist nur das Soll abrechenbar – über „korrigieren"
            lässt sich der Überhang deckeln, mit Begründung freigeben oder in den Folgemonat verschieben.
          </p>
          <p class="mt-2">
            Ablauf: <span class="font-medium">Doku offen → Nachweis prüfen → Abrechenbar → Rechnung erstellt → Offen/unbezahlt → Bezahlt</span>.
            <span class="ml-1">* Soll vorläufig (Schul-/Ferienkalender wird nachgeliefert).</span>
          </p>
        </div>
      </section>

      <!-- Schnellzugriff -->
      <section class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <button
          v-for="link in quickLinks"
          :key="link.title"
          class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-left shadow-sm hover:border-blue-200 hover:bg-blue-50"
          @click="navigate(link.route)"
        >
          <span>
            <span class="block text-sm font-semibold text-slate-900">{{ link.title }}</span>
            <span class="block text-xs text-slate-500">{{ link.description }}</span>
          </span>
          <ArrowRightIcon class="h-4 w-4 text-slate-400" aria-hidden="true" />
        </button>
      </section>
    </div>

    <!-- Überhang-Korrektur -->
    <overhang-correction-dialog
      :open="correctionDialogOpen"
      :row="correctionRow"
      :month-label="correctionRow ? rowMonth(correctionRow) : ''"
      @close="correctionDialogOpen = false"
      @confirmed="applyCorrection"
    />

    <!-- Sammelabrechnung -->
    <batch-invoice-dialog
      :open="batchDialogOpen"
      :rows="selectedRows"
      :is-loading="batchLoading"
      @close="batchDialogOpen = false"
      @confirmed="confirmBatch"
    />

    <!-- Erfolg -->
    <success-window
      v-if="successMessage"
      title="Sammelabrechnung vorbereitet"
      :message="successMessage"
      :open="!!successMessage"
      @close="successMessage = ''"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { isLocalAuthMode } from '@/services/authService.js'
import { dailyReportItems } from '@/utilities/billing/billing.js'
import {
  buildTimeSheetRow,
  buildInvoiceRow,
  monthContextFor
} from '@/utilities/billing/rows.js'
import {
  BILLING_STATUS,
  STATUS_CARD_ORDER,
  statusMeta
} from '@/utilities/billing/status.js'
import {
  ArrowRightIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowDownRightIcon
} from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'
import SignatureTrafficLight from '@/components/Main/Admin/Billing/SignatureTrafficLight.vue'
import OverhangCorrectionDialog from '@/components/Main/Admin/Billing/OverhangCorrectionDialog.vue'
import BatchInvoiceDialog from '@/components/Main/Admin/Billing/BatchInvoiceDialog.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'

export default {
  name: 'BillingCenter',
  components: {
    ArrowRightIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    PencilSquareIcon,
    ArrowDownRightIcon,
    InitialsAvatar,
    SignatureTrafficLight,
    OverhangCorrectionDialog,
    BatchInvoiceDialog,
    SuccessWindow
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const dailyReports = ref([])
    const invoices = ref([])
    const timeSheets = ref([])
    const isLoading = ref(false)
    const localAuthMode = isLocalAuthMode

    // Filter, Auswahl, Aufklapp- und Korrektur-Status
    const activeFilter = ref(null)
    const selectedIds = reactive({})
    const corrections = reactive({})
    const collapsedKeys = reactive({})

    const correctionDialogOpen = ref(false)
    const correctionRow = ref(null)
    const batchDialogOpen = ref(false)
    const batchLoading = ref(false)
    const successMessage = ref('')

    const monthContext = monthContextFor()

    // ── Demo-Daten (mehrere Status, Überhang, fehlende Unterschrift) ──
    const fullSignatures = { parent: true, school: true, professional: true }

    const demoTimeSheets = [
      // Abrechenbar: Soll 60 h (15 h/Wo × 4 Schulwo.), 52 h geleistet → 52 h × 45,50 € = 2.366,00 €
      makeDemoTimeSheet({
        id: 'demo-ts-lina', child: 'Lina Beispiel', employee: 'Mira Demir',
        carrier: 'JA Groß-Gerau', weeklyHours: 15, hourlyRate: 45.5,
        totalHours: 52, schoolDays: 20, hoursPerSchoolDay: 3, signatures: fullSignatures
      }),
      // Überhang: Soll 40 h (10 h/Wo × 4 Schulwo.), 46 h geleistet → +6 h, abrechenbar 40 h × 45,50 € = 1.820,00 €
      makeDemoTimeSheet({
        id: 'demo-ts-sara', child: 'Sara Yıldız', employee: 'Anna Koch',
        carrier: 'JA Mitte', weeklyHours: 10, hourlyRate: 45.5,
        totalHours: 46, schoolDays: 20, hoursPerSchoolDay: 2, signatures: fullSignatures
      }),
      // Abrechenbar: Soll 36 h (12 h/Wo × 3 Schulwo.), 33 h geleistet → 33 h × 45,50 € = 1.501,50 €
      makeDemoTimeSheet({
        id: 'demo-ts-max', child: 'Max Muster', employee: 'Jonas Keller',
        carrier: 'JA Mitte', weeklyHours: 12, hourlyRate: 45.5,
        totalHours: 33, schoolDays: 15, hoursPerSchoolDay: 2.4, signatures: fullSignatures
      }),
      // Nachweis prüfen: Unterschrift der Schule fehlt
      makeDemoTimeSheet({
        id: 'demo-ts-ben', child: 'Ben Roth', employee: 'Sven Bauer',
        carrier: 'JA Groß-Gerau', weeklyHours: 10, hourlyRate: 45.5,
        totalHours: 40, schoolDays: 20, hoursPerSchoolDay: 2,
        signatures: { parent: true, school: false, professional: true }
      }),
      // Nachweis prüfen: Doku zur Überarbeitung markiert
      makeDemoTimeSheet({
        id: 'demo-ts-mia', child: 'Mia Schulz', employee: 'Anna Koch',
        carrier: 'JA Mitte', weeklyHours: 8, hourlyRate: 45.5,
        totalHours: 28, schoolDays: 14, hoursPerSchoolDay: 2, flag: 'revise', signatures: fullSignatures
      }),
      // Doku offen: noch keine Tages-Dokus vorhanden
      makeDemoTimeSheet({
        id: 'demo-ts-tom', child: 'Tom Klein', employee: 'Sven Bauer',
        carrier: 'JA Groß-Gerau', weeklyHours: 8, hourlyRate: 45.5,
        totalHours: 0, signatures: fullSignatures
      })
    ]

    const demoInvoices = [
      // Rechnung erstellt (noch nicht versendet)
      makeDemoInvoice({
        id: 'demo-inv-1', internalNumber: 'RE-2026-0501', child: 'Nora Sahin',
        employee: 'Mira Demir', carrier: 'JA Groß-Gerau', weeklyHours: 12,
        hourlyRate: 45.5, totalHours: 54, transmitted: false, charged: false
      }),
      // Offen / unbezahlt (versendet, noch nicht bezahlt)
      makeDemoInvoice({
        id: 'demo-inv-2', internalNumber: 'RE-2026-0488', child: 'Erik Wolf',
        employee: 'Anna Koch', carrier: 'JA Mitte', weeklyHours: 10,
        hourlyRate: 45.5, totalHours: 45, transmitted: true, charged: false
      })
    ]

    onMounted(loadBillingData)

    const sourceTimeSheets = computed(() =>
      localAuthMode && timeSheets.value.length === 0 ? demoTimeSheets : timeSheets.value
    )
    const sourceInvoices = computed(() =>
      localAuthMode && invoices.value.length === 0 ? demoInvoices : invoices.value
    )
    const hasOnlyDemoData = computed(
      () => dailyReports.value.length === 0 && timeSheets.value.length === 0 && invoices.value.length === 0
    )

    // Alle Zeilen (Nachweise + Rechnungen) mit voller Berechnung
    const allRows = computed(() => {
      const timeSheetRows = sourceTimeSheets.value
        .filter((ts) => ts.reportType !== 'special')
        .map((ts) =>
          buildTimeSheetRow(ts, {
            monthContext: ts.demoContext ? { ...monthContext, ...ts.demoContext } : monthContext,
            correction: corrections[ts.id] || null
          })
        )
      const invoiceRows = sourceInvoices.value.map((inv) => buildInvoiceRow(inv))
      return [...timeSheetRows, ...invoiceRows]
    })

    // Karten-Filter "abrechenbar" umfasst auch "ueberhang"
    function matchesFilter(row, filter) {
      if (!filter) return true
      if (filter === BILLING_STATUS.ABRECHENBAR) {
        return row.status === BILLING_STATUS.ABRECHENBAR || row.status === BILLING_STATUS.UEBERHANG
      }
      return row.status === filter
    }

    const statusCards = computed(() =>
      STATUS_CARD_ORDER.map((status) => ({
        status,
        ...statusMeta(status),
        count: allRows.value.filter((row) => matchesFilter(row, status)).length
      }))
    )

    const filteredRows = computed(() => allRows.value.filter((row) => matchesFilter(row, activeFilter.value)))

    // Gruppierung pro Klient
    const groupedRows = computed(() => {
      const map = new Map()
      filteredRows.value.forEach((row) => {
        const client = row.document.child?.name
          ? `${row.document.child.name} ${row.document.child.familyName || ''}`.trim()
          : 'Nicht angegeben'
        const key = row.document.child?.id || client
        if (!map.has(key)) {
          map.set(key, {
            key,
            client,
            employee: employeeName(row.document),
            rows: [],
            amount: 0,
            selectableIds: []
          })
        }
        const group = map.get(key)
        group.rows.push(row)
        if (Number.isFinite(row.amount)) group.amount += row.amount
        if (isSelectable(row)) group.selectableIds.push(row.id)
      })
      return Array.from(map.values()).map((group) => ({
        ...group,
        amountLabel: group.amount > 0 ? formatEuroLocal(group.amount) : '–'
      }))
    })

    // Auswahl
    function isSelectable(row) {
      return (
        row.kind === 'timeSheet' &&
        (row.status === BILLING_STATUS.ABRECHENBAR || row.status === BILLING_STATUS.UEBERHANG)
      )
    }
    const selectedRows = computed(() => allRows.value.filter((row) => selectedIds[row.id] && isSelectable(row)))
    const selectableRows = computed(() => filteredRows.value.filter(isSelectable))
    const allSelected = computed(
      () => selectableRows.value.length > 0 && selectableRows.value.every((row) => selectedIds[row.id])
    )

    function toggleSelect(row) {
      if (!isSelectable(row)) return
      if (selectedIds[row.id]) delete selectedIds[row.id]
      else selectedIds[row.id] = true
    }
    function toggleSelectAll() {
      const select = !allSelected.value
      selectableRows.value.forEach((row) => {
        if (select) selectedIds[row.id] = true
        else delete selectedIds[row.id]
      })
    }
    function groupSelected(group) {
      return group.selectableIds.length > 0 && group.selectableIds.every((id) => selectedIds[id])
    }
    function toggleGroupSelect(group) {
      const select = !groupSelected(group)
      group.selectableIds.forEach((id) => {
        if (select) selectedIds[id] = true
        else delete selectedIds[id]
      })
    }

    // Aufklappen (Standard: aufgeklappt)
    function isExpanded(key) {
      return !collapsedKeys[key]
    }
    function toggleGroup(key) {
      if (collapsedKeys[key]) delete collapsedKeys[key]
      else collapsedKeys[key] = true
    }

    function setFilter(status) {
      activeFilter.value = activeFilter.value === status ? null : status
    }

    // Überhang-Korrektur
    function openCorrection(row) {
      correctionRow.value = row
      correctionDialogOpen.value = true
    }
    function applyCorrection(correction) {
      if (correctionRow.value) corrections[correctionRow.value.id] = correction
      correctionDialogOpen.value = false
    }
    function correctionLabel(correction) {
      if (correction.mode === 'release') return `freigegeben (+${correction.releasedHours} h)`
      if (correction.mode === 'carryover') return 'in Folgemonat verschoben'
      return 'gedeckelt'
    }

    // Sammelabrechnung
    function openBatch() {
      if (selectedRows.value.length === 0) return
      batchDialogOpen.value = true
    }
    async function confirmBatch() {
      batchLoading.value = true
      try {
        const carriers = new Set(selectedRows.value.map((row) => row.document.carrier?.name || 'Ohne Kostenträger'))
        const count = selectedRows.value.length
        // Frontend-first: serverseitige Bündelung folgt mit der Backend-Erweiterung.
        successMessage.value = `${count} Nachweis(e) für ${carriers.size} Kostenträger zur Abrechnung vorbereitet.`
        Object.keys(selectedIds).forEach((id) => delete selectedIds[id])
        batchDialogOpen.value = false
      } finally {
        batchLoading.value = false
      }
    }

    async function loadBillingData() {
      try {
        isLoading.value = true
        const [reportResponse, timeSheetResponse, invoiceResponse] = await Promise.all([
          store.dispatch('getDailyReportDocuments', { nextToken: null }),
          store.dispatch('getTimeSheetDocuments', { nextToken: null }),
          store.dispatch('getInvoiceDocuments', { nextToken: null })
        ])
        dailyReports.value = reportResponse.items || []
        timeSheets.value = timeSheetResponse.items || []
        invoices.value = invoiceResponse.items || []
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function employeeName(document) {
      const name = [document.guardian?.name, document.guardian?.familyName].filter(Boolean).join(' ')
      return name || 'Nicht angegeben'
    }

    function rowMonth(row) {
      const document = row.document
      const items = dailyReportItems(document)
      const date = items.find((item) => item.documentDate)?.documentDate || document.documentDate || document.createdAt
      if (!date) {
        return document.invoiceMonth && document.invoiceYear
          ? `${document.invoiceMonth} ${document.invoiceYear}`
          : 'Keine Angabe'
      }
      return new Date(date).toLocaleString('de-DE', { month: 'long', year: 'numeric' })
    }

    function formatEuroLocal(amount) {
      return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
    }

    const quickLinks = [
      { title: 'Alle Nachweise', description: 'Leistungsnachweise prüfen und filtern', route: 'Timesheets' },
      { title: 'Rechnungen', description: 'Erstellte Rechnungen öffnen', route: 'Invoices' },
      { title: 'Dokumentationen', description: 'Dokus nach Klient und Zeitraum', route: 'Reports' },
      { title: 'Klienten', description: 'Fallakten und Zuordnungen', route: 'ChildrenOverview' }
    ]

    // ── Demo-Helfer ──
    // Erzeugt Tages-Dokus mit exakt der gewünschten Gesamtstundenzahl
    // (volle 4-h-Tage + ggf. ein Resttag), damit "Geleistet" planbar ist.
    function makeDayReports(prefix, totalHours, flag) {
      const items = []
      let remaining = totalHours
      let i = 0
      while (remaining > 0) {
        const h = Math.min(4, remaining)
        items.push({
          id: `${prefix}-day-${i}`,
          type: 'dailyReport',
          documentDate: new Date(monthContext.year, monthContext.month, i + 1).toISOString(),
          flag: i === 0 ? flag || null : null,
          charged: false,
          hourFrom: 9,
          minuteFrom: 0,
          hourTo: 9 + Math.floor(h),
          minuteTo: Math.round((h % 1) * 60)
        })
        remaining -= h
        i++
      }
      return items
    }
    function makeDemoTimeSheet(o) {
      const [name, familyName] = o.child.split(' ')
      const [gName, gFamily] = o.employee.split(' ')
      return {
        id: o.id,
        type: 'timeSheet',
        reportType: 'standard',
        documentDate: new Date(monthContext.year, monthContext.month, 15).toISOString(),
        signatures: o.signatures,
        key: o.signatures?.professional ? 'sig-key' : undefined,
        // Demo: Schultage/Stunden je Tag, damit das Soll exakt aufgeht.
        demoContext: o.schoolDays
          ? { schoolDays: o.schoolDays, hoursPerSchoolDay: o.hoursPerSchoolDay }
          : null,
        child: { id: `${o.id}-child`, name, familyName, weeklyHours: o.weeklyHours, hourlyRate: o.hourlyRate },
        guardian: { id: `${o.id}-guardian`, name: gName, familyName: gFamily },
        carrier: { id: `${o.id}-carrier`, name: o.carrier, defaultHourlyRate: o.hourlyRate },
        dailyReport: { items: makeDayReports(o.id, o.totalHours || 0, o.flag) }
      }
    }
    function makeDemoInvoice(o) {
      const [name, familyName] = o.child.split(' ')
      const [gName, gFamily] = o.employee.split(' ')
      return {
        id: o.id,
        type: 'invoice',
        internalNumber: o.internalNumber,
        transmitted: o.transmitted,
        charged: o.charged,
        invoiceYear: monthContext.year,
        invoiceMonth: new Date(monthContext.year, monthContext.month, 1).toLocaleString('de-DE', { month: 'long' }),
        createdAt: new Date(monthContext.year, monthContext.month, 20).toISOString(),
        child: { id: `${o.id}-child`, name, familyName, weeklyHours: o.weeklyHours, hourlyRate: o.hourlyRate },
        guardian: { id: `${o.id}-guardian`, name: gName, familyName: gFamily },
        carrier: { id: `${o.id}-carrier`, name: o.carrier, defaultHourlyRate: o.hourlyRate },
        dailyReport: { items: makeDayReports(o.id, o.totalHours || 0) }
      }
    }

    return {
      isLoading,
      localAuthMode,
      hasOnlyDemoData,
      activeFilter,
      statusCards,
      groupedRows,
      selectedIds,
      selectedRows,
      allSelected,
      correctionDialogOpen,
      correctionRow,
      batchDialogOpen,
      batchLoading,
      successMessage,
      quickLinks,
      setFilter,
      isSelectable,
      isExpanded,
      toggleGroup,
      toggleSelect,
      toggleSelectAll,
      groupSelected,
      toggleGroupSelect,
      openCorrection,
      applyCorrection,
      correctionLabel,
      openBatch,
      confirmBatch,
      navigate,
      rowMonth
    }
  }
}
</script>
