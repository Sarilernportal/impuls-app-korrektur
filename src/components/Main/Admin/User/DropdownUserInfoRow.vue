<template>
  <div class="flex py-4 sm:py-5 sm:gap-4 items-center">
    <dt class="text-sm col-span-2 sm:col-span-1 font-medium text-primaryText">
      {{ title }}
    </dt>
    <dd class="flex w-full mt-1 text-sm text-gray-100 sm:mt-0 sm:col-span-2 justify-end">
      <property-dropdown
        class="ml-4 sm:ml-0"
        @change-property="changeProperty"
        :possibilities="possibilities"
        :isLoading="isLoading"
      />
    </dd>
  </div>
</template>

<script>
// Vue imports
import { ref } from 'vue'
// Component imports
import PropertyDropdown from '@/components/UIComponents/Dropdowns/PropertyDropdown.vue'

export default {
  name: 'EditableUserInfoRow',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
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
  components: {
    PropertyDropdown
  },
  setup(_, ctx) {
    const editModeActive = ref(false)

    function changeProperty(to) {
      ctx.emit('change-property', to)
    }

    return {
      editModeActive,
      changeProperty
    }
  }
  //Loading Indicator for button when updating the value?
}
</script>
