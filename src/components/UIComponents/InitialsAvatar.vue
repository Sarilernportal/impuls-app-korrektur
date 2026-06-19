<!--
Project: Impuls Child care
Scope: Initials avatar – round, coloured initials derived from a name.
Used in lists and detail pages to make people/organisations easier to scan.
-->

<template>
  <span
    :class="[
      'inline-flex flex-shrink-0 items-center justify-center rounded-full font-semibold leading-none ring-1 ring-inset ring-black/5',
      sizeClass,
      palette.bg,
      palette.text
    ]"
    :title="name"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>

<script>
import { computed } from 'vue'

const PALETTES = [
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700' }
]

export default {
  name: 'InitialsAvatar',
  props: {
    name: {
      type: String,
      default: ''
    },
    // Tailwind size classes (height/width + text size)
    sizeClass: {
      type: String,
      default: 'h-10 w-10 text-sm'
    }
  },
  setup(props) {
    const initials = computed(() => {
      const cleaned = (props.name || '').trim()
      if (!cleaned) {
        return '–'
      }
      const parts = cleaned.split(/\s+/).filter(Boolean)
      if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase()
      }
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    })

    const palette = computed(() => {
      const key = (props.name || '').trim() || '–'
      let hash = 0
      for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0
      }
      return PALETTES[hash % PALETTES.length]
    })

    return { initials, palette }
  }
}
</script>
