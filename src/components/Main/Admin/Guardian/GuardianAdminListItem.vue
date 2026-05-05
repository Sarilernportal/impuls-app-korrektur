<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.01.2023

Scope:
Guardian List Item
-->

<template>
  <div class="flex">
    <div class="w-full px-6 pb-6 grid grid-cols-3 grid-rows-3 lg:grid-cols-9 lg:grid-rows-1 gap-x-4 items-center">
      <!-- item section -->
      <!-- guardian name -->
      <div class="order-1 lg:px-0 py-2 lg:py-4 col-span-4 lg:col-span-1 whitespace-nowrap">
        <div class="flex items-center">
          <div>
            <div class="lg:hidden text-base text-secondaryText">
              <span>Vorname:</span>
            </div>
            <div class="text-base text-primaryText flex flex-wrap break-words">
              <span class="mr-1 whitespace-pre-wrap break-words text-impuls-blue font-bold">{{ guardianName }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="order-1 lg:px-0 py-2 lg:py-4 col-span-4 lg:col-span-1 whitespace-nowrap">
        <div class="flex items-center">
          <div>
            <div class="lg:hidden text-base text-secondaryText">
              <span>Nachname:</span>
            </div>
            <div class="text-base text-primaryText flex flex-wrap break-words">
              <span class="mr-1 whitespace-pre-wrap break-words text-impuls-blue font-bold">{{ guardianFamilyName }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- contact -->
      <div class="order-2 lg:px-0 py-2 lg:py-4 col-span-4 lg:col-span-2 whitespace-nowrap">
        <div class="lg:hidden text-base text-secondaryText">
          <span>Kontakt:</span>
        </div>
        <div
          v-if="phone"
          class="text-base text-secondaryText"
        >
          <span class="whitespace-pre-wrap">{{ phone }}</span>
        </div>
        <div
          v-if="email"
          class="text-base text-primaryText"
        >
          <span class="whitespace-pre-wrap break-all">{{ email }}</span>
        </div>
        <div
          v-if="!email && !phone"
          class="text-base text-primaryText"
        >
          <span class="whitespace-pre-wrap">Nicht angegeben</span>
        </div>
      </div>
      <!-- guardian professional status -->
      <div class="order-3 lg:px-0 py-2 lg:py-4 col-span-4 lg:col-span-2 whitespace-nowrap">
        <div class="flex items-center">
          <div>
            <div class="lg:hidden text-base text-secondaryText">
              <span>Fachkraftstatus:</span>
            </div>
            <div class="text-base text-primaryText flex flex-wrap break-words">
              <div
                v-if="guardianIsProfessional"
                class="mr-1 whitespace-pre-wrap break-words bg-impuls-blue text-white text-sm p-1 rounded-full"
              >
                Fachkraft
              </div>
              <div
                v-else
                class="mr-1 whitespace-pre-wrap break-words bg-impuls-blue/50 text-white text-sm p-1 rounded-full"
              >
                Nicht-Fachkraft
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- timesheet status -->
      <div class="order-4 lg:px-0 py-2 lg:py-4 col-span-2 whitespace-nowrap">
        <div class="lg:hidden text-base text-gray-500 mb-2 lg:mb-0">
          <span>Abgabestatus:</span>
        </div>
        <div class="flex gap-2 text-base text-gray-200 items-center">
          <span :class="[
            'inline-flex leading-5 font-medium rounded-full',
            timeSheetStatus === 2 ? 'text-green-500' : timeSheetStatus === 1 ? 'text-orange-400' : timeSheetStatus === 0 ? 'text-red-500' : 'text-gray-500'
          ]">Abgegeben für:</span>
          <span class="text-primaryText">
            {{ timeSheetDate }}
          </span>
        </div>
      </div>
      <!-- Edit -->
      <div
        class="hidden lg:flex order-5 lg:order-4 lg:px-0 py-2 lg:py-4 col-span-8 whitespace-nowrap justify-self-center lg:col-span-1 lg:justify-self-end"
      >
        <button
          @click="showDetailsTapped"
          class="cursor-pointer text-base text-secondaryText hover:text-gray-600"
        >
          <Cog6ToothIcon class="h-8 w-8" />
        </button>
      </div>
      <!-- list of linked children -->
      <div
        v-if="guardian.careAssignments.items.length > 0"
        class="order-4 lg:order-5 w-full flex flex-wrap gap-2 col-span-3 lg:col-span-9"
      >
        <span class="text-base text-secondaryText">Klienten:</span>
        <!-- loading spinner container -->
        <div
          v-if="isLoading"
          class="p-1"
        >
          <LoadingSpinner size="h-4 w-4 p" />
        </div>
        <GuardianAdminListItemChild
          v-else
          v-for="careAssignment in guardian.careAssignments.items"
          :key="careAssignment"
          :careAssignment="careAssignment"
        />
      </div>
    </div>
    <!-- Edit -->
    <div class="lg:hidden flex py-2 whitespace-nowrap items-start">
      <button
        @click="showDetailsTapped"
        class="cursor-pointer text-base text-secondaryText hover:text-gray-600"
      >
        <Cog6ToothIcon class="h-8 w-8" />
      </button>
    </div>
  </div>
</template>

<script>
// Vue imports
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// component imports
import GuardianAdminListItemChild from '@/components/Main/Admin/Guardian/GuardianAdminListItemChild.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
// icon imports
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'GuardianAdminListItem',
  components: {
    GuardianAdminListItemChild,
    LoadingSpinner,
    Cog6ToothIcon
  },
  props: {
    guardian: {
      type: Object,
      required: true
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
      // function for redirecting user to guardian detail page of selected guardian
      router.push({
        name: 'UserDetails',
        params: { id: props.guardian.id }
      })
    }

    // computed property for Username
    // Use "Nicht angegeben" if no value is found both in props
    const guardianName = computed(() => {
      return props.guardian.name
        ? `${props.guardian.name}`
        : 'Nicht angegeben'
    })

    const guardianFamilyName = computed(() => {
      return props.guardian.familyName
        ? `${props.guardian.familyName}`
        : 'Nicht angegeben'
    })

    // compute the professional status of guardian
    const guardianIsProfessional = computed(() => {
      return props.guardian.professional
    })

    // computed property for phone
    const phone = computed(() => {
      return props.guardian.phone !== '' && props.guardian.phone
        ? props.guardian.phone
        : null
    })

    // computed property for email
    const email = computed(() => {
      return props.guardian.email !== '' && props.guardian.email
        ? props.guardian.email
        : null
    })

    // computed property for email
    const timeSheetStatus = computed(() => {
      // check if value is provided
      if (!props.guardian.timeSheetDate) {
        return false
      }

      // get current check date
      const highCheck = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()

      // get previous month check date
      const lowCheck = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime()

      // get guardian timeSheetDate unix timestamp
      const guardianDate = new Date(props.guardian.timeSheetDate).getTime()

      if (guardianDate > highCheck) {
        return 2
      } else if (guardianDate > lowCheck) {
        return 1
      }

      return 0
    })

    // get latest timesheet date of guardian as readable string
    const timeSheetDate = computed(() => {
      try {
        if (props.guardian.timeSheetDate) {
          return new Date(props.guardian.timeSheetDate).toLocaleString('de-DE', {
            month: 'long'
          })
        }

        return 'N/A'
      } catch (error) {
        console.log(error)
        // fallback
        return 'N/A'
      }
    })

    return {
      guardianName,
      guardianFamilyName,
      guardianIsProfessional,
      phone,
      email,
      timeSheetStatus,
      timeSheetDate,
      isLoading,
      showDetailsTapped
    }
  }
}
</script>
