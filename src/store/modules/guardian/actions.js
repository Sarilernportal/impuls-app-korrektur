/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
01.11.2022

Scope:
Guardian Actions
*/

import { API, Storage, Auth } from 'aws-amplify'
import * as queries from '@/graphql/queries'
import * as mutations from '@/graphql/mutations'
import { Buffer } from 'buffer'
import { isLocalAuthMode } from '@/services/authService.js'
import {
  closestEvent as localClosestEvent,
  getGuardian as getLocalGuardian,
  listDailyReports as listLocalDailyReports,
  listEvents as listLocalEvents,
  listFiles as listLocalFiles,
  listTimesheets as listLocalTimesheets
} from '@/services/localDemoData.js'

export default {
  // Method for set the guardian via mutation
  async setGuardian(ctx, payload) {
    ctx.commit('setGuardian', payload)
  },
  // Fetch the guardian data from the backend
  async fetchGuardianData(ctx) {
    if (isLocalAuthMode) {
      const guardian = getLocalGuardian('demo-guardian-1')
      await ctx.dispatch('setGuardian', { guardian })
      return guardian
    }

    const response = await API.graphql({ query: queries.getGuardianByGuardian })
    const guardian = JSON.parse(response.data.getGuardianByGuardian)
    await ctx.dispatch('setGuardian', { guardian: guardian })
    return guardian
  },
  async getChildCarrierStatus(_, payload) {
    const { id } = payload
    const response = await API.graphql({
      query: queries.getChildCarrierStatus,
      variables: { input: { id: id } }
    })
    const status = JSON.parse(response.data.getChildCarrierStatus)
    return status
  },
  async getDailyReports(_) {
    if (isLocalAuthMode) {
      return listLocalDailyReports()
    }

    const response = await API.graphql({
      query: queries.listDailyReportsByGuardian
    })
    const reports = JSON.parse(response.data.listDailyReportsByGuardian)
    return reports.sort((a, b) =>
      new Date(a.documentDate) < new Date(b.documentDate)
        ? 1
        : new Date(b.documentDate) < new Date(a.documentDate)
        ? -1
        : 0
    )
  },
  async guardianGetDailyReport(_, payload) {
    // get id from payload
    const { id } = payload

    // get report from AppSync
    const response = await API.graphql({
      query: queries.getDailyReportByGuardian,
      variables: { input: { id: id } }
    })
    const report = JSON.parse(response.data.getDailyReportByGuardian)
    return report
  },
  async getTimesheets(_, payload) {
    if (isLocalAuthMode) {
      return listLocalTimesheets()
    }

    // get data from payload
    const { nextToken } = payload

    const response = await API.graphql({
      query: queries.listTimeSheetsByGuardian,
      variables: { input: { nextToken: nextToken } }
    })
    const timeSheets = JSON.parse(response.data.listTimeSheetsByGuardian)
    return timeSheets
  },
  async downloadDocument(_, payload) {
    const { key } = payload
    // Get the raw data from the storage bucket
    const user = await Auth.currentAuthenticatedUser()
    const result = await Storage.get(key, {
      level: 'private',
      download: true,
      cacheControl: 'no-cache',
      contentType: 'application/pdf',
      identityId: user.username
    })
    // Convert it to a data blob TBD: Title
    const blob = new Blob([result.Body], {
      type: 'application/pdf',
      title: 'my title '
    })
    // Get the object url to push it to the pdf iframe
    return URL.createObjectURL(blob)
  },
  async createReport(_, payload) {
    // Get the signature from the payload
    const { signature } = payload
    // get user object, sub required for private upload
    const user = await Auth.currentAuthenticatedUser()
    // Get the raw data from the payload
    const data = payload.data
    // Set the private path key with private prefix
    data.privatePath = `private/${user.username}/`
    // set the image from signature
    data.signatureImage = signature
    // stringify json data
    data.guardian = JSON.stringify(data.guardian)
    data.homework = JSON.stringify(data.homework)
    // Send the data to the backend database
    const response = await API.graphql({
      query: mutations.createReport,
      variables: { input: data }
    })
    return response
  },
  async createSpecialReport(_, payload) {
    // Get the signature from the payload
    const { signature, data } = payload
    // get user object, sub required for private upload
    const user = await Auth.currentAuthenticatedUser()
    // Set the private path key with private prefix
    data.privatePath = `private/${user.username}/`
    // set the image from signature
    data.signatureImage = signature
    // stringify json data
    data.guardian = JSON.stringify(data.guardian)
    // Send the data to the backend database
    const response = await API.graphql({
      query: mutations.createSpecialReport,
      variables: { input: data }
    })
    return response
  },
  async updateReport(_, payload) {
    // Get the signature from the payload
    const { signature } = payload
    // get user object, sub required for private upload
    const user = await Auth.currentAuthenticatedUser()
    // Get the raw data from the payload
    const data = payload.data
    // Set the private path key with private prefix
    data.privatePath = `private/${user.username}/`
    // set the image from signature
    data.signatureImage = signature
    // stringify json data
    data.guardian = JSON.stringify(data.guardian)
    data.homework = JSON.stringify(data.homework)
    console.log(data)
    // Send the data to the backend database
    const response = await API.graphql({
      query: mutations.guardianUpdateDailyReport,
      variables: { input: data }
    })
    return response
  },
  async updateSpecialReport(_, payload) {
    // Get the signature from the payload
    const { signature } = payload
    // get user object, sub required for private upload
    const user = await Auth.currentAuthenticatedUser()
    // Get the raw data from the payload
    const data = payload.data
    // Set the private path key with private prefix
    data.privatePath = `private/${user.username}/`
    // set the image from signature
    data.signatureImage = signature
    // stringify json data
    data.guardian = JSON.stringify(data.guardian)
    // Send the data to the backend database
    const response = await API.graphql({
      query: mutations.guardianUpdateSpecialReport,
      variables: { input: data }
    })
    return response
  },
  async createTimesheet(_, payload) {
    // Get the signature from the payload
    const { signature } = payload
    // get user object, sub required for private upload
    const user = await Auth.currentAuthenticatedUser()
    // Get the raw data from the payload
    const data = payload.data
    // Set the private path key with private prefix
    data.privatePath = `private/${user.username}/`
    // set the image from signature
    data.signatureImage = signature
    // stringify json data
    data.documents = JSON.stringify(data.documents)
    // Send the data to the backend database
    const response = await API.graphql({
      query: mutations.createTimesheet,
      variables: { input: data }
    })
    return response
  },
  async createSpecialTimesheet(_, payload) {
    // Get the signature from the payload
    const { signature } = payload
    // get user object, sub required for private upload
    const user = await Auth.currentAuthenticatedUser()
    // Get the raw data from the payload
    const data = payload.data
    // Set the private path key with private prefix
    data.privatePath = `private/${user.username}/`
    // set the image from signature
    data.signatureImage = signature
    // stringify json data
    data.documents = JSON.stringify(data.documents)
    // Send the data to the backend database
    const response = await API.graphql({
      query: mutations.createSpecialTimesheet,
      variables: { input: data }
    })
    return response
  },
  async downloadTemporaryTimeSheet(_, payload) {
    // stringify json data
    const data = JSON.stringify(payload.documents)
    // Send the data to the backend database
    const response = await API.graphql({
      query: queries.downloadTemporaryTimeSheet,
      variables: { input: { documents: data } }
    })
    const docs = JSON.parse(response.data.downloadTemporaryTimeSheet)

    var decodedFiles = []

    for (const doc of docs) {
      // decode doc data from base64
      const decodedBase64 = Buffer.from(doc.document, 'base64')
      // create Blob using decoded file
      const decodedFile = new Blob([decodedBase64], {
        type: 'application/pdf'
      })
      // create document object with name and Blob link
      decodedFiles.push({
        name: doc.name,
        document: URL.createObjectURL(decodedFile)
      })
    }
    // return array of generated preview files
    return decodedFiles
  },
  async downloadFromSharebox(_, payload) {
    if (isLocalAuthMode) {
      return ''
    }

    const { key } = payload

    // get item name with file type
    const itemName = key.split('/').slice(2, 3).join('/')

    // download file using s3 controller
    const downloadResponse = await API.graphql({
      query: queries.guardianDownloadShareboxItem,
      variables: { input: { key: itemName } }
    })
    const file = JSON.parse(downloadResponse.data.guardianDownloadShareboxItem)

    // data come as byte array, needs to be decoded
    const decodedFile = new Blob([new Uint8Array(file.Body.data)], {
      type: file.ContentType
    })

    // create blob URL
    const fileURL = URL.createObjectURL(decodedFile)

    // return download response
    return fileURL
  },
  async deleteDailyReport(_, payload) {
    // get id from payload
    const { id } = payload

    // call delete controller
    const response = await API.graphql({
      query: mutations.guardianDeleteDailyReport,
      variables: { input: { id: id } }
    })
    return response
  },
  async getGuardianFlagStatusByGuardian() {
    if (isLocalAuthMode) {
      return { status: false }
    }

    // send request, no values requires, validation is done by identity
    const response = await API.graphql({
      query: queries.getGuardianFlagStatusByGuardian
    })

    // return parsed JSON
    return JSON.parse(response.data.getGuardianFlagStatusByGuardian)
  },
  async getFlaggedReportsByGuardian() {
    if (isLocalAuthMode) {
      return {}
    }

    // send request, no values requires, validation is done by identity
    const response = await API.graphql({
      query: queries.getFlaggedReportsByGuardian
    })

    // return parsed JSON
    return JSON.parse(response.data.getFlaggedReportsByGuardian)
  },
  async getFlaggedReportsByTimesheet(_, payload) {
    // get invoice id from payload
    const { timesheetId } = payload

    // call controller
    const response = await API.graphql({
      query: queries.getFlaggedReportsByTimesheet,
      variables: { input: { timesheetId } }
    })

    // return parsed JSON
    return JSON.parse(response.data.getFlaggedReportsByTimesheet)
  },
  async updateFlaggedReports(_, payload) {
    // Get the signature from the payload
    const { data } = payload
    // Send the data to the backend API controller
    const response = await API.graphql({
      query: mutations.updateTimesheet,
      variables: { input: data }
    })
    return response
  },
  async updateFlaggedSpecialReports(_, payload) {
    // Get the signature from the payload
    const { data } = payload
    // Send the data to the backend API controller
    const response = await API.graphql({
      query: mutations.updateSpecialTimesheet,
      variables: { input: data }
    })
    return response
  },
  async listSpecialDailyReportsByGuardian(_, payload) {
    // get data from payload
    const { nextToken } = payload
    // get daily reports of guardian with reportActivity being special-case
    const response = await API.graphql({
      query: queries.listSpecialDailyReportsByGuardian,
      variables: { input: { nextToken: nextToken } }
    })
    return JSON.parse(response.data.listSpecialDailyReportsByGuardian)
  },
  async guardianListEvents(_, payload) {
    if (isLocalAuthMode) {
      return listLocalEvents()
    }

    // Get the signature from the payload
    const { startDate, endDate } = payload
    // Send the data to the backend API controller
    const response = await API.graphql({
      query: queries.listEventsByIdentity,
      variables: { input: { startDate: startDate, endDate: endDate } }
    })
    return JSON.parse(response.data.listEventsByIdentity)
  },
  async guardianGetClosestEvents() {
    if (isLocalAuthMode) {
      return localClosestEvent()
    }

    // Send the data to the backend API controller
    const response = await API.graphql({
      query: queries.getNextEventByIdentity
    })
    return JSON.parse(response.data.getNextEventByIdentity)
  },
  async checkCreatedReportsCounts() {
    if (isLocalAuthMode) {
      // Zähler aus den Demo-Dokumentationen ableiten (bleibt in Sync).
      const reports = listLocalDailyReports()
      const specialActivities = [
        'holiday',
        'vacation',
        'employeeSickness',
        'teamMeeting',
        'furtherEducation',
        'miscellaneous'
      ]
      const special = reports.filter((report) =>
        specialActivities.includes(report.reportActivity)
      ).length
      return {
        standard: reports.length - special,
        special
      }
    }

    // no data required --> get counts by identity
    const response = await API.graphql({
      query: queries.checkCreatedReportsCount
    })
    return JSON.parse(response.data.checkCreatedReportsCount)
  }
}
