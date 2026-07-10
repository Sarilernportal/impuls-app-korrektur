<template>
  <!-- button with child name -->
  <button
    @click="goToChild"
    class="flex gap-1 text-primaryText hover:text-slate-400 break-words border-2 border-indigo-400 hover:border-indigo-600 px-2 leading-5 rounded-full text-xs"
  >
    <span v-if="childName">{{ childName }}</span>
    <span v-if="childFamilyName">{{ childFamilyName }}</span>
  </button>
</template>

<script>
// vue imports
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: {
    child: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // initialize router
    const router = useRouter()

    // get name of child
    const childName = computed(() => {
      try {
        return props.child.name
      } catch (error) {
        return null
      }
    })

    // get familyname of child
    const childFamilyName = computed(() => {
      try {
        return props.child.familyName
      } catch (error) {
        return null
      }
    })

    // redirect user to child detail page
    function goToChild() {
      try {
        router.push({
          name: 'ChildDetails',
          params: { id: props.child.id }
        })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      childName,
      childFamilyName,
      goToChild
    }
  }
}
</script>