<template>
  <div class="flex">
    <div class="w-full pb-6">
      <!-- carrier infor -->
      <div class="w-full px-6 grid grid-cols-2 grid-rows-3 lg:grid-cols-5 lg:grid-rows-1 gap-x-4 items-center">
        <!-- carrier name -->
        <div class="lg:px-0 py-2 lg:py-4 col-span-2 whitespace-nowrap">
          <div class="flex items-center">
            <div>
              <div class="lg:hidden text-base text-secondaryText">
                <span>Name:</span>
              </div>
              <div class="text-base text-primaryText flex flex-wrap break-words">
                <span class="mr-1 whitespace-pre-wrap break-words text-impuls-blue font-bold">{{ carrierName }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- address -->
        <div class="lg:px-0 py-2 lg:py-4 col-span-2 whitespace-nowrap">
          <div class="lg:hidden text-base text-gray-500">
            <span>Anschrift:</span>
          </div>
          <div
            v-if="street"
            class="text-base text-primaryText"
          >
            <span class="whitespace-pre-wrap">{{ street }}</span>
          </div>
          <div
            v-if="addressExtra"
            class="text-base text-primaryText"
          >
            <span class="whitespace-pre-wrap">{{ addressExtra }}</span>
          </div>
          <div
            v-if="city"
            class="text-base text-primaryText"
          >
            <span class="whitespace-pre-wrap">{{ city }}</span>
          </div>
          <div
            v-if="!city && !addressExtra && !street"
            class="text-base text-primaryText"
          >
            <span class="whitespace-pre-wrap">Nicht angegeben</span>
          </div>
        </div>
        <!-- Edit -->
        <div
          class="hidden lg:flex order-2 lg:order-1 lg:px-0 py-2 lg:py-4 whitespace-nowrap col-span-3 lg:col-span-1 lg:justify-self-end self-start"
        >
          <button
            @click="showDetailsTapped"
            class="cursor-pointer text-base text-secondaryText hover:text-gray-600"
          >
            <Cog6ToothIcon class="h-8 w-8" />
          </button>
        </div>
        <!-- list of linked contacts -->
        <div class="order-1 lg:order-2 w-full flex flex-wrap gap-2 col-span-2 lg:col-span-5">
          <span
            v-if="carrier.carrierContacts.items.length > 0"
            class="text-base text-secondaryText"
          >Kontakte:</span>
          <CarrierContactListItemChild
            v-for="carrierContact in carrier.carrierContacts.items"
            :key="carrierContact.id"
            :carrierContact="carrierContact"
          />
          <router-link
            :to="{ name: 'NewCarrierContact', query: { carrierID: carrier.id } }"
            class="flex gap-1 text-primaryText hover:text-gray-400 break-words border-2 border-indigo-400 hover:border-indigo-600 leading-5 rounded-full text-xs"
          >
            <PlusIcon class="h-5 w-5 text-secondaryText stroke-2" />
          </router-link>
        </div>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// component imports
import CarrierContactListItemChild from '@/components/Main/Admin/Carrier/CarrierListItemContact.vue'
// icon imports
import { Cog6ToothIcon, PlusIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'CarrierListItem',
  components: {
    CarrierContactListItemChild,
    Cog6ToothIcon,
    PlusIcon
  },
  props: {
    carrier: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    function showDetailsTapped() {
      // function for redirecting user to carrier detail page of selected carrier
      router.push({ name: 'CarrierDetails', params: { id: props.carrier.id } })
    }

    function goToGuardianTapped(guardian) {
      // function for redirecting user to guardian detail page
      router.push({ name: 'UserDetails', params: { id: guardian.id } })
    }

    // computed property for Username
    // Use "Nicht angegeben" if no value is found both in props
    const carrierName = computed(() => {
      return props.carrier.name !== '' ? props.carrier.name : 'Nicht angegeben'
    })

    // computed property for street first line
    const street = computed(() => {
      var street = ''
      var houseNumber = ''
      if (props.carrier.street !== '') {
        street = props.carrier.street
      }
      if (props.carrier.houseNumber !== undefined) {
        houseNumber = props.carrier.houseNumber
      }
      if (street === '') {
        return false
      }
      return `${street} ${houseNumber}`
    })

    // computed property for address extra
    const addressExtra = computed(() => {
      return props.carrier.addressExtra !== ''
        ? props.carrier.addressExtra
        : false
    })

    // computed property for bottom first line
    const city = computed(() => {
      var postalCode = ''
      var city = ''
      if (props.carrier.city !== '') {
        city = props.carrier.city
      }
      if (props.carrier.postalCode !== '') {
        postalCode = props.carrier.postalCode
      }
      if (city === '' || postalCode === '') {
        return false
      }
      return `${postalCode} ${city}`
    })

    // get full guardian name --> name + familyName
    function getGuardianName(guardian) {
      return guardian.name && guardian.familyName
        ? `${guardian.name} ${guardian.familyName}`
        : 'Nicht angegeben'
    }

    // calculate timesheet hand-in status
    function getTimeSheetStatus(guardian) {
      // check if value is provided
      if (!guardian.timeSheetDate) {
        return false
      }

      // get minimum date unix timestamp
      const dateNow = new Date()
      const checkDate = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        1
      ).getTime()

      // get guardian timeSheetDate unix timestamp
      const guardianDate = new Date(guardian.timeSheetDate).getTime()

      return guardianDate > checkDate
    }

    return {
      carrierName,
      street,
      addressExtra,
      city,
      showDetailsTapped,
      goToGuardianTapped,
      getGuardianName,
      getTimeSheetStatus
    }
  }
}
</script>
