<template>
  <TransitionRoot :show="open" as="template" @after-leave="query = ''" appear>
    <HDialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/40 transition-opacity" />
      </TransitionChild>
      <div
        class="fixed ml-0 md:ml-52 inset-0 z-10 overflow-y-auto p-6 sm:p-6 md:p-20 grid place-items-center"
      >
        <TransitionChild
          class="w-full"
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-3xl h-full sm:h-1/2 transform divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xl transition-all"
          >
            <Combobox v-slot="{ activeOption }">
              <div class="flex flex-col h-full grow">
                <div class="flex mt-2 items-center px-2 pb-1">
                  <MagnifyingGlassIcon
                    class="pointer-events-none h-5 w-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <ComboboxInput
                    class="h-12 w-full border-0 bg-transparent pr-4 text-slate-800 placeholder-slate-400 sm:text-sm"
                    placeholder="Suche nach Namen"
                    @change="query = $event.target.value"
                  />
                  <!-- close icon -->
                  <div class="flex items-center mr-2">
                    <button
                      class="h-7 w-7 text-slate-400 hover:text-slate-500 cursor-pointer"
                      @click="closeModal"
                    >
                      <XMarkIcon />
                    </button>
                  </div>
                </div>
                <ComboboxOptions
                  v-if="query === '' || filteredCalendars.length > 0"
                  class="flex flex-col overflow-y-auto sm:flex-row divide-x divide-slate-100"
                  as="div"
                  static
                  hold
                >
                  <!-- left side -->
                  <div
                    :class="[
                      ' min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4'
                    ]"
                  >
                    <div hold class="-mx-2 text-sm text-slate-600">
                      <ComboboxOption
                        v-for="calendar in filteredCalendars"
                        :key="calendar.id"
                        :value="calendar"
                        as="template"
                        v-slot="{ active }"
                      >
                        <div
                          :class="[
                            'group flex cursor-default select-none items-center rounded-md p-2',
                            active && 'bg-slate-100 text-slate-900'
                          ]"
                        >
                          <span
                            class="h-3 w-3 rounded-full"
                            :style="{ backgroundColor: calendar.color }"
                          ></span>
                          <span
                            v-if="!calendar.title"
                            class="ml-3 flex-auto truncate"
                            >Nicht Angegeben</span
                          >
                          <span v-else class="ml-3 flex-auto truncate">{{
                            calendar.title
                          }}</span>
                          <ChevronRightIcon
                            v-if="active"
                            class="ml-3 h-5 w-5 flex-none text-slate-400"
                            aria-hidden="true"
                          />
                        </div>
                      </ComboboxOption>
                    </div>
                    <div
                      v-if="showLoadMore"
                      class="w-full flex justify-center mt-5"
                    >
                      <div
                        class="p-2 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer"
                        @click="loadMore"
                      >
                        <ChevronDoubleDownIcon class="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <!-- right side -> user viewer -->
                  <div
                    v-if="activeOption"
                    class="w-full sm:w-1/2 flex-none flex-col divide-y divide-slate-100 overflow-y-auto sflex"
                  >
                    <!-- name -->
                    <div class="flex-none p-6 text-center">
                      <h2
                        v-if="!activeOption.title"
                        class="mt-3 font-display font-bold text-slate-900"
                      >
                        Nicht Angegeben
                      </h2>
                      <h2
                        v-else
                        class="mt-3 font-display font-bold text-slate-900"
                      >
                        {{ activeOption.title }}
                      </h2>
                    </div>
                    <!-- user info -->
                    <div class="flex flex-auto flex-col justify-between p-6">
                      <dl
                        class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-slate-600"
                      >
                        <!-- phone -->
                        <dt class="col-end-1 font-semibold text-slate-900">
                          Beschreibung
                        </dt>
                        <dd class="whitespace-pre-wrap">
                          {{
                            activeOption.description
                              ? activeOption.description
                              : 'Nicht angegeben'
                          }}
                        </dd>
                      </dl>
                      <div
                        class="flex flex-auto flex-col justify-between items-center p-6"
                      >
                        <button
                          @click="onSelect(activeOption)"
                          class="rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                        >
                          Auswählen
                        </button>
                      </div>
                    </div>
                  </div>
                </ComboboxOptions>
                <div
                  v-if="query !== '' && filteredCalendars.length === 0"
                  class="py-14 px-6 text-center text-sm sm:px-14"
                >
                  <UsersIcon
                    class="mx-auto h-6 w-6 text-slate-400"
                    aria-hidden="true"
                  />
                  <p class="mt-4 font-display font-bold text-slate-900">
                    Keine Kalender gefunden
                  </p>
                  <p class="mt-2 text-slate-500">
                    Wir konnten leider keine Kalender mit diesem Titel finden.
                  </p>
                </div>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script>
// vue imports
import { computed, ref, watch } from 'vue'

// heroicon imports
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import {
  ChevronRightIcon,
  UsersIcon,
  ChevronDoubleDownIcon
} from '@heroicons/vue/24/outline'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

export default {
  components: {
    MagnifyingGlassIcon,
    XMarkIcon,
    ChevronRightIcon,
    ChevronDoubleDownIcon,
    UsersIcon,
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    HDialog: Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot
  },
  props: {
    calendar: {
      type: Array,
      required: true,
      default: () => []
    },
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    showLoadMore: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['calendar-selected', 'close-modal', 'load-more', 'query-set'],
  setup(props, { emit }) {
    // initialize ref
    const query = ref('')

    // compute filtered calendar
    const filteredCalendars = computed(() =>
      query.value === ''
        ? props.calendar
        : props.calendar.filter((calendar) => {
            // filter by name and family name
            return calendar.title
              .toLowerCase()
              .includes(query.value.toLowerCase())
          })
    )

    // emit selection from list
    function onSelect(activeOption) {
      emit('calendar-selected', activeOption)
    }

    // emit closing event
    function closeModal() {
      emit('close-modal')
    }

    // emit load-more, to indicate that the user wants to load more users from API
    function loadMore() {
      emit('load-more')
    }

    function emitQuery() {
      emit('query-set', query.value)
    }

    // Watch the input value
    watch(
      () => query.value,
      () => {
        emitQuery()
      },
      { deep: true }
    )

    return {
      query,
      filteredCalendars,
      onSelect,
      closeModal,
      loadMore
    }
  }
}
</script>
