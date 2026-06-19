<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Unterschriften-Ampel (Eltern / Schule / Fachkraft)

Kompakte Anzeige der drei nötigen Unterschriften. Grün = vorhanden,
gelb = fehlt. Eine fehlende Unterschrift blockiert den Status "abrechenbar".
-->
<template>
  <div class="flex items-center gap-1.5" :title="titleText">
    <span
      v-for="kind in kinds"
      :key="kind.key"
      :class="[
        'inline-flex h-5 items-center gap-1 rounded-full px-1.5 text-[10px] font-semibold',
        signatures[kind.key]
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-amber-100 text-amber-700'
      ]"
    >
      <span
        :class="[
          'h-1.5 w-1.5 rounded-full',
          signatures[kind.key] ? 'bg-emerald-500' : 'bg-amber-500'
        ]"
      ></span>
      {{ kind.abbr }}
    </span>
  </div>
</template>

<script>
import { computed } from 'vue'
import { SIGNATURE_KINDS } from '@/utilities/billing/signatures.js'

export default {
  name: 'SignatureTrafficLight',
  props: {
    // { parent, school, professional, complete, missing: [...] }
    signatures: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const kinds = SIGNATURE_KINDS.map((kind) => ({
      ...kind,
      abbr: kind.label.charAt(0)
    }))

    const titleText = computed(() => {
      if (props.signatures.complete) return 'Alle Unterschriften vorliegen'
      return `Fehlt: ${(props.signatures.missing || []).join(', ')}`
    })

    return { kinds, titleText }
  }
}
</script>
