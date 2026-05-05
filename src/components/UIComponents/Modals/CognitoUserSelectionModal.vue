<template>
  <TransitionRoot
    :show="open"
    as="template"
    @after-leave="query = ''"
    appear
  >
    <Dialog
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
        <div class="fixed inset-0 bg-gray-800 bg-opacity-80 transition-opacity" />
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
            class="mx-auto max-w-3xl h-full sm:h-1/2 transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
          >
            <Combobox v-slot="{ activeOption }">
              <div class="flex flex-col h-full grow">
                <div class="flex mt-2 items-center px-2 pb-1">
                  <MagnifyingGlassIcon
                    class="pointer-events-none h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <ComboboxInput
                    class="h-12 w-full border-0 bg-transparent pr-4 text-gray-800 placeholder-gray-400 sm:text-sm"
                    placeholder="Suche nach Namen"
                    @change="query = $event.target.value"
                  />
                  <!-- close icon -->
                  <div class="flex items-center mr-2">
                    <button
                      class="h-7 w-7 text-gray-400 hover:text-gray-300 cursor-pointer"
                      @click="closeModal"
                    >
                      <XMarkIcon />
                    </button>
                  </div>
                </div>
                <ComboboxOptions
                  v-if="query === '' || filteredPeople.length > 0"
                  class="flex flex-col overflow-y-auto sm:flex-row divide-x divide-gray-100"
                  as="div"
                  static
                  hold
                >
                  <!-- left side -->
                  <div :class="[
                    ' min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4'
                  ]">
                    <div
                      hold
                      class="-mx-2 text-sm text-gray-700"
                    >
                      <ComboboxOption
                        v-for="person in filteredPeople"
                        :key="person.Username"
                        :value="person"
                        as="template"
                        v-slot="{ active }"
                      >
                        <div :class="[
                          'group flex cursor-default select-none items-center rounded-md p-2',
                          active && 'bg-gray-100 text-gray-900'
                        ]">
                          <span class="ml-3 flex-auto truncate">{{
                            getName(person)
                          }}</span>
                          <ChevronRightIcon
                            v-if="active"
                            class="ml-3 h-5 w-5 flex-none text-gray-400"
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
                        class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
                        @click="loadMore"
                      >
                        <ChevronDoubleDownIcon class="h-5 w-5 text-gray-400" />
                      </div>
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
                      <div class="flex flex-auto flex-col justify-between items-center p-6">
                        <button
                          @click="onSelect(activeOption)"
                          class="px-5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-900 text-white"
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
    </Dialog>
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
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot
  },
  props: {
    people: {
      type: Array,
      required: true,
      default: []
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
