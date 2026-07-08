<!--
Project:
Impuls Child care

Scope:
Auth Page – split-screen layout (brand panel + form panel)
-->

<template>
  <div class="min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
    <!-- Left: brand & value proposition (desktop only) -->
    <aside class="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
      <div class="absolute inset-0 bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900" />
      <img
        class="absolute inset-0 h-full w-full object-cover opacity-10"
        src="@/assets/img/impuls_mainbg.jpg"
        alt=""
        aria-hidden="true"
      />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_55%)]" />

      <!-- Logo -->
      <div class="relative p-10 xl:p-14">
        <span class="inline-flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-soft">
          <img
            class="h-9 w-auto"
            src="@/assets/img/logo_main.png"
            alt="Impuls Erziehungshilfen"
          />
          <span class="text-lg font-bold tracking-tight text-impuls-blue">Impuls</span>
        </span>
      </div>

      <!-- Value proposition -->
      <div class="relative px-10 pb-4 xl:px-14">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
          Teilhabeassistenz · §35a SGB VIII
        </p>
        <h1 class="mt-4 max-w-md text-4xl font-bold leading-tight text-white xl:text-[2.75rem]">
          Dokumentation, Nachweise und Abrechnung – mobil für Ihr Team.
        </h1>
        <ul class="mt-10 space-y-5">
          <li
            v-for="point in valuePoints"
            :key="point"
            class="flex items-start gap-3 text-blue-50"
          >
            <CheckCircleIcon class="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-200" aria-hidden="true" />
            <span class="text-lg">{{ point }}</span>
          </li>
        </ul>
      </div>

      <div class="relative p-10 text-sm text-blue-200/80 xl:px-14">
        © {{ year }} Impuls Erziehungshilfen
      </div>
    </aside>

    <!-- Right: form panel -->
    <main class="flex min-h-screen flex-col px-6 pb-10 pt-6 sm:px-10 lg:py-10">
      <!-- Mobiler Hero (Mitarbeiter nutzen die App am Handy – der große
           Hellblau-Bereich links ist dort ausgeblendet) -->
      <section class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 px-5 py-6 text-white shadow-soft lg:hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_55%)]" aria-hidden="true"></div>
        <div class="relative">
          <span class="inline-flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 shadow-soft">
            <img class="h-7 w-auto" src="@/assets/img/logo_main.png" alt="Impuls Logo" />
          </span>
          <p class="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            Teilhabeassistenz · §35a SGB VIII
          </p>
          <h1 class="mt-1.5 text-2xl font-bold leading-tight">
            Dokumentieren, nachweisen, abrechnen – an einem Ort.
          </h1>
        </div>
      </section>

      <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <auth-header />
        <div class="mt-8">
          <router-view />
        </div>
      </div>
      <div class="mx-auto flex w-full max-w-md flex-wrap justify-center gap-6 pt-8 text-sm print:hidden">
        <router-link
          :to="{ name: 'Imprint' }"
          class="text-slate-400 transition hover:text-impuls-blue"
        >Impressum</router-link>
        <router-link
          :to="{ name: 'GDPR' }"
          class="text-slate-400 transition hover:text-impuls-blue"
        >Datenschutzbestimmung</router-link>
      </div>
    </main>
  </div>
</template>

<script>
import AuthHeader from '@/components/Auth/AuthHeader.vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Auth',
  components: {
    AuthHeader,
    CheckCircleIcon
  },
  setup() {
    const valuePoints = [
      'Dokumentation in Minuten erfasst – direkt vom Einsatz',
      'Nachweise und Unterschriften vollständig digital',
      'Rechnungen für die Kostenträger auf Knopfdruck'
    ]
    return { valuePoints, year: new Date().getFullYear() }
  }
}
</script>
