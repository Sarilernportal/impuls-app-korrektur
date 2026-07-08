// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'

describe('EmailTextfield – verknüpft Eingabe mit Validierung', () => {
  const props = { elementID: 'email', name: 'email', placeholder: 'E-Mail' }

  it('meldet eine gültige E-Mail als gültig', async () => {
    const wrapper = mount(EmailTextfield, { props })
    const input = wrapper.get('input')
    await input.setValue('a.b@impuls-erziehungshilfen.de')
    await input.trigger('blur')
    const events = wrapper.emitted('is-valid')
    expect(events).toBeTruthy()
    expect(events[events.length - 1][0]).toBe(true)
  })

  it('meldet eine fehlerhafte E-Mail als ungültig', async () => {
    const wrapper = mount(EmailTextfield, { props })
    const input = wrapper.get('input')
    // erst gültig (Status true), dann ungültig -> Übergang auf false prüfen
    await input.setValue('a.b@impuls-erziehungshilfen.de')
    await input.trigger('blur')
    await input.setValue('keine-email')
    await input.trigger('blur')
    const events = wrapper.emitted('is-valid')
    expect(events[events.length - 1][0]).toBe(false)
  })
})

describe('StandardButton – Aktivierung & Klick', () => {
  const base = { title: 'Speichern', isLoading: false }

  it('ist deaktiviert, wenn enabled = false', () => {
    const wrapper = mount(StandardButton, { props: { ...base, enabled: false } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('löst button-tapped aus, wenn aktiviert und geklickt', async () => {
    const wrapper = mount(StandardButton, { props: { ...base, enabled: true } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('button-tapped')).toBeTruthy()
  })
})
