<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
Critical Action Component
-->
<template>
  <TransitionRoot as="template" :show="open">
    <HDialog
      as="div"
      static
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="$emit('close')"
      :open="open"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
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
          <DialogOverlay
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />
        </TransitionChild>
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <!-- Header section -->
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <!-- Loading Spinner -->
                <loading-spinner
                  v-if="isLoading"
                  class="h-12 w-12"
                  aria-hidden="true"
                />
                <QuestionMarkCircleIcon
                  v-else
                  class="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  {{ title }}
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
            <!-- Action area -->
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <slot name="action">
                <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="$emit('confirmed')"
                >
                  {{ buttonConfirmTitle }}
                </button>
              </slot>
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                @click="$emit('close')"
                ref="cancelButtonRef"
              >
                {{ buttonCancelTitle }}
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script>
// Component imports
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
// Component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  components: {
    HDialog: Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    LoadingSpinner,
    QuestionMarkCircleIcon
  },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    buttonConfirmTitle: {
      type: String,
      required: false,
      default: ''
    },
    buttonCancelTitle: {
      type: String,
      required: true,
      default: ''
    },
    message: {
      type: String,
      required: true,
      default: ''
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
