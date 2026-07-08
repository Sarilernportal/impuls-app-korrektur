<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Fallakte anlegen – 4-Schritt-Wizard

Reorganisiert das bisherige flache Formular in vier Abschnitte mit
Fortschrittsanzeige, echten Datums-Pickern, Inline-Validierung und der
Trennung „Als Entwurf speichern" vs. „Fallakte aktivieren".

Wichtig: Der Speicherweg bleibt unverändert – es wird dasselbe `childInput`
mit den bestehenden Keys per `submit-inputs` ausgegeben. Neue Felder (Adresse,
Geschlecht, Schulform … ) werden im UI erfasst und an das Backend angebunden,
sobald das Datenmodell erweitert ist (siehe Info-Banner).
-->

<template>
  <div class="w-full">
    <!-- Fortschrittsanzeige -->
    <ol class="flex flex-wrap gap-2">
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        class="flex-1 min-w-[8rem]"
      >
        <button
          type="button"
          @click="goToStep(index + 1)"
          :class="[
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition',
            currentStep === index + 1
              ? 'bg-brand-50 text-impuls-blue ring-1 ring-brand-200'
              : index + 1 < currentStep
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          ]"
        >
          <span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/70 text-[11px]">
            <CheckIcon v-if="index + 1 < currentStep" class="h-4 w-4" />
            <span v-else>{{ index + 1 }}</span>
          </span>
          <span class="truncate">{{ step.title }}</span>
        </button>
      </li>
    </ol>

    <!-- Hinweis zu vorbereiteten Feldern -->
    <div class="mt-4 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
      <InformationCircleIcon class="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>Neue Felder (Adresse, Geschlecht, Schulform, Sorgeberechtigte u. a.) sind bereits erfasst; sie werden gespeichert, sobald das Datenmodell erweitert ist.</span>
    </div>

    <form class="mt-6" @submit.prevent="onActivate">
      <!-- ───────────── Schritt 1: Stammdaten ───────────── -->
      <section v-show="currentStep === 1" class="space-y-5">
        <header>
          <h3 class="text-base font-semibold text-slate-900">Schritt 1 — Stammdaten Kind/Jugendliche:r</h3>
          <p class="mt-1 text-sm text-slate-500">Pflichtfelder zuerst, optionale Angaben danach.</p>
        </header>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <input-label elementID="name" labelText="Vorname*" />
            <text-textfield elementID="name" name="name" placeholder="Max" :prefilled="childInput.name.value"
              @input-value="setName" @is-valid="setNameValidation" />
          </div>
          <div>
            <input-label elementID="familyName" labelText="Nachname*" />
            <text-textfield elementID="familyName" name="familyName" placeholder="Mustermann" :prefilled="childInput.familyName.value"
              @input-value="setFamilyName" @is-valid="setFamilyNameValidation" />
          </div>
          <div>
            <input-label elementID="dateOfBirth" labelText="Geburtsdatum*" />
            <input
              id="dateOfBirth"
              type="date"
              v-model="dateOfBirthISO"
              class="input-base mt-1"
            />
          </div>
          <div>
            <input-label elementID="gender" labelText="Geschlecht" />
            <select id="gender" v-model="extra.gender" class="input-base mt-1">
              <option value="">Bitte wählen</option>
              <option>männlich</option>
              <option>weiblich</option>
              <option>divers</option>
              <option>keine Angabe</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <input-label elementID="address" labelText="Adresse (Straße, PLZ, Ort)" />
            <input id="address" v-model="extra.address" class="input-base mt-1" placeholder="Musterstraße 1, 65428 Rüsselsheim" />
          </div>
          <div>
            <input-label elementID="nativeLanguage" labelText="Muttersprache" />
            <input id="nativeLanguage" v-model="extra.nativeLanguage" class="input-base mt-1" placeholder="Deutsch" />
          </div>
          <div>
            <input-label elementID="recordNumber" labelText="Aktenzeichen" />
            <div class="mt-1 flex gap-2">
              <input id="recordNumber" :value="childInput.recordNumber.value || ''" @input="setRecordNumber($event.target.value)"
                class="input-base" placeholder="THA-2026-0042" />
              <button type="button" @click="generateRecordNumber"
                class="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                <ArrowPathIcon class="h-4 w-4" /> Auto
              </button>
            </div>
          </div>
        </div>

        <!-- Datenschutz -->
        <div class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <LockClosedIcon class="mt-0.5 h-5 w-5 flex-shrink-0 text-impuls-blue" aria-hidden="true" />
          <div class="text-xs text-slate-600">
            <p><strong class="text-slate-800">Datenschutz:</strong> Verarbeitung nach § 35 SGB I, §§ 61–68 SGB VIII, Art. 6/9 DSGVO.</p>
            <label class="mt-2 flex items-center gap-2 font-medium text-slate-700">
              <input type="checkbox" v-model="extra.consent" class="h-4 w-4 rounded border-slate-300 text-impuls-blue focus:ring-2 focus:ring-brand-200" />
              Einwilligung / Schweigepflichtentbindung liegt vor
            </label>
            <input v-if="extra.consent" type="date" v-model="extra.consentDate" class="input-base mt-2 max-w-[12rem]" />
          </div>
        </div>
      </section>

      <!-- ───────────── Schritt 2: Sorgeberechtigte ───────────── -->
      <section v-show="currentStep === 2" class="space-y-5">
        <header>
          <h3 class="text-base font-semibold text-slate-900">Schritt 2 — Sorgeberechtigte</h3>
          <p class="mt-1 text-sm text-slate-500">Beliebig viele Personen erfassen (Mutter, Vater, Vormund …).</p>
        </header>

        <div
          v-for="(person, idx) in guardiansList"
          :key="idx"
          class="rounded-xl border border-slate-200 p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-700">Sorgeberechtigte:r {{ idx + 1 }}</span>
            <button type="button" @click="removeGuardian(idx)"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <input-label :elementID="`role-${idx}`" labelText="Rolle*" />
              <select :id="`role-${idx}`" v-model="person.role" class="input-base mt-1">
                <option value="">Bitte wählen</option>
                <option>Mutter</option>
                <option>Vater</option>
                <option>Vormund</option>
                <option>Pflegeeltern</option>
                <option>Amtsvormund</option>
                <option>sonstige</option>
              </select>
            </div>
            <label class="flex items-center gap-2 self-end pb-2 text-sm text-slate-600">
              <input type="checkbox" v-model="person.custody" class="h-4 w-4 rounded border-slate-300 text-impuls-blue focus:ring-2 focus:ring-brand-200" />
              personensorgeberechtigt
            </label>
            <div>
              <input-label :elementID="`gname-${idx}`" labelText="Vorname*" />
              <input :id="`gname-${idx}`" v-model="person.name" class="input-base mt-1" placeholder="Erika" />
            </div>
            <div>
              <input-label :elementID="`gfname-${idx}`" labelText="Nachname*" />
              <input :id="`gfname-${idx}`" v-model="person.familyName" class="input-base mt-1" placeholder="Musterfrau" />
            </div>
            <div>
              <input-label :elementID="`gphone-${idx}`" labelText="Telefon" />
              <input :id="`gphone-${idx}`" v-model="person.phone" class="input-base mt-1" placeholder="0176 12345678" />
            </div>
            <div>
              <input-label :elementID="`gmail-${idx}`" labelText="E-Mail" />
              <input :id="`gmail-${idx}`" v-model="person.email" class="input-base mt-1" placeholder="erika@example.de" />
            </div>
          </div>
        </div>

        <button type="button" @click="addGuardian"
          class="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-impuls-blue transition hover:bg-brand-50">
          <PlusIcon class="h-4 w-4" /> Sorgeberechtigte:r hinzufügen
        </button>
      </section>

      <!-- ───────────── Schritt 3: Schule & Begleitung ───────────── -->
      <section v-show="currentStep === 3" class="space-y-5">
        <header>
          <h3 class="text-base font-semibold text-slate-900">Schritt 3 — Schule & Begleitung</h3>
          <p class="mt-1 text-sm text-slate-500">Kernangaben für die Teilhabeassistenz im Schulalltag.</p>
        </header>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <input-label elementID="school" labelText="Schule*" />
            <text-textfield elementID="school" name="school" placeholder="Goetheschule Rüsselsheim" :prefilled="childInput.school.value"
              @input-value="setSchool" @is-valid="setSchoolValidation" />
          </div>
          <div>
            <input-label elementID="schoolForm" labelText="Schulform" />
            <select id="schoolForm" v-model="extra.schoolForm" class="input-base mt-1">
              <option value="">Bitte wählen</option>
              <option>Grundschule</option>
              <option>Regelschule</option>
              <option>Förderschule</option>
              <option>Gymnasium</option>
              <option>Gesamtschule</option>
              <option>sonstige</option>
            </select>
          </div>
          <div>
            <input-label elementID="schoolClass" labelText="Klasse" />
            <input id="schoolClass" v-model="extra.schoolClass" class="input-base mt-1" placeholder="4b" />
          </div>
          <div>
            <input-label elementID="schoolContactName" labelText="Klassenlehrer:in / Ansprechpartner" />
            <text-textfield elementID="schoolContactName" name="schoolContactName" placeholder="Fr. Schneider"
              @input-value="setSchoolContactName" @is-valid="setSchoolContactNameValidation" />
          </div>
          <div class="sm:col-span-2">
            <input-label elementID="schoolContactEmail" labelText="Kontakt Schule (E-Mail)" />
            <email-textfield elementID="schoolContactEmail" name="schoolContactEmail" placeholder="sekretariat@schule.de"
              @input-value="setSchoolContactEmail" @is-valid="setSchoolContactEmailValidation" />
          </div>
          <div class="sm:col-span-2">
            <input-label elementID="thaKraft" labelText="Schulbegleiter:in (THA-Kraft)" />
            <select id="thaKraft" v-model="extra.thaKraft" class="input-base mt-1">
              <option value="">Wird nach dem Anlegen in der Detailansicht zugewiesen</option>
            </select>
            <p class="mt-1 text-xs text-slate-400">Die feste Verknüpfung zu „Betreuer" erfolgt nach dem Anlegen über die Detailseite.</p>
          </div>
          <div class="sm:col-span-2">
            <input-label elementID="supportNeed" labelText="Förder-/Unterstützungsbedarf" />
            <textarea id="supportNeed" v-model="extra.supportNeed" rows="3" class="input-base mt-1"
              placeholder="Kurzbeschreibung des Teilhabebedarfs im Schulkontext…"></textarea>
          </div>
        </div>
      </section>

      <!-- ───────────── Schritt 4: Hilfe & Abrechnung ───────────── -->
      <section v-show="currentStep === 4" class="space-y-5">
        <header>
          <h3 class="text-base font-semibold text-slate-900">Schritt 4 — Hilfe & Abrechnung (§ 35a SGB VIII)</h3>
          <p class="mt-1 text-sm text-slate-500">Rechtsgrundlage, Kostenträger und Stunden für die Abrechnung.</p>
        </header>
        <div class="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
          <ScaleIcon class="h-5 w-5 text-slate-500" aria-hidden="true" />
          Rechtsgrundlage: <strong>§ 35a SGB VIII</strong>
          <span class="text-xs text-slate-400">· fest hinterlegt</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <input-label elementID="carrierContact" labelText="Zuständiges Jugendamt / Kostenträger*" />
            <CarrierContactSelection @carrier-contact-selected="setCarrierContact" />
            <p class="mt-1 text-xs text-slate-400">Auswahl aus den Kostenträger-Stammdaten statt Freitext.</p>
          </div>
          <div>
            <input-label elementID="caseworker" labelText="Sachbearbeiter:in (Jugendamt)" />
            <input id="caseworker" v-model="extra.caseworker" class="input-base mt-1" placeholder="Hr. Wagner" />
          </div>
          <div>
            <input-label elementID="decisionRef" labelText="Bescheid-Aktenzeichen" />
            <input id="decisionRef" v-model="extra.decisionRef" class="input-base mt-1" placeholder="JA-2026-1187" />
          </div>
          <div>
            <input-label elementID="dateOfRegistration" labelText="Beginn der Hilfe*" />
            <input id="dateOfRegistration" type="date" v-model="dateOfRegistrationISO" class="input-base mt-1" />
          </div>
          <div>
            <input-label elementID="approvedUntil" labelText="Bewilligt bis" />
            <input id="approvedUntil" type="date" v-model="extra.approvedUntil" class="input-base mt-1" />
          </div>
          <div>
            <input-label elementID="weeklyHours" labelText="Bewilligte Wochenstunden*" />
            <float-textfield elementID="weeklyHours" name="weeklyHours" placeholder="15"
              @input-value="setWeeklyHours" @is-valid="setWeeklyHoursValidation" />
          </div>
        </div>
        <!-- Toggles zusammengeführt -->
        <div class="flex flex-wrap gap-3">
          <switchable-info title="Stundenberechnung:" propertyKey="weeklyHoursByPlan"
            :isActive="childInput.weeklyHoursByPlan.value"
            :value="childInput.weeklyHoursByPlan.value ? 'Gemäß Stundenplan' : 'Nach Wochenstunden'"
            @button-toggled="setWeeklyHoursByPlan" :isLoading="false" />
          <switchable-info title="Daten vollständig:" propertyKey="dataComplete"
            :isActive="childInput.dataComplete.value"
            :value="childInput.dataComplete.value ? 'Vollständig' : 'Unvollständig'"
            @button-toggled="setDataComplete" :isLoading="false" />
        </div>
        <!-- Upload -->
        <div class="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
          <ArrowUpTrayIcon class="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
          <p class="mt-1">Bewilligungsbescheid hochladen (PDF)</p>
          <p class="mt-0.5 text-xs text-slate-400">Upload wird mit der Backend-Erweiterung aktiviert.</p>
        </div>
      </section>

      <!-- Fehlerhinweis -->
      <p v-if="formError" class="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ formError }}
      </p>

      <!-- Navigation -->
      <div class="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button v-if="currentStep > 1" type="button" @click="prevStep" class="btn-secondary">
            <ArrowLeftIcon class="h-4 w-4" /> Zurück
          </button>
        </div>
        <div class="flex flex-wrap gap-3">
          <button type="button" @click="onSaveDraft" :disabled="isLoading" class="btn-secondary">
            <DocumentArrowDownIcon class="h-4 w-4" /> Als Entwurf speichern
          </button>
          <button v-if="currentStep < steps.length" type="button" @click="nextStep" class="btn-primary">
            Weiter <ArrowRightIcon class="h-4 w-4" />
          </button>
          <button v-else type="submit" :disabled="isLoading" class="btn-primary">
            <CheckIcon class="h-4 w-4" /> Fallakte aktivieren
          </button>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-400">* Pflichtangabe (wird beim Aktivieren geprüft).</p>
    </form>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import FloatTextfield from '@/components/UIComponents/Inputs/FloatTextfield.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'
import CarrierContactSelection from '@/components/Main/Admin/Children/CarrierContactSelection.vue'
import {
  ArrowLeftIcon, ArrowRightIcon, ArrowPathIcon, CheckIcon, PlusIcon, XMarkIcon,
  LockClosedIcon, InformationCircleIcon, ScaleIcon, ArrowUpTrayIcon, DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'NewChildWizard',
  components: {
    InputLabel, TextTextfield, EmailTextfield, FloatTextfield, SwitchableInfo, CarrierContactSelection,
    ArrowLeftIcon, ArrowRightIcon, ArrowPathIcon, CheckIcon, PlusIcon, XMarkIcon,
    LockClosedIcon, InformationCircleIcon, ScaleIcon, ArrowUpTrayIcon, DocumentArrowDownIcon
  },
  props: {
    isLoading: { type: Boolean, required: true, default: false }
  },
  emits: ['submit-inputs'],
  setup(_, { emit }) {
    const steps = [
      { title: '1 · Stammdaten' },
      { title: '2 · Sorgeberechtigte' },
      { title: '3 · Schule & Begleitung' },
      { title: '4 · Hilfe & Abrechnung' }
    ]
    const currentStep = ref(1)
    const formError = ref('')

    // Bestehende Keys – werden unverändert gespeichert.
    const childInput = reactive({
      name: { value: '', isValid: false },
      familyName: { value: '', isValid: false },
      dataComplete: { value: false, isValid: true },
      carrierContact: { value: null, isValid: false },
      dateOfBirth: { value: null, isValid: false },
      school: { value: null, isValid: false },
      dateOfRegistration: { value: null, isValid: false },
      weeklyHours: { value: null, isValid: false },
      weeklyHoursByPlan: { value: false, isValid: true },
      recordNumber: { value: null, isValid: true },
      motherName: { value: null, isValid: true },
      motherFamilyName: { value: null, isValid: true },
      motherPhone: { value: null, isValid: true },
      motherEmail: { value: null, isValid: true },
      fatherName: { value: null, isValid: true },
      fatherFamilyName: { value: null, isValid: true },
      fatherPhone: { value: null, isValid: true },
      fatherEmail: { value: null, isValid: true },
      schoolContactName: { value: null, isValid: true },
      schoolContactFamilyName: { value: null, isValid: true },
      schoolContactPhone: { value: null, isValid: true },
      schoolContactEmail: { value: null, isValid: true }
    })

    // Neue Felder (noch nicht persistiert) + dynamische Sorgeberechtigte
    const extra = reactive({
      gender: '', address: '', nativeLanguage: '',
      schoolForm: '', schoolClass: '', supportNeed: '', thaKraft: '',
      caseworker: '', decisionRef: '', approvedUntil: '',
      consent: false, consentDate: ''
    })
    const guardiansList = reactive([{ role: '', name: '', familyName: '', phone: '', email: '', custody: false }])

    // Datums-Picker (ISO <-> de-Format, gespeichert wird TT.MM.JJJJ)
    function isoToGerman(iso) {
      if (!iso) return null
      const [y, m, d] = iso.split('-')
      return `${d}.${m}.${y}`
    }
    const dateOfBirthISO = computed({
      get: () => germanToIso(childInput.dateOfBirth.value),
      set: (iso) => {
        childInput.dateOfBirth.value = isoToGerman(iso)
        childInput.dateOfBirth.isValid = !!iso
      }
    })
    const dateOfRegistrationISO = computed({
      get: () => germanToIso(childInput.dateOfRegistration.value),
      set: (iso) => {
        childInput.dateOfRegistration.value = isoToGerman(iso)
        childInput.dateOfRegistration.isValid = !!iso
      }
    })
    function germanToIso(de) {
      if (!de) return ''
      const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(de)
      return m ? `${m[3]}-${m[2]}-${m[1]}` : ''
    }

    // Setter (bestehende Logik)
    const setName = (v) => { childInput.name.value = v }
    const setNameValidation = (v) => { childInput.name.isValid = v }
    const setFamilyName = (v) => { childInput.familyName.value = v }
    const setFamilyNameValidation = (v) => { childInput.familyName.isValid = v }
    const setSchool = (v) => { childInput.school.value = v }
    const setSchoolValidation = (v) => { childInput.school.isValid = v }
    const setWeeklyHours = (v) => { childInput.weeklyHours.value = v }
    const setWeeklyHoursValidation = (v) => { childInput.weeklyHours.isValid = v }
    const setWeeklyHoursByPlan = (val) => { childInput.weeklyHoursByPlan.value = val.weeklyHoursByPlan }
    const setDataComplete = (val) => { childInput.dataComplete.value = val.dataComplete }
    const setRecordNumber = (v) => { childInput.recordNumber.value = v; childInput.recordNumber.isValid = true }
    const setCarrierContact = (v) => { childInput.carrierContact.value = v; childInput.carrierContact.isValid = true }
    const setSchoolContactName = (v) => { childInput.schoolContactName.value = v }
    const setSchoolContactNameValidation = (v) => { childInput.schoolContactName.isValid = v }
    const setSchoolContactEmail = (v) => { childInput.schoolContactEmail.value = v }
    const setSchoolContactEmailValidation = (v) => { childInput.schoolContactEmail.isValid = v }

    function generateRecordNumber() {
      const year = new Date().getFullYear()
      const seq = String(Math.floor(1000 + Math.random() * 9000))
      setRecordNumber(`THA-${year}-${seq}`)
    }

    // Sorgeberechtigte -> erste zwei Einträge in mother/father spiegeln (Speicherweg)
    function syncGuardiansToMotherFather() {
      const byRole = (r) => guardiansList.find((g) => g.role === r)
      const mother = byRole('Mutter') || guardiansList[0]
      const father = byRole('Vater') || (guardiansList[1] && guardiansList[1] !== mother ? guardiansList[1] : null)
      childInput.motherName.value = mother?.name || null
      childInput.motherFamilyName.value = mother?.familyName || null
      childInput.motherPhone.value = mother?.phone || null
      childInput.motherEmail.value = mother?.email || null
      childInput.fatherName.value = father?.name || null
      childInput.fatherFamilyName.value = father?.familyName || null
      childInput.fatherPhone.value = father?.phone || null
      childInput.fatherEmail.value = father?.email || null
    }
    function addGuardian() {
      guardiansList.push({ role: '', name: '', familyName: '', phone: '', email: '', custody: false })
    }
    function removeGuardian(idx) {
      if (guardiansList.length > 1) guardiansList.splice(idx, 1)
    }

    // Navigation
    function goToStep(n) { currentStep.value = n; formError.value = '' }
    function nextStep() { if (currentStep.value < steps.length) currentStep.value++; formError.value = '' }
    function prevStep() { if (currentStep.value > 1) currentStep.value--; formError.value = '' }

    // Mindest-Pflichtfelder (DB erzwingt diese als non-null)
    function missingRequired() {
      const missing = []
      if (!childInput.name.isValid) missing.push('Vorname')
      if (!childInput.familyName.isValid) missing.push('Nachname')
      if (!childInput.dateOfBirth.value) missing.push('Geburtsdatum')
      if (!childInput.school.value) missing.push('Schule')
      if (!childInput.dateOfRegistration.value) missing.push('Beginn der Hilfe')
      return missing
    }

    function buildAndEmit() {
      syncGuardiansToMotherFather()
      emit('submit-inputs', childInput)
    }

    function onSaveDraft() {
      const missing = missingRequired()
      if (missing.length) {
        formError.value = `Auch als Entwurf werden Mindestangaben benötigt: ${missing.join(', ')}.`
        return
      }
      childInput.dataComplete.value = false
      buildAndEmit()
    }

    function onActivate() {
      const missing = missingRequired()
      if (!childInput.weeklyHoursByPlan.value && !childInput.weeklyHours.isValid) {
        missing.push('Bewilligte Wochenstunden')
      }
      if (missing.length) {
        formError.value = `Bitte ausfüllen: ${missing.join(', ')}.`
        return
      }
      childInput.dataComplete.value = true
      buildAndEmit()
    }

    return {
      steps, currentStep, formError, childInput, extra, guardiansList,
      dateOfBirthISO, dateOfRegistrationISO,
      setName, setNameValidation, setFamilyName, setFamilyNameValidation,
      setSchool, setSchoolValidation, setWeeklyHours, setWeeklyHoursValidation,
      setWeeklyHoursByPlan, setDataComplete, setRecordNumber, setCarrierContact,
      setSchoolContactName, setSchoolContactNameValidation, setSchoolContactEmail, setSchoolContactEmailValidation,
      generateRecordNumber, addGuardian, removeGuardian,
      goToStep, nextStep, prevStep, onSaveDraft, onActivate
    }
  }
}
</script>
