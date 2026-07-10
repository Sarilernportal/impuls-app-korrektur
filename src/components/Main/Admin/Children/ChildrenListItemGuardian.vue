<template>
  <!-- button with child name -->
  <button
    @click="goToGuardian"
    class="flex gap-1 text-primaryText hover:text-slate-400 break-words border-2 border-indigo-400 hover:border-indigo-600 px-2 leading-5 rounded-full text-xs"
  >
    <span v-if="userName">{{ userName }}</span>
  </button>
</template>

<script>
// vue imports
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: {
    careAssignment: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // initialize router
    const router = useRouter()

    const userName = computed(() => {
      try {
        // define return var
        var guardianName = "Nicht angegeben"
        // define values
        const name = props.careAssignment.guardian.name
        const familyName = props.careAssignment.guardian.familyName
        const email = props.careAssignment.guardian.email

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

    // redirect user to guardian detail page
    function goToGuardian() {
      try {
        router.push({
          name: 'UserDetails',
          params: { id: props.careAssignment.guardianCareAssignmentsId }
        })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      userName,
      goToGuardian
    }
  }
}
</script>