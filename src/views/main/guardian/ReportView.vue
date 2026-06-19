<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
01.11.2022
Scope:
Report View
-->

<template>
  <div class="mx-auto max-w-3xl px-4 py-4 sm:px-6">
    <div>
      <!-- Error modal -->
      <error-window
        v-if="reportSuccess === 'error'"
        title="Fehler"
        message="Ihre Dokumentation konnte nicht erstellt werden. Bitte stellen Sie sicher, dass Sie alle Pflichtfelder ausgefüllt haben und über eine stabile Internetverbindung verfügen."
        :open="reportSuccess === 'error'"
        @close="reportSuccess = 'none'"
      />
      <!-- Success modal -->
      <success-window
        v-if="reportSuccess === 'success'"
        title="Dokumentation erstellt"
        message="Ihre Dokumentation wurde erfolgreich erstellt."
        :open="reportSuccess === 'success'"
        @close="goToHome"
      />
      <!-- no connected child Error modal -->
      <error-window
        v-if="!childFoundStatus"
        title="Kein Klient gefunden"
        message="Es konnte kein Klient gefunden werden. Bitte wenden Sie sich an einen Administrator."
        :open="!childFoundStatus"
        @close="goToHome"
      />
    </div>
    <!-- Form wrapper -->
    <form :class="[
      isLoading ? 'hidden' : 'block',
      'space-y-8 divide-y divide-slate-200'
    ]">
      <div class="space-y-8 divide-y divide-slate-200 sm:space-y-5">
        <div class="space-y-6 sm:space-y-5">
          <!-- Header -->
          <div>
            <h3 class="text-lg font-medium leading-6 text-primaryText">
              Dokumentation erstellen
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-secondaryText">
              Erstellen Sie eine Dokumentation für einen zugehörigen
              Klienten.
            </p>
          </div>

          <!-- Child selection -->
          <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5">
            <label
              for="child"
              class="block text-sm font-medium text-primaryText sm:mt-px sm:pt-2"
            >Klient wählen*</label>
            <div class="mt-1 sm:col-span-2 sm:mt-0">
              <select
                @change="childSelected"
                id="child"
                name="child"
                class="block w-full max-w-lg rounded-lg border-slate-300 shadow-sm focus:border-impuls-blue focus:ring-brand-100 sm:max-w-xs sm:text-sm"
              >
                <option
                  name="childoption"
                  v-for="child in children"
                  :value="child.id"
                  :key="child.id"
                >
                  {{ child.name + ' ' + child.familyName }}
                </option>
              </select>
            </div>
          </div>
          <!-- display error messages -->
          <div v-if="errorState !== 'none'">
            <div
              v-if="errorState === 'no-carrier'"
              class="bg-red-50 border border-red-200 p-2 rounded-md text-center"
            >
              <h2 class="text-lg text-red-700 font-bold my-2">
                Bitte an Admin wenden!
              </h2>
              <p class="text-red-700 p-2">
                Der ausgewählte Klient ist mit keinem Kostenträger-Kontakt oder der
                Kostenträger-Kontakt ist mit keinem Kostenträger verbunden!
              </p>
            </div>
          </div>
          <div v-else>
            <!-- sickness section -->
            <div class="flex flex-col gap-2 sm:border-t sm:border-slate-200 pb-2">
              <!-- sickness button -->
              <StandardButton
                v-if="!isSick"
                @button-tapped="childSickTapped"
                title="Klient krank melden"
                :enabled="!isSick"
                :isLoading="isLoading"
              />
              <p
                v-else
                class="text-sm text-secondaryText text-center"
              >
                Klient ist als krank markiert
              </p>
              <!-- healthy button -->
              <StandardButton
                v-if="isSick"
                @button-tapped="childNotSickTapped"
                title="Krankmeldung zurücknehmen"
                :enabled="isSick"
                :isLoading="isLoading"
              />
            </div>
            <!-- substitute selection -->
            <div class="flex flex-col sm:border-t sm:border-slate-200 mt-4 mb-2">
              <p class="text-base font-medium text-primaryText sm:text-sm">
                Vertretung*
              </p>
              <div class="mb-4 pace-y-4">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="inputData.substitute"
                    @click="substituteSelected"
                    id="substitute"
                    name="substitute"
                    class="w-5 h-5 text-impuls-blue bg-white border-slate-300 rounded focus:ring-brand-200 focus:ring-2"
                  >
                  <label
                    class="ml-3 p-1"
                    for="substitute"
                  >Die Betreuung findet in Vertretung statt.</label>
                </div>
              </div>
            </div>
            <!-- sick on time selection -->
            <div
              v-if="isSick"
              class="flex flex-col gap sm:border-t sm:border-slate-200 mt-4 mb-2"
            >
              <p class="text-base font-medium text-primaryText sm:text-sm">
                Meldestatus auswählen*
              </p>
              <p class="text-sm text-secondaryText mt-2">
                Bitte wählen Sie die passende Option für die Krankmeldung aus.
              </p>
              <div class="mb-4 pace-y-4">
                <div class="flex items-center">
                  <input
                    type="radio"
                    :checked="inputData.sickOnTime"
                    @click="sickOnTimeSelected"
                    id="sickOnTime"
                    name="sickOnTime"
                    class="h-4 w-4 border-gray-300 text-impuls-blue focus:ring-brand-200"
                  >
                  <label
                    class="ml-3 p-1"
                    for="sickOnTime"
                  >Folgetag (Meldezeit ist länger wie 24 Std)</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="radio"
                    :checked="!inputData.sickOnTime"
                    @click="sickOnTimeSelected"
                    id="sickDelayed"
                    name="sickDelayed"
                    class="h-4 w-4 border-gray-300 text-impuls-blue focus:ring-brand-200"
                  >
                  <label
                    class="ml-3 p-1"
                    for="sickDelayed"
                  >Krank (Meldezeit ist kürzer wie 24 Std)</label>
                </div>
              </div>
            </div>
            <!-- calendar | date + time selection -->
            <div class="flex flex-col gap-2 sm:border-t sm:border-slate-200">
              <p class="text-base font-medium text-primaryText sm:text-sm">
                Zeitraum auswählen*
              </p>
              <p
                v-if="!isSick"
                class="text-sm text-secondaryText"
              >
                Wählen Sie den betroffenen Tag, sowie Start- und Endzeitpunkt
                der Betreuung aus.
              </p>
              <p
                v-else
                class="text-sm text-secondaryText"
              >
                Wählen Sie den betroffenen Tag, sowie Start- und Endzeitpunkt
                der Betreuung aus, wie Sie sie bei Gesundheit des Kindes
                durchgeführt hätten.
              </p>
              <Calendar
                class="self-center"
                :showTimeSelection="allowTimeSelection"
                @date-selected="DateSelected"
                @time-selected="TimeSelected"
              />
            </div>
            <!-- report activity selection -->
            <div class="py-2">
              <div
                class="text-base font-medium text-primaryText sm:text-sm"
                id="reportActivity"
              >
                Tätigkeit auswählen
              </div>
              <p
                v-if="!isSick"
                class="text-sm text-secondaryText"
              >
                Wählen Sie die zutreffende Tätigkeit aus. Eine Tätigkeiten deaktivieren die Zeitauswahl.
              </p>
              <p
                v-else
                class="text-sm text-secondaryText"
              >
                Wählen Sie die zutreffende Tätigkeit aus, welche Sie bei
                Gesundheit des Klienten ausgeführt hätten.
              </p>
              <SimpleDropdown
                class="w-full mt-1"
                :displayTitle="false"
                title="Tätigkeit auswählen"
                :properties="[
                  'Schule',
                  'Hilfeplangespräch',
                  'Kennenlerngespräch',
                  'Hospitation',
                  'Ausflug / Klassenfahrt',
                  'Sonstiges'
                ]"
                defaultSelected="Schule"
                @selection="reportActivitySelected"
              />
            </div>

            <!-- Mood selection radio button section -->
            <div
              v-if="!isSick && inputData.reportActivity !== 'miscellaneous'"
              class="sm:pt-5"
            >
              <div
                role="group"
                aria-labelledby="label-notifications"
              >
                <div class="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                  <div>
                    <div
                      class="text-base font-medium text-primaryText sm:text-sm"
                      id="mood"
                    >
                      Verfassung / Stimmung
                    </div>
                  </div>
                  <div class="sm:col-span-2">
                    <div class="max-w-lg">
                      <p class="text-sm text-secondaryText">
                        Wählen Sie die zutreffende Option aus.
                      </p>
                      <div class="mt-4 space-y-4">
                        <div class="flex items-center">
                          <input
                            checked
                            @click="moodSelected"
                            id="happy"
                            name="moodinput"
                            type="radio"
                            class="h-4 w-4 border-gray-300 text-impuls-blue focus:ring-brand-200"
                          />
                          <img
                            class="ml-3 p-1 h-12 w-12 bg-white rounded-full"
                            src="@/assets/smileys/happy.png"
                          />
                        </div>
                        <div class="flex items-center">
                          <input
                            @click="moodSelected"
                            id="neutral"
                            name="moodinput"
                            type="radio"
                            class="h-4 w-4 border-gray-300 text-impuls-blue focus:ring-brand-200"
                          />
                          <img
                            class="ml-3 p-1 h-12 w-12 bg-white rounded-full"
                            src="@/assets/smileys/neutral.png"
                          />
                        </div>
                        <div class="flex items-center">
                          <input
                            @click="moodSelected"
                            id="sad"
                            name="moodinput"
                            type="radio"
                            class="h-4 w-4 border-gray-300 text-impuls-blue focus:ring-brand-200"
                          />
                          <img
                            class="ml-3 p-1 h-12 w-12 bg-white rounded-full"
                            src="@/assets/smileys/sad.png"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- exchange with school/teacher -->
            <div
              v-if="!isSick && inputData.reportActivity !== 'miscellaneous'"
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5"
            >
              <label
                for="negative"
                class="block text-sm font-medium text-primaryText sm:mt-px sm:pt-2"
              >Austausch</label>
              <p class="text-sm text-secondaryText">
                Austausch mit der Schule/ LehrerInnen/Fachfräfte (Abmachungen,
                Vereinbarungen, Infos, Sonstiges).
              </p>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  @input="exchangeFilled"
                  id="exchange"
                  name="exchange"
                  rows="3"
                  class="block w-full max-w-lg rounded-lg border-slate-300 shadow-sm focus:border-impuls-blue focus:ring-brand-100 sm:text-sm"
                />
                <p class="mt-2 text-sm text-secondaryText">Mehrere Sätze möglich.</p>
              </div>
            </div>

            <!-- Homework input -->
            <div
              v-if="!isSick && inputData.reportActivity !== 'miscellaneous'"
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5"
            >
              <label class="block text-sm font-medium text-primaryText sm:mt-px sm:pt-2">Hausaufgaben</label>
              <!-- <p class="text-sm text-secondaryText">
                Falls keine Hausaufgaben aufgegeben wurden, tragen Sie bitte
                "nichts" ein.
              </p> -->
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <!-- German input -->
                <div class="flex max-w-lg rounded-md shadow-sm">
                  <span
                    class="w-24 inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  >Deutsch</span>
                  <input
                    @input="germanFilled"
                    type="text"
                    name="german"
                    id="german"
                    class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <span class="sm:mt-px sm:pt-2"></span>
              <div class="mt-2 sm:col-span-2 sm:mt-0">
                <!-- Maths input -->
                <div class="flex max-w-lg rounded-md shadow-sm">
                  <span
                    class="w-24 inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  >Mathe</span>
                  <input
                    @input="mathsFilled"
                    type="text"
                    name="maths"
                    id="maths"
                    class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <span class="sm:mt-px sm:pt-2"></span>
              <div class="mt-2 sm:col-span-2 sm:mt-0">
                <!-- English input -->
                <div class="flex max-w-lg rounded-md shadow-sm">
                  <span
                    class="w-24 inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  >Englisch</span>
                  <input
                    @input="englishFilled"
                    type="text"
                    name="english"
                    id="english"
                    class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <span class="sm:mt-px sm:pt-2"></span>
              <div class="mt-2 sm:col-span-2 sm:mt-0">
                <!-- Individual homework input 1 -->
                <div class="flex max-w-lg rounded-md shadow-sm">
                  <input
                    @input="individual1NameFilled"
                    class="w-24 inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  />
                  <input
                    @input="individual1ValueFilled"
                    type="text"
                    name="individual1"
                    id="individual2"
                    class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <span class="sm:mt-px sm:pt-2"></span>
              <div class="mt-2 sm:col-span-2 sm:mt-0">
                <!-- Individual homework input 2 -->
                <div class="flex max-w-lg rounded-md shadow-sm">
                  <input
                    @input="individual2NameFilled"
                    class="w-24 inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  />
                  <input
                    @input="individual2ValueFilled"
                    type="text"
                    name="individual2"
                    id="individual2"
                    class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Daily report input -->
            <div
              v-if="!isSick"
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5"
            >
              <label
                for="report"
                class="block text-sm font-medium text-primaryText sm:mt-px sm:pt-2"
              >Tagesbericht*</label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  @input="reportFilled"
                  id="report"
                  name="report"
                  rows="3"
                  class="block w-full max-w-lg rounded-lg border-slate-300 shadow-sm focus:border-impuls-blue focus:ring-brand-100 sm:text-sm"
                />
                <p class="mt-2 text-sm text-secondaryText">Mehrere Sätze möglich.</p>
              </div>
            </div>

            <!-- Parent report input -->
            <div
              v-if="!isSick && inputData.reportActivity !== 'miscellaneous'"
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5"
            >
              <label
                for="parentreport"
                class="block text-sm font-medium text-primaryText sm:mt-px sm:pt-2"
              >Bericht der Eltern</label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  @input="parentreportFilled"
                  id="parentreport"
                  name="parentreport"
                  rows="3"
                  class="block w-full max-w-lg rounded-lg border-slate-300 shadow-sm focus:border-impuls-blue focus:ring-brand-100 sm:text-sm"
                />
                <p class="mt-2 text-sm text-secondaryText">Mehrere Sätze möglich.</p>
              </div>
            </div>

            <!-- Signature field for the school guardian -->
            <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5">
              <div class="col-span-1 sm:col-span-2 md:col-span-1">
                <SignatureField
                  ref="signatureField"
                  @get-image="signatureProvided"
                  class="mt-2"
                />
              </div>
              <p class="mt-2 text-sm text-secondaryText">
                Rechtsverbindliche elektronische Unterschrift.
              </p>
              <!-- truthfull button -->
              <div class="flex my-2 text-primaryText gap-2 items-center">
                <input
                  @click="thruthfullButtonTapped"
                  class="w-4 h-4 text-impuls-blue bg-white border-gray-300 rounded focus:ring-brand-200 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
                  type="checkbox"
                  id="truthfull"
                  value="truthfull"
                />
                <label for="truthfull">Ich versichere, dass die vorstehenden Angaben vollständig und
                  wahrheitsgemäß sind.</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <!-- Submit button section -->
    <div
      v-if="errorState === 'none'"
      :class="[isLoading ? 'hidden' : 'block', 'p-4']"
    >
      <!-- error message if not all required fields were filled -->
      <div
        v-if="!inputValid"
        class="flex items-center justify-center w-full h-full bg-red-50 border border-red-200 rounded-xl p-2"
      >
        <p class="text-center text-red-600 text-sm font-medium">
          Es wurden nicht alle Pflichtfelder ausgefüllt!
        </p>
      </div>
      <!-- submit button -->
      <StandardButton
        v-else
        @button-tapped="confirmButtonTapped"
        title="Bestätigen"
        :enabled="inputValid"
        :isLoading="isLoading"
      />
    </div>
    <!-- required fields reminder -->
    <div
      v-if="!isLoading && errorState === 'none'"
      class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5"
    >
      <p class="text-base font-medium text-secondaryText sm:text-sm">*Pflichtfeld</p>
    </div>
    <!-- loading spinenr -->
    <div
      v-if="isLoading"
      class="w-full flex justify-center"
    >
      <LoadingSpinner size="h-12 w-12" />
    </div>
  </div>
</template>


<script>
// Vue imports
import { ref, computed, onMounted } from 'vue'
import { careTimeIsPositive } from '@/utilities/forms/submitGuards.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// Component imports
import SignatureField from '@/components/UIComponents/Inputs/SignatureField.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import Calendar from '@/components/UIComponents/Inputs/Calendar.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  name: 'ReportView',
  components: {
    SignatureField,
    StandardButton,
    SimpleDropdown,
    Calendar,
    ErrorWindow,
    SuccessWindow,
    LoadingSpinner
  },
  setup() {
    const inpuDataDefault = {
      childname: '',
      dateOfRegistration: '',
      childID: '',
      schoolguardian: '',
      schoolguardianID: '',
      substitute: false,
      school: '',
      mood: 'happy',
      homework: {
        german: '',
        english: '',
        maths: '',
        individual1: {
          name: '',
          value: ''
        },
        individual2: {
          name: '',
          value: ''
        }
      },
      report: '',
      exchange: '',
      parentreport: '',
      sick: false,
      sickOnTime: false,
      date: null,
      hourFrom: null,
      hourTo: null,
      minuteFrom: null,
      minuteTo: null,
      reportActivity: 'school'
    }
    // Ref initialization
    const signatureField = ref()
    const inputData = ref(structuredClone(inpuDataDefault))
    const signature = ref(null)
    const truthfull = ref(false)
    const isSick = ref(false)
    const isLoading = ref(false)
    const reportSuccess = ref('none')
    const errorState = ref('none')
    const childFoundStatus = ref(false)
    const allowTimeSelection = ref(true)
    const sickOnTime = ref(false)

    // Store initialization
    const store = useStore()

    // router initialization
    const router = useRouter()

    // Get the guardians children from the store
    const children = computed(() => {
      return store.getters.children
    })

    // Callback when the user selected one children
    async function childSelected(event) {
      // Get the target child from the possible children
      const targetChild = store.getters.children.find((child) => {
        return child.id == event.target.value
      })
      // get carrier status
      await getCarrierStatusForChild(targetChild)
      // Set the name of the child
      inputData.value.childname = `${targetChild.name} ${targetChild.familyName}`
      // set the date of registration of the child
      inputData.value.dateOfRegistration = targetChild.dateOfRegistration
      // set the id of the child
      inputData.value.childID = targetChild.id
    }

    // Callback when the user selects the substitute option
    function substituteSelected(event) {
      // get value from checkbox
      inputData.value.substitute = event.target.checked
    }

    // callback when user selects child sick on time value
    function sickOnTimeSelected(val) {
      sickOnTime.value = val.target.id === 'sickOnTime'
      inputData.value.sickOnTime = val.target.id === 'sickOnTime'
    }

    // Callback when the user select a day
    function DateSelected(event) {
      inputData.value.date = event
    }

    // Callback when the user selects a reportActivity
    function reportActivitySelected(event) {
      // create dictionary to translate from selection to enum value
      const reportActivityterms = {
        Schule: 'school',
        Hilfeplangespräch: 'helpPlanDiscussion',
        Kennenlerngespräch: 'getToKnowInterview',
        Hospitation: 'hospitation',
        'Ausflug / Klassenfahrt': 'excursion',
        Sonstiges: 'miscellaneous'
      }
      inputData.value.reportActivity = reportActivityterms[event]
      // if activity is miscellaneous, we have to reset some values
      if (event === 'Sonstiges') {
        // reset report values --> values are not required for Sonstiges, so we reset them to default
        inputData.value.homework = {
          german: '',
          english: '',
          maths: '',
          individual1: {
            name: '',
            value: ''
          },
          individual2: {
            name: '',
            value: ''
          }
        }
        inputData.value.exchange = ''
        inputData.value.parentreport = ''
      }
    }

    // Callback when the user selected a mood radio button
    function moodSelected(event) {
      inputData.value.mood = event.target.id
    }

    // Callback when the user types in content for the positive reactions
    function exchangeFilled(event) {
      inputData.value.exchange = event.target.value
    }

    // Callback when the user types in content for the german homework
    function germanFilled(event) {
      inputData.value.homework.german = event.target.value
    }

    // Callback when the user types in content for the maths homework
    function mathsFilled(event) {
      inputData.value.homework.maths = event.target.value
    }

    // Callback when the user types in content for the english homework
    function englishFilled(event) {
      inputData.value.homework.english = event.target.value
    }

    // Callback when the user types in content for the first individual homework field name
    function individual1NameFilled(event) {
      inputData.value.homework.individual1.name = event.target.value
    }

    // Callback when the user types in content for the first individual homework field value
    function individual1ValueFilled(event) {
      inputData.value.homework.individual1.value = event.target.value
    }

    // Callback when the user types in content for the second individual homework field name
    function individual2NameFilled(event) {
      inputData.value.homework.individual2.name = event.target.value
    }

    // Callback when the user types in content for the second individual homework field value
    function individual2ValueFilled(event) {
      inputData.value.homework.individual2.value = event.target.value
    }

    // Callback when the user types in content for the report
    function reportFilled(event) {
      inputData.value.report = event.target.value
    }

    // Callback when the user types in content for the parents report
    function parentreportFilled(event) {
      inputData.value.parentreport = event.target.value
    }

    // Callback when the user types in content for the signature
    function signatureProvided(event) {
      signature.value = event
    }

    // Callback when user selects truthfull button
    function thruthfullButtonTapped(event) {
      truthfull.value = event.target.checked
    }

    // Callback when the user hits the confirm button
    async function confirmButtonTapped() {
      await submitReport()
    }

    // Callback when the user selects start and end time
    function TimeSelected(event) {
      for (const value in event) {
        inputData.value[value] = event[value]
      }
    }

    // Method to submit the report
    async function submitReport() {
      if (inputValid.value) {
        try {
          // set loading state
          isLoading.value = true
          // Get the image from the signature field
          signature.value
          // Get the guardian object from the store
          inputData.value.guardian = store.getters.guardian
          // Create the report in the backend via store
          const resp = await store.dispatch('createReport', {
            data: inputData.value,
            signature: signature.value
          })
          // set success state
          reportSuccess.value = 'success'
        } catch (error) {
          console.log(error)
          // set success state
          reportSuccess.value = 'error'
          // reset signature state
          signature.value = null
        } finally {
          // set loading state
          isLoading.value = false
        }
      }
    }

    // get carrier state for child, to check if a carrier is connected to child
    async function getCarrierStatusForChild(child) {
      try {
        // set loading state
        isLoading.value = true
        // call api with child ID
        const resp = await store.dispatch('getChildCarrierStatus', {
          id: child.id
        })

        // check status and change errorState
        if (resp.status) {
          errorState.value = 'none'
        } else {
          errorState.value = 'no-carrier'
        }
      } catch (error) {
        console.log(error)
      } finally {
        // set loading state
        isLoading.value = false
      }
    }

    // child sick tapped
    function childSickTapped() {
      // save selected values before reset
      const timeValues = {
        hourFrom: inputData.value.hourFrom,
        hourTo: inputData.value.hourTo,
        minuteFrom: inputData.value.minuteFrom,
        minuteTo: inputData.value.minuteTo,
        date: inputData.value.date
      }
      const reportActivityStatus = inputData.value.reportActivity

      // get currently selected child
      const currentChild = inputData.value.childID

      // set sick to true
      isSick.value = true

      // reset inputs
      inputData.value = structuredClone(inpuDataDefault)

      // Get the target child from the possible children
      const targetChild = store.getters.children.find((child) => {
        return child.id == currentChild
      })
      // set the school name
      inputData.value.school = targetChild.school
      // Set the name field for guardian
      inputData.value.schoolguardian =
        store.getters.user.attributes.name +
        ' ' +
        store.getters.user.attributes.family_name

      // pull basic child data
      childSelected({ target: { value: currentChild } })

      // write empty values for required inputs
      inputData.value.report = 'Krank'
      inputData.value.mood = 'sick'
      inputData.value.sick = true

      // rewrite values from before sick selection
      inputData.value.hourFrom = timeValues.hourFrom
      inputData.value.hourTo = timeValues.hourTo
      inputData.value.minuteFrom = timeValues.minuteFrom
      inputData.value.minuteTo = timeValues.minuteTo
      inputData.value.date = timeValues.date
      inputData.value.reportActivity = reportActivityStatus
    }

    // child not sick tapped
    function childNotSickTapped() {
      // save selected values before reset
      const timeValues = {
        hourFrom: inputData.value.hourFrom,
        hourTo: inputData.value.hourTo,
        minuteFrom: inputData.value.minuteFrom,
        minuteTo: inputData.value.minuteTo,
        date: inputData.value.date
      }
      const reportActivityStatus = inputData.value.reportActivity

      // get currently selected child
      const currentChild = inputData.value.childID

      // set sick to false
      isSick.value = false
      sickOnTime.value = false
      inputData.value.sickOnTime = false

      // reset inputs
      inputData.value = structuredClone(inpuDataDefault)

      // Get the target child from the possible children
      const targetChild = store.getters.children.find((child) => {
        return child.id == currentChild
      })
      // set the school name
      inputData.value.school = targetChild.school
      // Set the name field for guardian
      inputData.value.schoolguardian =
        store.getters.user.attributes.name +
        ' ' +
        store.getters.user.attributes.family_name

      // pull basic child data
      childSelected({ target: { value: currentChild } })

      // rewrite time from before healthy selection
      inputData.value.hourFrom = timeValues.hourFrom
      inputData.value.hourTo = timeValues.hourTo
      inputData.value.minuteFrom = timeValues.minuteFrom
      inputData.value.minuteTo = timeValues.minuteTo
      inputData.value.date = timeValues.date
      inputData.value.reportActivity = reportActivityStatus
    }

    const inputValid = computed(() => {
      // check shared required values (sick --> true/false)
      if (
        inputData.value.hourFrom === null ||
        !inputData.value.hourTo === null ||
        !inputData.value.minuteFrom === null ||
        !inputData.value.minuteTo === null ||
        !inputData.value.date ||
        !signature.value ||
        !truthfull.value
      ) {
        return false
      }

      // check if selected time is more than 0 hours and 0 minutes
      if (
        allowTimeSelection.value &&
        !careTimeIsPositive({
          hourFrom: inputData.value.hourFrom,
          minuteFrom: inputData.value.minuteFrom,
          hourTo: inputData.value.hourTo,
          minuteTo: inputData.value.minuteTo
        })
      ) {
        return false
      }

      // check data required if sick is false
      if (!isSick.value && inputData.value.reportActivity !== 'miscellaneous') {
        if (inputData.value.report !== '') {
          return true
        }
        return false
      }

      // return true if sick values were provided and sick is true
      return true
    })

    // redirect user to home view if he successfully created his report
    function goToHome() {
      router.push({ name: 'GuardianOverview' })
    }

    // Mounted hook to perform actions when the component is mounted
    onMounted(async () => {
      // Check if the user has connected children
      if (children.value.length !== 0) {
        // set status of child found to display form
        childFoundStatus.value = true
        // Get the first child
        const targetChild = store.getters.children[0]
        // get carrier status
        await getCarrierStatusForChild(targetChild)
        // set id fields
        inputData.value.childID = targetChild.id
        inputData.value.schoolguardianID = store.getters.user.username
        // set the school name
        inputData.value.school = targetChild.school
        // Set the name field for guardian
        inputData.value.schoolguardian =
          store.getters.user.attributes.name +
          ' ' +
          store.getters.user.attributes.family_name
        // set the date of registration of the child
        inputData.value.dateOfRegistration = targetChild.dateOfRegistration
        // Set the name of the first child as a default in the data object
        inputData.value.childname = `${targetChild.name} ${targetChild.familyName}`
      } else {
        // set child found status to display error message
        childFoundStatus.value = false
      }
    })

    // Return the setup object
    return {
      inputData,
      signatureField,
      children,
      inputValid,
      isLoading,
      reportSuccess,
      isSick,
      errorState,
      childFoundStatus,
      allowTimeSelection,
      sickOnTime,
      childSelected,
      substituteSelected,
      sickOnTimeSelected,
      DateSelected,
      reportActivitySelected,
      moodSelected,
      exchangeFilled,
      germanFilled,
      mathsFilled,
      englishFilled,
      individual1NameFilled,
      individual1ValueFilled,
      individual2NameFilled,
      individual2ValueFilled,
      reportFilled,
      parentreportFilled,
      signatureProvided,
      thruthfullButtonTapped,
      confirmButtonTapped,
      TimeSelected,
      childSickTapped,
      childNotSickTapped,
      goToHome
    }
  }
}
</script>