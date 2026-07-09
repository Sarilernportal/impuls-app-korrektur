<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Error Window Component
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
        class="
          flex
          items-center
          justify-center
          min-h-screen
          pt-4
          px-4
          pb-20
          text-center
          sm:block sm:p-0
        "
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
            class="fixed inset-0 bg-slate-900/40 transition-opacity"
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
            class="
              inline-block
              align-bottom
              bg-white
              rounded-2xl
              p-6
              text-left
              shadow-xl
              transform
              transition-all
              sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
            "
          >
            <!-- Header area -->
            <div class="sm:flex sm:items-start">
              <div
                class="
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  bg-red-100
                  sm:mx-0 sm:h-10 sm:w-10
                "
              >
                <ExclamationTriangleIcon
                  class="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 font-display font-bold text-slate-900"
                >
                  {{ title }}
                </DialogTitle>
                <div class="mt-2">
                  <slot name="message">
                    <p class="text-sm text-slate-500">
                      {{ message }}
                    </p>
                  </slot>
                </div>
              </div>
            </div>
            <!-- Action area -->
            <menu class="mt-6 px-0 py-0 sm:flex sm:flex-row-reverse">
              <slot name="actions">
                <button
                  type="button"
                  class="
                    mt-3
                    w-full
                    inline-flex
                    justify-center
                    rounded-lg
                    border border-slate-200
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:bg-slate-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-brand-500
                    sm:mt-0 sm:ml-3 sm:w-auto
                  "
                  @click="$emit('close')"
                  ref="cancelButtonRef"
                >
                  Okay
                </button>
              </slot>
            </menu>
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
  TransitionRoot,
} from "@headlessui/vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

export default {
  name: "ErrorWindow",
  components: {
    HDialog: Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationTriangleIcon,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: true,
    },
    title: {
      type: String,
      required: false,
      default: "Fehler",
    },
    message: {
      type: String,
      required: false,
      default:
        "Es ist ein unbekannter Fehler aufgetreten. Sollte dieser öfter auftreten, kontaktieren Sie bitte den Betreiber dieser Seite.",
    },
  },
};
</script>
