<template>
  <div class="w-full">
    <ul
      role="list"
      class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
    >
      <li
        v-for="file in fileList"
        :key="file.name"
        class="col-span-1 flex rounded-md shadow-sm"
      >
        <div
          :class="[
            file.type === 'pdf'
              ? 'bg-red-500'
              : file.type === 'docx'
              ? 'bg-blue-500'
              : file.type === 'doc'
              ? 'bg-blue-500'
              : file.type === 'xlsx'
              ? 'bg-green-500'
              : file.type === 'png'
              ? 'bg-teal-500'
              : file.type === 'jpg'
              ? 'bg-teal-500'
              : file.type === 'jpeg'
              ? 'bg-teal-500'
              : 'bg-gray-500',
            'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white uppercase'
          ]"
        >
          {{ file.type }}
        </div>
        <div
          class="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white"
        >
          <div class="flex-1 truncate px-4 py-2 text-sm">
            <p
              :title="file.name"
              :href="file.key"
              class="font-medium text-gray-900"
            >
              {{ file.name }}
            </p>

            <p class="text-gray-500">{{ file.size + ' ' + file.unit }}</p>
          </div>
          <div class="flex flex-col pr-2">
            <button
              v-if="showDelete"
              @click="deleteClicked(file)"
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-400 hover:text-red-500"
            >
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              @click="downloadClicked(file)"
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
            >
              <ArrowDownTrayIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// vue imports
import { computed } from 'vue'

// icon imports
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/vue/20/solid'

export default {
  components: {
    ArrowDownTrayIcon,
    XMarkIcon
  },
  props: {
    files: {
      type: Array,
      required: true,
      default: () => []
    },
    showDelete: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  emits: ['delete-file', 'download-file'],
  setup(props, { emit }) {
    // compute files
    const fileList = computed(() => {
      try {
        // create empty file list array
        var fileList = []

        for (const file of props.files) {
          // get name
          const fileFullName = file.Key.split('/')[2]
          const fileName = fileFullName.split('.').slice(0, -1).join('.')

          // get size with 2 decimals
          const fileSizeCheck = file.Size > 9999
          const fileFullSize = fileSizeCheck
            ? file.Size / 1000000
            : file.Size / 1000
          const fileSize = fileFullSize.toFixed(2)
          const fileUnit = fileSizeCheck ? 'MB' : 'KB'

          // get type
          const fileType = fileFullName.substr(
            fileFullName.lastIndexOf('.') + 1
          )

          // push file object to file list
          fileList.push({
            name: fileName,
            size: fileSize,
            type: fileType,
            unit: fileUnit,
            key: file.Key
          })
        }
        return fileList
      } catch (error) {
        console.log(error)
        return []
      }
    })

    function deleteClicked(file) {
      emit('delete-file', file)
    }

    function downloadClicked(file) {
      emit('download-file', file)
    }

    return {
      fileList,
      deleteClicked,
      downloadClicked
    }
  }
}
</script>