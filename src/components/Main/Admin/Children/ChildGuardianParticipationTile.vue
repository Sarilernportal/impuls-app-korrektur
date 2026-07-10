<template>
  <div>
    <div class="flex h-full">
      <!-- participation name/email -->
      <button
        @click="goToUser"
        :class="[
          'text-slate-300 text-xs md:text-base px-3 bg-gray-700 rounded-l-full overflow-clip hover:bg-gray-500 print:border print:border-gray-400',
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// icon imports
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  props: {
    participation: {
      type: Object,
      required: true
    },
    allowDelete: {
      type: Boolean,
      default: true
    }
  },
  components: {
    XMarkIcon
  },
  emit: ['delete-tapped'],
  setup(props, { emit }) {
    // initialize router
    const router = useRouter()

    const userName = computed(() => {
      try {
        // define return var
        var guardianName = "Nicht angegeben"
        // define values
        const name = props.participation.guardian.name
        const familyName = props.participation.guardian.familyName
        const email = props.participation.guardian.email

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
        return 'Nicht angegeben'
      }
    })

    // go to selected user
    function goToUser() {
      router.push({
        name: 'UserDetails',
        params: { id: props.participation.guardian.id }
      })
    }

    // emit delete click event
    function deleteTapped() {
      emit('delete-tapped', props.participation)
    }

    return {
      userName,
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