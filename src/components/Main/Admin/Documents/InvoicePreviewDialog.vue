<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Rechnungsansicht (Vorschau vor Versand)

Zeigt die Rechnung, wie sie an den Kostenträger geht: Empfänger, Positionen,
Rechnungskorrekturen (nur vor Versand, mit Pflicht-Begründung) und die
BERECHNUNGSGRUNDLAGE als Anlage – jeder Kostenträger hat eigene Regeln
(Krankheit, Soll, Pool, Stundensatz), die hier prüfbar ausgewiesen werden.
-->
<template>
  <TransitionRoot as="template" :show="open">
    <HDialog as="div" static class="fixed inset-0 z-20 overflow-y-auto" :open="open" @close="$emit('close')">
      <div class="flex min-h-screen items-end justify-center px-4 pb-16 pt-4 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
        </TransitionChild>
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="invoice"
            data-testid="invoice-preview"
            class="inline-block w-full transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-3xl sm:align-middle"
          >
            <!-- Kopf -->
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <DialogTitle as="h3" class="text-lg font-semibold text-slate-900">Rechnungsansicht</DialogTitle>
                  <p class="mt-0.5 text-sm text-slate-500">{{ invoiceNumber }} · {{ period }}</p>
                </div>
                <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', statusBadge.badgeClass]">
                  {{ statusBadge.label }}
                </span>
              </div>
            </div>

            <div class="max-h-[70vh] overflow-y-auto px-6 py-5">
              <!-- Empfänger -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-lg bg-slate-50 p-3">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Rechnungsempfänger</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">{{ carrierDisplayName }}</p>
                  <p v-if="carrierAddress" class="text-sm text-slate-600">{{ carrierAddress }}</p>
                  <p v-if="invoice.carrier?.billingContactName" class="mt-1 text-xs text-slate-500">
                    z. Hd. {{ invoice.carrier.billingContactName }}
                  </p>
                </div>
                <div class="rounded-lg bg-slate-50 p-3">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Leistung für</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">{{ childName }}</p>
                  <p class="text-sm text-slate-600">Fachkraft: {{ guardianName }}</p>
                  <p v-if="invoice.child?.recordNumber" class="mt-1 text-xs text-slate-500">
                    Aktenzeichen: {{ invoice.child.recordNumber }}
                  </p>
                </div>
              </div>

              <!-- Positionen -->
              <h4 class="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Positionen</h4>
              <table class="mt-2 w-full text-sm" data-testid="invoice-positions">
                <thead>
                  <tr class="border-b border-slate-200 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    <th class="py-2 pr-2">Leistung</th>
                    <th class="py-2 pr-2 text-right">Stunden</th>
                    <th class="py-2 pr-2 text-right">Satz</th>
                    <th class="py-2 text-right">Betrag</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="position in positions" :key="position.key">
                    <td class="py-2.5 pr-2">
                      <p class="font-medium text-slate-800">{{ position.label }}</p>
                      <p v-if="position.note" class="text-xs text-amber-700">{{ position.note }}</p>
                    </td>
                    <td class="py-2.5 pr-2 text-right tabular-nums">{{ formatHours(position.hours) }}</td>
                    <td class="py-2.5 pr-2 text-right tabular-nums">{{ position.rate !== null ? formatEuro(position.rate) : '–' }}</td>
                    <td class="py-2.5 text-right font-semibold tabular-nums">
                      {{ position.amount !== null ? formatEuro(position.amount) : 'offen' }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Ergänzungen & Korrekturen (Zusatzpositionen wie in der Vorlage:
                   Bekleidungspauschale, Taschengeld, Nachhilfe … oder Kürzungen) -->
              <div class="mt-6 flex items-center justify-between">
                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Ergänzungen &amp; Korrekturen</h4>
                <button
                  v-if="editable && !showCorrectionForm"
                  data-testid="add-correction-btn"
                  class="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="openCorrectionForm"
                >
                  <PlusIcon class="h-3.5 w-3.5" aria-hidden="true" /> Position ergänzen
                </button>
              </div>
              <p v-if="!editable" class="mt-1 text-xs text-slate-400">
                Rechnung ist bereits versendet/bezahlt – Ergänzungen und Korrekturen sind nicht mehr möglich.
              </p>

              <ul v-if="corrections.length" class="mt-2 space-y-2" data-testid="correction-list">
                <li
                  v-for="(correction, index) in corrections"
                  :key="index"
                  class="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"
                >
                  <div>
                    <p class="text-sm font-medium text-slate-800">{{ correction.label }}</p>
                    <p class="text-xs text-slate-500">
                      {{ correction.quantity || 1 }} × {{ formatEuro(correction.unitAmount ?? correction.amount) }}
                      <span v-if="correction.reason"> · {{ correction.reason }}</span>
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold tabular-nums" :class="correction.amount < 0 ? 'text-red-700' : 'text-emerald-700'">
                      {{ correction.amount > 0 ? '+' : '' }}{{ formatEuro(correction.amount) }}
                    </span>
                    <button
                      v-if="editable"
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                      @click="$emit('remove-correction', index)"
                    >
                      <XMarkIcon class="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              </ul>
              <p v-else-if="editable && !showCorrectionForm" class="mt-2 text-sm text-slate-400">
                Keine Ergänzungen erfasst – z. B. Bekleidungspauschale, Taschengeld, Nachhilfe oder eine Kürzung.
              </p>

              <!-- Formular: Position ergänzen -->
              <div v-if="showCorrectionForm" class="mt-3 rounded-lg border border-slate-200 p-3">
                <div class="grid gap-3 sm:grid-cols-3">
                  <div class="sm:col-span-3">
                    <label class="block text-xs font-medium text-slate-600" for="correctionLabel">Bezeichnung*</label>
                    <input id="correctionLabel" v-model="correctionForm.label" class="input-base mt-1" placeholder="z. B. Bekleidungspauschale, Nachhilfe, Kürzung nach Prüfung" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600" for="correctionQuantity">Menge</label>
                    <input id="correctionQuantity" type="number" min="1" step="1" v-model.number="correctionForm.quantity" class="input-base mt-1" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-medium text-slate-600" for="correctionAmount">Betrag je Einheit (€, negativ = Abzug)*</label>
                    <input id="correctionAmount" type="number" step="0.01" v-model.number="correctionForm.unitAmount" class="input-base mt-1" placeholder="60.00 oder -45.50" />
                  </div>
                  <div class="sm:col-span-3">
                    <label class="block text-xs font-medium text-slate-600" for="correctionReason">
                      Begründung <span v-if="(correctionForm.unitAmount || 0) < 0">*</span> (wird protokolliert; Pflicht bei Kürzungen)
                    </label>
                    <textarea id="correctionReason" v-model="correctionForm.reason" rows="2" class="input-base mt-1" placeholder="z. B. Absprache mit der Sachbearbeitung"></textarea>
                  </div>
                </div>
                <p v-if="correctionError" class="mt-2 text-xs text-red-600">{{ correctionError }}</p>
                <div class="mt-3 flex justify-end gap-2">
                  <button class="btn-secondary" @click="showCorrectionForm = false">Abbrechen</button>
                  <button data-testid="save-correction-btn" class="btn-primary" @click="submitCorrection">Übernehmen</button>
                </div>
              </div>

              <!-- Summe -->
              <div class="mt-5 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
                <span class="text-sm font-medium">Rechnungsbetrag<span v-if="corrections.length"> (inkl. Korrekturen)</span></span>
                <span data-testid="invoice-total" class="text-lg font-bold tabular-nums">{{ formatEuro(total) }}</span>
              </div>
              <p v-if="hasOpenPositions" class="mt-1 text-xs text-amber-700">
                Enthält offene Positionen (Detailregel des Amtes folgt) – diese sind im Betrag noch nicht enthalten.
              </p>

              <!-- Berechnungsgrundlage -->
              <div class="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4" data-testid="calculation-basis">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <ScaleIcon class="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  Berechnungsgrundlage (Anlage für den Kostenträger)
                </h4>
                <p class="mt-1 text-xs text-blue-800">
                  Regeln dieses Kostenträgers, mit denen die Rechnung berechnet wurde – zur Prüfbarkeit durch die Behörde.
                </p>
                <dl class="mt-3 space-y-1.5">
                  <div v-for="row in basis" :key="row.label" class="flex flex-col gap-0.5 text-sm sm:flex-row sm:justify-between sm:gap-4">
                    <dt class="font-medium text-blue-900 sm:w-44 sm:flex-shrink-0">{{ row.label }}</dt>
                    <dd class="text-blue-800 sm:text-right">{{ row.value }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Fuß -->
            <div class="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-between">
              <button class="btn-secondary" @click="$emit('close')">Schließen</button>
              <div class="flex flex-col-reverse gap-2 sm:flex-row">
                <button v-if="showDetailsLink" class="btn-secondary" @click="$emit('open-details')">Detailseite öffnen</button>
                <button data-testid="print-invoice-btn" class="btn-secondary" @click="printInvoice">
                  <PrinterIcon class="h-4 w-4" aria-hidden="true" /> Drucken / PDF
                </button>
                <button v-if="editable" class="btn-primary" @click="$emit('mark-ready')">
                  <PaperAirplaneIcon class="h-4 w-4" aria-hidden="true" /> Versand vorbereiten
                </button>
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { PlusIcon, XMarkIcon, ScaleIcon, PaperAirplaneIcon, PrinterIcon } from '@heroicons/vue/24/outline'
import {
  invoicePositions,
  invoiceTotal,
  canCorrect,
  calculationBasis,
  formatEuro,
  formatHours
} from '@/utilities/billing/invoiceView.js'
import { buildInvoiceHtml, openInvoicePrintWindow } from '@/utilities/billing/invoicePrint.js'
import logoUrl from '@/assets/img/logo_main.png'

export default {
  name: 'InvoicePreviewDialog',
  components: {
    HDialog: Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    PlusIcon,
    XMarkIcon,
    ScaleIcon,
    PaperAirplaneIcon,
    PrinterIcon
  },
  props: {
    open: { type: Boolean, required: true, default: false },
    invoice: { type: Object, default: null },
    corrections: { type: Array, default: () => [] },
    showDetailsLink: { type: Boolean, default: false }
  },
  emits: ['close', 'add-correction', 'remove-correction', 'mark-ready', 'open-details'],
  setup(props, { emit }) {
    const showCorrectionForm = ref(false)
    const correctionError = ref('')
    const correctionForm = reactive({ label: '', quantity: 1, unitAmount: null, reason: '' })

    const positions = computed(() => (props.invoice ? invoicePositions(props.invoice) : []))
    const basis = computed(() => (props.invoice ? calculationBasis(props.invoice) : []))
    const total = computed(() => invoiceTotal(positions.value, props.corrections))
    const editable = computed(() => canCorrect(props.invoice))
    const hasOpenPositions = computed(() => positions.value.some((position) => position.amount === null))

    const invoiceNumber = computed(() => props.invoice?.internalNumber || 'Rechnungsnummer offen')
    const childName = computed(
      () => [props.invoice?.child?.name, props.invoice?.child?.familyName].filter(Boolean).join(' ') || 'Nicht angegeben'
    )
    const guardianName = computed(
      () => [props.invoice?.guardian?.name, props.invoice?.guardian?.familyName].filter(Boolean).join(' ') || 'Nicht angegeben'
    )
    const carrierDisplayName = computed(
      () => props.invoice?.carrier?.billingName || props.invoice?.carrier?.name || 'Nicht angegeben'
    )
    const carrierAddress = computed(() => {
      const carrier = props.invoice?.carrier || {}
      const street = [carrier.billingStreet || carrier.street, carrier.billingHouseNumber || carrier.houseNumber]
        .filter(Boolean)
        .join(' ')
      const city = [carrier.billingPostalCode || carrier.postalCode, carrier.billingCity || carrier.city]
        .filter(Boolean)
        .join(' ')
      return [street, city].filter(Boolean).join(', ')
    })

    const period = computed(() => {
      const invoice = props.invoice
      if (!invoice) return ''
      const dates = (invoice.dailyReport?.items || [])
        .map((report) => report.documentDate)
        .filter(Boolean)
        .map((date) => new Date(date))
      if (dates.length === 0) {
        return invoice.invoiceMonth && invoice.invoiceYear
          ? `${invoice.invoiceMonth} ${invoice.invoiceYear}`
          : 'Zeitraum offen'
      }
      const start = new Date(Math.min(...dates)).toLocaleDateString('de-DE')
      const end = new Date(Math.max(...dates)).toLocaleDateString('de-DE')
      return start === end ? start : `${start} – ${end}`
    })

    const statusBadge = computed(() => {
      const invoice = props.invoice || {}
      if (invoice.charged) return { label: 'Bezahlt', badgeClass: 'bg-slate-100 text-slate-600' }
      if (invoice.transmitted) return { label: 'Offen / unbezahlt', badgeClass: 'bg-amber-100 text-amber-700' }
      return { label: 'Entwurf – vor Versand', badgeClass: 'bg-emerald-100 text-emerald-700' }
    })

    function openCorrectionForm() {
      correctionForm.label = ''
      correctionForm.quantity = 1
      correctionForm.unitAmount = null
      correctionForm.reason = ''
      correctionError.value = ''
      showCorrectionForm.value = true
    }

    function submitCorrection() {
      correctionError.value = ''
      if (!correctionForm.label.trim()) {
        correctionError.value = 'Bitte eine Bezeichnung angeben.'
        return
      }
      const quantity = Math.max(1, Math.round(Number(correctionForm.quantity) || 1))
      const unitAmount = Number(correctionForm.unitAmount)
      if (!Number.isFinite(unitAmount) || unitAmount === 0) {
        correctionError.value = 'Bitte einen Betrag je Einheit ungleich 0 angeben (negativ = Abzug).'
        return
      }
      // Zusätze (Taschengeld, Pauschalen …) brauchen keine Begründung –
      // Kürzungen/Abzüge dagegen immer (Protokollpflicht).
      if (unitAmount < 0 && !correctionForm.reason.trim()) {
        correctionError.value = 'Bei Kürzungen ist eine Begründung Pflicht (wird protokolliert).'
        return
      }
      emit('add-correction', {
        label: correctionForm.label.trim(),
        quantity,
        unitAmount: Math.round(unitAmount * 100) / 100,
        amount: Math.round(quantity * unitAmount * 100) / 100,
        reason: correctionForm.reason.trim(),
        at: new Date().toISOString()
      })
      showCorrectionForm.value = false
    }

    // Druckfertigen Rechnungsvordruck (Briefkopf, Positionen, Korrekturen,
    // Berechnungsgrundlage) erzeugen und den Browser-Druckdialog öffnen –
    // dort „Als PDF speichern" wählen.
    function printInvoice() {
      const carrier = props.invoice?.carrier || {}
      const street = [carrier.billingStreet || carrier.street, carrier.billingHouseNumber || carrier.houseNumber]
        .filter(Boolean)
        .join(' ')
      const city = [carrier.billingPostalCode || carrier.postalCode, carrier.billingCity || carrier.city]
        .filter(Boolean)
        .join(' ')
      const invoiceDate = props.invoice?.createdAt
        ? new Date(props.invoice.createdAt).toLocaleDateString('de-DE')
        : new Date().toLocaleDateString('de-DE')

      // Betreff laut Vorlage: „Rechnung für den Monat Juni 2026" –
      // Abrechnungsmonat bevorzugen, sonst den Zeitraum der Dokus.
      const monthLabel =
        props.invoice?.invoiceMonth && props.invoice?.invoiceYear
          ? `${props.invoice.invoiceMonth} ${props.invoice.invoiceYear}`
          : period.value

      const html = buildInvoiceHtml({
        invoiceNumber: invoiceNumber.value,
        invoiceDate,
        period: monthLabel,
        recordNumber: props.invoice?.child?.recordNumber || '',
        birthDate: props.invoice?.child?.dateOfBirth || '',
        debtorNumber: carrier.debtorNumber || '',
        recipient: {
          name: carrierDisplayName.value,
          contact: carrier.billingContactName ? `z. Hd. ${carrier.billingContactName}` : '',
          addressLine1: street,
          addressLine2: city
        },
        childName: childName.value,
        guardianName: guardianName.value,
        positions: positions.value,
        corrections: props.corrections,
        total: total.value,
        logoUrl,
        formatEuro,
        formatHours
      })
      openInvoicePrintWindow(html)
    }

    return {
      showCorrectionForm,
      correctionForm,
      correctionError,
      printInvoice,
      positions,
      basis,
      total,
      editable,
      hasOpenPositions,
      invoiceNumber,
      childName,
      guardianName,
      carrierDisplayName,
      carrierAddress,
      period,
      statusBadge,
      openCorrectionForm,
      submitCorrection,
      formatEuro,
      formatHours
    }
  }
}
</script>
