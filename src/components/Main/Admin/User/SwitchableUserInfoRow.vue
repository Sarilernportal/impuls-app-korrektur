<template>
  <SwitchGroup
    as="div"
    class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5"
  >
    <SwitchLabel
      as="dt"
      class="text-sm font-medium text-primaryText"
      passive
    >
      {{ title }}
    </SwitchLabel>
    <dd class="mt-1 flex text-sm text-primaryText sm:mt-0 sm:col-span-2">
      <span class="flex-grow">{{ value }}</span>
      <loading-spinner
        v-if="isLoading"
        size="h-6 w-6"
      />
      <Switch
        v-else
        v-model="buttonIsActive"
        :class="[
          buttonIsActive ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-auto'
        ]"
      >
        <span
          aria-hidden="true"
          :class="[
            buttonIsActive ? 'translate-x-5' : 'translate-x-0',
            'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          ]"
        />
      </Switch>
    </dd>
  </SwitchGroup>
</template>

<script>
// Vue imports
import { ref, watch } from 'vue'
// Component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
export default {
  name: 'SwitchableUserInfoRow',
  emits: ['button-toggled'],
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: String,
      required: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
    Switch,
    SwitchGroup,
    SwitchLabel,
    LoadingSpinner
  },
  setup(props, ctx) {
    const buttonIsActive = ref(props.isActive)

    watch(
      () => buttonIsActive.value,
      (state) => {
        buttonToggled(state)
      }
    )

    function buttonToggled(state) {
      ctx.emit('button-toggled', state)
    }

    return {
      buttonIsActive
    }
  }
}
</script>
