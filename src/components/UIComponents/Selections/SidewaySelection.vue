<template>
  <div class="sm:items-start sm:gap-4">
    <label class="block text-sm font-medium text-slate-500 sm:mt-px">{{
      title
    }}</label>
    <div class="mt-1 sm:mt-0">
      <div class="flex h-10 items-center rounded-md border border-slate-300">
        <!-- previous arrow -->
        <button>
          <ChevronLeftIcon
            @click="prevPressed"
            class="w-6 h-6 text-slate-400 hover:text-slate-500"
          />
        </button>
        <!-- selected value -->
        <div class="w-full">
          <p class="text-center">{{ properties[selected] }}</p>
        </div>
        <!-- next arrow -->
        <button>
          <ChevronRightIcon
            @click="nextPressed"
            class="w-6 h-6 text-slate-400 hover:text-slate-500"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { onMounted, ref } from 'vue'

// heroicon imports
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    ChevronLeftIcon,
    ChevronRightIcon
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Nicht angegeben'
    },
    properties: {
      type: Array,
      required: true,
      default: () => ['val1', 'val2']
    }
  },
  emits: ['selection'],
  setup(props, { emit }) {
    // initialize refs
    const selected = ref(1)

    // select current year as default
    function selectCurrentYear() {
      selected.value = props.properties.length - 2
      emit('selection', props.properties[selected.value])
    }

    // user press previous arrow
    function prevPressed() {
      if (selected.value - 1 >= 0) {
        selected.value = selected.value - 1
        emitSelected()
      }
    }

    // user press next arrow
    function nextPressed() {
      if (selected.value + 1 <= props.properties.length - 1) {
        selected.value = selected.value + 1
        emitSelected()
      }
    }

    function emitSelected() {
      emit('selection', props.properties[selected.value])
    }

    onMounted(() => {
      selectCurrentYear()
    })

    return {
      selected,
      prevPressed,
      nextPressed
    }
  }
}
</script>