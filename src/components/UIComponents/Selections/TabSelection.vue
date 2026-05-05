<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
17.11.2022

Scope:
Tab Selection
-->

<template>
  <div>
    <div class="">
      <nav
        class="isolate flex divide-x divide-gray-200 rounded-lg shadow-md drop-shadow"
        aria-label="Tabs"
      >
        <button
          v-for="(tab, tabIdx) in tabs"
          @click="emitSelection(tab, tabIdx)"
          :key="tab.name"
          :class="[
            tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            tabIdx === 0 ? 'rounded-l-lg' : '',
            tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
            useSmallText ? 'text-xs' : 'text-sm',
            'flex group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 font-medium text-center hover:bg-gray-50 focus:z-10 cursor-pointer justify-center gap-2'
          ]"
          :aria-current="tab.current ? 'page' : undefined"
        >
          <div
            v-if="tab.indicator || tab.indicator > -1"
            :class="['flex justify-center items-center  rounded-full h-5 w-5 aspect-square text-white', tab.indicator === 0 ? 'bg-green-600' : 'bg-red-600']"
          >{{ tab.indicator }}</div>
          <span class="break-all">{{ tab.name }}</span>
          <span
            aria-hidden="true"
            :class="[
              tab.current ? 'bg-indigo-500' : 'bg-transparent',
              'absolute inset-x-0 bottom-0 h-0.5'
            ]"
          />
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
      default: []
    },
    useSmallText: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['selected'],
  setup(_, { emit }) {
    // emit selected value
    function emitSelection(selection, tabIdx) {
      emit('selected', { selection: selection, tabindex: tabIdx })
    }

    return {
      emitSelection
    }
  }
}
</script>