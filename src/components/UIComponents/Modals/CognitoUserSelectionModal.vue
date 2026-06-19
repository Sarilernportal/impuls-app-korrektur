<template>
  <TransitionRoot
    :show="open"
    as="template"
    @after-leave="query = ''"
    appear
  >
    <HDialog
      as="div"
      class="relative z-10"
      @close="closeModal"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      </TransitionChild>
      <div class="fixed ml-0 md:ml-52 inset-0 z-10 overflow-y-auto p-6 sm:p-6 md:p-20 grid place-items-center">
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
            class="mx-auto flex max-h-[80vh] w-full max-w-3xl transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 transition-all"
          >
            <Combobox v-slot="{ activeOption }">
              <div class="flex flex-col h-full grow">
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
                  class="flex flex-col overflow-y-auto sm:flex-row divide-x divide-gray-100"
                  as="div"
                  static
                  hold
                >
                  <!-- left side -->
                  <div class="min-w-0 flex-auto scroll-py-4 overflow-y-auto p-3">
                    <div hold class="space-y-1">
                      <ComboboxOption
                        v-for="person in filteredPeople"
                        :key="person.Username"
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
                          <InitialsAvatar :name="getName(person)" size-class="h-9 w-9 text-xs" />
                          <span class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{{ getName(person) }}</span>
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
                  <!-- right side -> user viewer -->
                  <div
                    v-if="activeOption"
                    class="w-full sm:w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sflex"
                  >
                    <!-- name -->
                    <div class="flex-none p-6 text-center">
                      <h2 class="mt-3 font-semibold text-gray-900">
                        {{ getName(activeOption) }}
                      </h2>
                    </div>
                    <!-- user info -->
                    <div class="flex flex-auto flex-col justify-between p-6">
                      <dl class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                        <!-- phone -->
                        <dt class="col-end-1 font-semibold text-gray-900">
                          Telefon
                        </dt>
                        <dd>
                          {{ getPhone(activeOption) }}
                        </dd>
                        <!-- email -->
                        <dt class="col-end-1 font-semibold text-gray-900">
                          Email
                        </dt>
                        <dd class="truncate">
                          <a
                            v-if="getEmail(activeOption)"
                            :href="`mailto:${getEmail(activeOption)}`"
                            class="text-indigo-600 underline"
                          >
                            {{ getEmail(activeOption) }}
                          </a>
                          <p v-else>Nicht angegeben</p>
                        </dd>
                      </dl>
                      <div class="mt-6 flex justify-center">
                        <button
                          @click="onSelect(activeOption)"
                          class="w-full rounded-xl bg-impuls-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                        >
                          Auswählen
                        </button>
                      </div>
                    </div>
                  </div>
                </ComboboxOptions>
                <div
                  v-if="query !== '' && filteredPeople.length === 0"
                  class="py-14 px-6 text-center text-sm sm:px-14"
                >
                  <UsersIcon
                    class="mx-auto h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                  <p class="mt-4 font-semibold text-gray-900">
                    Keine Personen gefunden
                  </p>
                  <p class="mt-2 text-gray-500">
                    Wir konnten leider keine Personen mit diesem Namen finden.
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
    const activeOption = ref('')

    // compute filtered people
    const filteredPeople = computed(() =>
      query.value === ''
        ? props.people
        : props.people.filter((user) => {
          // Set the container properties to lowercase to ensure there are no missspelling based on uppercase lowercase issues
          // get Name Value, if not found in object return empty string
          let name = user.Attributes.find((attribute) => {
            return attribute.Name === 'name'
          })
          name = typeof name === 'object' ? name.Value.toLowerCase() : ''

          // get familyName Value, if not found in object return empty string
          let familyName = user.Attributes.find((attribute) => {
            return attribute.Name === 'family_name'
          })
          familyName =
            typeof familyName === 'object' ? familyName.Value.toLowerCase() : ''

          // get mail Value, if not found in object return empty string
          let mail = user.Attributes.find((attribute) => {
            return attribute.Name === 'email'
          })
          mail = typeof mail === 'object' ? mail.Value.toLowerCase() : ''

          // put searchvalue to lower case
          const searchString = query.value.toLowerCase()

          // Return if any of the given predicates matches, so the user can query against all of them at the search bar
          return name.includes(searchString) || familyName.includes(searchString) || mail.includes(searchString)
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

    // get name + familyname or email from user object
    function getName(user) {
      try {
        var listName = 'Nicht angegeben'
        // get indexes of values
        const nameIndex = user.Attributes.findIndex(
          (attr) => attr.Name === 'name'
        )
        const familyNameIndex = user.Attributes.findIndex(
          (attr) => attr.Name === 'family_name'
        )
        const emailIndex = user.Attributes.findIndex(
          (attr) => attr.Name === 'email'
        )

        // try to get name
        if (nameIndex > -1) {
          listName = user.Attributes[nameIndex].Value
        }
        // try to get surname
        if (familyNameIndex > -1) {
          listName = listName + ' ' + user.Attributes[familyNameIndex].Value
        }
        // if none was found, try email
        if (familyNameIndex < 0 && nameIndex < 0 && emailIndex > -1) {
          listName = user.Attributes[emailIndex].Value
          return listName
        }

        // return generated name
        return listName
      } catch (error) {
        console.log(error)
      }
    }

    // get email from selected user
    function getEmail(user) {
      try {
        const emailIndex = user.Attributes.findIndex(
          (attr) => attr.Name === 'email'
        )
        // if none was found, try email
        if (emailIndex > -1) {
          return user.Attributes[emailIndex].Value
        }
        // Fallback
        return null
      } catch (error) {
        console.log(error)
        // Fallback
        return null
      }
    }

    // get phone from selected user
    function getPhone(user) {
      try {
        const phoneIndex = user.Attributes.findIndex(
          (attr) => attr.Name === 'phone_number'
        )
        // if none was found, try phone
        if (phoneIndex > -1) {
          return user.Attributes[phoneIndex].Value
        }
        // Fallback
        return 'Nicht angegeben'
      } catch (error) {
        console.log(error)
        // Fallback
        return 'Nicht angegeben'
      }
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
      activeOption,
      onSelect,
      closeModal,
      loadMore,
      getName,
      getEmail,
      getPhone
    }
  }
}
</script>
