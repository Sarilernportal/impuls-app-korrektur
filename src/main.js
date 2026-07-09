import { createApp } from 'vue'
import App from './App.vue'
// Schriften lokal gebündelt (Offline-PWA, keine externen Font-Server):
// DM Sans = Body/Data, Plus Jakarta Sans = Display (Satoshi-Ersatz, s. DESIGN.md)
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/plus-jakarta-sans'
import './index.css'
import 'v-calendar/dist/style.css'
import router from './router'
import store from './store'
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports.js'
import { registerSW } from 'virtual:pwa-register'

// Service Worker NUR in Produktion registrieren. Im lokalen Dev/Demo würde er
// alte Versionen aus dem Cache ausliefern ("Klick passiert nix" nach Änderungen).
// Zusätzlich einen evtl. vorhandenen SW im Dev einmalig entfernen (Selbstheilung).
if (import.meta.env.PROD) {
  registerSW({ immediate: true })
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  })
  if (window.caches?.keys) {
    window.caches.keys().then((keys) => keys.forEach((key) => window.caches.delete(key)))
  }
}

// Configure the AWS Amplify backend
Amplify.configure(aws_exports)

createApp(App).use(store).use(router).mount('#app')
