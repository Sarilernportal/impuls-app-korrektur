/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Store - Admin - Actions
*/

import { Auth, API, Storage, graphqlOperation } from 'aws-amplify'
import * as queries from '@/graphql/queries'
import * as customQueries from '@/customQueries'
import * as customMutations from '@/customMutations'
import * as mutations from '@/graphql/mutations'
import _ from 'lodash'
import { isLocalAuthMode } from '@/services/authService.js'
import {
  countChildren as countLocalChildren,
  countGuardians as countLocalGuardians,
  createCalendar as createLocalCalendar,
  createCarrier as createLocalCarrier,
  createCarrierContact as createLocalCarrierContact,
  createChild as createLocalChild,
  createEvent as createLocalEvent,
  createInvoice as createLocalInvoice,
  createUser as createLocalUser,
  getCalendar as getLocalCalendar,
  getCarrier as getLocalCarrier,
  getCarrierContact as getLocalCarrierContact,
  getChild as getLocalChild,
  getGuardian as getLocalGuardian,
  listCalendars as listLocalCalendars,
  listCarrierContacts as listLocalCarrierContacts,
  listCarriers as listLocalCarriers,
  listChildren as listLocalChildren,
  listDocuments as listLocalDocuments,
  listEvents as listLocalEvents,
  listEventsByCalendar as listLocalEventsByCalendar,
  listFiles as listLocalFiles,
  listGuardians as listLocalGuardians,
  listGuardiansSelection as listLocalGuardiansSelection,
  listNotes as listLocalNotes,
  listUsers as listLocalUsers,
  listParticipationsByCalendar as listLocalParticipationsByCalendar,
  unreadNotesStatus as localUnreadNotesStatus
} from '@/services/localDemoData.js'

export default {
  async fetchUser(_, payload) {
    if (isLocalAuthMode) {
      return listLocalUsers()
    }

    const groupname =
      payload.groupname.charAt(0).toUpperCase() + payload.groupname.slice(1)
    const { nextToken, filter } = payload
    const limit = 50
    const apiName = 'AdminQueries'
    const path = '/listUsersInGroup'
    const myInit = {
      queryStringParameters: {
        groupname: groupname,
        limit: limit,
        token: nextToken
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      }
    }
    const response = await API.get(apiName, path, myInit)
    return response
  },
  async fetchAllUsers() {
    if (isLocalAuthMode) {
      return listLocalUsers()
    }

    var userList = []
    var nextToken = null
    // pull users from cognito until no new are provided --> required for dictionary lookup in components
    do {
      const limit = 60
      const apiName = 'AdminQueries'
      const path = '/listUsers'
      const myInit = {
        queryStringParameters: {
          limit: limit,
          token: nextToken
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`
        }
      }
      const response = await API.get(apiName, path, myInit)
      // save nextToken so we can continue to pull new users
      nextToken = response.NextToken
      // append users to existing list
      userList = userList.concat(response.Users)
    } while (nextToken !== undefined)
    // return list of users
    return { Users: userList }
  },
  async fetchCarriersOverviewList(_, payload) {
    if (isLocalAuthMode) {
      return listLocalCarriers(payload)
    }

    // get token and filter
    const { nextToken, filter } = payload

    const variables = {
      limit: filter ? 1000 : 50,
      nextToken: nextToken,
      filter: {}
    }

    // add filter to fetch object, if provided
    if (filter) {
      const lowercaseFilter = filter.toLowerCase()
      const capitalizedFilter =
        filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()

      // Apply both variations to name and familyName fields
      variables.filter.or = [
        { name: { contains: lowercaseFilter } },
        { name: { contains: capitalizedFilter } },
      ]
    }

    try {
      const carrierResponse = await API.graphql(graphqlOperation(customQueries.listCarriersOverviewList, variables))
      if (carrierResponse && carrierResponse.data?.listCarriers) {
        return carrierResponse.data.listCarriers || []
      } else {
        console.warn(
          'No data returned for listCarriersOverviewList query:',
          carrierResponse.errors || 'Unknown error'
        )
        return []
      }
    } catch (error) {
      console.error('Error fetching carriers:', error)
      throw error // Let the calling function handle this
    }
  },
  async fetchCarriers(_, payload) {
    if (isLocalAuthMode) {
      return listLocalCarriers(payload)
    }

    // get token and filter
    const { nextToken, filter } = payload

    // create fetch object with nexttoken
    var fetchData = {
      query: queries.listCarriers,
      variables: {
        limit: filter ? 1000 : 50,
        nextToken: nextToken,
        filter: {}
      }
    }

    // add filter to fetch object, if provided
    if (filter) {
      const lowercaseFilter = filter.toLowerCase()
      const capitalizedFilter =
        filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()

      // Apply both variations to name and familyName fields
      fetchData.variables.filter.or = [
        { name: { contains: lowercaseFilter } },
        { name: { contains: capitalizedFilter } },
      ]
    }

    try {
      const carrierResponse = await API.graphql(fetchData)
      if (carrierResponse && carrierResponse.data?.listCarriers) {
        return carrierResponse.data.listCarriers || []
      } else {
        console.warn(
          'No data returned for listCarriers query:',
          carrierResponse.errors || 'Unknown error'
        )
        return []
      }
    } catch (error) {
      console.error('Error fetching carriers:', error)
      throw error // Let the calling function handle this
    }
  },
  async fetchCarrierContacts(_, payload) {
    if (isLocalAuthMode) {
      return listLocalCarrierContacts(payload)
    }

    // Get carrier contact list from AppSync
    // get token and filter
    const { nextToken, filter } = payload

    // create fetch object with nexttoken
    var fetchData = {
      query: queries.listCarrierContacts,
      variables: {
        limit: 1000,
        nextToken: nextToken
      }
    }

    // add filter to fetch object, if provided
    if (filter && filter !== '') {
      fetchData.variables.filter = {
        or: [
          { name: { contains: filter } },
          { familyName: { contains: filter } }
        ]
      }
    }

    // call API
    const carrierContactResponse = await API.graphql(fetchData)
    const carrierContactList = carrierContactResponse.data.listCarrierContacts
    return carrierContactList
  },
  async fetchCarrierContactsSelection(_, payload) {
    if (isLocalAuthMode) {
      return listLocalCarrierContacts(payload)
    }

    // Get carrier contact list from AppSync
    // get token and filter
    const { nextToken, filter } = payload

    // create fetch object with nexttoken
    var variables = {
      limit: 1000,
      nextToken: nextToken
    }

    // add filter to fetch object, if provided
    if (filter && filter !== '') {
      variables.filter = {
        or: [
          { name: { contains: filter } },
          { familyName: { contains: filter } }
        ]
      }
    }

    // call API
    const carrierContactResponse = await API.graphql(customQueries.listCarrierContactsSelection, variables)
    const carrierContactList = carrierContactResponse.data.listCarrierContacts
    return carrierContactList
  },
  // In your Vuex store
  async fetchGuardians({ commit }, payload) {
    if (isLocalAuthMode) {
      return listLocalGuardians(payload)
    }

    const { nextToken, filter, filterStatus, showArchived } = payload

    // Debounced fetch function to reduce API calls during typing
    const variables = {
      archiveStatus: showArchived ? 'archived' : 'unarchived',
      limit: filter ? 1000 : 50, // Higher limit if a filter is applied
      nextToken: nextToken,
      filter: {}
    }

    // Apply filter only if there is a search term
    if (filter) {
      // Create a lowercase and capitalized version of the filter
      const lowercaseFilter = filter.toLowerCase()
      const capitalizedFilter =
        filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()

      // Apply both variations to name and familyName fields
      variables.filter.or = [
        { name: { contains: lowercaseFilter } },
        { name: { contains: capitalizedFilter } },
        { familyName: { contains: lowercaseFilter } },
        { familyName: { contains: capitalizedFilter } }
      ]
    }

    // Add date filter for timesheet status if specified
    if (filterStatus) {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()

      let timeSheetDateFilter = {}

      if (filterStatus === 'after') {
        timeSheetDateFilter = { ge: new Date(currentYear, currentMonth, 1).toISOString() }
      } else if (filterStatus === 'between') {
        timeSheetDateFilter = {
          between: [
            new Date(currentYear, currentMonth - 1, 1).toISOString(),
            new Date(currentYear, currentMonth, 1).toISOString()
          ]
        }
      } else if (filterStatus === 'before') {
        timeSheetDateFilter = {
          lt: new Date(currentYear, currentMonth - 1, 1).toISOString(),
          attributeExists: true
        }
      }
      variables.filter.timeSheetDate = timeSheetDateFilter
    }

    try {
      const guardianResponse = await API.graphql(graphqlOperation(customQueries.listGuardiansOverviewList, variables))
      if (guardianResponse && guardianResponse.data?.listGuardianByState) {
        return guardianResponse.data.listGuardianByState || []
      } else {
        console.warn(
          'No data returned for listGuardianByState query:',
          guardianResponse.errors || 'Unknown error'
        )
        return []
      }
    } catch (error) {
      console.error('Error fetching guardians:', error)
      throw error // Let the calling function handle this
    }
  },
  async fetchGuardiansSelection({ commit }, payload) {
    if (isLocalAuthMode) {
      return listLocalGuardiansSelection(payload)
    }

    const { nextToken, filter, filterStatus, showArchived } = payload

    // Debounced fetch function to reduce API calls during typing
    const variables = {
      archiveStatus: showArchived ? 'archived' : 'unarchived',
      limit: filter ? 1000 : 50, // Higher limit if a filter is applied
      nextToken: nextToken,
      filter: {}
    }

    // Apply filter only if there is a search term
    if (filter) {
      // Create a lowercase and capitalized version of the filter
      const lowercaseFilter = filter.toLowerCase()
      const capitalizedFilter =
        filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()

      // Apply both variations to name and familyName fields
      variables.filter.or = [
        { name: { contains: lowercaseFilter } },
        { name: { contains: capitalizedFilter } },
        { familyName: { contains: lowercaseFilter } },
        { familyName: { contains: capitalizedFilter } }
      ]
    }

    // Add date filter for timesheet status if specified
    if (filterStatus) {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()

      let timeSheetDateFilter = {}

      if (filterStatus === 'after') {
        timeSheetDateFilter = { ge: new Date(currentYear, currentMonth, 1).toISOString() }
      } else if (filterStatus === 'between') {
        timeSheetDateFilter = {
          between: [
            new Date(currentYear, currentMonth - 1, 1).toISOString(),
            new Date(currentYear, currentMonth, 1).toISOString()
          ]
        }
      } else if (filterStatus === 'before') {
        timeSheetDateFilter = {
          lt: new Date(currentYear, currentMonth - 1, 1).toISOString(),
          attributeExists: true
        }
      }
      variables.filter.timeSheetDate = timeSheetDateFilter
    }

    try {
      const guardianResponse = await API.graphql(graphqlOperation(customQueries.listGuardiansSelection, variables))
      if (guardianResponse && guardianResponse.data?.listGuardianByState) {
        return guardianResponse.data.listGuardianByState || []
      } else {
        console.warn(
          'No data returned for listGuardianByState query:',
          guardianResponse.errors || 'Unknown error'
        )
        return []
      }
    } catch (error) {
      console.error('Error fetching guardians:', error)
      throw error // Let the calling function handle this
    }
  },

  async countGuardians(_, payload) {
    if (isLocalAuthMode) {
      return countLocalGuardians(payload)
    }

    const { searchValue, showArchived, filterStatus } = payload
    // define query
    var countQuery = `
      query MyQuery {
        listGuardianByState(archiveStatus: ${showArchived ? 'archived' : 'unarchived'
      },filter:{
    `

    // apply search value
    if (searchValue && searchValue !== '') {
      const names = searchValue.split(' ')
      var nameFilters = '['
      for (const name of names) {
        const lowercaseName = name.charAt(0).toLowerCase() + name.slice(1)
        const upperCaseName = name.charAt(0).toUpperCase() + name.slice(1)
        nameFilters += `
          {
            name: { contains: \"${lowercaseName}\" }
          },
          {
            name: { contains: \"${upperCaseName}\" }
          },
          {
            familyName: {
              contains: \"${lowercaseName}\"
            }
          },
          {
            familyName: {
              contains: \"${upperCaseName}\"
            }
          }
        `
      }
      countQuery += `,or: ${nameFilters}]`
    }

    // add filter for timesheet status if given
    if (filterStatus) {
      if (filterStatus === 'after') {
        // filter greater than first day of current month
        countQuery += `,timeSheetDate:{ge:\"${new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString()}\"}`
      } else if (filterStatus === 'between') {
        // filter between first day of current and previous month
        countQuery += `,timeSheetDate:{between:[\"${new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        ).toISOString()}\",\"${new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString()}\"]}`
      } else if (filterStatus === 'before') {
        // filter lower than first day of previous month
        countQuery += `,timeSheetDate:{lt: \"${new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        ).toISOString()}\", attributeExists: true}`
      }
    }

    // complete query with return values
    countQuery += `}, limit: 1000) {
          items {
            id
          }
        }
      }    
      `
    // get list of guardians via appsync
    const guardianResp = await API.graphql({ query: countQuery })
    // return length of list
    return guardianResp.data.listGuardianByState.items.length
  },
  async fetchChildren(_, payload) {
    if (isLocalAuthMode) {
      return listLocalChildren(payload)
    }

    // fetch children from AppSync
    const { nextToken, filter, showDataIncomplete, showArchived } = payload

    // create fetch object with nexttoken
    var variables = {
      limit: 25,
      nextToken: nextToken,
      archiveStatus: showArchived ? 'archived' : 'unarchived',
      filter: {}
    }

    // add filter if given and apply to both name and familyName, so the API searches both fields
    if (filter) {
      // Create a lowercase and capitalized version of the filter
      const lowercaseFilter = filter.toLowerCase()
      const capitalizedFilter =
        filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()

      // Apply both variations to name and familyName fields
      variables.filter.or = [
        { name: { contains: lowercaseFilter } },
        { name: { contains: capitalizedFilter } },
        { familyName: { contains: lowercaseFilter } },
        { familyName: { contains: capitalizedFilter } }
      ]
    }

    // add filter for incomplete data
    if (showDataIncomplete) {
      variables.filter.dataComplete = {
        eq: !showDataIncomplete
      }
    }

    try {
      const childResponse = await API.graphql(graphqlOperation(customQueries.listChildrenOverviewList, variables))
      if (childResponse && childResponse.data?.listChildrenByArchiveState) {
        return childResponse.data.listChildrenByArchiveState || []
      } else {
        console.warn(
          'No data returned for listChildrenByArchiveState query:',
          carrierResponse.errors || 'Unknown error'
        )
        return []
      }
    } catch (error) {
      console.error('Error fetching children:', error)
      throw error // Let the calling function handle this
    }
  },
  async countChildren(_, payload) {
    if (isLocalAuthMode) {
      return countLocalChildren(payload)
    }

    const { carrier, searchValue, showArchived, showDataIncomplete } = payload
    // define query
    var countQuery = `
      query MyQuery {
        listChildren(filter:{
    `

    // apply achived filter
    countQuery += `archiveStatus: {eq: ${showArchived ? 'archived' : 'unarchived'
      }}`

    // apply data incomplete filter
    if (showDataIncomplete) {
      countQuery += `, dataComplete: {eq: false}`
    }

    // apply search value
    if (searchValue && searchValue !== '') {
      const names = searchValue.split(' ')
      var nameFilters = '['
      for (const name of names) {
        const lowercaseName = name.charAt(0).toLowerCase() + name.slice(1)
        const upperCaseName = name.charAt(0).toUpperCase() + name.slice(1)
        nameFilters += `
          {
            name: { contains: \"${lowercaseName}\" }
          },
          {
            name: { contains: \"${upperCaseName}\" }
          },
          {
            familyName: {
              contains: \"${lowercaseName}\"
            }
          },
          {
            familyName: {
              contains: \"${upperCaseName}\"
            }
          }
        `
      }
      countQuery += `,or: ${nameFilters}]`
    }

    // complete query with return values
    countQuery += `}, limit: 1000) {
          items {
            id
          }
        }
      }    
      `
    // get list of children via appsync
    const childResp = await API.graphql({ query: countQuery })
    // return length of list
    return childResp.data.listChildren.items.length
  },
  async fetchChildrenByGuardian(_, payload) {
    if (isLocalAuthMode) {
      return listLocalChildren(payload)
    }

    // fetch children from AppSync by guardian id
    const { nextToken, filter, guardianId } = payload

    // setup variables object
    var variables = { nextToken: nextToken, guardianChildrenId: guardianId }

    // add filter if given and apply to both name and familyName, so the API searches both fields
    if (filter !== '') {
      variables.filter = {
        or: [
          { name: { contains: filter } },
          { familyName: { contains: filter } }
        ]
      }
    }

    // get children via API
    const childResponse = await API.graphql({
      query: queries.careAssignmentsByGuardian,
      variables: {
        nextToken: variables.nextToken,
        guardianCareAssignmentsId: variables.guardianChildrenId,
        filter: variables.filter
      }
    })

    return childResponse.data.careAssignmentsByGuardian
  },
  async fetchChildrenByCarrier(_, payload) {
    if (isLocalAuthMode) {
      return listLocalChildren(payload)
    }

    // fetch children from AppSync
    const { carrierCarrierContactsId } = payload

    // Get the response from the backend
    const childResponse = await API.graphql({
      query: queries.listChildrenByCarrier,
      variables: {
        input: { carrierCarrierContactsId: carrierCarrierContactsId }
      }
    })
    const children = JSON.parse(childResponse.data.listChildrenByCarrier)
    return children
  },
  async fetchUserDetails(_, payload) {
    if (isLocalAuthMode) {
      const sub = payload.sub
      if (String(sub).startsWith('demo-guardian')) {
        const guardian = getLocalGuardian(sub)
        return {
          Username: guardian.id,
          Enabled: true,
          UserCreateDate: new Date().toISOString(),
          UserLastModifiedDate: new Date().toISOString(),
          UserAttributes: [
            { Name: 'given_name', Value: guardian.name || '' },
            { Name: 'family_name', Value: guardian.familyName || '' },
            { Name: 'email', Value: guardian.email || '' },
            { Name: 'phone_number', Value: guardian.phone || '' }
          ]
        }
      }

      const user = listLocalUsers().Users[0]
      return {
        ...user,
        UserAttributes: user.UserAttributes || user.Attributes || []
      }
    }

    const sub = payload.sub
    // Call the admin queries api
    const apiName = 'AdminQueries'
    // We get the user with the get user path
    const path = '/getUser'
    // Initialize the init object
    const myInit = {
      // Set the query parameters
      queryStringParameters: {
        username: sub
      },
      // Set the headers
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      }
    }
    // Set the user to the retrieved user object
    return await API.get(apiName, path, myInit)
  },
  async fetchGuardianDetails(_, payload) {
    if (isLocalAuthMode) {
      return getLocalGuardian(payload.sub)
    }

    // fetch single guardian object from AppSync by ID
    // get id from payload
    const id = payload.sub

    // call API
    const guardianResponse = await API.graphql(
      graphqlOperation(queries.getGuardian, { id: id })
    )
    const guardian = guardianResponse.data.getGuardian
    return guardian
  },
  async fetchGuardianDetailsMini(_, payload) {
    if (isLocalAuthMode) {
      return getLocalGuardian(payload.sub)
    }

    // fetch single guardian object from AppSync by ID
    // get id from payload
    const id = payload.sub

    // call API
    const guardianResponse = await API.graphql(
      graphqlOperation(customQueries.getGuardianMini, { id: id })
    )
    const guardian = guardianResponse.data.getGuardian
    return guardian
  },
  async fetchCarrierDetails(_, payload) {
    if (isLocalAuthMode) {
      return getLocalCarrier(payload.sub)
    }

    // fetch single carrier object from AppSync by ID
    // get id from payload
    const id = payload.sub

    // call API
    const carrierResponse = await API.graphql(
      graphqlOperation(customQueries.fetchCarrierDetail, { id: id })
    )
    const carrier = carrierResponse.data.getCarrier
    return carrier
  },
  async fetchCarrierContactDetails(_, payload) {
    if (isLocalAuthMode) {
      return getLocalCarrierContact(payload.sub)
    }

    // fetch single carrier contact object from AppSync by ID
    // get id from payload
    const id = payload.sub

    // call API
    const carrierContactResponse = await API.graphql(
      graphqlOperation(customQueries.fetchCarrierContactDetail, { id: id })
    )
    const carrierContact = carrierContactResponse.data.getCarrierContact
    return carrierContact
  },
  async fetchChildDetails(_, payload) {
    if (isLocalAuthMode) {
      return getLocalChild(payload.sub)
    }

    // fetch single child object from AppSync by ID
    // get id from payload
    const id = payload.sub

    // call API
    const childResponse = await API.graphql(
      graphqlOperation(customQueries.fetchChildDetail, { id: id })
    )
    const child = childResponse.data.getChild
    return child
  },
  async fetchUserGroup(_, payload) {
    if (isLocalAuthMode) {
      const groupName = String(payload.username).startsWith('demo-guardian') ? 'Guardian' : 'Admin'
      return {
        Groups: [{ GroupName: groupName }]
      }
    }

    const username = payload.username
    // Call the admin queries API
    const apiName = 'AdminQueries'
    // We get the group from the listGroupsForUser path
    const path = '/listGroupsForUser'
    // Initialize the init object
    const myInit = {
      // Set the query parameters
      queryStringParameters: {
        username: username
      },
      // Set the headers
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      }
    }
    return await API.get(apiName, path, myInit)
  },
  async updateUser(_, payload) {
    const user = payload.user
    const changeObject = payload.changeObject
    // Get the users name from the user object
    const username = user.Username
    // Call the admin queries API
    const apiName = 'AdminQueries'
    // We switch the group with the switchUserGroup path
    const path = '/updateUser'
    // Initialize the init object
    const myInit = {
      // Set the headers
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      },
      // Set the body
      body: {
        username: username,
        modify_input: changeObject
      }
    }
    // Post the request to the backend
    return await API.post(apiName, path, myInit)
  },
  async updateCarrier({ commit }, { carrier, changeObject }) {
    try {
      const input = {
        id: carrier.id,
        ...changeObject
      }
      
      const result = await API.graphql(
        graphqlOperation(customMutations.updateCarrier, { input })
      )
      
      // Update the local state with the returned carrier data
      commit('updateCarrier', result.data.updateCarrier)
      return result
    } catch (error) {
      console.error('Error updating carrier:', error)
      throw error
    }
  },
  async updateCarrierContact(_, payload) {
    // get values from payload
    const carrierContact = payload.carrierContact
    // get value + value-name that should be updated
    const changeObject = payload.changeObject
    const changeKey = Object.keys(changeObject)[0]
    const changeValue = changeObject[changeKey]

    // create update object
    const updateObject = {
      id: carrierContact.id,
      [changeKey]: changeValue
    }

    const carrierContactResponse = await API.graphql({
      query: mutations.updateCarrierContact,
      variables: { input: updateObject }
    })
    return carrierContactResponse
  },
  async updateGuardian(_, payload) {
    // get values from payload
    const guardian = payload.guardian
    // get value + value-name that should be updated
    const changeObject = payload.changeObject
    const changeKey = Object.keys(changeObject)[0]
    const changeValue = changeObject[changeKey]

    // create update object
    const updateObject = {
      id: guardian.id,
      [changeKey]: changeValue
    }

    const guardianResponse = await API.graphql({
      query: mutations.updateGuardian,
      variables: { input: updateObject }
    })
    return guardianResponse
  },
  async updateChild(_, payload) {
    // get values from payload
    const child = payload.child
    // get value + value-name that should be updated
    const changeObject = payload.changeObject
    const changeKey = Object.keys(changeObject)[0]
    const changeValue = changeObject[changeKey]

    const changeValuePlain = JSON.parse(JSON.stringify(changeValue))
    delete changeValuePlain.__typename

    // create update object
    const updateObject = {
      id: child.id,
      [changeKey]: changeValuePlain
    }

    // call API
    const childResponse = await API.graphql({
      query: mutations.updateChild,
      variables: { input: updateObject }
    })
    return childResponse
  },
  async createCareAssignment(_, payload) {
    // get data from paylaod
    const { childID, guardianID } = payload
    // setup create-object
    const createObject = {
      childCareAssignmentsId: childID,
      guardianCareAssignmentsId: guardianID
    }
    // create care assignemnt via API call
    const careResponse = await API.graphql({
      query: mutations.createCareAssignment,
      variables: { input: createObject }
    })
    return careResponse
  },
  async deleteCareAssignment(_, payload) {
    // get data from payload
    const { id } = payload
    // delete care assignment via API call
    const careResponse = await API.graphql({
      query: mutations.deleteCareAssignment,
      variables: { input: { id } }
    })
    return careResponse
  },
  async getCareAssignment(_, payload) {
    // get data from payload
    const { id } = payload
    // delete care assignment via API call
    const careResponse = await API.graphql({
      query: queries.getCareAssignment,
      variables: { id }
    })
    return careResponse.data.getCareAssignment
  },
  async getCareAssignmentByGuardian(_, payload) {
    // get data from payload
    const { id } = payload
    // delete care assignment via API call
    const careResponse = await API.graphql({
      query: queries.careAssignmentsByGuardian,
      variables: { guardianCareAssignmentsId: id }
    })
    return careResponse.data.careAssignmentsByGuardian.items
  },
  async getCareAssignmentByChild(_, payload) {
    // get data from payload
    const { id } = payload
    // delete care assignment via API call
    const careResponse = await API.graphql({
      query: queries.careAssignmentsByChild,
      variables: { childCareAssignmentsId: id }
    })
    return careResponse.data.careAssignmentsByChild.items
  },
  // Method to add a new user
  async addUser(_, payload) {
    if (isLocalAuthMode) {
      return createLocalUser(payload)
    }

    const attributes = payload.attributes
    const groupname = payload.groupname
    const apiName = 'AdminQueries'
    const path = '/createUser'
    const myInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      },
      body: {
        groupname: groupname,
        attributes: attributes
      }
    }
    return await API.post(apiName, path, myInit)
  },
  // Method to add a new carrier
  async addCarrier(_, payload) {
    if (isLocalAuthMode) {
      return createLocalCarrier(payload)
    }

    // create data object for new carrier, data must be provided in payload
    const input = {
      addressExtra: payload.addressExtra,
      city: payload.city,
      houseNumber: payload.houseNumber,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      postalCode: payload.postalCode,
      poBox: payload.poBox,
      street: payload.street,
      billingName: payload.billingName,
      billingPostalCode: payload.billingPostalCode,
      billingStreet: payload.billingStreet,
      billingAddressExtra: payload.billingAddressExtra,
      billingCity: payload.billingCity,
      billingHouseNumber: payload.billingHouseNumber,
      billingPoBox: payload.billingPoBox
    }

    // call API with data object
    const carrierResponse = await API.graphql({
      query: mutations.createCarrier,
      variables: { input: input }
    })
    const carrierList = carrierResponse
    return carrierList
  },
  // Method to add a new carrier contact
  async addCarrierContact(_, payload) {
    if (isLocalAuthMode) {
      return createLocalCarrierContact(payload)
    }

    // get data from payload
    const { name, familyName, email, phone, carrier } = payload

    // create data object for new child
    const input = {
      name: name,
      familyName: familyName,
      email: email,
      phone: phone
    }

    // if carrier ID is provided, add to data object
    if (carrier !== null) {
      input.carrierCarrierContactsId = carrier.id
    }

    // call API with data object to create a child
    const carrierContactResponse = await API.graphql({
      query: mutations.createCarrierContact,
      variables: { input: input }
    })
    const carrierContact = carrierContactResponse
    return carrierContact
  },
  // Method to add a new child
  async addChild(_, payload) {
    if (isLocalAuthMode) {
      return createLocalChild(payload)
    }

    // get data from payload
    const {
      name,
      familyName,
      dateOfBirth,
      school,
      dateOfRegistration,
      weeklyHours,
      weeklyHoursByPlan,
      recordNumber,
      carrierContact,
      motherName,
      motherFamilyName,
      motherPhone,
      motherEmail,
      fatherName,
      fatherFamilyName,
      fatherPhone,
      fatherEmail,
      schoolContactName,
      schoolContactFamilyName,
      schoolContactPhone,
      schoolContactEmail
    } = payload

    // create data object for new child
    const input = {
      archiveStatus: 'unarchived',

      name: name,
      familyName: familyName,
      school: school,
      dateOfBirth: dateOfBirth,
      dateOfRegistration: dateOfRegistration,
      weeklyHours: weeklyHours,
      weeklyHoursByPlan: weeklyHoursByPlan,
      recordNumber: recordNumber,
      mother: {
        name: motherName,
        familyName: motherFamilyName,
        phone: motherPhone,
        email: motherEmail
      },
      father: {
        name: fatherName,
        familyName: fatherFamilyName,
        phone: fatherPhone,
        email: fatherEmail
      },
      schoolContact: {
        name: schoolContactName,
        familyName: schoolContactFamilyName,
        phone: schoolContactPhone,
        email: schoolContactEmail
      }
    }

    // if carrier ID is provided, add to data object
    if (carrierContact !== null) {
      input.carrierContactChildrenId = carrierContact.id
    }

    // call API with data object to create a child
    const ChildResponse = await API.graphql({
      query: mutations.createChild,
      variables: { input: input }
    })
    const childList = ChildResponse
    return childList
  },
  // Method for delete a user
  async deleteUser(_, payload) {
    const username = payload.username
    const apiName = 'AdminQueries'
    const path = '/deleteUser'
    const myInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      },
      body: { username }
    }
    return await API.del(apiName, path, myInit)
  },
  // Method for deleting a carrier
  async deleteCarrier(_, payload) {
    // get carrier id from payload
    const carrier = payload.carrier

    // call API to delete carrier, only ID must be provided
    const carrierResponse = await API.graphql({
      query: mutations.deleteCarrier,
      variables: { input: { id: carrier.id } }
    })
    return carrierResponse
  },
  // Method for deleting a carrier contact
  async deleteCarrierContact(_, payload) {
    // get carrier contact id from payload
    const carrierContact = payload.carrierContact

    // call API to delete carrier contact, only ID must be provided
    const carrierContactResponse = await API.graphql({
      query: mutations.deleteCarrierContact,
      variables: { input: { id: carrierContact.id } }
    })
    return carrierContactResponse
  },
  // Method for deleting a child
  async deleteChild(_, payload) {
    // get child id from payload
    const child = payload.child

    // call API to delete child, only ID must be provided
    const childResponse = await API.graphql({
      query: mutations.deleteChild,
      variables: { input: { id: child.id } }
    })
    return childResponse
  },
  // Method for enabling the user in cognito
  async enableUser(_, payload) {
    const sub = payload.username
    const apiName = 'AdminQueries'
    const path = '/enableUser'
    const myInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      },
      body: {
        username: sub
      }
    }
    return await API.post(apiName, path, myInit)
  },
  // Method for disabling the user in cognito
  async disableUser(_, payload) {
    const sub = payload.username
    const apiName = 'AdminQueries'
    const path = '/disableUser'
    const myInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      },
      body: {
        username: sub
      }
    }
    return await API.post(apiName, path, myInit)
  },
  async getDailyReportDocuments(_, payload) {
    if (isLocalAuthMode) {
      return listLocalDocuments()
    }

    // get payload data
    const { startDate, endDate, childID, guardianID, charged, nextToken } =
      payload

    // create fetchdata object
    var variables = {
      limit: 50,
      type: 'dailyReport',
      nextToken: nextToken,
      sortDirection: 'DESC',
      filter: {}
    }

    // apply date filter
    if (
      startDate !== null &&
      startDate !== undefined &&
      endDate !== null &&
      endDate !== undefined
    ) {
      variables.documentDate = {
        between: [startDate, endDate]
      }
    }

    // apply child as filter
    if (childID) {
      variables.filter.childDailyReportId = {
        eq: childID
      }
      // if filter is given, incease limit
      variables.limit = 200
    }

    // apply guardian as filter
    if (guardianID) {
      variables.filter.guardianDailyReportId = {
        eq: guardianID
      }
      // if filter is given, incease limit
      variables.limit = 200
    }

    // apply charged as filter
    if (charged !== undefined) {
      variables.filter.charged = {
        eq: charged
      }
    }

    // Get the response from the backend
    const documentResponse = await API.graphql(graphqlOperation(customQueries.fetchDokumentationen, variables))
    // unrwap the data from the response object
    const documents = documentResponse.data.dailyReportsByType
    return documents
  },
  async getTimeSheetDocuments(_, payload) {
    if (isLocalAuthMode) {
      return listLocalDocuments()
    }

    // get payload data
    const { startDate, endDate, childID, guardianID, nextToken } = payload

    // create fetchdata object
    var variables = {
      limit: 50,
      type: 'timeSheet',
      nextToken: nextToken,
      sortDirection: 'DESC',
      filter: {}
    }

    // apply date filter
    if (
      startDate !== null &&
      startDate !== undefined &&
      endDate !== null &&
      endDate !== undefined
    ) {
      variables.documentDate = {
        between: [startDate, endDate]
      }
    }

    // apply child as filter
    if (childID) {
      variables.filter.childTimeSheetsId = {
        eq: childID
      }
      // if filter is given, incease limit
      variables.limit = 200
    }

    // apply guardian as filter
    if (guardianID) {
      variables.filter.guardianTimeSheetsId = {
        eq: guardianID
      }
      // if filter is given, incease limit
      variables.limit = 200
    }

    // Get the response from the backend
    const documentResponse = await API.graphql(graphqlOperation(customQueries.fetchNachweise, variables))
    // unrwap the data from the response object
    const documents = documentResponse.data.timeSheetsByType
    return documents
  },
  async getInvoiceDocuments(_, payload) {
    if (isLocalAuthMode) {
      return listLocalDocuments()
    }

    // get payload data
    const {
      startDate,
      endDate,
      childID,
      guardianID,
      carrierID,
      internalNumber,
      nextToken
    } = payload

    // create fetchdata object
    var fetchData = {
      query: queries.invoicesByType,
      variables: {
        type: 'invoice',
        nextToken: nextToken,
        limit: 50,
        sortDirection: 'DESC',
        filter: {}
      }
    }

    // apply date filter
    if (
      startDate !== null &&
      startDate !== undefined &&
      endDate !== null &&
      endDate !== undefined
    ) {
      fetchData.variables.documentDate = {
        between: [startDate, endDate]
      }
    }

    // apply child as filter
    if (childID) {
      fetchData.variables.filter.childInvoicesId = {
        eq: childID
      }
      // if filter is given, incease limit
      fetchData.variables.limit = 200
    }

    // apply guardian as filter
    if (guardianID) {
      fetchData.variables.filter.guardianInvoicesId = {
        eq: guardianID
      }
      // if filter is given, incease limit
      fetchData.variables.limit = 200
    }

    // apply guardian as filter
    if (carrierID) {
      fetchData.variables.filter.carrierInvoicesId = {
        eq: carrierID
      }
      // if filter is given, incease limit
      fetchData.variables.limit = 200
    }

    // apply internal number as filter
    if (internalNumber) {
      fetchData.variables.filter.internalNumber = {
        contains: internalNumber
      }
    }

    // Get the response from the backend
    const documentResponse = await API.graphql(graphqlOperation(customQueries.getInvoicesOVerview, fetchData.variables))
    // unrwap the data from the response object
    const documents = documentResponse.data.invoicesByType
    return documents
  },
  async getDocumentsByGuardianID(_, payload) {
    return listLocalDocuments()
  },
  async getDocumentsByChildID(_, payload) {
    return listLocalDocuments()
  },
  async getSingleDocument(_, payload) {
    return null
  },
  async getSingleDailyReport(_, payload) {
    if (isLocalAuthMode) {
      return {
        id: payload.id,
        key: 'demo-report.pdf',
        type: 'dailyReport',
        retrospectively: true,
        documentDate: new Date().toISOString(),
        child: getLocalChild('demo-child-1'),
        guardian: getLocalGuardian('demo-guardian-1'),
        charged: false
      }
    }

    // Get the id from the payload
    const id = payload.id

    // Get the response from the backend
    const documentResponse = await API.graphql(
      graphqlOperation(queries.getDailyReport, { id: id })
    )
    // unrwap the data from the response object
    const document = documentResponse.data.getDailyReport
    return document
  },
  async flagDailyReport(_, payload) {
    // Get the id from the payload
    const { id, flagText, flagDaySelection, timeSheetId } = payload
    // create dailyreport update object
    const updateObject = {
      id: id,
      flag: 'revise',
      flagText: flagText,
      flagDaySelection: flagDaySelection
    }

    // Get the response from the backend
    const documentResponse = await API.graphql({
      query: mutations.updateDailyReport,
      variables: { input: updateObject }
    })

    // create timesheet update object
    const timeSheetUpdateObject = {
      id: timeSheetId,
      flag: 'revise'
    }

    // get timesheet update response from backend
    // we have to flag the timesheet as well so when the guardian deletes a marked dailyreport, he can still sign and regenerate the timesheet pdf
    const timeSheetResp = await API.graphql({
      query: mutations.updateTimeSheets,
      variables: { input: timeSheetUpdateObject }
    })

    return documentResponse
  },
  async createEmptyReport(_, payload) {
    if (isLocalAuthMode) {
      return {
        data: {
          adminCreateEmptyReport: {
            id: `demo-report-${Date.now()}`,
            ...payload
          }
        }
      }
    }

    // create report via controller
    const documentResponse = await API.graphql({
      query: mutations.adminCreateEmptyReport,
      variables: { input: payload }
    })
    return documentResponse
  },
  async createInvoice(_, payload) {
    if (isLocalAuthMode) {
      return createLocalInvoice(payload)
    }

    // get values from payload
    const {
      timeSheets,
      invoiceYear,
      invoiceMonth
      // overwriteHours,
      // overwriteHoursValidation,
      // overwriteSickHours,
      // overwriteSickHoursValidation
    } = payload
    // create dailyReport array from timesheets
    var dailyReports = []
    for (const timeSheet of timeSheets) {
      dailyReports = dailyReports.concat(timeSheet.dailyReport.items)
    }
    // create params object
    const params = {
      documents: JSON.stringify(dailyReports),
      // overwriteHours: overwriteHours,
      // overwriteHoursValidation: overwriteHoursValidation,
      // overwriteSickHours: overwriteSickHours,
      // overwriteSickHoursValidation: overwriteSickHoursValidation,
      child: JSON.stringify(timeSheets[0].child),
      carrier: JSON.stringify(timeSheets[0].carrier),
      guardian: JSON.stringify(timeSheets[0].guardian),
      invoiceYear,
      invoiceMonth
    }
    // create invoice via API
    const invoiceResponse = await API.graphql({
      query: mutations.createInvoice,
      variables: { input: params }
    })
  },
  async confirmInvoice(_, payload) {
    if (isLocalAuthMode) {
      return {
        data: {
          confirmInvoice: {
            id: payload.id,
            status: 'confirmed'
          }
        }
      }
    }

    // Get the id from the payload
    const { id } = payload

    // Get the response from the backend
    const documentResponse = await API.graphql({
      query: mutations.confirmInvoice,
      variables: { input: { invoiceId: id } }
    })
    return documentResponse
  },
  async adminRegenerateInvoice(_, payload) {
    if (isLocalAuthMode) {
      return {
        data: {
          adminRegenerateInvoice: {
            id: payload.id,
            status: 'regenerated'
          }
        }
      }
    }

    // Get the id from the payload
    const { id, invoiceYear, invoiceMonth, invoiceNumber, extraHours, extraHourRate, extraDescription } = payload
    const invoice = await API.graphql(graphqlOperation(customQueries.getInvoices, { id: id }))
    
    // Get the response from the backend
    const documentResponse = await API.graphql({
      query: mutations.adminRegenerateInvoice,
      variables: { input: { invoiceID: id, invoice: JSON.stringify(invoice), invoiceYear, invoiceMonth, invoiceNumber, extraHours, extraHourRate, extraDescription, } }
    })
    return documentResponse
  },
  async getSingleTimeSheet(_, payload) {
    if (isLocalAuthMode) {
      const guardian = getLocalGuardian('demo-guardian-1')
      const child = getLocalChild('demo-child-1')
      return {
        id: payload.id,
        key: 'demo-timesheet.pdf',
        type: 'timeSheet',
        guardian,
        child,
        carrier: getLocalCarrier('demo-carrier-1'),
        dailyReport: {
          items: [
            {
              id: 'demo-report-1',
              flag: null,
              child,
              guardian
            }
          ]
        }
      }
    }

    // Get the id from the payload
    const id = payload.id

    // Get the response from the backend
    const documentResponse = await API.graphql(
      graphqlOperation(queries.getTimeSheets, { id: id })
    )
    // unrwap the data from the response object
    const document = documentResponse.data.getTimeSheets
    return document
  },
  async getSingleInvoice(_, payload) {
    if (isLocalAuthMode) {
      const guardian = getLocalGuardian('demo-guardian-1')
      const child = getLocalChild('demo-child-1')
      const carrier = getLocalCarrier('demo-carrier-1')
      return {
        id: payload.id,
        key: 'demo-invoice.pdf',
        type: 'invoice',
        guardian,
        child,
        carrier,
        charged: false,
        dailyReport: {
          items: [
            {
              id: 'demo-report-1',
              flag: null,
              child,
              guardian
            }
          ]
        }
      }
    }

    // Get the id from the payload
    const id = payload.id

    // Get the response from the backend
    const documentResponse = await API.graphql(
      graphqlOperation(queries.getInvoices, { id: id })
    )
    // unrwap the data from the response object
    const document = documentResponse.data.getInvoices
    return document
  },
  async downloadSingleDocument(_, payload) {
    if (isLocalAuthMode) {
      return 'about:blank'
    }

    const { key, userPath } = payload
    // Get the raw data from the storage bucket
    const result = await Storage.get(key, {
      level: 'private',
      download: true,
      cacheControl: 'no-cache',
      contentType: 'application/pdf',
      identityId: userPath
    })
    // Convert it to a data blob TBD: Title
    const blob = new Blob([result.Body], {
      type: 'application/pdf',
      title: key
    })
    // Get the object url to push it to the pdf iframe
    return URL.createObjectURL(blob)
  },
  async listAdminSharebox() {
    if (isLocalAuthMode) {
      return listLocalFiles()
    }

    // get file list from s3 controller
    const fileResponse = await API.graphql(
      graphqlOperation(queries.listAdminSharebox)
    )
    const files = JSON.parse(fileResponse.data.listAdminSharebox)

    // return file list
    return files
  },
  async listGuardianSharebox() {
    if (isLocalAuthMode) {
      return listLocalFiles()
    }

    // get file list from s3 controller
    const fileResponse = await API.graphql(
      graphqlOperation(queries.listGuardianSharebox)
    )
    const files = JSON.parse(fileResponse.data.listGuardianSharebox)

    // return file list
    return files
  },
  async uploadShareboxItem(_, payload) {
    if (isLocalAuthMode) {
      return {
        data: {
          uploadShareboxItem: JSON.stringify({
            status: 'ok',
            folder: payload.folder,
            count: payload.files?.length || 0
          })
        }
      }
    }

    const { folder, files } = payload

    // create upload input object
    const input = JSON.stringify({
      files: files,
      folder: folder
    })

    // upload file list to s3 controller
    const fileResponse = await API.graphql({
      query: mutations.uploadShareboxItem,
      variables: { input: { files: input } }
    })

    // return file list
    return fileResponse
  },
  async deleteShareboxItem(_, payload) {
    const { key } = payload

    // delete file using s3 controller
    const deleteResponse = await API.graphql({
      query: mutations.deleteShareboxItem,
      variables: { input: { key: key } }
    })

    // return delete response
    return deleteResponse
  },
  async downloadShareboxItem(_, payload) {
    const { key, folder } = payload
    // get folder path
    const path = folder === 'Admin' ? 'admin' : 'guardian'

    // get item name with file type
    const itemName = key.split('/').slice(2, 3).join('/')

    // Get the raw data from the storage bucket
    const result = await Storage.get(itemName, {
      level: 'private',
      download: true,
      identityId: path
    })

    // Get the object url to push it to the pdf iframe
    return { file: URL.createObjectURL(result.Body), name: itemName }
  },
  async createCalendar(_, payload) {
    if (isLocalAuthMode) {
      return createLocalCalendar(payload)
    }

    console.log(payload)
    // get data from payload
    const { title, description, color } = payload

    // create calendar using graphQL
    const calendarResponse = await API.graphql({
      query: mutations.createCalendar,
      variables: { input: { title, description, color } }
    })

    return calendarResponse
  },
  async listCalendars() {
    if (isLocalAuthMode) {
      return listLocalCalendars()
    }

    // get calendars from backend
    const calendarResponse = await API.graphql(graphqlOperation(customQueries.listCalendars))

    // return calendars
    return calendarResponse.data.listCalendars
  },
  async getSingleCalendar(_, payload) {
    if (isLocalAuthMode) {
      return getLocalCalendar(payload.id)
    }

    // get data from payload
    const { id } = payload

    // get calendars from backend
    const calendarResponse = await API.graphql(
      graphqlOperation(queries.getCalendar, { id: id })
    )

    // return calendars
    return calendarResponse.data.getCalendar
  },
  async updateCalendar(_, payload) {
    // get data from payload
    const { id, updateObject } = payload
    // write id into update object --> required to update correct entry
    updateObject.id = id

    // get calendars from backend
    const calendarResponse = await API.graphql({
      query: mutations.updateCalendar,
      variables: { input: updateObject }
    })

    // return calendars
    return calendarResponse.data.updateCalendar
  },
  async adminDeleteCalendar(_, payload) {
    // get data from payload
    const { id } = payload

    // delete calendar from backend
    const calendarResponse = await API.graphql({
      query: mutations.adminDeleteCalendar,
      variables: { input: { id: id } }
    })
    console.log(calendarResponse)
    // return calendars
    return calendarResponse
  },
  async calendarFetchUsers(_, payload) {
    if (isLocalAuthMode) {
      return listLocalUsers()
    }

    const { nextToken, filter } = payload
    const limit = 30
    const apiName = 'AdminQueries'
    const path = '/listUsers'
    const myInit = {
      queryStringParameters: {
        limit: limit,
        token: nextToken
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`
      }
    }
    const response = await API.get(apiName, path, myInit)
    return response
  },
  async createParticipation(_, payload) {
    if (isLocalAuthMode) {
      return {
        data: {
          createParticipation: {
            id: `demo-participation-${Date.now()}`,
            participant: payload.participantId,
            calendarParticipationsId: payload.calendarId,
            type: payload.userType
          }
        }
      }
    }

    // get data from payload
    const { participantId, calendarId, userType } = payload

    // create params object
    const params = {
      participant: participantId,
      calendarParticipationsId: calendarId,
      type: userType
    }

    // create participation using graphQL
    const participationResponse = await API.graphql({
      query: mutations.createParticipation,
      variables: { input: params }
    })

    return participationResponse
  },
  async listParticipationByCalendar(_, payload) {
    if (isLocalAuthMode) {
      return listLocalParticipationsByCalendar(payload.id)
    }

    // get data from payload
    const { id } = payload

    // create participation using graphQL
    const participationResponse = await API.graphql({
      query: queries.participationByCalendar,
      variables: { calendarParticipationsId: id }
    })

    return participationResponse
  },
  async deleteParticipation(_, payload) {
    // get data from payload
    const { id } = payload

    // create participation using graphQL
    const participationResponse = await API.graphql({
      query: mutations.deleteParticipation,
      variables: { input: { id } }
    })

    return participationResponse
  },
  async createEvent(_, payload) {
    if (isLocalAuthMode) {
      return createLocalEvent(payload)
    }

    // create event using graphQL
    const eventResponse = await API.graphql({
      query: mutations.createEvent,
      variables: { input: payload }
    })

    return eventResponse
  },
  async deleteEvent(_, payload) {
    // get data from payload
    const { id } = payload

    // create participation using graphQL
    const eventResponse = await API.graphql({
      query: mutations.deleteEvent,
      variables: { input: { id } }
    })

    return eventResponse
  },
  async listEventsByDate(_, payload) {
    if (isLocalAuthMode) {
      return listLocalEvents()
    }

    const { startDate } = payload

    // get timezone offset
    const offset = new Date(startDate).getTimezoneOffset() * 60 * 1000
    // Create a new date with the offset
    const start = new Date(
      new Date(new Date(startDate).setHours(0)).valueOf() - offset
    ).toISOString()
    const end = new Date(
      new Date(new Date(startDate).setHours(24)).valueOf() - offset
    ).toISOString()

    var variables = {
      active: 'active',
      startDate: {
        between: [start, end]
      }
    }

    // get calendars from backend
    const eventResponse = await API.graphql(graphqlOperation(customQueries.fetchEventsByActive, variables))

    // return calendars
    return eventResponse.data.eventsByActive
  },
  async listEventsByCalendar(_, payload) {
    if (isLocalAuthMode) {
      return listLocalEventsByCalendar(payload.id)
    }

    const { id } = payload

    // get first day of previous month
    const previousMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).toISOString()

    // get calendars from backend
    const eventResponse = await API.graphql({
      query: queries.eventsByCalendar,
      variables: { calendarEventsId: id, startDate: { gt: previousMonthStart } }
    })

    // return calendars
    return eventResponse.data.eventsByCalendar.items
  },
  async createNoteAndNotetags(_, payload) {
    const { noteTitle, noteDescription, participants } = payload
    // Create params object
    const params = {
      noteTitle: noteTitle,
      noteDescription: noteDescription,
      participants: JSON.stringify(participants)
    }
    // Call backend function via API to create note and all connected notetags
    const noteResponse = await API.graphql({
      query: mutations.createNoteAndNotetags,
      variables: { input: params }
    })

    return noteResponse
  },
  async getNotesByStatus(_, payload) {
    if (isLocalAuthMode) {
      return listLocalNotes()
    }

    // get ntoestatus from payload
    const { noteStatus } = payload
    // get notes by status via appsync
    const noteResponse = await API.graphql({
      query: queries.notesByStatus,
      variables: { status: noteStatus, sortDirection: 'DESC' }
    })
    return noteResponse.data.notesByStatus
  },
  async markNoteDone(_, payload) {
    // get data from payload
    const { id } = payload

    // create updateObject
    const updateObject = {
      id: id,
      status: 'done'
    }

    // mark note in backend
    const noteResponse = await API.graphql({
      query: mutations.updateNote,
      variables: { input: updateObject }
    })

    // return note
    return noteResponse.data.updateNote
  },
  async markNoteRead(_, payload) {
    // get data from payload
    const { id } = payload

    // create updateObject
    const updateObject = {
      id: id,
      status: 'read'
    }

    // mark note tag read from backend
    const noteTagResponse = await API.graphql({
      query: mutations.updateNoteTag,
      variables: { input: updateObject }
    })

    // return notetag
    return noteTagResponse.data.updateNoteTag
  },
  async deleteNote(_, payload) {
    // get data from payload
    const { id } = payload

    // mark note in backend
    const noteResponse = await API.graphql({
      query: mutations.deleteNote,
      variables: { input: { id } }
    })

    // return note
    return noteResponse.data.deleteNote
  },
  async checkUnreadNotesStatus() {
    if (isLocalAuthMode) {
      return localUnreadNotesStatus()
    }

    // get calendars from backend
    const noteTagResponse = await API.graphql({
      query: queries.checkUnreadNotesStatus
    })
    // parse status from json string
    const noteTagStatus = JSON.parse(
      noteTagResponse.data.checkUnreadNotesStatus
    )

    // return notetag status
    return noteTagStatus
  },
  async adminCheckChildArchivePossibility(_, payload) {
    // get id from payload
    const { id } = payload
    const resp = await API.graphql({
      query: queries.adminCheckChildArchivePossibility,
      variables: { input: { id } }
    })
    return JSON.parse(resp.data.adminCheckChildArchivePossibility)
  },
  async adminArchiveClient(_, payload) {
    // get id from payload
    const { id } = payload
    const resp = await API.graphql({
      query: mutations.adminArchiveClient,
      variables: { input: { id } }
    })
    return resp
  }
}
