<template>
  <!-- button with carrier contact name -->
  <button
    @click="goToCarrierContact"
    class="flex gap-1 text-primaryText hover:text-gray-400 break-words border-2 border-indigo-400 hover:border-indigo-600 px-2 leading-5 rounded-full text-xs"
  >
    <span v-if="carrierContactName">{{ carrierContactName }}</span>
    <span v-if="carrierContactFamilyName">{{ carrierContactFamilyName }}</span>
    <span v-if="!carrierContactName && !carrierContactFamilyName">Nicht angegeben</span>
  </button>
</template>

<script>
// vue imports
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: {
    carrierContact: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // initialize router
    const router = useRouter()

    // get name of carrierContact
    const carrierContactName = computed(() => {
      try {
        return props.carrierContact.name
      } catch (error) {
        return null
      }
    })

    // get familyname of carrierContact
    const carrierContactFamilyName = computed(() => {
      try {
        return props.carrierContact.familyName
      } catch (error) {
        return null
      }
    })

    // redirect user to child detail page
    function goToCarrierContact() {
      try {
        router.push({
          name: 'CarrierContactDetails',
          params: { id: props.carrierContact.id }
        })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      carrierContactName,
      carrierContactFamilyName,
      goToCarrierContact
    }
  }
}
</script>