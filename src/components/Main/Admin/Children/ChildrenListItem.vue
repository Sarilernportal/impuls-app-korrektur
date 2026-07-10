<template>
  <div class="w-full py-4">
    <div
      :class="[
        ' flex flex-col md:flex-row gap-x-4 items-center',
        dataComplete ? '' : 'bg-red-500/50'
      ]"
    >
      <!-- index section -->
      <div v-if="childIndex" class="flex h-full self-start justify-self-end">
        <div
          class="flex justify-center items-center rounded-full h-5 w-5 aspect-square text-white bg-impuls-blue"
        >
          {{ childIndex }}
        </div>
      </div>
      <!-- section 1 -->
      <div class="flex flex-row w-full md:w-1/6 self-stretch">
        <div class="w-full flex flex-col">
          <!-- child name -->
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:flex">
              <div class="flex flex-wrap items-center text-sm text-gray-300">
                <UserIcon
                  class="mr-1.5 h-5 w-5 flex-shrink-0 text-secondaryText"
                  aria-hidden="true"
                />
                <p class="mr-2 text-secondaryText">Klient:</p>
                <p class="text-impuls-blue font-bold">{{ childName }}</p>
              </div>
            </div>
          </div>
          <!-- weeklyHours -->
          <div class="mt-2 sm:flex sm:justify-between"
          :class="{'bg-red-100 border border-red-500 rounded-lg p-1': !childWeeklyHours}">
            <div class="sm:flex">
              <div class="flex flex-wrap items-center text-sm text-gray-300">
                <UserIcon
                  class="mr-1.5 h-5 w-5 flex-shrink-0 text-secondaryText"
                  aria-hidden="true"
                />
                <p class="mr-2 text-secondaryText">Wochenstunden:</p>
                <p class="text-primaryText">{{ childWeeklyHours || 'N/A'}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Edit -->
        <div class="flex md:hidden h-full self-start justify-self-end">
          <button
            @click="showDetailsTapped"
            class="cursor-pointer text-base text-secondaryText hover:text-gray-600"
          >
            <Cog6ToothIcon class="h-8 w-8" />
          </button>
        </div>
      </div>
      <!-- section 2 -->
      <div class="flex flex-row w-full md:w-2/6 self-stretch">
        <div class="w-full">
          <!-- carrier contact name -->
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:flex">
              <div class="flex flex-wrap items-center text-sm text-gray-300">
                <UserIcon
                  class="mr-1.5 h-5 w-5 flex-shrink-0 text-secondaryText"
                  aria-hidden="true"
                />
                <p class="mr-2 text-secondaryText">ASD-Fachkraft:</p>
                <button
                  @click="goToCarrierContact"
                  class="flex-wrap justify-center text-primaryText hover:text-secondaryText break-words border-2 border-indigo-400 hover:border-indigo-600 px-1 inline-flex leading-5 rounded-full"
                >
                  <span
                    v-if="carrierContactName"
                    class="mr-1 whitespace-pre-wrap break-words"
                    >{{ carrierContactName }}</span
                  >
                  <span
                    v-if="carrierContactFamilyName"
                    class="mr-1 whitespace-pre-wrap break-words"
                    >{{ carrierContactFamilyName }}</span
                  >
                  <span
                    v-if="!carrierContactFamilyName && !carrierContactName"
                    class="mr-1 whitespace-pre-wrap break-words"
                    >Nicht angegeben</span
                  >
                </button>
              </div>
            </div>
          </div>
          <!-- carrier name -->
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:flex">
              <div class="flex flex-wrap items-center text-sm text-gray-300">
                <UserIcon
                  class="mr-1.5 h-5 w-5 flex-shrink-0 text-secondaryText"
                  aria-hidden="true"
                />
                <p class="mr-2 text-secondaryText">Kostenträger:</p>
                <button
                  @click="goToCarrier"
                  class="flex-wrap justify-center text-primaryText hover:text-secondaryText break-words border-2 border-indigo-400 hover:border-indigo-600 px-1 inline-flex leading-5 rounded-xl"
                >
                  <span
                    v-if="carrierName"
                    :title="carrierFullName"
                    class="mr-1 whitespace-pre-wrap break-words"
                    >{{ carrierName }}</span
                  >
                  <span v-else class="mr-1 whitespace-pre-wrap break-words"
                    >Nicht angegeben</span
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- section 3 -->
      <div class="w-full md:w-1/6 self-stretch">
        <!-- school contact -->
        <div class="mt-2 flex flex-col sm:justify-between">
          <div class="sm:flex">
            <div class="flex items-center text-sm text-gray-300">
              <UserIcon
                class="mr-1.5 h-5 w-5 flex-shrink-0 text-secondaryText"
                aria-hidden="true"
              />
              <p class="mr-2 text-secondaryText">Schulkontakt:</p>
            </div>
          </div>
          <div
            class="flex flex-col items-start text-sm text-gray-500 sm:mt-0 pl-6"
          >
            <div
              class="flex-wrap text-primaryText break-words px-1 inline-flex leading-5 rounded-full"
            >
              <span
                v-if="schoolContactName"
                class="mr-1 whitespace-pre-wrap break-words"
                >{{ schoolContactName }}</span
              >
              <span
                v-if="schoolContactFamilyName"
                class="mr-1 whitespace-pre-wrap break-words"
                >{{ schoolContactFamilyName }}</span
              >
              <span
                v-if="!schoolContactName && !schoolContactFamilyName"
                class="mr-1 whitespace-pre-wrap break-words"
                >Nicht angegeben</span
              >
            </div>
            <div
              class="flex-wrap text-secondaryText break-words px-1 inline-flex leading-5 rounded-full"
            >
              <span
                v-if="schoolContactPhone"
                class="mr-1 whitespace-pre-wrap break-words"
                >{{ schoolContactPhone }}</span
              >
            </div>
            <div
              class="flex-wrap text-indigo-500 hover:text-indigo-300 break-words px-1 inline-flex leading-5 rounded-full"
            >
              <a
                v-if="schoolContactEmail"
                :href="'mailto:' + schoolContactEmail"
                class="mr-1 whitespace-pre-wrap break-words"
                >{{ schoolContactEmail }}</a
              >
            </div>
          </div>
        </div>
      </div>
      <!-- Section 4 + 5 -->
      <div class="flex flex-col md:flex-row w-full md:w-2/6 self-stretch">
        <!-- section 4 -->
        <div class="w-1/2 self-stretch">
          <!-- mother -->
          <div class="mt-2 flex flex-col sm:justify-between">
            <div class="sm:flex">
              <div class="flex items-center text-sm text-gray-300">
                <UserIcon
                  class="mr-1.5 h-5 w-5 flex-shrink-0 text-secondaryText"
                  aria-hidden="true"
                />
                <p class="mr-2 text-secondaryText">Mutter:</p>
              </div>
            </div>
            <div
              class="flex flex-col items-start text-sm text-gray-500 sm:mt-0 pl-6"
            >
              <div
                class="flex-wrap text-primaryText break-words px-1 inline-flex leading-5 rounded-full"
              >
                <span
                  v-if="motherName"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ motherName }}</span
                >
                <span
                  v-if="motherFamilyName"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ motherFamilyName }}</span
                >
                <span
                  v-if="!motherName && !motherFamilyName"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >Nicht angegeben</span
                >
              </div>
              <div
                class="flex-wrap text-secondaryText break-words px-1 inline-flex leading-5 rounded-full"
              >
                <span
                  v-if="motherPhone"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ motherPhone }}</span
                >
              </div>
              <div
                class="flex-wrap text-indigo-500 hover:text-indigo-300 break-words px-1 inline-flex leading-5 rounded-full"
              >
                <a
                  v-if="motherEmail"
                  :href="'mailto:' + motherEmail"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ motherEmail }}</a
                >
              </div>
            </div>
          </div>
        </div>
        <!-- section 5 -->
        <div class="w-1/2 self-stretch">
          <!-- father -->
          <div class="mt-2 flex flex-col sm:justify-between">
            <div class="sm:flex">
              <div class="flex items-center text-sm text-gray-300">
                <UserIcon
                  class="mr-1.5 h-5 w-5 flex-shrink-0 text-secondaryText"
                  aria-hidden="true"
                />
                <p class="mr-2 text-secondaryText">Vater:</p>
              </div>
            </div>
            <div
              class="flex flex-col items-start text-sm text-gray-500 sm:mt-0 pl-6"
            >
              <div
                class="flex-wrap text-primaryText break-words px-1 inline-flex leading-5 rounded-full"
              >
                <span
                  v-if="fatherName"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ fatherName }}</span
                >
                <span
                  v-if="fatherFamilyName"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ fatherFamilyName }}</span
                >
                <span
                  v-if="!fatherName && !fatherFamilyName"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >Nicht angegeben</span
                >
              </div>
              <div
                class="flex-wrap text-secondaryText break-words px-1 inline-flex leading-5 rounded-full"
              >
                <span
                  v-if="fatherPhone"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ fatherPhone }}</span
                >
              </div>
              <div
                class="flex-wrap text-indigo-500 hover:text-indigo-300 break-words px-1 inline-flex leading-5 rounded-full"
              >
                <a
                  v-if="fatherEmail"
                  :href="'mailto:' + fatherEmail"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ fatherEmail }}</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Edit -->
      <div class="hidden md:flex h-full self-start justify-self-end">
        <button
          @click="showDetailsTapped"
          class="cursor-pointer text-base text-secondaryText hover:text-gray-600"
        >
          <Cog6ToothIcon class="h-8 w-8" />
        </button>
      </div>
    </div>
    <!-- list of linked children -->
    <div
      v-if="children.careAssignments.items.length > 0"
      :class="[
        'flex-col col-span-2 lg:col-span-7 pt-2 pb-1',
        dataComplete ? '' : 'bg-red-500/50'
      ]"
    >
      <div class="flex flex-row items-center gap-2">
        <span class="text-base text-secondaryText">Betreuer:</span>
        <!-- loading spinner container -->
        <div v-if="isLoading" class="p-1">
          <LoadingSpinner size="h-4 w-4 p" />
        </div>
        <ChildrenListItemGuardian
          v-else
          v-for="careAssignment in children.careAssignments.items"
          :key="careAssignment"
          :careAssignment="careAssignment"
        />
      </div>
      <button
        @click="goToTimesheets"
        class="inline-flex p-1 mr-2 gap-1 font-bold mt-4 text-white break-words border-2 border-indigo-400 hover:border-indigo-600 px-2 leading-5 rounded-full text-xs bg-indigo-400 hover:bg-indigo-600"
      >
        <span>Nachweise</span>
      </button>
      <button
        @click="goToReports"
        class="inline-flex p-1 mr-2 gap-1 font-bold mt-4 text-white break-words border-2 border-indigo-400 hover:border-indigo-600 px-2 leading-5 rounded-full text-xs bg-indigo-400 hover:bg-indigo-600"
      >
        <span>Dokumentationen</span>
      </button>
      <button
        @click="goToInvoices"
        class="inline-flex p-1 gap-1 font-bold mt-4 text-white break-words border-2 border-indigo-400 hover:border-indigo-600 px-2 leading-5 rounded-full text-xs bg-indigo-400 hover:bg-indigo-600"
      >
        <span>Rechnungen</span>
      </button>
    </div>
  </div>
</template>

<script>
// Vue imports
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// icon imports
import { UserIcon } from '@heroicons/vue/20/solid'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

// component imports
import ChildrenListItemGuardian from '@/components/Main/Admin/Children/ChildrenListItemGuardian.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  name: 'ChildrenListItem',
  components: {
    UserIcon,
    Cog6ToothIcon,
    ChildrenListItemGuardian,
    LoadingSpinner
  },
  props: {
    children: {
      type: Object,
      required: true
    },
    childIndex: {
      type: Number,
      required: false,
      default: null
    }
  },
  setup(props) {
    // initialize refs
    const isLoading = ref(false)

    // initialize router
    const router = useRouter()

    // initialize store
    const store = useStore()

    function showDetailsTapped() {
      // function for redirecting user to children detail page of selected children
      router.push({ name: 'ChildDetails', params: { id: props.children.id } })
    }

    function goToGuardian() {
      try {
        // function for redirecting user to children detail page of selected children
        router.push({
          name: 'UserDetails',
          params: { id: props.children.guardian.id }
        })
      } catch (error) {
        console.log('no guardian id found')
      }
    }

    function goToTimesheets() {
      try {
        // function for redirecting user to timesheets page with client and guardian query params
        router.push({
          path: '/admin/documents/timesheets',
          query: { 
            clientID: props.children.id,
            guardianID: props.children.careAssignments.items[0].guardianCareAssignmentsId
          }
        })
      } catch (error) {
        console.log('no guardian id found')
      }
    }

    function goToReports() {
      try {
        // function for redirecting user to timesheets page with client and guardian query params
        router.push({
          path: '/admin/documents/reports',
          query: { 
            clientID: props.children.id,
            guardianID: props.children.careAssignments.items[0].guardianCareAssignmentsId
          }
        })
      } catch (error) {
        console.log('no guardian id found')
      }
    }

    function goToInvoices() {
      try {
        // function for redirecting user to timesheets page with client and guardian query params
        router.push({
          path: '/admin/documents/invoices',
          query: { 
            clientID: props.children.id,
            guardianID: props.children.careAssignments.items[0].guardianCareAssignmentsId
          }
        })
      } catch (error) {
        console.log('error :', error)
        console.log('no guardian id found')
      }
    }

    function goToCarrier() {
      try {
        // function for redirecting user to carrier detail page of selected children
        router.push({
          name: 'CarrierDetails',
          params: { id: props.children.carrierContact.carrier.id }
        })
      } catch (error) {
        console.log('no carrier id found')
      }
    }

    function goToCarrierContact() {
      try {
        // function for redirecting user to children detail page of selected children
        router.push({
          name: 'CarrierContactDetails',
          params: { id: props.children.carrierContact.id }
        })
      } catch (error) {
        console.log('no carrierContact id found')
      }
    }

    // computed property for Username
    // Use "Nicht angegeben" if no value is found both in props
    const childName = computed(() => {
      var name = 'Nicht angegeben'
      if (props.children.name !== '') {
        name = props.children.name
      }
      if (props.children.familyName !== '') {
        name = name + ' ' + props.children.familyName
      }
      return name
    })

    // compute weekly hours of client
    const childWeeklyHours = computed(() => {
      try {
        return props.children.weeklyHours
      } catch (error) {
        console.log(error)
        // fallback
        return 'N/A'
      }
    })

    // get data completion status
    const dataComplete = computed(() => {
      try {
        return (
          props.children.dataComplete === null || props.children.dataComplete
        )
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // get carrier contact name
    const carrierContactName = computed(() => {
      try {
        return props.children.carrierContact.name
      } catch (error) {
        return null
      }
    })

    // get carrier contact family name
    const carrierContactFamilyName = computed(() => {
      try {
        return props.children.carrierContact.familyName
      } catch (error) {
        return null
      }
    })

    // compute mother information
    // compute mother name
    const motherName = computed(() => {
      try {
        return props.children.mother.name
      } catch (error) {
        return null
      }
    })
    // compute mother familyname
    const motherFamilyName = computed(() => {
      try {
        return props.children.mother.familyName
      } catch (error) {
        return null
      }
    })
    // compute mother phone
    const motherPhone = computed(() => {
      try {
        return props.children.mother.phone
      } catch (error) {
        return null
      }
    })
    // compute mother email
    const motherEmail = computed(() => {
      try {
        return props.children.mother.email
      } catch (error) {
        return null
      }
    })

    // compute father information
    // compute father name
    const fatherName = computed(() => {
      try {
        return props.children.father.name
      } catch (error) {
        return null
      }
    })
    // compute father familyname
    const fatherFamilyName = computed(() => {
      try {
        return props.children.father.familyName
      } catch (error) {
        return null
      }
    })
    // compute father phone
    const fatherPhone = computed(() => {
      try {
        return props.children.father.phone
      } catch (error) {
        return null
      }
    })
    // compute father email
    const fatherEmail = computed(() => {
      try {
        return props.children.father.email
      } catch (error) {
        return null
      }
    })

    // compute school contact information
    // compute schoolContact name
    const schoolContactName = computed(() => {
      try {
        return props.children.schoolContact.name
      } catch (error) {
        return null
      }
    })
    // compute schoolContact familyname
    const schoolContactFamilyName = computed(() => {
      try {
        return props.children.schoolContact.familyName
      } catch (error) {
        return null
      }
    })
    // compute schoolContact phone
    const schoolContactPhone = computed(() => {
      try {
        return props.children.schoolContact.phone
      } catch (error) {
        return null
      }
    })
    // compute schoolContact email
    const schoolContactEmail = computed(() => {
      try {
        return props.children.schoolContact.email
      } catch (error) {
        return null
      }
    })

    // compute carrier values
    // compute carrier name
    const carrierName = computed(() => {
      try {
        return props.children.carrierContact.carrier.name.length > 29
          ? props.children.carrierContact.carrier.name.slice(0, 30) + '...'
          : props.children.carrierContact.carrier.name
      } catch (error) {
        return null
      }
    })
    // compute carrier name
    const carrierFullName = computed(() => {
      try {
        return props.children.carrierContact.carrier.name
      } catch (error) {
        return null
      }
    })

    return {
      childName,
      childWeeklyHours,
      dataComplete,
      carrierContactName,
      carrierContactFamilyName,
      carrierName,
      carrierFullName,
      schoolContactName,
      schoolContactFamilyName,
      schoolContactPhone,
      schoolContactEmail,
      motherName,
      motherFamilyName,
      motherEmail,
      motherPhone,
      fatherName,
      fatherFamilyName,
      fatherEmail,
      fatherPhone,
      isLoading,
      showDetailsTapped,
      goToGuardian,
      goToCarrier,
      goToCarrierContact,
      goToTimesheets,
      goToReports,
      goToInvoices
    }
  }
}
</script>
