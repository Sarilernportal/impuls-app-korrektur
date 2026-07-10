<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
09.08.2023
Scope:
Invoice Creation Modal
-->
<template>
  <div class="absolute bottom-0 m-5 mb-10">
    <div
      class="flex flex-col grow md:flex-row bg-white p-4 rounded-lg items-start gap-2 md:gap-6 border border-slate-200 drop-shadow"
    >
      <!-- close button -->
      <div class="self-end md:self-center">
        <button @click="closeClicked">
          <XMarkIcon class="h-5 w-5 text-slate-600 hover:text-slate-400" />
        </button>
      </div>
      <!-- main section -->
      <div>
        <!-- info section -->
        <div class="flex gap-2">
          <div>
            <!-- info text -->
            <p
              v-if="selectedTimeSheets.length <= 0"
              class="text-sm md:text-base"
            >Es wurden noch keine Nachweise ausgewählt</p>
            <div
              class="text-sm"
              v-else
            >
              <!-- timesheet count -->
              <div class="flex gap-2">
                <p class="text-primaryText">Ausgewählt:</p>
                <p class="text-secondaryText">{{ selectedTimeSheets.length }}</p>
              </div>
              <!-- guardian info -->
              <!-- <div class="flex gap-2">
                <p class="text-primaryText">Betreuer:</p>
                <p class="text-secondaryText">{{ guardianName }}</p>
              </div> -->
              <!-- child info -->
              <div class="flex gap-2">
                <p class="text-primaryText">Klient:</p>
                <p class="text-secondaryText">{{ childName }}</p>
              </div>
              <!-- carrier info -->
              <div class="flex md:hidden gap-2">
                <p class="text-primaryText">Kostenträger:</p>
                <p class="text-secondaryText">{{ carrierName }}</p>
              </div>
              <!-- carrier invoice address usage -->
              <div class="flex md:hidden gap-2">
                <p class="text-primaryText">Adressverwendung:</p>
                <p class="text-secondaryText">{{ carrierUsesBillingAddress ? 'Rechnungsadresse' : 'Postanschrift' }}</p>
              </div>
            </div>
          </div>
          <!-- desktop carrier info -->
          <div
            v-if="selectedTimeSheets.length > 0"
            class="hidden md:flex md:flex-col text-sm pl-2"
          >
            <!-- carrier info -->
            <div class="flex gap-2">
              <p class="text-primaryText">Kostenträger:</p>
              <p class="text-secondaryText">{{ carrierName }}</p>
            </div>
            <!-- carrier invoice address usage -->
            <div class="flex gap-2">
              <p class="text-primaryText">Adressverwendung:</p>
              <p class="text-secondaryText">{{ carrierUsesBillingAddress ? 'Rechnungsadresse' : 'Postanschrift' }}</p>
            </div>
          </div>
        </div>
        <div>
          <!-- time info -->
          <div
            v-if="selectedTimeSheets.length > 0"
            class="flex flex-col text-sm"
          >
            <!-- overwrite hours -->
            <div class="flex flex-col md:flex-row gap-0 md:gap-4 border-t md:border-t-0 border-slate-200 mt-1 pt-1">
              <div class="flex gap-2 items-center w-full md:w-1/2">
                <p class="text-primaryText">Betreuungsstunden:</p>
                <p class="text-secondaryText">{{ totalHours }}</p>
              </div>
              <!-- delete DIV below in case of update to overwrite hours -->
              <div class="flex gap-2 items-center w-full md:w-1/2">
                <p class="text-primaryText">Krankenstunden:</p>
                <p class="text-secondaryText">{{ totalSickHours + ' (' + billableSickHours + ')' }}</p>
              </div>
              <!-- <div class="flex gap-2 items-center w-full md:w-1/2">
                <p class="text-primaryText">Überschreibung:</p>
                <number-textfield
                  elementID="overwriteHours"
                  name="overwriteHours"
                  placeholder="(optional)"
                  @input-value="setOverwriteHours"
                  @is-valid="setOverwriteHoursValidation"
                />
              </div> -->
            </div>
            <!-- overwrite sick hours -->
            <!-- <div class="flex flex-col md:flex-row gap-0 md:gap-4 border-t md:border-t-0 border-slate-200 mt-1 pt-1">
              <div class="flex gap-2 items-center w-full md:w-1/2">
                <p class="text-primaryText">Krankenstunden:</p>
                <p class="text-secondaryText">{{ totalSickHours + ' (' + billableSickHours + ')' }}</p>
              </div>
              <div class="flex gap-2 items-center w-full md:w-1/2">
                <p class="text-primaryText">Überschreibung:</p>
                <number-textfield
                  elementID="overwriteSickHours"
                  name="overwriteSickHours"
                  placeholder="(optional)"
                  @input-value="setOverwriteSickHours"
                  @is-valid="setOverwriteSickHoursValidation"
                />
              </div>
            </div> -->
          </div>
        </div>
        <div>
          <!-- Year info -->
          <div
            v-if="selectedTimeSheets.length > 0"
            class="flex flex-col text-sm"
          >
            <!-- year/month selection -->
            <div class="flex flex-col md:flex-row gap-0 md:gap-4 border-t md:border-t-0 border-slate-200 mt-1 pt-1">
              <SimpleDropdown
                class="w-full"
                title="Rechnungsjahr"
                :properties="[new Date().getFullYear(), new Date().getFullYear() - 1]"
                :defaultSelected="new Date().getFullYear().toString()"
                @selection="setInvoiceYear"
              />
              <SimpleDropdown
                class="w-full"
                title="Rechnungsmonat"
                :properties="months"
                :defaultSelected="defaultMonth"
                @selection="setInvoiceMonth"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Submit Button -->
      <div class="self-center">
        <StandardButton
          title="Rechnung erstellen"
          :isLoading="isLoading"
          :enabled="createEnabled && !isLoading"
          @button-tapped="createTapped"
        />
      </div>
    </div>
  </div>
</template>
  
<script>
// vue imports
import { ref, computed } from "vue";

// component imports
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import NumberTextfield from '@/components/UIComponents/Inputs/NumberTextfield.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'

//Icon imports
import {
  XMarkIcon
} from '@heroicons/vue/24/outline'

export default {
  components: {
    XMarkIcon,
    StandardButton,
    NumberTextfield,
    SimpleDropdown
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    createEnabled: {
      type: Boolean,
      required: true,
      default: false
    },
    selectedTimeSheets: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['close-clicked', 'create-tapped', 'overwrite-hours', 'overwrite-hours-validation', 'overwrite-sick-hours', 'overwrite-sick-hours-validation', 'year-selected', 'month-selected'],
  setup(props, { emit }) {
    // initialize refs
    const months = ref([
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember'
    ])

    // set overwrite hours value
    function setOverwriteHours(val) {
      emit('overwrite-hours', val)
    }
    // set overwrite hours validation
    function setOverwriteHoursValidation(val) {
      emit('overwrite-hours-validation', val)
    }
    // set overwrite sick hours value
    function setOverwriteSickHours(val) {
      emit('overwrite-sick-hours', val)
    }
    // set overwrite sick hours validation
    function setOverwriteSickHoursValidation(val) {
      emit('overwrite-sick-hours-validation', val)
    }

    // function for emitting the invoice year
    function setInvoiceYear(year) {
      emit('year-selected', year)
    }

    // function for emitting the invoice month
    function setInvoiceMonth(month) {
      console.log(month)
      emit('month-selected', month)
    }

    // compute carriername of selected timesheets
    const carrierName = computed(() => {
      try {
        return props.selectedTimeSheets[0].carrier.name !== '' ? props.selectedTimeSheets[0].carrier.name.slice(0, 30) + '...' : 'Nicht angegeben'
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht angegeben'
      }
    })

    // compute guardianName of selected timesheets
    const guardianName = computed(() => {
      try {
        // define return var
        var guardianName = "Nicht angegeben"
        // define values
        const name = props.selectedTimeSheets[0].guardian.name
        const familyName = props.selectedTimeSheets[0].guardian.familyName
        const email = props.selectedTimeSheets[0].guardian.email

        // check if name exists
        if (name) {
          guardianName = name
        }
        // check if familyname and name exists, if yes return full name
        if (name && familyName) {
          guardianName = guardianName + " " + familyName
        }
        // if neither name and familyname exist, but email was found, return email
        if (!name && !familyName && email) {
          guardianName = email
        }

        return guardianName
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht angegeben'
      }
    })

    // compute childName of selected timesheets
    const childName = computed(() => {
      try {
        var name = 'Nicht angegeben'
        if (props.selectedTimeSheets[0].child.name !== '') {
          name = props.selectedTimeSheets[0].child.name
        }
        if (props.selectedTimeSheets[0].child.familyName !== '') {
          name = name + ' ' + props.selectedTimeSheets[0].child.familyName
        }
        return name
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht angegeben'
      }
    })

    // compute carrier address usage of selected timesheets
    const carrierUsesBillingAddress = computed(() => {
      try {
        const carrier = props.selectedTimeSheets[0].carrier
        return carrier.useBillingAddress && carrier.billingCity !== null && carrier.billingHouseNumber !== null && carrier.billingPostalCode !== null && carrier.billingStreet !== null
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht angegeben'
      }
    })

    // compute total hours of dailyReports of all selected timeSheets
    const totalHours = computed(() => {
      try {
        var totalDecimal = 0
        for (const doc of props.selectedTimeSheets) {
          for (const dailyReport of doc.dailyReport.items) {
            if (!dailyReport.sick) {
              const timeFrom = dailyReport.hourFrom + dailyReport.minuteFrom / 60
              const timeTo = dailyReport.hourTo + dailyReport.minuteTo / 60
              totalDecimal = totalDecimal + (timeTo - timeFrom)
            }
          }
        }
        return totalDecimal
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht ermittelbar'
      }
    })

    // compute total hours of dailyReports of all selected timeSheets where the client was sick
    const totalSickHours = computed(() => {
      try {
        var totalDecimal = 0
        for (const doc of props.selectedTimeSheets) {
          for (const dailyReport of doc.dailyReport.items) {
            if (dailyReport.sick) {
              const timeFrom = dailyReport.hourFrom + dailyReport.minuteFrom / 60
              const timeTo = dailyReport.hourTo + dailyReport.minuteTo / 60
              totalDecimal = totalDecimal + (timeTo - timeFrom)
            }
          }
        }
        return totalDecimal
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht ermittelbar'
      }
    })

    // compute total hours of dailyReports of all selected timeSheets where the client was sick with a maximum of 3 being billable
    const billableSickHours = computed(() => {
      try {
        // create total decimal variable
        var totalDecimal = 0
        // create sorted dailyReport array from timesheets
        var dailyReports = []
        for (const timeSheet of props.selectedTimeSheets) {
          dailyReports = dailyReports.concat(timeSheet.dailyReport.items)
        }
        // create sorted document array --> sort by date, starting with the earliest --> VERY important for invoice payment calculation
        const sortedDocuments = dailyReports.sort((a, b) =>
          new Date(a.documentDate) > new Date(b.documentDate)
            ? 1
            : new Date(b.documentDate) > new Date(a.documentDate)
              ? -1
              : 0
        );
        // counting sick days
        var sickDayCount = 0
        // calculate total sick hours --> up to 3 sick days
        for (const dailyReport of sortedDocuments) {
          // adjust sick counter
          if (dailyReport.sick && (dailyReport.sickOnTime === false || dailyReport.sickOnTime === null)) {
            sickDayCount += 1
          }
          if (sickDayCount <= 3 && dailyReport.sick && (dailyReport.sickOnTime === false || dailyReport.sickOnTime === null)) {
            const timeFrom = dailyReport.hourFrom + dailyReport.minuteFrom / 60
            const timeTo = dailyReport.hourTo + dailyReport.minuteTo / 60
            totalDecimal = totalDecimal + (timeTo - timeFrom)
          }
        }
        return totalDecimal
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht ermittelbar'
      }
    })

    const defaultMonth = computed(() => {
      return new Date().toLocaleString('de', { month: 'long' })
    })

    // function for emitting close clicked event
    function closeClicked() {
      emit('close-clicked')
    }

    // emit create tapped event
    function createTapped() {
      emit('create-tapped')
    }

    return {
      carrierName,
      guardianName,
      childName,
      carrierUsesBillingAddress,
      totalHours,
      totalSickHours,
      billableSickHours,
      months,
      defaultMonth,
      closeClicked,
      createTapped,
      setOverwriteHours,
      setOverwriteHoursValidation,
      setOverwriteSickHours,
      setOverwriteSickHoursValidation,
      setInvoiceYear,
      setInvoiceMonth
    }
  }
}
</script>