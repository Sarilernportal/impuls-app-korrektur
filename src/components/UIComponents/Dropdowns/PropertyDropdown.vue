<template>
  <span class="z-0">
    <Listbox as="div" v-model="selected">
      <ListboxLabel class="sr-only"> Change group </ListboxLabel>
      <div class="relative">
        <div
          class="inline-flex shadow-sm rounded-md divide-x divide-indigo-600"
        >
          <div
            class="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-indigo-600"
          >
            <div
              class="relative inline-flex items-center bg-indigo-500 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white"
            >
              <loading-spinner v-if="isLoading" size="h-4 w-4" />
              <CheckIcon v-else-if="selected != null" class="h-5 w-5" aria-hidden="true" />
              <p class="ml-2.5 text-sm font-medium">{{ selected?.title || 'Nicht ausgewählt' }}</p>
            </div>
            <ListboxButton
              v-if="!userIsCurrentUser"
              class="relative inline-flex items-center bg-indigo-500 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-indigo-500"
            >
              <span class="sr-only">Change group</span>
              <ChevronDownIcon class="h-5 w-5 text-white" aria-hidden="true" />
            </ListboxButton>
            <div
              v-else
              class="relative inline-flex items-center bg-indigo-500 p-2 rounded-l-none rounded-r-md"
            />
          </div>
        </div>

        <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="origin-top-right absolute right-0 mt-2 -mr-1 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-slate-200 ring-1 ring-black ring-opacity-5 focus:outline-none sm:left-auto sm:right-0"
          >
            <ListboxOption
              as="template"
              v-for="possibility in possibilities"
              :key="possibility.name"
              :value="possibility"
              v-slot="{ active, selected }"
              @click="changeProperty(possibility.name)"
            >
              <li
                :class="[
                  active ? 'text-white bg-indigo-500' : 'text-slate-900',
                  'cursor-default select-none relative p-4 text-sm'
                ]"
              >
                <div class="flex flex-col">
                  <div class="flex justify-between">
                    <p :class="selected ? 'font-semibold' : 'font-normal'">
                      {{ possibility.title }}
                    </p>
                    <span
                      v-if="selected"
                      :class="active ? 'text-white' : 'text-indigo-500'"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <p
                    :class="[
                      active ? 'text-indigo-200' : 'text-slate-500',
                      'mt-2'
                    ]"
                  >
                    {{ possibility.description }}
                  </p>
                </div>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </span>
</template>

<script>
import { ref } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
export default {
  name: 'PropertyDropdown',
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    ChevronDownIcon,
    LoadingSpinner
  },
  emits: ['change-property'],
  props: {
    possibilities: {
      type: Array,
      required: false,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  setup(props, ctx) {
    const selected = ref(
      props.possibilities.find((possibility) => {
        return possibility.current === true
      })
    )

    const userIsCurrentUser = false

    function changeProperty(to) {
      ctx.emit('change-property', to)
    }

    return {
      selected,
      userIsCurrentUser,
      changeProperty
    }
  }
}
</script>
