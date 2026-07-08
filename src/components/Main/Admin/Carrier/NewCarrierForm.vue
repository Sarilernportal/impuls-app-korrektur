<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Kostenträger / Jugendamt hinzufügen (Rechnungsempfänger)

Der „Träger" ist hier der KOSTENTRÄGER (Jugendamt), an den die THA-Leistungen
fakturiert werden. Gegliedert in Stammdaten · Rechnungskontakt · Rechnungs-
adresse (mit Übernahme-Checkbox) · E-Rechnung · Abrechnungsregeln je Amt.

Speicherweg unverändert: emittiert wird `carrierInput` mit den bestehenden
Keys (street/houseNumber/postalCode/city werden aus den kompakten Feldern
geparst). Neue Felder (Typ, Rechnungskontakt-Name, E-Rechnung, Abrechnungs-
regeln) liegen in `extra` und werden ans Backend angebunden, sobald das
Datenmodell erweitert ist (siehe Info-Banner).
-->

<template>
  <div class="w-full">
    <form class="mt-5 grid w-full gap-6" @submit.prevent="submitForm">
      <div class="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
        <InformationCircleIcon class="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span>Typ, Rechnungskontakt, E-Rechnungsdaten und Abrechnungsregeln werden erfasst und gespeichert, sobald das Datenmodell erweitert ist.</span>
      </div>

      <!-- ───────────── Stammdaten ───────────── -->
      <section class="space-y-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Stammdaten</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <input-label elementID="name" labelText="Name der Institution*" />
            <text-textfield elementID="name" name="name" placeholder="Jugendamt Groß-Gerau"
              @input-value="setName" @is-valid="setNameValidation" />
          </div>
          <div>
            <input-label elementID="carrierType" labelText="Typ" />
            <select id="carrierType" v-model="extra.carrierType" class="input-base mt-1">
              <option>Jugendamt</option>
              <option>Sozialamt / EGH-Träger</option>
              <option>Sonstiger Kostenträger</option>
            </select>
          </div>
          <div>
            <input-label elementID="streetLine" labelText="Straße & Hausnr.*" />
            <input id="streetLine" v-model="streetLine" class="input-base mt-1" placeholder="Musterstraße 1A" />
            <p v-if="streetLine && !streetLineValid" class="mt-1 text-xs text-red-600">Bitte Straße und Hausnummer angeben.</p>
          </div>
          <div>
            <input-label elementID="cityLine" labelText="PLZ & Stadt*" />
            <input id="cityLine" v-model="cityLine" class="input-base mt-1" placeholder="64521 Groß-Gerau" />
            <p v-if="cityLine && !cityLineValid" class="mt-1 text-xs text-red-600">Bitte PLZ und Stadt angeben.</p>
          </div>
          <div>
            <input-label elementID="addressExtra" labelText="Adresszusatz" />
            <input id="addressExtra" v-model="addressExtra" class="input-base mt-1" placeholder="optional" />
          </div>
          <div>
            <input-label elementID="poBox" labelText="Postfach" />
            <input id="poBox" v-model="poBox" class="input-base mt-1" placeholder="optional" />
          </div>
        </div>
      </section>

      <!-- ───────────── Rechnungskontakt / Buchhaltung ───────────── -->
      <section class="space-y-4 border-t border-slate-100 pt-5">
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Rechnungskontakt / Buchhaltung</h3>
          <p class="mt-1 text-xs text-slate-400">Allgemeine Stelle für den Rechnungsversand. Der fallbezogene Sachbearbeiter wird am Klienten (Hilfe &amp; Abrechnung) gepflegt.</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <input-label elementID="billingContactName" labelText="Rechnungsstelle / Kontakt" />
            <input id="billingContactName" v-model="extra.billingContactName" class="input-base mt-1" placeholder="Buchhaltung / Leistungsabrechnung" />
          </div>
          <div>
            <input-label elementID="phone" labelText="Telefon" />
            <phone-textfield elementID="phone" name="phone" placeholder="06152 ..."
              @input-value="setPhone" @is-valid="setPhoneValidation" />
          </div>
          <div>
            <input-label elementID="email" labelText="E-Mail (Rechnungsversand)" />
            <email-textfield elementID="email" name="email" placeholder="rechnung@gross-gerau.de"
              @input-value="setEmail" @is-valid="setEmailValidation" />
          </div>
        </div>
      </section>

      <!-- ───────────── Rechnungsadresse ───────────── -->
      <section class="space-y-3 border-t border-slate-100 pt-5">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Rechnungsadresse</h3>
        <label class="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-impuls-blue">
          <input type="checkbox" v-model="extra.sameAsMain" class="h-4 w-4 rounded border-slate-300 text-impuls-blue focus:ring-2 focus:ring-brand-200" />
          Entspricht der Hauptadresse
          <span class="text-xs font-normal text-blue-700">— spart doppelte Eingabe</span>
        </label>
        <div v-if="!extra.sameAsMain" class="grid gap-4 md:grid-cols-2">
          <div>
            <input-label elementID="billingName" labelText="Abweichender Name" />
            <input id="billingName" v-model="billingNameValue" class="input-base mt-1" placeholder="optional" />
          </div>
          <div class="hidden md:block"></div>
          <div>
            <input-label elementID="billingStreetLine" labelText="Straße & Hausnr." />
            <input id="billingStreetLine" v-model="billingStreetLine" class="input-base mt-1" placeholder="Musterstraße 1A" />
          </div>
          <div>
            <input-label elementID="billingCityLine" labelText="PLZ & Stadt" />
            <input id="billingCityLine" v-model="billingCityLine" class="input-base mt-1" placeholder="64521 Groß-Gerau" />
          </div>
        </div>
      </section>

      <!-- ───────────── Rechnung & E-Rechnung ───────────── -->
      <section class="space-y-4 border-t border-slate-100 pt-5">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Rechnung &amp; E-Rechnung (Behörde)</h3>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <input-label elementID="leitwegId" labelText="Leitweg-ID (XRechnung)" />
            <input id="leitwegId" v-model="extra.leitwegId" class="input-base mt-1" placeholder="04-12345-67" />
            <p class="mt-1 flex items-center gap-1 text-xs text-impuls-blue">
              <DocumentTextIcon class="h-3.5 w-3.5" aria-hidden="true" /> für E-Rechnung an Behörden
            </p>
          </div>
          <div>
            <input-label elementID="debtorNumber" labelText="Debitoren-/Kundennr." />
            <input id="debtorNumber" v-model="extra.debtorNumber" class="input-base mt-1" placeholder="DEB-1187" />
          </div>
          <div>
            <input-label elementID="paymentTermDays" labelText="Zahlungsziel (Tage)" />
            <input id="paymentTermDays" type="number" min="0" v-model.number="extra.paymentTermDays" class="input-base mt-1" placeholder="30" />
          </div>
          <div>
            <input-label elementID="vatId" labelText="USt-ID / Steuernr." />
            <input id="vatId" v-model="extra.vatId" class="input-base mt-1" placeholder="optional" />
          </div>
        </div>
      </section>

      <!-- ───────────── Abrechnungsregeln je Amt ───────────── -->
      <section class="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-amber-800">
          <AdjustmentsHorizontalIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Abrechnungsregeln je Amt
        </div>
        <p class="mt-1 text-xs text-amber-800">
          Diese Regeln gelten PRO BEHÖRDE und steuern die Abrechnungszentrale
          (Stundensätze, Krankheit/Terminabsage, Pool, Soll-Berechnung).
          Jede Behörde hinterlegt immer zwei Stundensätze: mit und ohne Fachkraft.
        </p>
        <div class="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label class="block text-xs font-medium text-amber-900" for="hourlyRateSpecialist">Stundensatz mit Fachkraft (€)</label>
            <input id="hourlyRateSpecialist" type="number" min="0" step="0.01" v-model.number="extra.hourlyRateSpecialist" class="input-base mt-1" placeholder="45.50" />
            <p class="mt-1 text-xs text-amber-700">für Päd. Fachkräfte</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-amber-900" for="hourlyRateAssistant">Stundensatz ohne Fachkraft (€)</label>
            <input id="hourlyRateAssistant" type="number" min="0" step="0.01" v-model.number="extra.hourlyRateAssistant" class="input-base mt-1" placeholder="38.00" />
            <p class="mt-1 text-xs text-amber-700">für Päd. Hilfskräfte</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-amber-900" for="sicknessRule">Krankheit Kind / Terminabsage</label>
            <select id="sicknessRule" v-model="extra.sicknessRule" class="input-base mt-1">
              <option value="">Regel wählen…</option>
              <option value="none">nicht vergütet</option>
              <option value="partial">teilweise (%-Satz)</option>
              <option value="full">voll vergütet</option>
            </select>
          </div>
          <div v-if="extra.sicknessRule === 'partial'">
            <label class="block text-xs font-medium text-amber-900" for="sicknessPercent">Vergütung Absage (%)</label>
            <input id="sicknessPercent" type="number" min="1" max="100" step="1" v-model.number="extra.sicknessPercent" class="input-base mt-1" placeholder="30" />
            <p class="mt-1 text-xs text-amber-700">Anteil des Stundensatzes (THA-Standard: 30&nbsp;%)</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-amber-900" for="poolRule">Stundenpool</label>
            <select id="poolRule" v-model="extra.poolRule" class="input-base mt-1">
              <option value="none">kein Pool</option>
              <option value="carryover">Übertrag Folgemonat</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-amber-900" for="sollRule">Soll-Berechnung</label>
            <select id="sollRule" v-model="extra.sollRule" class="input-base mt-1">
              <option value="schooldays">Schultage-basiert (Ferienkalender)</option>
            </select>
          </div>
        </div>
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
import { ref, reactive, computed } from 'vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import PhoneTextfield from '@/components/UIComponents/Inputs/PhoneTextfield.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import { InformationCircleIcon, DocumentTextIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'NewCarrierForm',
  components: {
    InputLabel, TextTextfield, PhoneTextfield, EmailTextfield, StandardButton,
    InformationCircleIcon, DocumentTextIcon, AdjustmentsHorizontalIcon
  },
  props: {
    isLoading: { type: Boolean, required: true, default: false }
  },
  setup(_, context) {
    // Kompakte UI-Felder (werden beim Submit in die bestehenden Keys geparst)
    const streetLine = ref('')
    const cityLine = ref('')
    const addressExtra = ref('')
    const poBox = ref('')
    const billingStreetLine = ref('')
    const billingCityLine = ref('')
    const billingNameValue = ref('')

    // Bestehende Keys – Speicherweg unverändert.
    const carrierInput = reactive({
      name: { value: '', isValid: false },
      phone: { value: '', isValid: false },
      email: { value: '', isValid: false },
      street: { value: '', isValid: false },
      houseNumber: { value: '', isValid: false },
      addressExtra: { value: '', isValid: true },
      postalCode: { value: '', isValid: false },
      city: { value: '', isValid: false },
      poBox: { value: '', isValid: true },
      billingName: { value: null, isValid: true },
      billingStreet: { value: null, isValid: true },
      billingHouseNumber: { value: null, isValid: true },
      billingAddressExtra: { value: null, isValid: true },
      billingPostalCode: { value: null, isValid: true },
      billingCity: { value: null, isValid: true },
      billingPoBox: { value: null, isValid: true }
    })

    // Neue Felder (noch nicht persistiert).
    const extra = reactive({
      carrierType: 'Jugendamt',
      billingContactName: '',
      sameAsMain: true,
      leitwegId: '',
      debtorNumber: '',
      paymentTermDays: null,
      vatId: '',
      // Immer ZWEI Sätze je Behörde: mit Fachkraft / ohne Fachkraft.
      hourlyRateSpecialist: null,
      hourlyRateAssistant: null,
      sicknessRule: '',
      // Prozentsatz bei „teilweise" – je Behörde unterschiedlich (Default 30 %).
      sicknessPercent: null,
      poolRule: 'none',
      sollRule: 'schooldays'
    })

    const setName = (v) => { carrierInput.name.value = v }
    const setNameValidation = (v) => { carrierInput.name.isValid = v }
    const setPhone = (v) => { carrierInput.phone.value = v }
    const setPhoneValidation = (v) => { carrierInput.phone.isValid = v }
    const setEmail = (v) => { carrierInput.email.value = v }
    const setEmailValidation = (v) => { carrierInput.email.isValid = v }

    // Adresszeile in Straße + Hausnummer trennen (letztes Token = Hausnr.).
    function splitStreet(value) {
      const m = (value || '').trim().match(/^(.*\S)\s+(\S+)$/)
      return m ? { street: m[1], houseNumber: m[2] } : { street: (value || '').trim(), houseNumber: '' }
    }
    // „PLZ Stadt" trennen (erstes Token = PLZ).
    function splitCity(value) {
      const m = (value || '').trim().match(/^(\S+)\s+(.*\S)$/)
      return m ? { postalCode: m[1], city: m[2] } : { postalCode: '', city: (value || '').trim() }
    }

    const streetLineValid = computed(() => {
      const s = splitStreet(streetLine.value)
      return Boolean(s.street && s.houseNumber)
    })
    const cityLineValid = computed(() => {
      const c = splitCity(cityLine.value)
      return Boolean(/^\d{4,5}$/.test(c.postalCode) && c.city)
    })

    const allInputsValidated = computed(
      () => carrierInput.name.isValid && streetLineValid.value && cityLineValid.value
    )

    function submitForm() {
      // Hauptadresse aus kompakten Feldern in die bestehenden Keys parsen.
      const s = splitStreet(streetLine.value)
      carrierInput.street.value = s.street
      carrierInput.street.isValid = true
      carrierInput.houseNumber.value = s.houseNumber
      carrierInput.houseNumber.isValid = true
      const c = splitCity(cityLine.value)
      carrierInput.postalCode.value = c.postalCode
      carrierInput.postalCode.isValid = true
      carrierInput.city.value = c.city
      carrierInput.city.isValid = true
      carrierInput.addressExtra.value = addressExtra.value || null
      carrierInput.poBox.value = poBox.value || null

      if (extra.sameAsMain) {
        // Keine abweichende Rechnungsadresse -> Felder leer (Abrechnung nutzt Hauptadresse).
        for (const key of [
          'billingName', 'billingStreet', 'billingHouseNumber',
          'billingAddressExtra', 'billingPostalCode', 'billingCity', 'billingPoBox'
        ]) {
          carrierInput[key].value = null
          carrierInput[key].isValid = false
        }
      } else {
        const bs = splitStreet(billingStreetLine.value)
        carrierInput.billingStreet.value = bs.street
        carrierInput.billingStreet.isValid = Boolean(bs.street)
        carrierInput.billingHouseNumber.value = bs.houseNumber
        carrierInput.billingHouseNumber.isValid = Boolean(bs.houseNumber)
        const bc = splitCity(billingCityLine.value)
        carrierInput.billingPostalCode.value = bc.postalCode
        carrierInput.billingPostalCode.isValid = Boolean(bc.postalCode)
        carrierInput.billingCity.value = bc.city
        carrierInput.billingCity.isValid = Boolean(bc.city)
        carrierInput.billingName.value = billingNameValue.value || null
        carrierInput.billingName.isValid = true
      }

      // Speicherweg unverändert: nur die bestehenden Keys emittieren.
      context.emit('submit-inputs', carrierInput)
    }

    return {
      streetLine, cityLine, addressExtra, poBox,
      billingStreetLine, billingCityLine, billingNameValue,
      carrierInput, extra,
      streetLineValid, cityLineValid, allInputsValidated,
      setName, setNameValidation, setPhone, setPhoneValidation, setEmail, setEmailValidation,
      submitForm
    }
  }
}
</script>
