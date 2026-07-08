<template>
  <div class="mx-auto max-w-4xl px-4 py-4 sm:px-6">
    <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p class="text-sm font-medium text-impuls-blue">Dokumentation</p>
      <h2 class="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">Was möchten Sie erfassen?</h2>
      <p class="mt-2 text-sm text-slate-600">
        Wählen Sie den passenden Eintrag. Die App führt Sie danach Schritt für Schritt durch die Eingabe.
      </p>
    </section>

    <section class="mt-4 grid gap-4 sm:grid-cols-2">
      <button
        v-for="option in options"
        :key="option.name"
        @click="optionTapped(option)"
        class="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-200 hover:bg-blue-50"
      >
        <div :class="['flex h-12 w-12 items-center justify-center rounded-lg', option.bgClass]">
          <component
            :is="option.icon"
            class="h-6 w-6"
            aria-hidden="true"
          />
        </div>
        <h3 class="mt-4 font-display text-lg font-bold text-slate-900">{{ option.name }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ option.description }}</p>
        <p class="mt-4 text-sm font-semibold text-impuls-blue">Starten</p>
      </button>
    </section>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { DocumentTextIcon, StarIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    DocumentTextIcon,
    StarIcon
  },
  setup() {
    const options = [
      {
        name: 'Dokumentation',
        description: 'Für Schule, Hilfeplangespräch, Kennenlerngespräch, Hospitation, Ausflug oder Sonstiges.',
        route: 'ReportView',
        icon: DocumentTextIcon,
        bgClass: 'bg-amber-100 text-amber-700'
      },
      {
        name: 'Sonderzeiten',
        description: 'Für Feiertag, Urlaub, Krankheit, Supervision, Teamsitzung oder andere Sonderfälle.',
        route: 'SpecialReportView',
        icon: StarIcon,
        bgClass: 'bg-violet-100 text-violet-700'
      }
    ]

    const router = useRouter()

    async function optionTapped(option) {
      router.push({ name: option.route })
    }

    return {
      options,
      optionTapped
    }
  }
}
</script>
