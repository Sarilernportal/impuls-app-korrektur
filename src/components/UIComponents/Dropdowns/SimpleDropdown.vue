<template>
  <div class="sm:items-start sm:gap-4">
    <label
      v-if="displayTitle"
      for="Property"
      class="block text-sm font-medium text-gray-500 sm:mt-px"
      >{{ title }}</label
    >
    <div class="mt-1 sm:mt-0">
      <select
        v-model="selected"
        size="1"
        @change="propertySelected"
        id="property"
        name="property"
        class="block h-11 w-full max-w-lg rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition focus:border-impuls-blue focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <option
          class="py-1"
          name="propertyOption"
          v-for="property in properties"
          :value="property"
          :key="property"
          :id="property"
        >
          {{ property }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, onMounted, watch } from 'vue'

export default {
  props: {
    properties: {
      type: Array,
      required: true,
      default: []
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    displayTitle: {
      type: Boolean,
      required: false,
      default: true
    },
    defaultSelected: {
      type: String,
      required: false,
      default: null
    }
  },
  emits: ['selection'],
  setup(props, { emit }) {
    // initialize ref
    const selected = ref([])

    // emit selected property
    function propertySelected(val) {
      emit('selection', val.target.value)
    }

    // watch for updates of user input
    watch(
      () => [props.defaultSelected],
      () => {
        selected.value = props.defaultSelected
      },
      { deep: true }
    )

    // get default selected value
    onMounted(() => {
      selected.value =
        props.defaultSelected === null ? [] : props.defaultSelected
    })

    return {
      selected,
      propertySelected
    }
  }
}
</script>
