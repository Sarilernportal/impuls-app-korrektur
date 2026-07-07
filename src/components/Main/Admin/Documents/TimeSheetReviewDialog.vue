<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Nachweis-Prüfansicht (Nachweiszentrale)

Zeigt einen Leistungsnachweis zum PRÜFEN: alle Tages-Dokumentationen mit
Datum/Zeit/Stunden/Tätigkeit, Unterschriften-Ampel und Doku-Abgleich – und
erlaubt direkt Freigeben bzw. Rückfrage. Arbeitet auf dem geladenen Objekt
und funktioniert damit im Demo- UND Live-Betrieb.
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
            v-if="timeSheet"
            data-testid="review-dialog"
            class="inline-block w-full transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-2xl sm:align-middle"
          >
            <!-- Kopf -->
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <DialogTitle as="h3" class="text-lg font-semibold text-slate-900">Nachweis prüfen</DialogTitle>
                  <p class="mt-0.5 text-sm text-slate-500">{{ childName }} · {{ guardianName }} · {{ carrierName }}</p>
                </div>
                <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', meta.badgeClass]">{{ meta.label }}</span>
              </div>
            </div>

            <div class="max-h-[65vh] overflow-y-auto px-6 py-5">
              <!-- Prüf-Status auf einen Blick -->
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-lg bg-slate-50 p-3">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Unterschriften</p>
                  <div class="mt-1.5"><SignatureTrafficLight :signatures="signatures" /></div>
                  <p v-if="!signatures.complete" class="mt-1 text-xs text-amber-700">Fehlt: {{ signatures.missing.join(', ') }}</p>
                </div>
                <div class="rounded-lg bg-slate-50 p-3">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Doku-Abgleich</p>
                  <p :class="['mt-1.5 inline-flex items-center gap-1 text-sm font-semibold', docState.ok ? 'text-emerald-700' : 'text-amber-700']">
                    <component :is="docState.ok ? CheckCircleIcon : ExclamationTriangleIcon" class="h-4 w-4" aria-hidden="true" />
                    {{ docState.label }}
                  </p>
                </div>
              </div>

              <!-- Tages-Dokumentationen -->
              <h4 class="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Dokumentierte Einsätze ({{ reports.length }})
              </h4>
              <div v-if="reports.length === 0" class="mt-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                Keine Tages-Dokumentation vorhanden – der Nachweis kann nicht freigegeben werden.
              </div>
              <table v-else class="mt-2 w-full text-sm" data-testid="review-reports">
                <thead>
                  <tr class="border-b border-slate-200 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    <th class="py-2 pr-2">Datum</th>
                    <th class="py-2 pr-2">Zeit</th>
                    <th class="py-2 pr-2 text-right">Stunden</th>
                    <th class="py-2 pr-2">Tätigkeit</th>
                    <th class="py-2">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="report in reports" :key="report.id" class="text-slate-700">
                    <td class="py-2.5 pr-2">{{ reportDate(report) }}</td>
                    <td class="py-2.5 pr-2 tabular-nums">{{ reportTime(report) }}</td>
                    <td class="py-2.5 pr-2 text-right tabular-nums">{{ reportHoursLabel(report) }}</td>
                    <td class="py-2.5 pr-2">{{ activityLabel(report) }}</td>
                    <td class="py-2.5">
                      <span v-if="report.flag === 'revise'" class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Rückfrage</span>
                      <span v-else-if="report.sick" class="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">Terminabsage</span>
                      <span v-else class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">ok</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="mt-4 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
                <span class="text-sm font-medium">Gesamtstunden ({{ periodLabel }})</span>
                <span class="text-lg font-bold tabular-nums">{{ totalHoursLabel }}</span>
              </div>
            </div>

            <!-- Fuß / Aktionen -->
            <div class="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-between">
              <button class="btn-secondary" @click="$emit('close')">Schließen</button>
              <div class="flex flex-col-reverse gap-2 sm:flex-row">
                <button v-if="showDetailsLink" class="btn-secondary" @click="$emit('open-details')">Detailseite öffnen</button>
                <button
                  v-if="!isReleased"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  @click="$emit('query')"
                >
                  <ChatBubbleLeftRightIcon class="h-4 w-4" aria-hidden="true" /> Rückfrage stellen
                </button>
                <button
                  v-if="releasable"
                  data-testid="dialog-release-btn"
                  class="btn-primary"
                  @click="$emit('release')"
                >
                  <CheckIcon class="h-4 w-4" aria-hidden="true" /> Freigeben
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
import { computed } from 'vue'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import {
  CheckIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import SignatureTrafficLight from '@/components/Main/Admin/Billing/SignatureTrafficLight.vue'
import { reviewMeta, reviewSignatures, docMatch, REVIEW_STATUS } from '@/utilities/billing/review.js'

const ACTIVITY_LABELS = {
  school: 'Schulbegleitung',
  helpPlanDiscussion: 'Hilfeplangespräch',
  getToKnowInterview: 'Kennenlerngespräch',
  hospitation: 'Hospitation',
  excursion: 'Ausflug',
  supervision: 'Supervision',
  teamMeeting: 'Teambesprechung',
  employeeSickness: 'Krankheit Mitarbeiter:in',
  holiday: 'Feiertag',
  vacation: 'Ferien',
  other: 'Sonstiges',
  miscellaneous: 'Sonstiges'
}

export default {
  name: 'TimeSheetReviewDialog',
  components: {
    HDialog: Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    CheckIcon,
    ChatBubbleLeftRightIcon,
    SignatureTrafficLight
  },
  props: {
    open: { type: Boolean, required: true, default: false },
    timeSheet: { type: Object, default: null },
    // Prüf-Status inkl. UI-Overrides (kommt aus der Übersicht)
    status: { type: String, default: '' },
    releasable: { type: Boolean, default: false },
    showDetailsLink: { type: Boolean, default: false }
  },
  emits: ['close', 'release', 'query', 'open-details'],
  setup(props) {
    const reports = computed(() => props.timeSheet?.dailyReport?.items || [])
    const meta = computed(() => reviewMeta(props.status))
    const isReleased = computed(() => props.status === REVIEW_STATUS.FREIGEGEBEN)
    const signatures = computed(() => reviewSignatures(props.timeSheet || {}))
    const docState = computed(() => docMatch(props.timeSheet || {}))

    const childName = computed(
      () => [props.timeSheet?.child?.name, props.timeSheet?.child?.familyName].filter(Boolean).join(' ') || 'Nicht angegeben'
    )
    const guardianName = computed(
      () => [props.timeSheet?.guardian?.name, props.timeSheet?.guardian?.familyName].filter(Boolean).join(' ') || 'Nicht angegeben'
    )
    const carrierName = computed(() => props.timeSheet?.carrier?.name || 'Nicht angegeben')

    function reportHoursDecimal(report) {
      if (typeof report.hourFrom !== 'number' || typeof report.hourTo !== 'number') return 0
      const from = report.hourFrom + (report.minuteFrom || 0) / 60
      const to = report.hourTo + (report.minuteTo || 0) / 60
      return Math.max(to - from, 0)
    }
    function pad(value) {
      return String(value || 0).padStart(2, '0')
    }
    function reportDate(report) {
      const date = new Date(report.documentDate)
      return Number.isNaN(date.getTime()) ? '–' : date.toLocaleDateString('de-DE')
    }
    function reportTime(report) {
      if (typeof report.hourFrom !== 'number') return '–'
      return `${pad(report.hourFrom)}:${pad(report.minuteFrom)} – ${pad(report.hourTo)}:${pad(report.minuteTo)}`
    }
    function reportHoursLabel(report) {
      const hours = reportHoursDecimal(report)
      const h = Math.floor(hours)
      const m = Math.round((hours % 1) * 60)
      return m === 0 ? `${h} h` : `${h} h ${m} m`
    }
    function activityLabel(report) {
      return ACTIVITY_LABELS[report.reportActivity] || report.reportActivity || '–'
    }

    const totalHoursLabel = computed(() => {
      const total = reports.value.reduce((sum, report) => sum + reportHoursDecimal(report), 0)
      const h = Math.floor(total)
      const m = Math.round((total % 1) * 60)
      return m === 0 ? `${h} h` : `${h} h ${m} m`
    })

    const periodLabel = computed(() => {
      const dates = reports.value
        .map((report) => new Date(report.documentDate))
        .filter((date) => !Number.isNaN(date.getTime()))
      if (dates.length === 0) return 'Zeitraum offen'
      const start = new Date(Math.min(...dates)).toLocaleDateString('de-DE')
      const end = new Date(Math.max(...dates)).toLocaleDateString('de-DE')
      return start === end ? start : `${start} – ${end}`
    })

    return {
      reports,
      meta,
      isReleased,
      signatures,
      docState,
      childName,
      guardianName,
      carrierName,
      reportDate,
      reportTime,
      reportHoursLabel,
      activityLabel,
      totalHoursLabel,
      periodLabel,
      CheckCircleIcon,
      ExclamationTriangleIcon
    }
  }
}
</script>
