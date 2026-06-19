<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
User Details
-->

<template>
  <!-- Critical action modal for user delete operation -->
  <critical-action
    :open="deleteSelected"
    title="Nutzer löschen"
    message="Möchten Sie den Nutzer wirklich löschen? Dieser Vorgang ist nichtmehr umzukehren."
    buttonCancelTitle="Abbrechen"
    buttonConfirmTitle="Nutzer löschen"
    @close="deleteSelected = false"
    @confirmed="confirmedDelete"
  >
  </critical-action>
  <!-- Error modal -->
  <error-window
    v-if="customError.isPresent"
    :title="customError.title"
    :message="customError.message"
    :open="customError.isPresent"
    @close="customErrorConfirmed"
  />
  <!-- Success modal -->
  <success-window
    v-if="customSuccess.isPresent"
    :title="customSuccess.title"
    :message="customSuccess.message"
    :open="customSuccess.isPresent"
    @close="customSuccessConfirmed"
  />
  <div class="min-h-screen overflow-y-auto bg-slate-50 flex">
    <!-- Content area -->
    <!-- Loading spinner -->
    <div
      v-if="isLoading"
      class="w-full flex justify-center items-center"
    >
      <loading-spinner size="h-16 w-16" />
    </div>
    <!-- Main content area -->
    <div
      v-else
      class="flex-1 flex flex-col"
    >
      <main class="flex-1 focus:outline-none">
        <div class="relative mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-0">
          <div class="py-8">
            <div class="px-4 sm:px-6 md:px-0 space-y-6">
              <!-- Description list with inline editing -->
              <div class="rounded-xl border border-slate-200 bg-white shadow-card p-6 divide-y divide-slate-200">
                <!-- Header section -->
                <div class="space-y-1">
                  <h3 class="text-lg leading-6 font-semibold text-slate-900">
                    Profil
                  </h3>
                  <p class="max-w-2xl text-sm text-secondaryText">
                    Informationen über persönliche Daten des Nutzers.
                  </p>
                </div>
                <!-- Data section -->
                <div class="mt-6">
                  <!-- Data section for users -->
                  <user-detail-data-info
                    :user="user"
                    :userObject="userObject"
                    :isLoading="propertyIsLoading"
                    @change-submit="changeSubmitted"
                    @change-profession="updateUserObject"
                  />
                </div>
              </div>
              <!-- children list -->
              <div
                v-if="user.Group.GroupName === 'Guardian'"
                class="mt-6"
              >
                <GuardianDetailChildrenList
                  @child-selected="addChild"
                  @remove-child="removeChild"
                  :children="children"
                />
              </div>
              <!-- Account Information section -->
              <div class="rounded-xl border border-slate-200 bg-white shadow-card p-6 divide-y divide-slate-200">
                <user-detail-account-info
                  :user="user"
                  :deleteIsLoading="deleteIsLoading"
                  :userStateIsLoading="userStateIsLoading"
                  @active-button-toggled="activeButtonToggled"
                  @delete-user-tapped="deleteUserTapped"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
// Component imports
import UserDetailDataInfo from '@/components/Main/Admin/User/UserDetailDataInfo.vue'
import UserDetailAccountInfo from '@/components/Main/Admin/User/UserDetailAccountInfo.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import GuardianDetailChildrenList from '@/components/Main/Admin/Guardian/GuardianDetailChildrenList.vue'
// Utility imports
import {
  createErrorMessage,
  createErrorTitle
} from '@/utilities/auth/errorCreator.js'

export default {
  components: {
    UserDetailDataInfo,
    UserDetailAccountInfo,
    CriticalAction,
    LoadingSpinner,
    SuccessWindow,
    ErrorWindow,
    GuardianDetailChildrenList
  },
  props: ['id'],
  setup() {
    // Initialize Refs
    const user = ref(null)
    const userObject = ref(null)
    const isLoading = ref(true)
    const userStateIsLoading = ref(false)
    const deleteIsLoading = ref(false)
    const deleteSelected = ref(false)
    const children = ref([])
    // Initialize Reactives
    const customError = reactive({
      isPresent: false,
      title: '',
      message: ''
    })
    const customSuccess = reactive({
      isPresent: false,
      title: '',
      message: ''
    })
    const propertyIsLoading = reactive({
      property: '',
      isLoading: false
    })
    // Initialize Route & Router
    const route = useRoute()
    const router = useRouter()
    // Initialze Store
    const store = useStore()

    // Mounted Hook
    onMounted(() => {
      // Get the id from the route
      const id = route.params.id
      // Fetch the user details from cognito
      fetchUserDetails(id)
    })

    // Fetch the user details from cognito
    async function fetchUserDetails(id) {
      try {
        isLoading.value = true
        // The sub for the user is the id
        const sub = id

        const [userResponse, guardianResponse, userGroup] = await Promise.all([
          store.dispatch('fetchUserDetails', { sub }),
          store.dispatch('fetchGuardianDetailsMini', { sub }),
          fetchUserGroup(sub)
        ])


        user.value = userResponse
        userObject.value = guardianResponse
        user.value.Group = userGroup
        if (user.value.Group.GroupName === 'Guardian') {
          children.value = guardianResponse.careAssignments.items
        }
      } catch (err) {
        // Log the error
        console.log(err)
        const errorLog = err.response.data.message
        customError.isPresent = true
        customError.title = createErrorTitle(errorLog)
        customError.message = createErrorMessage(errorLog)
      } finally {
        // reset isloading
        isLoading.value = false
      }
    }

    async function addChild(child) {
      try {
        // check if child is already connected to guardian
        const careIndex = children.value.findIndex((assignement) => assignement.child.id === child.id)
        // create care assignment object if no connection was found
        if (careIndex < 0) {
          // create care assignment via store
          const careResponse = await store.dispatch('createCareAssignment', {
            childID: child.id, guardianID: user.value.Username,
          })
          // add assignment to children array
          children.value.push(careResponse.data.createCareAssignment)
        }
      } catch (err) {
        // Log the error
        console.log(err)
      }
    }

    async function removeChild(careAssignment) {
      try {
        // delete care assignment via store
        await store.dispatch('deleteCareAssignment', {
          id: careAssignment.id
        })
        // get index of deleted object in user object
        const carIndex = children.value.findIndex((childAttr) => {
          return childAttr.id === careAssignment.id
        })
        // delete child from object array
        delete children.value.splice(carIndex, 1)
      } catch (err) {
        console.log(err)
      }
    }

    // Fetch the user group for the user
    async function fetchUserGroup(username) {
      try {
        // We retrieve an array of groups for the user
        const groups = await store.dispatch('fetchUserGroup', { username })
        // Because we only set one group per user the target group is always at the first place
        const userGroup = groups.Groups[0]
        // Set the group to the user object
        return userGroup
      } catch (err) {
        // Log the error
        console.log(err.response.data.message)
      }
    }

    // Admin tapped the delete user button
    function deleteUserTapped() {
      // Set the selected value to true to trigger the modal
      deleteSelected.value = true
    }

    // This method gets called, when the admin confirmed the deletion of the selected user
    async function confirmedDelete() {
      deleteSelected.value = false
      deleteIsLoading.value = true
      try {
        await store.dispatch('deleteUser', { username: user.value.Username })
        deleteIsLoading.value = false
        // Show success window when user was successfully removed
        customSuccess.isPresent = true
        customSuccess.title = 'Erfolgreich gelöscht'
        customSuccess.message = 'Sie haben den Nutzer erfolgreich gelöscht!'
      } catch (err) {
        console.log(err)
        // Show error window when user couldn't be removed
        customError.isPresent = true
        customError.title = createErrorTitle(err)
        customError.message = createErrorMessage(err)
        deleteIsLoading.value = false
        deleteSelected.value = false
      }
    }

    // Admin confirmed a success modal
    function customSuccessConfirmed() {
      router.push({ name: 'UserOverview' })
    }

    // Admin confirmed a error modal
    function customErrorConfirmed() {
      router.push({ name: 'UserOverview' })
    }

    // The button to enable oder disable the user toggled
    function activeButtonToggled(value) {
      // Check the value and enable or disable the user based on this state
      value ? enableUser() : disableUser()
    }

    // Disable the user
    async function disableUser() {
      userStateIsLoading.value = true
      try {
        await store.dispatch('disableUser', { username: user.value.Username })
        user.value.Enabled = false
      } catch (err) {
        // Log the error
        console.log(err)
      } finally {
        userStateIsLoading.value = false
      }
    }

    // Enable the user
    async function enableUser() {
      userStateIsLoading.value = true
      try {
        await store.dispatch('enableUser', { username: user.value.Username })
        user.value.Enabled = true
      } catch (err) {
        // Log the error
        console.log(err)
      } finally {
        userStateIsLoading.value = false
      }
    }

    // Gets called, whenever an user attribute is changed by the admin
    function changeSubmitted(changeObject) {
      updateUser(changeObject)
    }

    // Update the users attributes
    async function updateUser(changeObject) {
      // Set the target object to flag his loading
      propertyIsLoading.property = Object.keys(changeObject)[0]
      propertyIsLoading.isLoading = true
      try {
        // Update the user
        await store.dispatch('updateUser', {
          user: user.value,
          changeObject
        })
        // Check which object we are targeting, check also custom attributes
        updateUIValues(changeObject)
      } catch (err) {
        // Log the error
        console.log(err.response.data.message)
      } finally {
        // Reset the target object loading flag
        propertyIsLoading.property = ''
        propertyIsLoading.isLoading = false
      }
    }

    // Update user appsync attributes
    async function updateUserObject(changeObject) {
      // Set the target object to flag his loading
      propertyIsLoading.property = Object.keys(changeObject)[0]
      propertyIsLoading.isLoading = true
      try {
        // Update the carrier
        await store.dispatch('updateGuardian', {
          guardian: userObject.value,
          changeObject
        })
      } catch (err) {
        // Log the error
        console.log(err.response.data.message)
      } finally {
        // Reset the target object loading flag
        userObject.value[propertyIsLoading.property] = Object.values(changeObject)[0]
        propertyIsLoading.property = ''
        propertyIsLoading.isLoading = false
      }
    }

    // Function to update the local label values after updating the backend values
    function updateUIValues(changeObject) {
      let attributeFound = false

      // since family name in cognito and appSync are written differently we need to
      // find the index if family name or phone was changed
      if (Object.keys(changeObject)[0] === 'familyName') {
        // check for family name
        const familyNameIndex = user.value.UserAttributes.findIndex(
          (userAttr) => userAttr.Name === 'family_name'
        )
        user.value.UserAttributes[familyNameIndex].Value =
          changeObject['familyName']
        return
      } else if (Object.keys(changeObject)[0] === 'phone') {
        // check for phone
        const familyNameIndex = user.value.UserAttributes.findIndex(
          (userAttr) => userAttr.Name === 'phone_number'
        )
        user.value.UserAttributes[familyNameIndex].Value = changeObject['phone']
        return
      } else {
        // check for any other value
        for (var i in user.value.UserAttributes) {
          if (
            user.value.UserAttributes[i].Name ===
            Object.keys(changeObject)[0] ||
            user.value.UserAttributes[i].Name ===
            `custom:${Object.keys(changeObject)[0]}`
          ) {
            // If the attribute was found, set our new value to update the view
            user.value.UserAttributes[i].Value =
              changeObject[Object.keys(changeObject)[0]]
            // Break the loop because we are finish
            attributeFound = true
            break
          }
        }
        // If the attribute is not present, it was newly added, so add it to the object too
        if (!attributeFound) {
          user.value.UserAttributes.push({
            Name: Object.keys(changeObject)[0],
            Value: changeObject[Object.keys(changeObject)[0]]
          })
        }
      }
    }

    // Return the setup object
    return {
      isLoading,
      userStateIsLoading,
      deleteIsLoading,
      propertyIsLoading,
      user,
      userObject,
      deleteSelected,
      customError,
      customSuccess,
      children,
      customSuccessConfirmed,
      customErrorConfirmed,
      deleteUserTapped,
      confirmedDelete,
      activeButtonToggled,
      changeSubmitted,
      updateUserObject,
      addChild,
      removeChild
    }
  }
}
</script>
