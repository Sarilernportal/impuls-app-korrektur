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
        class="fixed ml-0 md:ml-52 inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 grid place-items-center"
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
            class="mx-auto flex max-h-[80vh] w-full max-w-3xl transform flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 transition-all"
          >
            <Combobox v-slot="{ activeOption }">
              <div class="flex h-full grow flex-col">
                <!-- Search header -->
                <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                  <MagnifyingGlassIcon
                    class="pointer-events-none h-5 w-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <ComboboxInput
                    class="h-10 w-full border-0 bg-transparent text-slate-800 placeholder-slate-400 focus:ring-0 sm:text-sm"
                    placeholder="Nach Namen suchen …"
                    @change="query = $event.target.value"
                  />
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    @click="closeModal"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
                <ComboboxOptions
                  v-if="query === '' || filteredPeople.length > 0"
                  class="flex flex-col divide-slate-100 overflow-y-auto sm:flex-row sm:divide-x"
                  as="div"
                  static
                  hold
                >
                  <!-- left side: list -->
                  <div class="min-w-0 flex-auto scroll-py-4 overflow-y-auto p-3">
                    <div hold class="space-y-1">
                      <ComboboxOption
                        v-for="person in filteredPeople"
                        :key="person.id"
                        :value="person"
                        as="template"
                        v-slot="{ active }"
                      >
                        <div
                          @click="onSelect(person)"
                          :class="[
                            'group flex cursor-pointer select-none items-center gap-3 rounded-xl p-2',
                            active ? 'bg-brand-50' : 'hover:bg-slate-50'
                          ]"
                        >
                          <InitialsAvatar :name="displayName(person)" size-class="h-9 w-9 text-xs" />
                          <span class="min-w-0 flex-1">
                            <span class="block truncate text-sm font-semibold text-slate-900">{{ displayName(person) }}</span>
                            <span
                              v-if="person.email || person.carrier"
                              class="block truncate text-xs text-slate-500"
                            >{{ person.email || person.carrier?.name }}</span>
                          </span>
                          <ChevronRightIcon
                            :class="['h-5 w-5 flex-none', active ? 'text-impuls-blue' : 'text-slate-300 group-hover:text-slate-400']"
                            aria-hidden="true"
                          />
                        </div>
                      </ComboboxOption>
                    </div>
                    <div
                      v-if="showLoadMore"
                      class="mt-4 flex justify-center"
                    >
                      <button
                        class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        @click="loadMore"
                      >
                        <ChevronDoubleDownIcon class="h-4 w-4" />
                        Mehr laden
                      </button>
                    </div>
                  </div>
                  <!-- right side: detail preview -->
                  <div
                    v-if="activeOption"
                    class="hidden w-full flex-none flex-col overflow-y-auto bg-slate-50/60 sm:flex sm:w-1/2"
                  >
                    <div class="flex flex-col items-center p-6 text-center">
                      <InitialsAvatar :name="displayName(activeOption)" size-class="h-16 w-16 text-lg" />
                      <h2 class="mt-3 font-display font-bold text-slate-900">{{ displayName(activeOption) }}</h2>
                    </div>
                    <div class="flex flex-auto flex-col justify-between px-6 pb-6">
                      <dl class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-slate-700">
                        <dt class="col-end-1 font-semibold text-slate-900">Telefon</dt>
                        <dd>{{ activeOption.phone ? activeOption.phone : 'Nicht angegeben' }}</dd>
                        <dt class="col-end-1 font-semibold text-slate-900">E-Mail</dt>
                        <dd class="truncate">
                          <a
                            v-if="activeOption.email"
                            :href="`mailto:${activeOption.email}`"
                            class="text-impuls-blue underline"
                          >{{ activeOption.email }}</a>
                          <span v-else>Nicht angegeben</span>
                        </dd>
                        <template v-if="activeOption.carrier">
                          <dt class="col-end-1 font-semibold text-slate-900">Kostenträger</dt>
                          <dd>{{ activeOption.carrier.name ? activeOption.carrier.name : 'Nicht angegeben' }}</dd>
                        </template>
                        <template v-if="activeOption.mother">
                          <dt class="col-end-1 font-semibold text-slate-900">Mutter</dt>
                          <dd>{{ displayName(activeOption.mother) }}</dd>
                        </template>
                        <template v-if="activeOption.father">
                          <dt class="col-end-1 font-semibold text-slate-900">Vater</dt>
                          <dd>{{ displayName(activeOption.father) }}</dd>
                        </template>
                      </dl>
                      <div class="mt-6 flex justify-center">
                        <button
                          @click="onSelect(activeOption)"
                          class="w-full rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                        >
                          Auswählen
                        </button>
                      </div>
                    </div>
                  </div>
                </ComboboxOptions>
                <div
                  v-if="query !== '' && filteredPeople.length === 0"
                  class="px-6 py-14 text-center text-sm sm:px-14"
                >
                  <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <UsersIcon class="h-6 w-6 text-slate-400" aria-hidden="true" />
                  </span>
                  <p class="mt-4 font-semibold text-slate-900">Keine Personen gefunden</p>
                  <p class="mt-1 text-slate-500">Wir konnten niemanden mit diesem Namen finden.</p>
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

// component imports
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'
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
    InitialsAvatar,
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
    people: {
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
  emits: ['person-selected', 'close-modal', 'load-more', 'query-set'],
  setup(props, { emit }) {
    // initialize ref
    const query = ref('')

    // build a readable display name from a person-like object
    function displayName(person) {
      const name = [person?.name, person?.familyName].filter(Boolean).join(' ').trim()
      return name || 'Nicht angegeben'
    }

    // compute filtered people
    const filteredPeople = computed(() =>
      query.value === ''
        ? props.people
        : props.people.filter((person) => {
            // if no family name is given, only filter by first name
            if (person.familyName === undefined) {
              // filter by name
              return person.name
                .toLowerCase()
                .includes(query.value.toLowerCase())
            } else {
              // filter by name and family name
              return (
                person.name.toLowerCase().includes(query.value.toLowerCase()) ||
                person.familyName
                  .toLowerCase()
                  .includes(query.value.toLowerCase())
              )
            }
          })
    )

    // emit selection from list
    function onSelect(activeOption) {
      emit('person-selected', activeOption)
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
      filteredPeople,
      displayName,
      onSelect,
      closeModal,
      loadMore
    }
  }
}
</script>
