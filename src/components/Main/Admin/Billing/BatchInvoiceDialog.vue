<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Sammelabrechnung – Bestätigung

Bündelt die ausgewählten abrechenbaren Nachweise zu Rechnung(en), gruppiert
pro Kostenträger / Jugendamt. Zeigt vor dem Erstellen eine Zusammenfassung
(je Kostenträger: Anzahl Nachweise, Summe Betrag).
-->
<template>
  <TransitionRoot as="template" :show="open">
    <HDialog as="div" static class="fixed inset-0 z-20 overflow-y-auto" :open="open" @close="$emit('close')">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
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
          <div class="inline-block w-full transform overflow-hidden rounded-xl bg-white px-5 pb-5 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
            <div class="flex items-start gap-3">
              <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <DocumentTextIcon class="h-5 w-5 text-blue-600" aria-hidden="true" />
              </span>
              <div>
                <DialogTitle as="h3" class="text-base font-semibold text-slate-900">Ausgewählte abrechnen</DialogTitle>
                <p class="mt-0.5 text-sm text-slate-500">
                  {{ totalCount }} Nachweis(e) werden pro Kostenträger zu Rechnungen gebündelt.
                </p>
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <div
                v-for="group in groups"
                :key="group.carrier"
                class="rounded-lg border border-slate-200 p-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-slate-800">{{ group.carrier }}</span>
                  <span class="text-sm font-semibold text-slate-900">{{ group.amountLabel }}</span>
                </div>
                <p class="mt-0.5 text-xs text-slate-500">
                  {{ group.rows.length }} Nachweis(e) · {{ group.clients }}
                </p>
              </div>
            </div>

            <p class="mt-4 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
              <InformationCircleIcon class="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Erstellt je Kostenträger eine Sammelrechnung. Die serverseitige Bündelung wird mit der Backend-Erweiterung aktiviert.</span>
            </p>

            <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" class="btn-secondary" @click="$emit('close')">Abbrechen</button>
              <button type="button" class="btn-primary" :disabled="isLoading" @click="$emit('confirmed')">
                {{ groups.length > 1 ? `${groups.length} Rechnungen erstellen` : 'Rechnung erstellen' }}
              </button>
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
import { DocumentTextIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { formatEuro } from '@/utilities/billing/calculation.js'

export default {
  name: 'BatchInvoiceDialog',
  components: {
    HDialog: Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    DocumentTextIcon,
    InformationCircleIcon
  },
  props: {
    open: { type: Boolean, required: true, default: false },
    rows: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false }
  },
  emits: ['close', 'confirmed'],
  setup(props) {
    const totalCount = computed(() => props.rows.length)

    // Ausgewählte Zeilen pro Kostenträger gruppieren.
    const groups = computed(() => {
      const map = new Map()
      props.rows.forEach((row) => {
        const carrier = row.document.carrier?.name || 'Ohne Kostenträger'
        if (!map.has(carrier)) {
          map.set(carrier, { carrier, rows: [], amount: 0, clientSet: new Set() })
        }
        const entry = map.get(carrier)
        entry.rows.push(row)
        entry.amount += Number.isFinite(row.amount) ? row.amount : 0
        entry.clientSet.add(row.document.child?.name || '–')
      })
      return Array.from(map.values()).map((entry) => ({
        carrier: entry.carrier,
        rows: entry.rows,
        amountLabel: formatEuro(entry.amount),
        clients: Array.from(entry.clientSet).join(', ')
      }))
    })

    return { totalCount, groups }
  }
}
</script>
