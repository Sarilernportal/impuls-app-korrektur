<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Betreuer hinzufügen – Mitarbeiter-Zugang

Gegliedert in drei Abschnitte (Stammdaten · Funktion & Qualifikation ·
Erweitertes Führungszeugnis § 72a SGB VIII). Dieses Formular legt
ausschließlich Betreuungskräfte an – KEINE System-/Admin-Rollen (die laufen
über „Administratoren"). Login per Einladungs-E-Mail.

Bestehender Speicherweg unverändert: emittiert wird nur `userInput` mit den
bisherigen Keys. Neue Felder (Funktion, Vergütung, Anstellung, Eintritt,
Führungszeugnis) liegen in `extra` und werden ans Backend angebunden, sobald
das Datenmodell erweitert ist (siehe Info-Banner).
-->

<template>
  <div class="w-full">
    <form class="grid w-full gap-6" @submit.prevent="submitForm">
      <!-- Hinweis zu vorbereiteten Feldern -->
      <div class="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
        <InformationCircleIcon class="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span>Funktion, Vergütung, Anstellung, Eintritt und Führungszeugnis werden erfasst und gespeichert, sobald das Datenmodell erweitert ist.</span>
      </div>

      <!-- ───────────── Stammdaten ───────────── -->
      <section class="space-y-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Stammdaten</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <input-label elementID="name" labelText="Vorname*" />
            <text-textfield ref="nameTextfield" elementID="name" name="name" placeholder="Max"
              @input-value="setName" @is-valid="setNameValidation" />
          </div>
          <div>
            <input-label elementID="familyName" labelText="Nachname*" />
            <text-textfield ref="familyNameTextfield" elementID="familyName" name="familyName" placeholder="Mustermann"
              @input-value="setFamilyName" @is-valid="setFamilyNameValidation" />
          </div>
          <div>
            <input-label elementID="email" labelText="E-Mail-Adresse*" />
            <email-textfield ref="emailTextfield" elementID="email" name="email" placeholder="benutzername@beispiel.com"
              @input-value="setEmail" @is-valid="setEmailValidation" />
            <p class="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <EnvelopeIcon class="h-3.5 w-3.5" aria-hidden="true" /> Einladung zum Passwort-Setzen wird gesendet
            </p>
          </div>
          <div>
            <input-label elementID="phone" labelText="Telefonnummer" />
            <phone-textfield ref="phoneTextfield" elementID="phone" name="phone" placeholder="176123456789"
              @input-value="setPhone" @is-valid="setPhoneValidation" />
          </div>
        </div>
      </section>

      <!-- ───────────── Funktion & Qualifikation ───────────── -->
      <section v-if="!isAdmin" class="space-y-4 border-t border-slate-100 pt-5">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Funktion &amp; Qualifikation</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <input-label elementID="jobFunction" labelText="Funktion / Tätigkeit*" />
            <select id="jobFunction" v-model="extra.jobFunction" class="input-base mt-1">
              <option value="">Bitte wählen</option>
              <option>Schulbegleiter:in (THA-Kraft)</option>
              <option>Pädagogische Fachkraft</option>
              <option>Vertretung / Springer:in</option>
            </select>
            <p class="mt-1 text-xs text-slate-400">Admin/Leitung läuft über „Administratoren".</p>
          </div>
          <div>
            <input-label elementID="professional" labelText="Fachkraftstatus" />
            <SimpleDropdown class="mt-1 w-full" title="Fachkraftstatus" :displayTitle="false"
              :properties="['Fachkraft', 'Nicht-Fachkraft']" defaultSelected="Fachkraft" @selection="setProfessional" />
          </div>
          <div>
            <input-label elementID="qualification" labelText="Qualifikation / Ausbildung" />
            <input id="qualification" v-model="extra.qualification" class="input-base mt-1"
              placeholder="z. B. Erzieher:in, Heilerziehungspfleger:in" />
          </div>
          <div>
            <input-label elementID="hourlyRate" labelText="Vergütung / Stundensatz (€/Std)" />
            <input id="hourlyRate" type="number" min="0" step="0.01" v-model.number="extra.hourlyRate"
              class="input-base mt-1" placeholder="45.50" />
            <p class="mt-1 flex items-center gap-1 text-xs text-impuls-blue">
              <CurrencyEuroIcon class="h-3.5 w-3.5" aria-hidden="true" /> Wird in der Abrechnungszentrale verwendet
            </p>
          </div>
          <div>
            <input-label elementID="employmentType" labelText="Anstellungsart" />
            <select id="employmentType" v-model="extra.employmentType" class="input-base mt-1">
              <option>Festanstellung</option>
              <option>Honorarkraft</option>
              <option>Minijob</option>
            </select>
          </div>
          <div>
            <input-label elementID="startDate" labelText="Eintrittsdatum" />
            <input id="startDate" type="date" v-model="extra.startDate" class="input-base mt-1" />
          </div>
        </div>
      </section>

      <!-- ───────────── § 72a Führungszeugnis ───────────── -->
      <section v-if="!isAdmin" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-amber-800">
          <ShieldCheckIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Erweitertes Führungszeugnis (§ 72a SGB VIII)
        </div>
        <p class="mt-1 text-xs text-amber-800">
          Pflicht vor Einsatz mit Kindern/Jugendlichen. Ohne Vorlage kein aktiver Zugang.
        </p>
        <div class="mt-3 grid items-end gap-4 sm:grid-cols-3">
          <label class="flex items-center gap-2 text-sm font-medium text-amber-900">
            <input type="checkbox" v-model="extra.certificateSubmitted"
              class="h-4 w-4 rounded border-amber-300 text-impuls-blue focus:ring-2 focus:ring-brand-200" />
            vorgelegt
          </label>
          <div>
            <label class="block text-xs font-medium text-amber-900" for="certDate">Vorgelegt am</label>
            <input id="certDate" type="date" v-model="extra.certificateSubmittedDate" class="input-base mt-1" />
          </div>
          <div>
            <label class="block text-xs font-medium text-amber-900" for="certRenewal">Wiedervorlage</label>
            <input id="certRenewal" type="date" v-model="extra.certificateRenewalDate" class="input-base mt-1" />
          </div>
        </div>
        <!-- Einsatz-Sperre / Status-Hinweis -->
        <p v-if="!extra.certificateSubmitted"
          class="mt-3 flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-800">
          <ExclamationTriangleIcon class="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Zugang wird als „inaktiv / Nachweis fehlt" angelegt und ist erst nach Vorlage einsatzbereit.
        </p>
        <p v-else class="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircleIcon class="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Nachweis liegt vor – Zugang ist einsatzbereit.
        </p>
      </section>

      <!-- Footer -->
      <div class="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span class="text-sm font-medium text-slate-500">* Pflichtangabe</span>
        <div class="w-full sm:w-48">
          <standard-button title="Hinzufügen" :isLoading="isLoading" :enabled="allInputsValidated" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import PhoneTextfield from '@/components/UIComponents/Inputs/PhoneTextfield.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import {
  InformationCircleIcon, EnvelopeIcon, CurrencyEuroIcon, ShieldCheckIcon,
  ExclamationTriangleIcon, CheckCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'NewUserForm',
  components: {
    InputLabel, TextTextfield, PhoneTextfield, EmailTextfield, StandardButton, SimpleDropdown,
    InformationCircleIcon, EnvelopeIcon, CurrencyEuroIcon, ShieldCheckIcon,
    ExclamationTriangleIcon, CheckCircleIcon
  },
  props: {
    isLoading: { type: Boolean, required: true, default: false },
    isAdmin: { type: Boolean, required: true, default: false }
  },
  setup(props, context) {
    const nameTextfield = ref(null)
    const familyNameTextfield = ref(null)
    const emailTextfield = ref(null)
    const phoneTextfield = ref(null)

    // Bestehende Keys – Speicherweg unverändert.
    const userInput = reactive({
      name: { value: '', isValid: false },
      familyName: { value: '', isValid: false },
      email: { value: '', isValid: false },
      phone: { value: '', isValid: false },
      professional: { value: 'Fachkraft', isValid: true }
    })

    // Neue Felder (noch nicht persistiert).
    const extra = reactive({
      jobFunction: '',
      qualification: '',
      hourlyRate: null,
      employmentType: 'Festanstellung',
      startDate: '',
      certificateSubmitted: false,
      certificateSubmittedDate: '',
      certificateRenewalDate: ''
    })

    // Wiedervorlage automatisch auf +5 Jahre vorbelegen, sobald „vorgelegt am"
    // gesetzt wird und noch keine Wiedervorlage erfasst ist.
    watch(
      () => extra.certificateSubmittedDate,
      (iso) => {
        if (iso && !extra.certificateRenewalDate) {
          const d = new Date(iso)
          d.setFullYear(d.getFullYear() + 5)
          extra.certificateRenewalDate = d.toISOString().slice(0, 10)
        }
      }
    )

    const setName = (v) => { userInput.name.value = v }
    const setNameValidation = (v) => { userInput.name.isValid = v }
    const setFamilyName = (v) => { userInput.familyName.value = v }
    const setFamilyNameValidation = (v) => { userInput.familyName.isValid = v }
    const setPhone = (v) => { userInput.phone.value = v }
    const setPhoneValidation = (v) => { userInput.phone.isValid = v }
    const setEmail = (v) => { userInput.email.value = v }
    const setEmailValidation = (v) => { userInput.email.isValid = v }
    const setProfessional = (v) => { userInput.professional.value = v }

    // Pflicht: Vor-/Nachname, E-Mail; bei Betreuer zusätzlich Funktion/Tätigkeit.
    const allInputsValidated = computed(() => {
      if (!userInput.name.isValid || !userInput.familyName.isValid) return false
      if (!userInput.email.isValid) return false
      if (!props.isAdmin && !extra.jobFunction) return false
      return true
    })

    function submitForm() {
      // Speicherweg unverändert: nur die bestehenden Keys emittieren.
      context.emit('submit-inputs', userInput)
    }

    return {
      nameTextfield, familyNameTextfield, emailTextfield, phoneTextfield,
      userInput, extra,
      setName, setNameValidation, setFamilyName, setFamilyNameValidation,
      setPhone, setPhoneValidation, setEmail, setEmailValidation, setProfessional,
      allInputsValidated, submitForm
    }
  }
}
</script>
