<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Icon Tab Selector Component
-->
<template>
  <div class="w-full flex justify-around">
    <div class="w-full mx-4 border-b border-slate-100">
      <div class="-mb-px flex justify-between" aria-label="Tabs">
        <button
          type="button"
          v-for="tab in tabs"
          @click="tabSelected(tab.name)"
          :key="tab.name"
          :class="[
            tab.current
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-slate-300 hover:text-slate-500 hover:border-slate-100',
            'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
          ]"
          :aria-current="tab.current ? 'page' : undefined"
        >
          <component
            :is="tab.icon"
            :class="[
              tab.current
                ? 'text-indigo-500'
                : 'text-slate-200 group-hover:text-slate-300',
              '-ml-0.5 mr-2 h-5 w-5',
            ]"
            aria-hidden="true"
          />
          <span>{{ tab.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Vue imports
import { reactive } from "vue";
// Component imports
import { EnvelopeIcon, PhoneIcon } from "@heroicons/vue/24/solid";

export default {
  name: "IconTabSelector",
  setup(_, context) {
    // Initialize reactives
    const tabs = reactive([
      { name: "phone", title: "Telefon", icon: PhoneIcon, current: true },
      { name: "email", title: "E-Mail", icon: EnvelopeIcon, current: false },
    ]);

    // Gets called, when an tab is selected
    function tabSelected(name) {
      tabs.map((tab) => {
        if (tab.name === name) {
          tab.current = true;
        } else {
          tab.current = false;
        }
      });
      // Emit the new selected tab
      context.emit("switched-tab", name);
    }

    // Return the setup object
    return {
      tabs,
      tabSelected,
    };
  },
};
</script>
