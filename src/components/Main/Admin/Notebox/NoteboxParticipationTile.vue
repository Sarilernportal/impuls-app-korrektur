<template>
  <div>
    <div
      v-if="isLoading"
      class="flex mt-4-center"
    >
      <LoadingSpinner size="h-6 w-6" />
    </div>
    <div
      v-else
      class="flex h-full"
    >
      <!-- participation name/email -->
      <button
        @click="goToUser"
        :class="[
          'text-gray-300 text-xs md:text-base px-3 bg-gray-700 rounded-l-full overflow-clip hover:bg-gray-500 print:border print:border-gray-400',
          allowDelete ? 'rounded-r-none' : 'rounded-r-full pr-3'
        ]"
      >
        {{ userName }}
      </button>
      <!-- delete option -->
      <button
        v-if="allowDelete"
        @click="deleteTapped"
        class="h-full pr-1 bg-gray-700 hover:bg-gray-500 rounded-r-full overflow-clip text-red-500 hover:text-red-300"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// icon imports
import { XMarkIcon } from '@heroicons/vue/24/outline'

// component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  props: {
    participation: {
      type: Object,
      required: true
    },
    allowDelete: {
      type: Boolean,
      default: true
    },
    userList: {
      type: Object,
      required: true
    }
  },
  components: {
    XMarkIcon,
    LoadingSpinner
  },
  emit: ['delete-tapped'],
  setup(props, { emit }) {
    // initialize refs
    const isLoading = ref(false)

    // initialize router
    const router = useRouter()

    const userName = computed(() => {
      try {
        // set loading state
        isLoading.value = true
        // get participant from userlist
        const participant = props.userList[props.participation.Username]
        // check if Attributes values can be read
        if (!participant.Attributes) {
          return 'Nicht angegeben'
        }
        // define fallback
        var listName = 'Nicht angegeben'
        // get indexes of values
        const nameIndex = participant.Attributes.findIndex(
          (attr) => attr.Name === 'name'
        )
        const familyNameIndex = participant.Attributes.findIndex(
          (attr) => attr.Name === 'family_name'
        )
        const emailIndex = participant.Attributes.findIndex(
          (attr) => attr.Name === 'email'
        )

        // try to get name
        if (nameIndex > -1) {
          listName = participant.Attributes[nameIndex].Value
        }
        // try to get surname
        if (familyNameIndex > -1) {
          listName =
            listName +
            ' ' +
            participant.Attributes[familyNameIndex].Value
        }
        // if none was found, try email
        if (familyNameIndex < 0 && nameIndex < 0 && emailIndex > -1) {
          listName = participant.Attributes[emailIndex].Value
          return listName
        }

        // return generated name
        return listName
      } catch (error) {
        console.log(error)
        return 'Nicht angegeben'
      } finally {
        // reset loading state
        isLoading.value = false
      }
    })

    // go to selected user
    function goToUser() {
      router.push({
        name: 'UserDetails',
        params: { id: props.participation.Username }
      })
    }

    // emit delete click event
    function deleteTapped() {
      emit('delete-tapped', props.participation)
    }

    return {
      userName,
      isLoading,
      goToUser,
      deleteTapped
    }
  }
}
</script>

<style>
@media print {
  #participationColor {
    print-color-adjust: exact;
  }
}
</style>