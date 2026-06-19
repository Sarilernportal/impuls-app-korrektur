/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Input Validations
*/

// Check if the input is empty
export function emptyValidation(name) {
  if (name === '') {
    return false
  }
  return true
}
// Check if the email input is in correct format
export function emailValidation(email) {
  if (email === '') {
    return false
  }
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const result = regex.test(String(email).toLowerCase())
  if (!result) {
    return false
  }
  return true
}
// Check if the password input is in correct format.
// Minimum: 12 chars, upper/lowercase, number and special character.
export function passwordValidation(password) {
  if (password === '') {
    return false
  }
  if (password.length < 12) {
    return false
  }
  if (password.search(/[0-9]/) < 0) {
    return false
  }
  if (password.search(/[A-Z]/) < 0) {
    return false
  }
  if (password.search(/[a-z]/) < 0) {
    return false
  }
  if (password.search(/[^A-Za-z0-9]/) < 0) {
    return false
  }
  if (/\s/.test(password)) {
    return false
  }
  return true
}

// Check if the number input is in correct format
// Min 1 Number
export function numberValidation(number) {
  if (number === '') {
    return false
  }
  // Min 1 Number
  if (!Number.isInteger(number)) {
    return false
  }
  return true
}

// Check if the float input is in correct format
// Min 1 Number
export function floatOrIntegerValidation(number) {
  if (number === '') {
    return false
  }
  // regex pattern for float validation
  const regexPattern = /^-?[0-9]+$/
  // check if number is float or normal integer
  return !regexPattern.test(number) || Number.isInteger(number)
}

// Check if the text only input is in correct format
// Min 1 Character
export function textValidation(text) {
  if (text === '') {
    return false
  }
  // Min 1 Character
  if (text.search(/[0-9]/) > 0) {
    return false
  }
  return true
}

// Check if the phone number is in correct format
export function phoneValidation(phone) {
  if (phone === '') {
    return false
  }
  // Only numbers
  if (phone.search(/[a-z]/i) > 0) {
    return false
  }
  // Akzeptiert internationale (+49…), nationale (0176…) und Nummern ohne
  // führende 0. 7–13 Ziffern insgesamt.
  const regex = /^(\+?[1-9]\d{6,12}|0\d{6,12})$/
  const result = regex.test(String(phone))
  if (!result) {
    return false
  }
  return true
}

// Check if the percentage input is in correct format
// Min 1 Number
export function percentageValidation(number) {
  if (number === '') {
    return false
  }
  // Min 1 Number
  if (number.search(/[0-9]/) < 0) {
    return false
  }
  // Max 100
  if (number > 100) {
    return false
  }
  return true
}

// CUSTOM FOR THIS APP
// Check if the license plate district input is in correct format
// Min 1 Character
// Max 3 Character
export function licensePlateDistrictValidation(district) {
  if (district === '') {
    return false
  }
  // Only Character
  if (district.search(/[0-9]/) > 0) {
    return false
  }
  // Max 2 Character
  if (district.length > 3) {
    return false
  }
  return true
}
// Check if the license plate identifier input is in correct format
// Min 1 Character
// Max 3 Character ( Customer wish )
export function licensePlateIdentifierValidation(identifier) {
  if (identifier === '') {
    return false
  }
  // Only Character
  if (identifier.search(/[0-9]/) > 0) {
    return false
  }
  // Max 2 Character
  if (identifier.length > 3) {
    return false
  }
  return true
}

// Check if the license plate number input is in correct format
// Min 1 Number
// Max 4 Numbers
export function licensePlateNumberValidation(number) {
  if (number === '') {
    return false
  }
  // Min 1 Number
  if (number.search(/[0-9]/) < 0) {
    return false
  }
  // Max 4 Number
  if (number.length > 4) {
    return false
  }
  return true
}
