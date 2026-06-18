<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
09.03.2023
Scope:
Edit Report View
-->

<template>
  <div class="mx-auto max-w-3xl px-4 py-4 sm:px-6">
    <div>
      <!-- Error modal -> report not found -->
      <error-window
        v-if="reportFindSuccess === 'error'"
        title="Fehler"
        message="Ihre Dokumentation konnte nicht gefunden werden. Bitte stellen Sie sicher, dass Sie alle Pflichtfelder ausgefüllt haben und über eine stabile Internetverbindung verfügen."
        :open="reportFindSuccess === 'error'"
        @close="goBackToPrevious"
      />
      <!-- Error modal -> report updaet failes -->
      <error-window
        v-if="reportSuccess === 'error'"
        title="Fehler"
        message="Ihre Dokumentation konnte nicht aktualisiert werden. Bitte stellen Sie sicher, dass Sie alle Pflichtfelder ausgefüllt haben und über eine stabile Internetverbindung verfügen."
        :open="reportSuccess === 'error'"
        @close="reportSuccess = 'none'"
      />
      <!-- Success modal -->
      <success-window
        v-if="reportSuccess === 'success'"
        title="Dokumentation aktualisiert"
        message="Ihre Dokumentation wurde erfolgreich aktualisiert."
        :open="reportSuccess === 'success'"
        @close="goBackToPrevious"
      />
    </div>
    <!-- Form wrapper -->
    <form :class="[
      isLoading ? 'hidden' : 'block',
      'space-y-8 divide-y divide-gray-200'
    ]">
      <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div class="space-y-6 sm:space-y-5">
          <!-- Header -->
          <div>
            <h3 class="text-lg font-medium leading-6 text-primaryText">
              Dokumentation überarbeiten
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-secondaryText">
              Überarbeiten Sie die Dokumentation für den zugehörigen
              Klienten.
            </p>
          </div>
          <div
            v-if="flagText"
            class="flex flex-col bg-red-50 border border-red-200 rounded-lg p-2 gap-2"
          >
            <!-- flag text -->
            <h3 class="w-full text-center font-medium text-red-700">
              Anmerkung durch Admin
            </h3>
            <!-- description -->
            <p class="text-center text-sm text-red-700">
              {{ flagText }}
            </p>
          </div>

          <!-- Child selection -->
          <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              for="child"
              class="text-base font-medium text-primaryText sm:text-sm"
            >Klient:</label>
            <div>
              <p class="block text-lg font-semibold text-primaryText sm:mt-px sm:pt-2">
                {{ childName }}
              </p>
            </div>
          </div>
          <!-- substitute selection -->
          <div class="flex flex-col sm:border-t sm:border-gray-200 mt-4 mb-2">
            <p class="text-base font-medium text-primaryText sm:text-sm">
              In Vertretung?*
            </p>
            <p class="text-sm text-secondaryText mt-2">
              Bitte wählen Sie aus, ob Sie als Vertratung für den Klienten agieren.
            </p>
          </div>
          <!-- substitute selection -->
          <div class="flex flex-col sm:border-t sm:border-gray-200 mt-4 mb-2">
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
                  class="w-5 h-5 text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
                >
                <label
                  class="ml-3 p-1"
                  for="substitute"
                >Die Betreuung findet in Vertretung statt.</label>
              </div>
            </div>
          </div>
          <!-- sickness section -->
          <div>
            <div
              v-if="isSick"
              class="flex flex-col sm:border-t sm:border-gray-200 mt-4 mb-2"
            >
              <p class="text-sm text-secondaryText text-center">
                Klient ist als krank markiert
              </p>
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
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  >
                  <label
                    class="ml-3 p-1"
                    for="sickDelayed"
                  >Krank (Meldezeit ist kürzer wie 24 Std)</label>
                </div>
              </div>
            </div>
            <!-- calendar | date + time selection -->
            <div class="flex flex-col gap-2 sm:border-t sm:border-gray-200">
              <p class="text-base font-medium text-primaryText sm:text-sm">
                Zeitraum auswählen*
              </p>
              <p
                v-if="!isSick"
                class="text-sm text-secondaryText"
              >
                Wählen Sie den Start- und Endzeitpunkt der Betreuung aus.
              </p>
              <p
                v-else
                class="text-sm text-secondaryText"
              >
                Wählen Sie den Start- und Endzeitpunkt der Betreuung aus, wie
                Sie sie bei Gesundheit des Kindes durchgeführt hätten.
              </p>
              <p class="text-base font-medium text-primaryText sm:text-sm text-center">
                {{ 'Datum: ' + reportDate }}
              </p>
              <Calendar
                class="self-center"
                @date-selected="DateSelected"
                @time-selected="TimeSelected"
                :showDaySelection="allowDaySelection"
                :showTimeSelection="allowTimeSelection"
                :defaultValues="getDefaultSelectedTimeDate"
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
                :defaultSelected="getDefaultSelectedActivity"
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
                            :checked="inputData.mood === 'happy'"
                            @click="moodSelected"
                            id="happy"
                            name="moodinput"
                            type="radio"
                            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <img
                            class="ml-3 p-1 h-12 w-12 bg-white rounded-full"
                            src="@/assets/smileys/happy.png"
                          />
                        </div>
                        <div class="flex items-center">
                          <input
                            :checked="inputData.mood === 'neutral'"
                            @click="moodSelected"
                            id="neutral"
                            name="moodinput"
                            type="radio"
                            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <img
                            class="ml-3 p-1 h-12 w-12 bg-white rounded-full"
                            src="@/assets/smileys/neutral.png"
                          />
                        </div>
                        <div class="flex items-center">
                          <input
                            :checked="inputData.mood === 'sad'"
                            @click="moodSelected"
                            id="sad"
                            name="moodinput"
                            type="radio"
                            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
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
                  :value="inputData.exchange"
                  class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p class="mt-2 text-sm text-secondaryText">Mehrere Sätze möglich.</p>
              </div>
            </div>

            <!-- Homework input -->
            <div
              v-if="!isSick && inputData.reportActivity !== 'miscellaneous'"
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
            >
              <label class="block text-sm font-medium text-primaryText sm:mt-px sm:pt-2">Hausaufgaben</label>
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
                    :value="inputData.homework.german"
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
                    :value="inputData.homework.maths"
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
                    :value="inputData.homework.english"
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
                    :value="homeWorkIndividual1Name"
                    class="w-24 inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  />
                  <input
                    @input="individual1ValueFilled"
                    type="text"
                    name="individual1"
                    id="individual1"
                    :value="homeWorkIndividual1Value"
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
                    :value="homeWorkIndividual2Name"
                    class="w-24 inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  />
                  <input
                    @input="individual2ValueFilled"
                    type="text"
                    name="individual2"
                    id="individual2"
                    :value="homeWorkIndividual2Value"
                    class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Daily report input -->
            <div
              v-if="!isSick"
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
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
                  :value="inputData.report"
                  class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p class="mt-2 text-sm text-secondaryText">Mehrere Sätze möglich.</p>
              </div>
            </div>

            <!-- Parent report input -->
            <div
              v-if="!isSick && inputData.reportActivity !== 'miscellaneous'"
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
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
                  :value="inputData.parentreport"
                  class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p class="mt-2 text-sm text-secondaryText">Mehrere Sätze möglich.</p>
              </div>
            </div>

            <!-- Signature field for the school guardian -->
            <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
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
                  class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
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
      <StandardButton
        @button-tapped="confirmButtonTapped"
        title="Bestätigen"
        :enabled="inputValid"
        :isLoading="isLoading"
      />
    </div>
    <!-- required fields reminder -->
    <div
      v-if="!isLoading && errorState === 'none'"
      class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
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
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

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
    LoadingSpinner,
  },
  setup() {
    const inpuDataDefault = {
      id: '',
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
    const sickOnTime = ref(false)
    const isLoading = ref(false)
    const reportSuccess = ref('none')
    const reportFindSuccess = ref('none')
    const errorState = ref('none')
    const dailyReportData = ref(null)
    const getDefaultSelectedTimeDate = ref(null)
    const allowDaySelection = ref(false)
    const flagText = ref(null)
    const allowTimeSelection = ref(true)

    // Store initialization
    const store = useStore()

    // router initialization
    const router = useRouter()

    // route initialization
    const route = useRoute()

    // Callback when the user selects the substitute option
    function substituteSelected(event) {
      // get value from checkbox
      inputData.value.substitute = event.target.checked
    }

    // callback when user changes sickontime status
    function sickOnTimeSelected(val) {
      inputData.value.sickOnTime = val.target.id === 'sickOnTime'
      sickOnTime.value = val.target.id === 'sickOnTime'
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
        Sonstiges: 'miscellaneous',
        'Ausflug / Klassenfahrt': 'excursion',
        '[i]Feiertag': 'holiday',
        '[i]Urlaub': 'vacation',
        '[i]Krankmeldung': 'employeeSickness',
        '[i]Sonstiges': 'other',
        '[i]Supervision': 'supervision',
        '[i]Teamsitzung': 'teamMeeting'
      }
      inputData.value.reportActivity = reportActivityterms[event]
      // check for time enable/disable state
      checkTimeEnable()
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

    // check if time selection should be disabled
    function checkTimeEnable() {
      try {
        // create blacklist of activities where time should be disabled
        const blacklist = ['holiday', 'vacation', 'employeeSickness', 'other']

        // check if new activity is in blacklist 
        if (blacklist.includes(inputData.value.reportActivity)) {
          // disable time selection
          allowTimeSelection.value = false
          // set time to default values
          TimeSelected({ hourFrom: 12, hourTo: 12, minuteFrom: 0, minuteTo: 0 })
        } else {
          allowTimeSelection.value = true
        }
      } catch (error) {
        console.log(error)
      }
    }

    // pull dailyReport from AppSync
    async function getReport() {
      try {
        // set loading state
        isLoading.value = true
        // get dailyReport values from controller
        const dailyReport = await store.dispatch('guardianGetDailyReport', {
          id: route.params.id
        })
        // set daily report
        dailyReportData.value = dailyReport
        // set daySelection status
        allowDaySelection.value = dailyReport.flagDaySelection
        // set flag text
        flagText.value = dailyReport.flagText
      } catch (error) {
        console.log(error)
        reportFindSuccess.value = 'error'
      } finally {
        // set loading state
        isLoading.value = false
      }
    }

    // prefill input using report data
    function prefillInput() {
      if (reportFindSuccess.value === 'none') {
        // set report id
        inputData.value.id = route.params.id

        // set child data
        inputData.value.childID = dailyReportData.value.child.id
        inputData.value.school = dailyReportData.value.child.school
        inputData.value.dateOfRegistration =
          dailyReportData.value.child.dateOfRegistration
        inputData.value.childname = `${dailyReportData.value.child.name} ${dailyReportData.value.child.familyName}`

        // set guardian data
        inputData.value.schoolguardianID = store.getters.user.username
        inputData.value.schoolguardian =
          store.getters.user.attributes.name +
          ' ' +
          store.getters.user.attributes.family_name

        // fill out simple values
        inputData.value.mood = dailyReportData.value.mood
        inputData.value.parentreport = dailyReportData.value.parentreport
        inputData.value.report = dailyReportData.value.report
        inputData.value.exchange = dailyReportData.value.exchange
        inputData.value.reportActivity = dailyReportData.value.reportActivity
        inputData.value.hourFrom = dailyReportData.value.hourFrom
        inputData.value.minuteFrom = dailyReportData.value.minuteFrom
        inputData.value.hourTo = dailyReportData.value.hourTo
        inputData.value.minuteTo = dailyReportData.value.minuteTo
        inputData.value.sick = dailyReportData.value.sick
        inputData.value.sickOnTime = dailyReportData.value.sickOnTime || dailyReportData.value.sickOnTime === null
        inputData.value.substitute = dailyReportData.value.substitute === null ? false : dailyReportData.value.substitute
        inputData.value.date = dailyReportData.value.documentDate

        // fill out homework
        const parsedHomework = JSON.parse(dailyReportData.value.homework)
        inputData.value.homework.german = parsedHomework.german
        inputData.value.homework.maths = parsedHomework.maths
        inputData.value.homework.english = parsedHomework.english
        inputData.value.homework.individual1 = parsedHomework.individual1
        inputData.value.homework.individual2 = parsedHomework.individual2

        // set sick status
        isSick.value = dailyReportData.value.sick
        sickOnTime.value = dailyReportData.value.sickOnTime || dailyReportData.value.sickOnTime === null

        getDefaultSelectedTimeDate.value = {
          date: inputData.value.date,
          hourFrom: inputData.value.hourFrom,
          minuteFrom: inputData.value.minuteFrom,
          hourTo: inputData.value.hourTo,
          minuteTo: inputData.value.minuteTo
        }
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
          // Update the report in the backend via store
          const resp = await store.dispatch('updateReport', {
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
        inputData.value.hourTo +
        inputData.value.minuteTo / 60 -
        (inputData.value.hourFrom + inputData.value.minuteFrom / 60) <=
        0
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

    // compute full child name
    const childName = computed(() => {
      try {
        return inputData.value.childname !== ''
          ? inputData.value.childname
          : 'N/A'
      } catch (error) {
        return 'N/A'
      }
    })

    // compute date of report
    const reportDate = computed(() => {
      try {
        return new Date(inputData.value.date).toLocaleDateString('de-DE')
      } catch (error) {
        return 'N/A'
      }
    })

    // return name for individual homework 1
    const homeWorkIndividual1Name = computed(() => {
      try {
        return inputData.value.homework.individual1.name
      } catch (error) {
        return ''
      }
    })
    // return value for individual homework 1
    const homeWorkIndividual1Value = computed(() => {
      try {
        return inputData.value.homework.individual1.value
      } catch (error) {
        return ''
      }
    })

    // return name for individual homework 2
    const homeWorkIndividual2Name = computed(() => {
      try {
        return inputData.value.homework.individual2.name
      } catch (error) {
        return ''
      }
    })
    // return value for individual homework 2
    const homeWorkIndividual2Value = computed(() => {
      try {
        return inputData.value.homework.individual2.value
      } catch (error) {
        return ''
      }
    })

    const getDefaultSelectedActivity = computed(() => {
      try {
        // create dictionary for value translation
        const reportActivitytermsRev = {
          school: 'Schule',
          helpPlanDiscussion: 'Hilfeplangespräch',
          getToKnowInterview: 'Kennenlerngespräch',
          hospitation: 'Hospitation',
          excursion: 'Ausflug / Klassenfahrt',
          miscellaneous: 'Sonstiges',
          holiday: '[i]Feiertag',
          vacation: '[i]Urlaub',
          employeeSickness: '[i]Krankmeldung',
          other: '[i]Sonstiges',
          supervision: '[i]Supervision',
          teamMeeting: '[i]Teamsitzung'
        }

        return reportActivitytermsRev[inputData.value.reportActivity]
      } catch (error) {
        console.log(error)
        return null
      }
    })

    // redirect user to home view if he successfully created his report
    function goBackToPrevious() {
      try {
        if (route.query.from === 'ProofView') {
          router.push({ name: 'ProofView' })
        } else if (route.query.from === 'GuardianFlaggedDetails') {
          router.push({
            name: 'GuardianFlaggedDetails',
            params: { id: route.query.flagId }
          })
        } else {
          router.push({ name: 'GuardianOverview' })
        }
      } catch (error) {
        router.push({ name: 'GuardianOverview' })
      }
    }

    // Mounted hook to perform actions when the component is mounted
    onMounted(async () => {
      await getReport()
      prefillInput()
    })

    // Return the setup object
    return {
      signatureField,
      inputValid,
      isLoading,
      reportSuccess,
      reportFindSuccess,
      isSick,
      sickOnTime,
      errorState,
      childName,
      inputData,
      reportDate,
      allowDaySelection,
      flagText,
      dailyReportData,
      getDefaultSelectedActivity,
      getDefaultSelectedTimeDate,
      homeWorkIndividual1Name,
      homeWorkIndividual1Value,
      homeWorkIndividual2Name,
      homeWorkIndividual2Value,
      allowTimeSelection,
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
      goBackToPrevious
    }
  }
}
</script>