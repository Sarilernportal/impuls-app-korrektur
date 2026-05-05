<template>
  <div
    :class="styling"
    class="flex flex-row items-center space-x-2"
  >
    <!-- Col header title -->
    <div class="text-impuls-blue font-medium">{{ menuItem.value }}</div>
    <!-- button section, only shown if emit signal is classified -->
    <div
      class="flex flex-col"
      v-if="menuItem.emitValue !== null"
    >
      <!-- ascending sort button -->
      <button @click="ascendingButtonTapped(menuItem.emitValue)">
        <ChevronUpIcon
          :class="{
            'text-secondaryText': ascendingIsActive === false,
            'text-primaryText':
              ascendingIsActive === true && menuItem.sorted === true,
          }"
          class="h-4 w-4 text-secondaryText hover:text-gray-500"
          aria-hidden="true"
        />
      </button>
      <!-- descending sort button -->
      <button @click="descendingButtonTapped(menuItem.emitValue)">
        <ChevronDownIcon
          :class="{
            'text-secondaryText': descendingIsActive === false,
            'text-primaryText':
              descendingIsActive === true && menuItem.sorted === true,
          }"
          class="h-4 w-4 text-secondaryText hover:text-gray-500"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref } from "vue";
// heroicons imports
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid";

export default {
  name: "ListColHeader",
  props: {
    menuItem: {
      type: Object,
      required: true,
    },
  },
  components: {
    ChevronUpIcon,
    ChevronDownIcon,
  },
  emits: ["sort-event"],
  setup(props, context) {
    // Initialize Refs
    const descendingIsActive = ref(false);
    const ascendingIsActive = ref(false);
    const styling = ref(`col-span-${props.menuItem.spanValue}`);

    // emit sort event ascending with sort direction and item to sort
    function ascendingButtonTapped(item) {
      const sortEvent = {
        direction: "ascending",
        value: item,
      };
      // set values for sorting indicators
      descendingIsActive.value = false;
      ascendingIsActive.value = true;
      context.emit("sort-event", sortEvent);
    }

    // emit sort event ascending with sort direction and item to sort
    function descendingButtonTapped(item) {
      const sortEvent = {
        direction: "descending",
        value: item,
      };
      // set values for sorting indicators
      descendingIsActive.value = true;
      ascendingIsActive.value = false;
      context.emit("sort-event", sortEvent);
    }

    return {
      descendingIsActive,
      ascendingIsActive,
      styling,
      ascendingButtonTapped,
      descendingButtonTapped,
    };
  },
};
</script>
