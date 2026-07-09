<!--
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Betreuer-/Mitarbeiter-Detailseite (/admin/user/{id})

Übersicht: Status-Kopf, Bearbeiten-Modus (ein „Bearbeiten" → alle Felder, dann
Speichern/Abbrechen) statt vieler Einzel-Buttons, Karten-Gliederung,
§ 72a-Führungszeugnis-Karte und Klienten-Tabelle (n:m / Pooling).

Speicherweg unverändert: bestehende Felder werden über updateUser (Cognito)
bzw. updateGuardian (AppSync) gespeichert – je Feld ein change-Dispatch wie
bisher. Neue Felder (Funktion, Vergütung, Anstellung, Eintritt, Führungszeugnis)
werden frontend-first angezeigt/erfasst und nach Schema-Erweiterung angebunden.
-->

<template>
  <critical-action :open="deleteSelected" title="Nutzer löschen"
    message="Möchten Sie den Nutzer wirklich löschen? Dieser Vorgang ist nicht mehr umzukehren."
    buttonCancelTitle="Abbrechen" buttonConfirmTitle="Nutzer löschen"
    @close="deleteSelected = false" @confirmed="confirmedDelete" />
  <critical-action :open="childRemoveSelected !== null" title="Zuordnung entfernen"
    message="Möchten Sie die Zuordnung dieses Klienten wirklich entfernen?"
    buttonCancelTitle="Abbrechen" buttonConfirmTitle="Entfernen"
    @close="childRemoveSelected = null" @confirmed="confirmRemoveChild" />
  <error-window v-if="customError.isPresent" :title="customError.title" :message="customError.message"
    :open="customError.isPresent" @close="customErrorConfirmed" />
  <success-window v-if="customSuccess.isPresent" :title="customSuccess.title" :message="customSuccess.message"
    :open="customSuccess.isPresent" @close="customSuccessConfirmed" />

  <div class="min-h-screen bg-app-bg">
    <div v-if="isLoading" class="flex h-screen w-full items-center justify-center">
      <loading-spinner size="h-16 w-16" />
    </div>

    <div v-else class="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <!-- Status-Kopf -->
      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <button
              type="button"
              @click="goBack"
              title="Zurück zur Übersicht"
              class="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              <ArrowLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <InitialsAvatar :name="fullName" size-class="h-14 w-14 text-lg" />
            <div>
              <h1 class="font-display text-2xl font-black tracking-tight text-slate-900">{{ fullName || 'Nicht angegeben' }}</h1>
              <div class="mt-1.5 flex flex-wrap items-center gap-2">
                <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600']">
                  <span :class="['h-1.5 w-1.5 rounded-full', isActive ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                  {{ isActive ? 'Aktiv' : 'Inaktiv' }}
                </span>
                <span v-if="isGuardian" class="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {{ form.professional ? 'Fachkraft' : 'Nicht-Fachkraft' }}
                </span>
                <span v-if="isGuardian && displayJobFunction" class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {{ displayJobFunction }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <template v-if="!editing">
              <button class="btn-primary" @click="startEdit">
                <PencilSquareIcon class="h-4 w-4" aria-hidden="true" /> Bearbeiten
              </button>
            </template>
            <template v-else>
              <button class="btn-secondary" :disabled="savingEdit" @click="cancelEdit">Abbrechen</button>
              <button class="btn-primary" :disabled="savingEdit" @click="saveEdit">
                <CheckIcon class="h-4 w-4" aria-hidden="true" /> {{ savingEdit ? 'Speichern…' : 'Speichern' }}
              </button>
            </template>
          </div>
        </div>
      </section>

      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <!-- Stammdaten -->
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 class="font-display text-lg font-bold text-slate-900">Stammdaten</h3>
          <dl class="mt-4 space-y-3">
            <field label="Vorname">
              <input v-if="editing" v-model="form.name" class="input-base" />
              <span v-else>{{ displayName }}</span>
            </field>
            <field label="Nachname">
              <input v-if="editing" v-model="form.familyName" class="input-base" />
              <span v-else>{{ displayFamilyName }}</span>
            </field>
            <field v-if="isGuardian" label="Geschlecht">
              <select v-if="editing" v-model="form.gender" class="input-base">
                <option value="">Nicht angegeben</option>
                <option value="Male">Männlich</option>
                <option value="Female">Weiblich</option>
              </select>
              <span v-else>{{ displayGender }}</span>
            </field>
            <field label="E-Mail-Adresse">
              <input v-if="editing" v-model="form.email" class="input-base" />
              <span v-else>{{ displayEmail }}</span>
            </field>
            <field label="Telefonnummer">
              <input v-if="editing" v-model="form.phone" class="input-base" />
              <span v-else>{{ displayPhone || 'Nicht angegeben' }}</span>
            </field>
          </dl>
        </section>

        <!-- Funktion & Qualifikation -->
        <section v-if="isGuardian" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 class="font-display text-lg font-bold text-slate-900">Funktion &amp; Qualifikation</h3>
          <dl class="mt-4 space-y-3">
            <field label="Funktion / Tätigkeit">
              <select v-if="editing" v-model="form.jobFunction" class="input-base">
                <option value="">Bitte wählen</option>
                <option>Schulbegleiter:in (THA-Kraft)</option>
                <option>Pädagogische Fachkraft</option>
                <option>Vertretung / Springer:in</option>
              </select>
              <span v-else>{{ displayJobFunction || 'Nicht angegeben' }}</span>
            </field>
            <field label="Fachkraftstatus">
              <select v-if="editing" v-model="form.professional" class="input-base">
                <option :value="true">Fachkraft</option>
                <option :value="false">Nicht-Fachkraft</option>
              </select>
              <span v-else>{{ form.professional ? 'Fachkraft' : 'Nicht-Fachkraft' }}</span>
            </field>
            <field label="Qualifikation">
              <input v-if="editing" v-model="form.qualification" class="input-base" />
              <span v-else>{{ displayQualification || 'Nicht angegeben' }}</span>
            </field>
            <field label="Vergütung / Stundensatz">
              <input v-if="editing" type="number" min="0" step="0.01" v-model.number="form.hourlyRate" class="input-base" />
              <span v-else>{{ form.hourlyRate ? form.hourlyRate + ' €/Std' : 'Nicht angegeben' }}</span>
            </field>
            <field label="Anstellungsart">
              <select v-if="editing" v-model="form.employmentType" class="input-base">
                <option>Festanstellung</option>
                <option>Honorarkraft</option>
                <option>Minijob</option>
              </select>
              <span v-else>{{ form.employmentType || 'Nicht angegeben' }}</span>
            </field>
            <field label="Eintrittsdatum">
              <input v-if="editing" type="date" v-model="form.startDate" class="input-base" />
              <span v-else>{{ form.startDate || 'Nicht angegeben' }}</span>
            </field>
          </dl>
        </section>

        <!-- Führungszeugnis (§ 72a) -->
        <section v-if="isGuardian" :class="['rounded-2xl border p-6 shadow-card lg:col-span-2', certificateBox.boxClass]">
          <div class="flex items-center gap-2">
            <ShieldCheckIcon class="h-5 w-5 flex-shrink-0" :class="certificateBox.iconClass" aria-hidden="true" />
            <h3 class="font-display text-lg font-bold text-slate-900">Erweitertes Führungszeugnis (§ 72a SGB VIII)</h3>
            <span :class="['ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold', certificateBox.badgeClass]">
              {{ certificateBox.label }}
            </span>
          </div>
          <dl class="mt-4 grid gap-3 sm:grid-cols-3">
            <field label="Vorgelegt">
              <label v-if="editing" class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="form.certificateSubmitted" class="h-4 w-4 rounded border-slate-300 text-impuls-blue focus:ring-2 focus:ring-brand-200" />
                vorgelegt
              </label>
              <span v-else>{{ form.certificateSubmitted ? 'Ja' : 'Nein' }}</span>
            </field>
            <field label="Vorgelegt am">
              <input v-if="editing" type="date" v-model="form.certificateSubmittedDate" class="input-base" />
              <span v-else>{{ form.certificateSubmittedDate || '–' }}</span>
            </field>
            <field label="Wiedervorlage am">
              <input v-if="editing" type="date" v-model="form.certificateRenewalDate" class="input-base" />
              <span v-else>{{ form.certificateRenewalDate || '–' }}</span>
            </field>
          </dl>
        </section>

        <!-- Zuständige Klienten -->
        <section v-if="isGuardian" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-display text-lg font-bold text-slate-900">Zuständige Klienten</h3>
              <p class="mt-0.5 text-sm text-slate-500">Pooling: eine Fachkraft kann mehrere Klienten betreuen.</p>
            </div>
          </div>
          <div v-if="clientRows.length === 0" class="mt-4 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
            Noch keine Klienten zugeordnet.
          </div>
          <div v-else class="mt-4 overflow-x-auto">
            <table class="w-full min-w-[640px] text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  <th class="px-3 py-2">Klient</th>
                  <th class="px-3 py-2">Schule</th>
                  <th class="px-3 py-2 text-right">Wochenstunden</th>
                  <th class="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="row in clientRows" :key="row.assignmentId">
                  <td class="px-3 py-3">
                    <div class="flex items-center gap-2">
                      <InitialsAvatar :name="row.name" size-class="h-8 w-8 text-xs" />
                      <span class="font-medium text-slate-900">{{ row.name }}</span>
                    </div>
                  </td>
                  <td class="px-3 py-3 text-slate-600">{{ row.school || '–' }}</td>
                  <td class="px-3 py-3 text-right tabular-nums text-slate-700">{{ row.weeklyHours != null ? row.weeklyHours : '–' }}</td>
                  <td class="px-3 py-3">
                    <div class="flex items-center justify-end gap-1">
                      <button v-if="row.childId" class="rounded-lg px-2.5 py-1 text-xs font-semibold text-impuls-blue hover:bg-blue-50" @click="openChild(row.childId)">
                        Fallakte
                      </button>
                      <button class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600" @click="childRemoveSelected = row.assignment">
                        <XMarkIcon class="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Account -->
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
          <user-detail-account-info
            :user="user"
            :deleteIsLoading="deleteIsLoading"
            :userStateIsLoading="userStateIsLoading"
            @active-button-toggled="activeButtonToggled"
            @delete-user-tapped="deleteUserTapped"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import UserDetailAccountInfo from '@/components/Main/Admin/User/UserDetailAccountInfo.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'
import {
  PencilSquareIcon, CheckIcon, XMarkIcon, ShieldCheckIcon, ArrowLeftIcon
} from '@heroicons/vue/24/outline'
import { createErrorMessage, createErrorTitle } from '@/utilities/auth/errorCreator.js'

// Kleine Feld-Zeile (Label + Wert/Eingabe) als Render-Funktion, um das Template
// schlank zu halten.
const Field = {
  name: 'Field',
  props: { label: { type: String, required: true } },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4' }, [
        h('dt', { class: 'text-sm text-slate-500 sm:w-44 sm:flex-shrink-0' }, props.label),
        h('dd', { class: 'text-sm font-medium text-slate-900 sm:flex-1' }, slots.default ? slots.default() : [])
      ])
  }
}

export default {
  components: {
    UserDetailAccountInfo, CriticalAction, LoadingSpinner, SuccessWindow, ErrorWindow,
    InitialsAvatar, Field,
    PencilSquareIcon, CheckIcon, XMarkIcon, ShieldCheckIcon, ArrowLeftIcon
  },
  props: ['id'],
  setup() {
    const user = ref(null)
    const userObject = ref(null)
    const isLoading = ref(true)
    const userStateIsLoading = ref(false)
    const deleteIsLoading = ref(false)
    const deleteSelected = ref(false)
    const childRemoveSelected = ref(null)
    const children = ref([])
    const editing = ref(false)
    const savingEdit = ref(false)

    const customError = reactive({ isPresent: false, title: '', message: '' })
    const customSuccess = reactive({ isPresent: false, title: '', message: '' })

    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    // Editier-Formular (wird beim Bearbeiten aus user/userObject befüllt)
    const form = reactive({
      name: '', familyName: '', email: '', phone: '',
      gender: '', professional: false, qualification: '',
      jobFunction: '', hourlyRate: null, employmentType: '', startDate: '',
      certificateSubmitted: false, certificateSubmittedDate: '', certificateRenewalDate: ''
    })
    let original = {}

    onMounted(() => fetchUserDetails(route.params.id))

    // ── Anzeige-Helfer ──
    const userAttributes = computed(() => user.value?.UserAttributes || user.value?.Attributes || [])
    function attr(names) {
      return userAttributes.value.find((a) => names.includes(a.Name))?.Value || ''
    }
    const isGuardian = computed(() => user.value?.Group?.GroupName === 'Guardian')
    const isActive = computed(() => user.value?.Enabled !== false)
    const displayName = computed(() => attr(['given_name', 'name']) || 'Nicht angegeben')
    const displayFamilyName = computed(() => attr(['family_name']) || 'Nicht angegeben')
    const displayEmail = computed(() => attr(['email']) || 'Nicht angegeben')
    const displayPhone = computed(() => attr(['phone_number']))
    const fullName = computed(() => [attr(['given_name', 'name']), attr(['family_name'])].filter(Boolean).join(' '))
    const displayGender = computed(() => {
      const g = userObject.value?.gender
      return g === 'Male' ? 'Männlich' : g === 'Female' ? 'Weiblich' : 'Nicht angegeben'
    })
    const displayQualification = computed(() => userObject.value?.qualification || '')
    const displayJobFunction = computed(() => userObject.value?.jobFunction || form.jobFunction || '')

    // --- Profil-Header (Anzeige) ---
    const statusLabel = computed(() => (isActive.value ? 'Aktiv' : 'Inaktiv'))
    const statusClass = computed(() =>
      isActive.value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
    )
    const chips = computed(() => {
      const list = []
      const email = attr(['email'])
      if (email) list.push(email)
      if (isGuardian.value) list.push(userObject.value?.professional ? 'Fachkraft' : 'Nicht-Fachkraft')
      if (displayJobFunction.value) list.push(displayJobFunction.value)
      const phone = attr(['phone_number'])
      if (phone) list.push(phone)
      return list
    })
    function goBack() {
      router.push({ name: 'UserOverview' })
    }

    // § 72a-Status mit Warnfarben
    const certificateBox = computed(() => {
      const submitted = userObject.value?.certificateSubmitted || form.certificateSubmitted
      const renewal = userObject.value?.certificateRenewalDate || form.certificateRenewalDate
      if (!submitted) {
        return {
          label: 'Einsatz gesperrt', boxClass: 'border-red-200 bg-red-50',
          iconClass: 'text-red-600', badgeClass: 'bg-red-100 text-red-700'
        }
      }
      if (renewal) {
        const days = Math.ceil((new Date(renewal) - new Date()) / 86400000)
        if (days < 0) {
          return {
            label: 'Wiedervorlage überfällig', boxClass: 'border-red-200 bg-red-50',
            iconClass: 'text-red-600', badgeClass: 'bg-red-100 text-red-700'
          }
        }
        if (days <= 90) {
          return {
            label: 'Wiedervorlage bald fällig', boxClass: 'border-amber-200 bg-amber-50',
            iconClass: 'text-amber-600', badgeClass: 'bg-amber-100 text-amber-700'
          }
        }
      }
      return {
        label: 'Gültig', boxClass: 'border-emerald-200 bg-emerald-50',
        iconClass: 'text-emerald-600', badgeClass: 'bg-emerald-100 text-emerald-700'
      }
    })

    // Klienten-Tabelle (n:m / Pooling)
    const clientRows = computed(() =>
      (children.value || []).map((assignment) => {
        const child = assignment.child || {}
        return {
          assignmentId: assignment.id,
          assignment,
          childId: child.id,
          name: [child.name, child.familyName].filter(Boolean).join(' ') || 'Nicht angegeben',
          school: child.school,
          weeklyHours: child.weeklyHours
        }
      })
    )

    function openChild(childId) {
      router.push({ name: 'ChildDetails', params: { id: childId } })
    }

    // ── Bearbeiten-Modus ──
    function startEdit() {
      form.name = attr(['given_name', 'name'])
      form.familyName = attr(['family_name'])
      form.email = attr(['email'])
      form.phone = attr(['phone_number'])
      form.gender = userObject.value?.gender || ''
      form.professional = userObject.value?.professional === true
      form.qualification = userObject.value?.qualification || ''
      form.jobFunction = userObject.value?.jobFunction || ''
      form.hourlyRate = userObject.value?.hourlyRate ?? null
      form.employmentType = userObject.value?.employmentType || ''
      form.startDate = userObject.value?.startDate || ''
      form.certificateSubmitted = userObject.value?.certificateSubmitted || false
      form.certificateSubmittedDate = userObject.value?.certificateSubmittedDate || ''
      form.certificateRenewalDate = userObject.value?.certificateRenewalDate || ''
      original = { ...form }
      editing.value = true
    }

    function cancelEdit() {
      editing.value = false
    }

    // Speichert nur die bereits unterstützten Felder über die bestehenden
    // Dispatch-Pfade (Cognito + Guardian). Neue Felder folgen mit dem Backend.
    async function saveEdit() {
      savingEdit.value = true
      try {
        const cognitoKeys = ['name', 'familyName', 'email', 'phone']
        for (const key of cognitoKeys) {
          if (form[key] !== original[key]) {
            await updateUser({ [key]: form[key] })
          }
        }
        const guardianChanges = {}
        if (form.gender !== original.gender) guardianChanges.gender = form.gender
        if (form.professional !== original.professional) guardianChanges.professional = form.professional
        if (form.qualification !== original.qualification) guardianChanges.qualification = form.qualification
        for (const [key, value] of Object.entries(guardianChanges)) {
          await updateGuardian({ [key]: value })
        }
        editing.value = false
      } catch (err) {
        console.log(err)
        customError.isPresent = true
        customError.title = createErrorTitle(err)
        customError.message = createErrorMessage(err)
      } finally {
        savingEdit.value = false
      }
    }

    // ── Bestehende Datenflüsse (unverändert) ──
    async function fetchUserDetails(id) {
      try {
        isLoading.value = true
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
        console.log(err)
        const errorLog = err.response?.data?.message || err.message
        customError.isPresent = true
        customError.title = createErrorTitle(errorLog)
        customError.message = createErrorMessage(errorLog)
      } finally {
        isLoading.value = false
      }
    }

    async function fetchUserGroup(username) {
      try {
        const groups = await store.dispatch('fetchUserGroup', { username })
        return groups.Groups[0]
      } catch (err) {
        console.log(err.response?.data?.message || err.message)
      }
    }

    function confirmRemoveChild() {
      const assignment = childRemoveSelected.value
      childRemoveSelected.value = null
      if (assignment) removeChild(assignment)
    }

    async function removeChild(careAssignment) {
      try {
        await store.dispatch('deleteCareAssignment', { id: careAssignment.id })
        const idx = children.value.findIndex((c) => c.id === careAssignment.id)
        if (idx >= 0) children.value.splice(idx, 1)
      } catch (err) {
        console.log(err)
      }
    }

    function deleteUserTapped() {
      deleteSelected.value = true
    }

    async function confirmedDelete() {
      deleteSelected.value = false
      deleteIsLoading.value = true
      try {
        await store.dispatch('deleteUser', { username: user.value.Username })
        deleteIsLoading.value = false
        customSuccess.isPresent = true
        customSuccess.title = 'Erfolgreich gelöscht'
        customSuccess.message = 'Sie haben den Nutzer erfolgreich gelöscht!'
      } catch (err) {
        console.log(err)
        customError.isPresent = true
        customError.title = createErrorTitle(err)
        customError.message = createErrorMessage(err)
        deleteIsLoading.value = false
        deleteSelected.value = false
      }
    }

    function customSuccessConfirmed() {
      router.push({ name: 'UserOverview' })
    }
    function customErrorConfirmed() {
      customError.isPresent = false
    }

    function activeButtonToggled(value) {
      value ? enableUser() : disableUser()
    }
    async function disableUser() {
      userStateIsLoading.value = true
      try {
        await store.dispatch('disableUser', { username: user.value.Username })
        user.value.Enabled = false
      } catch (err) {
        console.log(err)
      } finally {
        userStateIsLoading.value = false
      }
    }
    async function enableUser() {
      userStateIsLoading.value = true
      try {
        await store.dispatch('enableUser', { username: user.value.Username })
        user.value.Enabled = true
      } catch (err) {
        console.log(err)
      } finally {
        userStateIsLoading.value = false
      }
    }

    async function updateUser(changeObject) {
      try {
        await store.dispatch('updateUser', { user: user.value, changeObject })
        updateUIValues(changeObject)
      } catch (err) {
        console.log(err.response?.data?.message || err.message)
        throw err
      }
    }

    async function updateGuardian(changeObject) {
      try {
        await store.dispatch('updateGuardian', { guardian: userObject.value, changeObject })
        userObject.value[Object.keys(changeObject)[0]] = Object.values(changeObject)[0]
      } catch (err) {
        console.log(err.response?.data?.message || err.message)
        throw err
      }
    }

    function updateUIValues(changeObject) {
      const key = Object.keys(changeObject)[0]
      const value = changeObject[key]
      const map = { familyName: 'family_name', phone: 'phone_number', name: 'given_name', email: 'email' }
      const attrName = map[key] || key
      const list = user.value.UserAttributes
      const idx = list.findIndex((a) => a.Name === attrName || a.Name === `custom:${key}`)
      if (idx >= 0) list[idx].Value = value
      else list.push({ Name: attrName, Value: value })
    }

    return {
      user, userObject, isLoading, userStateIsLoading, deleteIsLoading, deleteSelected,
      childRemoveSelected, children, editing, savingEdit, form,
      customError, customSuccess,
      isGuardian, isActive, fullName, chips, statusLabel, statusClass, goBack,
      displayName, displayFamilyName, displayEmail, displayPhone, displayGender,
      displayQualification, displayJobFunction, certificateBox, clientRows,
      startEdit, cancelEdit, saveEdit, openChild,
      confirmRemoveChild, deleteUserTapped, confirmedDelete,
      customSuccessConfirmed, customErrorConfirmed, activeButtonToggled
    }
  }
}
</script>
