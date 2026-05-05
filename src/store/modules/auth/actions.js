/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022
Scope:
Store - Auth - Actions
*/

import { Auth } from 'aws-amplify'
import {
  currentAuthenticatedUser,
  signIn,
  signOut
} from '@/services/authService.js'

export default {
  // Method for set the user
  async setUser(ctx, payload) {
    ctx.commit('setUser', payload)
  },
  // Method for set the username
  async setUsername(ctx, payload) {
    ctx.commit('setUsername', payload)
  },
  // Method for signing in an existing user
  async signIn(ctx, payload) {
    const user = await signIn(payload.email, payload.password)
    ctx.dispatch('setUser', { user })
  },
  // Method for signing out an existing user
  async signOut(ctx) {
    await signOut()
    ctx.commit('setUser', {})
  },
  // Method for getting the users auth state
  async currentAuthenticatedUser() {
    await currentAuthenticatedUser()
  },

  // Method for setting a new password on first login, returns user object
  async completeNewPassword(_, payload) {
    const user = payload.user
    const newPassword = payload.newPassword
    // no email required: https://stackoverflow.com/questions/71667989/aws-cognito-respond-to-new-password-required-challenge-returns-cannot-modify-an
    // user object required: https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#complete-new-password
    await Auth.completeNewPassword(user, newPassword)
  },

  // Method to change the users password
  async changePassword(_, payload) {
    const user = payload.user
    const oldPassword = payload.oldPassword
    const newPassword = payload.newPassword
    await Auth.changePassword(user, oldPassword, newPassword)
  },

  // Method to forgot password from a user
  async forgotPassword(_, payload) {
    const username = payload.username
    await Auth.forgotPassword(username)
  },

  // Method to confirm password reset
  async forgotPasswordConfirm(_, payload) {
    const username = payload.username
    const code = payload.code
    const password = payload.password
    await Auth.forgotPasswordSubmit(username, code, password)
  }
}
