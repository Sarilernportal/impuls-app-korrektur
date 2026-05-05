/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Error creator for authentication actions
*/

// Create an readable error title for the user
export function createErrorTitle(error) {
  if (error.code === 'UsernameExistsException') {
    return 'Nutzername existiert'
  } else if (error.code === 'UserNotFoundException') {
    return 'Nutzer existiert nicht'
  } else if (error.code === 'NotAuthorizedException') {
    return 'Eingabe fehlerhaft'
  } else if (error.code === 'CodeMismatchException') {
    return 'Falscher Code'
  } else if (error.code === 'InvalidParameterException') {
    return 'Nicht verifiziert'
  } else if (error.code === 'LimitExceededException') {
    return 'Limit erreicht'
  } else if (error.code === 'NetworkError') {
    return 'Keine Internetverbindung'
  }
  return 'Unbekannter Fehler'
}

// Create an readable error message for the user
export function createErrorMessage(error) {
  if (error.code === 'UsernameExistsException') {
    return 'Die eingegebene E-Mail-Adresse oder Telefonnummer wird bereits für ein bestehendes Konto benutzt. Bitte versuchen Sie eine neue E-Mail-Adresse. Falls Sie Ihr Passwort vergessen haben, gehen Sie bitte zum Login, um es zurückzusetzen.'
  } else if (error.code === 'UserNotFoundException') {
    return 'Der eingegebene Nutzer wurde nicht gefunden. Bitte prüfen Sie die Eingabe oder registrieren Sie sich!'
  } else if (error.code === 'NotAuthorizedException') {
    return 'Der eingegebene Nutzername oder das Passwort ist fehlerhaft.'
  } else if (error.code === 'CodeMismatchException') {
    return 'Sie haben einen falschen Bestätigungscode eingegeben. Bitte versuchen Sie es nochmal oder fordern Sie einen Code erneut an.'
  } else if (error.code === 'InvalidParameterException') {
    return 'Sie können Ihr Passwort erst zurücksetzen, wenn Sie sich mit ihrem Code verifiziert haben.'
  } else if (error.code === 'LimitExceededException') {
    return 'Sie haben das Limit an Versuchen erreicht. Bitte versuchen Sie es später nochmal.'
  } else if (error.code === 'NetworkError') {
    return 'Um sich in der DriversApp authentifizieren zu können, müssen Sie mit dem Internet verbunden sein'
  }
  return 'Es ist ein unbekannter Fehler aufgetreten, bitte versuchen Sie es erneut oder kontaktieren Sie den Administrator der Seite.'
}
