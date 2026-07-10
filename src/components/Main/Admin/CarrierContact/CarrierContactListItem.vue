<template>
  <div class="flex">
    <div class="w-full pb-6">
      <!-- carrier infor -->
      <div
        class="w-full px-6 grid grid-cols-2 grid-rows-3 lg:grid-cols-8 lg:grid-rows-1 gap-x-4 items-center"
      >
        <!-- carrier contact name -->
        <div class="lg:px-0 py-2 lg:py-4 col-span-2 whitespace-nowrap">
          <div class="flex items-center">
            <div>
              <div class="lg:hidden text-base text-secondaryText">
                <span>Name:</span>
              </div>
              <div
                class="text-base flex flex-wrap break-words text-impuls-blue font-bold"
              >
                <span
                  v-if="carrierContactName"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ carrierContactName }}</span
                >
                <span
                  v-if="carrierContactFamilyname"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >{{ carrierContactFamilyname }}</span
                >
                <span
                  v-if="!carrierContactName && !carrierContactFamilyname"
                  class="mr-1 whitespace-pre-wrap break-words"
                  >Nicht angegeben</span
                >
              </div>
            </div>
          </div>
        </div>
        <!-- contact -->
        <div class="lg:px-0 py-2 lg:py-4 col-span-3 whitespace-nowrap">
          <div class="lg:hidden text-base text-secondaryText">
            <span>Kontakt:</span>
          </div>
          <div v-if="phone" class="text-base text-secondaryText">
            <span class="whitespace-pre-wrap">{{ phone }}</span>
          </div>
          <div v-if="email" class="text-base text-primaryText">
            <span class="whitespace-pre-wrap">{{ email }}</span>
          </div>
          <div v-if="!email && !phone" class="text-base text-secondaryText">
            <span class="whitespace-pre-wrap">Nicht angegeben</span>
          </div>
        </div>
        <!-- carrier name -->
        <div class="lg:px-0 py-2 lg:py-4 col-span-2 whitespace-nowrap">
          <div class="flex items-center">
            <div>
              <div class="lg:hidden text-base text-slate-500">
                <span>Kostenträger:</span>
              </div>
              <button
                @click="showCarrierDetailsTapped(carrierId)"
                class="flex-wrap text-secondaryText hover:text-slate-400 break-words border-2 border-indigo-400 hover:border-indigo-600 px-4 py-1 inline-flex leading-5 rounded-full text-xl lg:text-base"
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
        <!-- Edit -->
        <div
          class="hidden lg:flex lg:px-0 py-2 lg:py-4 whitespace-nowrap col-span-3 justify-self-center lg:col-span-1 lg:justify-self-end self-start"
        >
          <button
            @click="showDetailsTapped"
            class="cursor-pointer text-base text-secondaryText hover:text-slate-600"
          >
            <Cog6ToothIcon class="h-8 w-8" />
          </button>
        </div>
        <!-- list of linked children -->
        <div
          v-if="carrierContact.children.items.length > 0"
          class="w-full flex flex-wrap gap-2 col-span-2 lg:col-span-8"
        >
          <span class="text-base text-secondaryText">Klienten:</span>
          <CarrierContactListItemChild
            v-for="child in carrierContact.children.items"
            :key="child.id"
            :child="child"
          />
        </div>
      </div>
    </div>
    <!-- Edit -->
    <div class="lg:hidden flex py-2 whitespace-nowrap items-start">
      <button
        @click="showDetailsTapped"
        class="cursor-pointer text-base text-secondaryText hover:text-slate-600"
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
import CarrierContactListItemChild from '@/components/Main/Admin/CarrierContact/CarrierContactListItemChild.vue'
// icon imports
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'CarrierContactListItem',
  components: {
    CarrierContactListItemChild,
    Cog6ToothIcon
  },
  props: {
    carrierContact: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // initialize router
    const router = useRouter()

    function showDetailsTapped() {
      // function for redirecting user to carrier contact detail page of selected carrier
      router.push({
        name: 'CarrierContactDetails',
        params: { id: props.carrierContact.id }
      })
    }

    function showCarrierDetailsTapped(id) {
      // function for redirecting user to carrier detail page of selected carrier
      if (id) {
        router.push({
          name: 'CarrierDetails',
          params: { id: id }
        })
      }
    }

    // computed property for carrier contact name
    const carrierContactName = computed(() => {
      try {
        return props.carrierContact.name !== ''
          ? props.carrierContact.name
          : 'Nicht angegeben'
      } catch (error) {
        return null
      }
    })

    // compute carrier contact family name
    const carrierContactFamilyname = computed(() => {
      try {
        return props.carrierContact.familyName !== ''
          ? props.carrierContact.familyName
          : 'Nicht angegeben'
      } catch (error) {
        return null
      }
    })

    // compute carrier name
    const carrierName = computed(() => {
      try {
        return props.carrierContact.carrier.name !== ''
          ? props.carrierContact.carrier.name.length > 29
            ? props.carrierContact.carrier.name.slice(0, 30) + '...'
            : props.carrierContact.carrier.name
          : 'Nicht angegeben'
      } catch (error) {
        return null
      }
    })
    // compute carrier name
    const carrierFullName = computed(() => {
      try {
        return props.carrierContact.carrier.name !== ''
          ? props.carrierContact.carrier.name
          : 'Nicht angegeben'
      } catch (error) {
        return null
      }
    })

    // compute carrier id
    const carrierId = computed(() => {
      try {
        return props.carrierContact.carrier.id !== ''
          ? props.carrierContact.carrier.id
          : null
      } catch (error) {
        return null
      }
    })

    // computed property for phone
    const phone = computed(() => {
      try {
        return props.carrierContact.phone !== '' && props.carrierContact.phone
          ? props.carrierContact.phone
          : null
      } catch (error) {
        return null
      }
    })

    // computed property for email
    const email = computed(() => {
      try {
        return props.carrierContact.email !== '' && props.carrierContact.email
          ? props.carrierContact.email
          : null
      } catch (error) {
        return null
      }
    })

    return {
      carrierContactName,
      carrierContactFamilyname,
      carrierName,
      carrierFullName,
      carrierId,
      phone,
      email,
      showDetailsTapped,
      showCarrierDetailsTapped
    }
  }
}
</script>
