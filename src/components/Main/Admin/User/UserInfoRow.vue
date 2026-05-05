<template>
  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt class="text-sm font-medium text-primaryText">{{ title }}</dt>
    <dd class="mt-1 flex text-sm text-primaryText sm:mt-0 sm:col-span-2">
      <span class="flex-grow">{{ value }}</span>
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
