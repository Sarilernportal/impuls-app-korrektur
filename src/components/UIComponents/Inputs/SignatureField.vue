<!--
Project:
Impuls Child care
Developed by:
Moebus Digital Solutions GbR
Chris Moebus
10.10.2022
Scope:
Signature Field
-->

<template>
  <div
    id="canvasContainer"
    class="w-full h-auto"
  >
    <div class="flex w-full items-center mb-2">
      <label class="w-full block text-sm font-medium text-primaryText sm:mt-px sm:pt-2">Unterschrift</label>
      <button
        @click.prevent="clearPad"
        class="bg-indigo-600 rounded-full text-white p-1"
      >
        <ArrowPathIcon class="h-6 w-6" />
      </button>
    </div>
    <!-- Pad canvas -->
    <canvas
      :key="height + width"
      ref="canvas"
      @touchstart="preventTouch"
      @touchmove="preventTouch"
      @pointerdown.passive="handlePointerDown"
      @pointerup.passive="handlePointerUp"
      @pointermove.passive="handlePointerMove"
      class="bg-white rounded-md border border-gray-200"
      :height="height"
      :width="width"
    />
  </div>
</template>

<script>
// Vue imports
import { onMounted, ref } from 'vue'

// icon imports
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'SignatureField',
  components: {
    ArrowPathIcon
  },
  emits: ['get-image'],
  setup(_, { emit }) {
    // Ref declaration
    const canvas = ref(null)
    const writingMode = ref(false)
    const height = ref(0)
    const width = ref(0)

    // calculate canvas size depending on available width and ratio (2.625)
    function calcSize() {
      const signatureField = document.getElementById('canvasContainer')
      if (signatureField !== null) {
        width.value = document.getElementById('canvasContainer').offsetWidth
        height.value = width.value / 2.625
      }
    }

    // Callback when the user hits the submit button
    function getImage(clear = true) {
      // Get the image in base64
      const imageBase64 = canvas.value.toDataURL('image/png')
      // Emit it to the parent
      emit('get-image', imageBase64)
      // Finally clear the pad
      if (clear) {
        clearPad()
      }
    }

    // Callback when the user moves over the pad
    function handlePointerMove(event) {
      // Only draw on the pad when the writing mode is enabled
      if (!writingMode.value) return
      // Get the position
      const [positionX, positionY] = getTargetPosition(event)
      // Get the context
      const ctx = canvas.value.getContext('2d')
      // Set the line paramaeters
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // Move the line to the position
      ctx.lineTo(positionX, positionY)
      // Stroke the line on the pad
      ctx.stroke()
      // push image to parent component
      getImage(false)
    }

    // Get the target positon on the pad
    function getTargetPosition(event) {
      // Get X
      const positionX = event.clientX - event.target.getBoundingClientRect().x
      // Get Y
      const positionY = event.clientY - event.target.getBoundingClientRect().y
      // Return the positions
      return [positionX, positionY]
    }

    // Callback when the user tabs on the pad
    function handlePointerDown(event) {
      // Enable writing mode
      writingMode.value = true
      // Get the context
      const ctx = canvas.value.getContext('2d')
      // Begin with the path
      ctx.beginPath()
      // Get the positions for the target
      const [positionX, positionY] = getTargetPosition(event)
      // Move the line to the calculated positions
      ctx.moveTo(positionX, positionY)
    }

    // Callback when the user leaves the pad
    function handlePointerUp() {
      // Disable writing mode
      writingMode.value = false
    }

    // Clear the pad
    function clearPad() {
      // Get the context
      const ctx = canvas.value.getContext('2d')
      // Clear the rect from the conts
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      // emit reset value as false --> required for validation check
      emit('get-image', null)
    }

    // Event prevention to not trigger from default
    function preventTouch(event) {
      event.preventDefault()
    }

    // calculate initial canvas size
    onMounted(() => {
      // add windows resize event listener to resize signature canvas to correct size
      window.addEventListener('resize', () => {
        calcSize()
      })
      calcSize()
    })

    // Return the setup object
    return {
      canvas,
      width,
      height,
      getImage,
      handlePointerMove,
      handlePointerDown,
      handlePointerUp,
      preventTouch,
      clearPad
    }
  }
}
</script>