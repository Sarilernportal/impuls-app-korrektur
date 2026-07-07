import { Auth } from 'aws-amplify'
import awsExports from '@/aws-exports.js'

const LOCAL_USER_KEY = 'impuls-local-user'

const hasAwsConfig = Boolean(
  awsExports.aws_user_pools_id &&
  awsExports.aws_user_pools_web_client_id &&
  awsExports.aws_project_region
)

const localAuthRequested =
  import.meta.env.VITE_USE_LOCAL_AUTH === 'true' ||
  awsExports.localOnly ||
  !hasAwsConfig

const localAuthAllowed =
  import.meta.env.DEV ||
  import.meta.env.VITE_ALLOW_LOCAL_AUTH === 'true'

export const isLocalAuthMode = localAuthRequested && localAuthAllowed
export const localAuthBlocked = localAuthRequested && !localAuthAllowed

function assertLocalAuthNotBlocked() {
  if (localAuthBlocked) {
    throw new Error(
      'Lokaler Demo-Login ist in produktiven Builds gesperrt. Bitte echte AWS/Cognito-Konfiguration verwenden.'
    )
  }
}

function createSessionUser(email, group = 'Admin') {
  return {
    username: email,
    user: {
      username: email
    },
    attributes: {
      email,
      phone_number: ''
    },
    signInUserSession: {
      accessToken: {
        payload: {
          'cognito:groups': [group]
        }
      }
    }
  }
}

function readLocalUser() {
  const savedUser = sessionStorage.getItem(LOCAL_USER_KEY)
  if (savedUser) {
    return JSON.parse(savedUser)
  }

  throw new Error('No local demo user signed in')
}

export async function signIn(email, password) {
  assertLocalAuthNotBlocked()

  if (!isLocalAuthMode) {
    return Auth.signIn(email, password)
  }

  if (!email || !password) {
    const error = new Error('Bitte E-Mail-Adresse und Passwort eingeben.')
    error.name = 'NotAuthorizedException'
    throw error
  }

  // Demo-Rolle aus der E-Mail ableiten: mitarbeiter@… -> Mitarbeiter-Sicht,
  // alles andere -> Admin (wie bisher).
  const group = /mitarbeiter|guardian/i.test(email) ? 'Guardian' : 'Admin'
  const user = createSessionUser(email, group)
  sessionStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user))
  return user
}

export async function signOut() {
  assertLocalAuthNotBlocked()

  if (!isLocalAuthMode) {
    return Auth.signOut()
  }

  sessionStorage.removeItem(LOCAL_USER_KEY)
}

export async function currentAuthenticatedUser() {
  assertLocalAuthNotBlocked()

  if (!isLocalAuthMode) {
    return Auth.currentAuthenticatedUser()
  }

  return readLocalUser()
}

export async function currentSession() {
  assertLocalAuthNotBlocked()

  if (!isLocalAuthMode) {
    return Auth.currentSession()
  }

  return {
    getAccessToken() {
      return {
        getJwtToken() {
          return 'local-demo-token'
        }
      }
    }
  }
}
