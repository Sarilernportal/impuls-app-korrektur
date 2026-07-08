<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Überhang-Korrektur

Wenn geleistet > Soll, kann die Verwaltung den Überhang
  (a) deckeln (nur Soll abrechnen),
  (b) mit Pflicht-Begründung ganz/teilweise freigeben, oder
  (c) in den Folgemonat verschieben.
Die Korrektur wird mit Protokoll (wer, wann, warum) zurückgegeben.
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
              <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <ExclamationTriangleIcon class="h-5 w-5 text-amber-600" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <DialogTitle as="h3" class="text-base font-semibold text-slate-900">Überhang korrigieren</DialogTitle>
                <p class="mt-0.5 text-sm text-slate-500">{{ row?.client }} · {{ monthLabel }}</p>
              </div>
            </div>

            <!-- Kennzahlen -->
            <dl class="mt-4 grid grid-cols-3 gap-2 text-center">
              <div class="rounded-lg bg-slate-50 p-2">
                <dt class="text-[11px] uppercase tracking-wide text-slate-400">Soll</dt>
                <dd class="text-sm font-semibold text-slate-800">{{ row?.display.soll }}</dd>
              </div>
              <div class="rounded-lg bg-slate-50 p-2">
                <dt class="text-[11px] uppercase tracking-wide text-slate-400">Geleistet</dt>
                <dd class="text-sm font-semibold text-slate-800">{{ row?.display.worked }}</dd>
              </div>
              <div class="rounded-lg bg-amber-50 p-2">
                <dt class="text-[11px] uppercase tracking-wide text-amber-500">Überhang</dt>
                <dd class="text-sm font-semibold text-amber-700">{{ row?.display.overhang }}</dd>
              </div>
            </dl>

            <!-- Modus-Auswahl -->
            <fieldset class="mt-5 space-y-2">
              <legend class="text-sm font-medium text-slate-700">Wie soll der Überhang behandelt werden?</legend>
              <label
                v-for="option in modeOptions"
                :key="option.value"
                :class="[
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition',
                  mode === option.value ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                ]"
              >
                <input type="radio" :value="option.value" v-model="mode" class="mt-0.5 h-4 w-4 text-impuls-blue focus:ring-brand-200" />
                <span>
                  <span class="block font-semibold text-slate-800">{{ option.title }}</span>
                  <span class="block text-xs text-slate-500">{{ option.description }}</span>
                </span>
              </label>
            </fieldset>

            <!-- Teilfreigabe: Stundenanzahl -->
            <div v-if="mode === 'release'" class="mt-4">
              <label class="block text-sm font-medium text-slate-700" for="releasedHours">
                Freizugebende Überhang-Stunden (max. {{ maxOverhang }} h)
              </label>
              <input
                id="releasedHours"
                type="number"
                min="0"
                :max="maxOverhang"
                step="0.25"
                v-model.number="releasedHours"
                class="input-base mt-1"
              />
            </div>

            <!-- Begründung (Pflicht bei Freigabe) -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-slate-700" for="reason">
                Begründung <span v-if="mode === 'release'" class="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                v-model="reason"
                rows="2"
                class="input-base mt-1"
                :placeholder="reasonPlaceholder"
              ></textarea>
              <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
            </div>

            <!-- Aktionen -->
            <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" class="btn-secondary" @click="$emit('close')">Abbrechen</button>
              <button type="button" class="btn-primary" @click="confirm">Korrektur übernehmen</button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script>
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'OverhangCorrectionDialog',
  components: {
    HDialog: Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationTriangleIcon
  },
  props: {
    open: { type: Boolean, required: true, default: false },
    row: { type: Object, default: null },
    monthLabel: { type: String, default: '' }
  },
  emits: ['close', 'confirmed'],
  setup(props, { emit }) {
    const mode = ref('cap')
    const releasedHours = ref(0)
    const reason = ref('')
    const error = ref('')

    const modeOptions = [
      { value: 'cap', title: 'Deckeln', description: 'Nur das Soll abrechnen, Überhang verfällt.' },
      { value: 'release', title: 'Freigeben', description: 'Überhang ganz/teilweise abrechnen – Begründung erforderlich.' },
      { value: 'carryover', title: 'In Folgemonat verschieben', description: 'Nur Soll abrechnen, Rest in den nächsten Monat übertragen.' }
    ]

    const maxOverhang = computed(() => props.row?.overhangHours || 0)

    const reasonPlaceholder = computed(() => {
      if (mode.value === 'release') return 'Warum wird der Überhang (teilweise) freigegeben? (Pflicht)'
      if (mode.value === 'carryover') return 'Optionaler Hinweis zur Übertragung…'
      return 'Optionaler Hinweis…'
    })

    // Bei Öffnen mit vorhandener Korrektur vorbelegen, sonst zurücksetzen.
    watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return
        const existing = props.row?.correction
        mode.value = existing?.mode || 'cap'
        releasedHours.value = existing?.releasedHours || maxOverhang.value
        reason.value = existing?.reason || ''
        error.value = ''
      }
    )

    function confirm() {
      error.value = ''
      if (mode.value === 'release') {
        if (!reason.value.trim()) {
          error.value = 'Für eine Freigabe ist eine Begründung erforderlich.'
          return
        }
        const hours = Number(releasedHours.value)
        if (!Number.isFinite(hours) || hours <= 0) {
          error.value = 'Bitte freizugebende Stunden angeben.'
          return
        }
      }
      emit('confirmed', {
        mode: mode.value,
        releasedHours: mode.value === 'release' ? Number(releasedHours.value) : 0,
        reason: reason.value.trim(),
        at: new Date().toISOString()
      })
    }

    return {
      mode,
      releasedHours,
      reason,
      error,
      modeOptions,
      maxOverhang,
      reasonPlaceholder,
      confirm
    }
  }
}
</script>
