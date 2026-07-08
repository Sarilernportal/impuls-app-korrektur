<template>
  <div class="flex">
    <div
      class="w-full px-6 grid grid-cols-4 grid-rows-3 lg:grid-rows-1 lg:grid-cols-7 gap-x-4 items-center"
    >
      <!-- item section -->
      <!-- username and family name -->
      <div
        class="lg:px-0 py-2 lg:py-4 col-span-2 lg:col-span-1 whitespace-nowrap"
      >
        <div class="flex items-center">
          <div>
            <div class="lg:hidden text-base text-secondaryText">
              <span>Name:</span>
            </div>
            <div class="text-base text-primaryText flex flex-wrap break-words">
              <span
                class="mr-1 whitespace-pre-wrap break-words text-impuls-blue font-bold"
                >{{ username }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- phone and email -->
      <div class="lg:px-0 py-2 lg:py-4 col-span-2 whitespace-nowrap">
        <div class="lg:hidden text-base text-secondaryText">
          <span>Kontakt:</span>
        </div>
        <div class="text-base font-medium text-primaryText">
          <span class="whitespace-pre-wrap">{{ phone }}</span>
        </div>
        <div class="text-base text-secondaryText">
          <span class="mr-1 whitespace-pre-wrap break-words">{{ mail }}</span>
        </div>
      </div>
      <!-- status -->
      <div
        class="lg:px-0 py-2 lg:py-4 col-span-2 lg:col-span-1 whitespace-nowrap"
      >
        <div class="lg:hidden text-base text-secondaryText">
          <span>Status:</span>
        </div>
        <span
          :class="[
            user.Enabled
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700',
            'px-2 py-1 inline-flex text-base leading-5 font-semibold rounded-full'
          ]"
        >
          {{ user.Enabled ? 'Aktiv' : 'Inaktiv' }}
        </span>
      </div>
      <!-- registration date -->
      <div class="lg:px-0 py-2 lg:py-4 col-span-2 whitespace-nowrap">
        <div class="lg:hidden text-base text-secondaryText">
          <span>Registriert:</span>
        </div>
        <div class="text-base text-tertiaryText">
          {{ registered }}
        </div>
      </div>
      <!-- Edit -->
      <div
        class="hidden lg:flex lg:px-0 py-2 lg:py-4 col-span-4 whitespace-nowrap justify-self-center lg:col-span-1 lg:justify-self-end self-start"
      >
        <button
          @click="showDetailsTapped"
          class="cursor-pointer text-base text-secondaryText hover:text-gray-600"
        >
          <Cog6ToothIcon class="h-8 w-8" />
        </button>
      </div>
    </div>
    <!-- Edit -->
    <div class="lg:hidden flex py-2 whitespace-nowrap items-start">
      <button
        @click="showDetailsTapped"
        class="cursor-pointer text-base text-secondaryText hover:text-gray-600"
      >
        <Cog6ToothIcon class="h-8 w-8" />
      </button>
    </div>
  </div>
</template>

<script>
// Vue imports
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// icon imports
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'UserListItem',
  components: {
    Cog6ToothIcon
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    userType: {
      type: String,
      required: false,
      default: 'none'
    }
  },
  setup(props) {
    const router = useRouter()

    function showDetailsTapped() {
      // function for redirecting user to user detail page of selected user
      router.push({ name: 'UserDetails', params: { id: props.user.Username } })
    }

    // computed property for Username
    // Use "Nicht angegeben" if no value is found both in props
    const username = computed(() => {
      let name = props.user.Attributes.find((attr) => {
        return attr.Name === 'name'
      })
      let lastName = props.user.Attributes.find((attr) => {
        return attr.Name === 'family_name'
      })
      if (typeof name === 'undefined' && typeof lastName === 'undefined') {
        return 'Nicht angegeben'
      }
      name = typeof name !== 'undefined' ? name.Value : ''
      lastName = typeof lastName !== 'undefined' ? lastName.Value : ''
      return `${name} ${lastName}`
    })

    // computed property for Phone
    // Use "Nicht angegeben" if no value is found in prop
    const phone = computed(() => {
      const phone = props.user.Attributes.find((attr) => {
        return attr.Name === 'phone_number'
      })
      if (typeof phone === 'undefined') {
        return 'Nicht angegeben'
      }
      return phone.Value
    })

    // computed property for Mail
    // Use "Nicht angegeben" if no value is found in prop
    const mail = computed(() => {
      const mail = props.user.Attributes.find((attr) => {
        return attr.Name === 'email'
      })
      if (typeof mail === 'undefined') {
        return 'Nicht angegeben'
      }
      return mail.Value
    })

    // compute UserCreateDate to readable format
    const registered = computed(() => {
      const rawDate = +new Date(props.user.UserCreateDate)
      const offset = new Date(+rawDate).getTimezoneOffset() * 60 * 1000
      const timeStamp = new Date(+rawDate - offset).toISOString()
      const convertedArray = timeStamp.split('T')
      const date = convertedArray[0].replaceAll('-', '.')
      const dateSorted = date.split('.').reverse().join('.')
      const time = convertedArray[1].split('.')[0]
      const convertedTimestamp = dateSorted + ', ' + time

      return convertedTimestamp
    })

    return {
      username,
      phone,
      mail,
      registered,
      showDetailsTapped
    }
  }
}
</script>
