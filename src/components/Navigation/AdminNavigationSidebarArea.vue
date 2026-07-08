<template>
  <div
    v-for="item in navigation"
    :key="item.name"
  >
    <button
      v-if="!item.children && !item.queryChildren"
      :key="item.name"
      @click="navigationTabTapped(item.route)"
      :class="[
        item.current
          ? 'bg-impuls-blue text-white shadow-sm'
          : 'text-stone-700 hover:bg-black/5 hover:text-stone-900',
        'w-full group flex min-h-[2.75rem] items-center px-3 py-2.5 text-sm leading-6 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-impuls-blue/40'
      ]"
      :aria-current="item.current ? 'page' : undefined"
    >
      <component
        :is="item.icon"
        class="mr-4 h-6 w-6 flex-shrink-0"
        aria-hidden="true"
      />
      {{ item.name }}
    </button>
    <!-- collapsable simple children -->
    <Disclosure
      as="div"
      v-if="item.children"
      class="space-y-1"
      v-slot="{ open }"
    >
      <DisclosureButton
        @click="navigationTabTapped(item.route)"
        :class="[
          item.current
            ? 'bg-impuls-blue text-white shadow-sm'
            : 'text-stone-700 hover:bg-black/5 hover:text-stone-900',
          'w-full group flex min-h-[2.75rem] items-center px-3 py-2.5 text-sm leading-6 font-medium rounded-lg'
        ]"
        :aria-current="item.current ? 'page' : undefined"
      >
        <component
          :is="item.icon"
          class="mr-4 h-6 w-6 flex-shrink-0"
          aria-hidden="true"
        />
        {{ item.name }}
        <svg
          :class="[
            open ? 'rotate-90' : '',
            'ml-3 h-5 w-5 flex-shrink-0 transform opacity-70'
          ]"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M6 6L14 10L6 14V6Z"
            fill="currentColor"
          />
        </svg>
      </DisclosureButton>
      <DisclosurePanel class="space-y-1">
        <DisclosureButton
          v-for="subItem in item.children"
          :key="subItem.name"
          as="a"
          @click="navigationTabTapped(subItem.route)"
          class="group flex min-h-[2.5rem] w-full cursor-pointer items-center rounded-lg py-2 pl-11 pr-2 text-sm font-medium text-stone-600 hover:bg-black/5 hover:text-stone-900"
        >
          {{ subItem.name }}</DisclosureButton>
      </DisclosurePanel>
    </Disclosure>
    <!-- collapsable query children -->
    <Disclosure
      as="div"
      v-if="item.queryChildren"
      class="space-y-1"
      v-slot="{ open }"
    >
      <DisclosureButton
        @click="navigationTabTapped(item.route)"
        :class="[
          item.current
            ? 'bg-impuls-blue text-white shadow-sm'
            : 'text-stone-700 hover:bg-black/5 hover:text-stone-900',
          'w-full group flex min-h-[2.75rem] items-center px-3 py-2.5 text-sm leading-6 font-medium rounded-lg'
        ]"
        :aria-current="item.current ? 'page' : undefined"
      >
        <component
          :is="item.icon"
          class="mr-4 h-6 w-6 flex-shrink-0"
          aria-hidden="true"
        />
        {{ item.name }}
        <svg
          :class="[
            open ? 'rotate-90' : '',
            'ml-3 h-5 w-5 flex-shrink-0 transform opacity-70'
          ]"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M6 6L14 10L6 14V6Z"
            fill="currentColor"
          />
        </svg>
      </DisclosureButton>
      <DisclosurePanel class="space-y-1">
        <DisclosureButton
          as="a"
          @click="navigationQueryTabTapped(item, { query: '', value: '' })"
          class="group flex min-h-[2.5rem] w-full cursor-pointer items-center rounded-lg py-2 pl-11 pr-2 text-sm font-medium text-stone-600 hover:bg-black/5 hover:text-stone-900"
        >
          Übersicht
        </DisclosureButton>
        <DisclosureButton
          v-for="subItem in item.queryChildren"
          :key="subItem.name"
          as="a"
          @click="navigationQueryTabTapped(item, subItem.route)"
          class="group flex min-h-[2.5rem] w-full cursor-pointer items-center rounded-lg py-2 pl-11 pr-2 text-sm font-medium text-stone-600 hover:bg-black/5 hover:text-stone-900"
        >
          {{ subItem.name }}
        </DisclosureButton>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script>
// vue imports
import { useRouter } from 'vue-router'

//Headles UI imports
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/vue'

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel
  },
  props: {
    navigation: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['nav-tabbed', 'nav-query-tabbed'],
  setup(_, { emit }) {
    // Callback when the user hits the navigtation tab
    async function navigationTabTapped(route) {
      emit('nav-tabbed', route)
    }

    async function navigationQueryTabTapped(mainRoute, route) {
      emit('nav-query-tabbed', { mainRoute, route })
    }

    return {
      navigationTabTapped,
      navigationQueryTabTapped
    }
  }

}
</script>
