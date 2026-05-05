<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
26.10.2022

Scope:
Reload prompt
-->

<template>
  <!-- Root container -->
  <div v-if="needRefresh || offlineReady" aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
        <div class="p-4">
          <div class="flex items-start">
            <div class="ml-3 w-0 flex-1">
              <!-- Refresh text -->
              <div v-if="needRefresh">
                <p class="text-sm font-medium text-gray-900">
                  Update verfügbar
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Bitte updaten Sie die App
                </p>
              </div>
              <!-- Offline useable text -->
              <div v-else>
                <p class="text-sm font-medium text-gray-900">
                  Offline verfügbar
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Die App kann nun offline genutzt werden
                </p>
              </div>
              <!-- Button area -->
              <div class="mt-4 flex">
                <!-- Refresh button area -->
                <div v-if="needRefresh">
                  <!-- Update button -->
                  <button @click="updateAppTapped" type="button" class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Updaten
                  </button>
                  <!-- Cancel button -->
                  <button @click="closeTapped" type="button" class="ml-3inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Abbrechen
                  </button>
                </div>
                <!-- Offline confirm button -->
                <button v-else @click="closeTapped" type="button" class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Verstanden!
                </button>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <!-- Close button with icon -->
              <button @click="closeTapped" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
// Service worker imports
import { useRegisterSW } from 'virtual:pwa-register/vue'
export default {
  name: 'ReloadPrompt',
  setup() {
    // Constants initialization
    // Get values from service worker
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()
    // Callback when user hits close button
    function closeTapped() {
      needRefresh.value = false
      offlineReady.value = false
    }
    // Callback when user hits the update button
    function updateAppTapped() {
      // Update service worker to latest version
      updateServiceWorker()
    }
    // Return setup object
    return {
      offlineReady,
      needRefresh,
      updateAppTapped,
      closeTapped
    }
  }
}
</script>