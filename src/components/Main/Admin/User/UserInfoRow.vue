<template>
  <div class="group py-1.5">
    <dt class="text-xs font-medium text-slate-500">{{ title }}</dt>
    <dd class="flex items-center justify-between gap-3 text-sm sm:col-span-2">
      <span :class="['min-w-0 flex-grow break-words', value ? 'font-medium text-slate-900' : 'text-slate-400']">{{ value }}</span>
    </dd>
  </div>
</template>

<script>
export default {
  name: 'UserInfoRow',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>
