/* Amplify Params - DO NOT EDIT
  API_CHILDCAREAPI_CARRIERTABLE_ARN
  API_CHILDCAREAPI_CARRIERTABLE_NAME
  API_CHILDCAREAPI_DAILYREPORTTABLE_ARN
  API_CHILDCAREAPI_DAILYREPORTTABLE_NAME
  API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT
  API_CHILDCAREAPI_GRAPHQLAPIIDOUTPUT
  API_CHILDCAREAPI_GUARDIANTABLE_ARN
  API_CHILDCAREAPI_GUARDIANTABLE_NAME
  API_CHILDCAREAPI_INVOICESTABLE_ARN
  API_CHILDCAREAPI_INVOICESTABLE_NAME
  API_CHILDCAREAPI_TIMESHEETSTABLE_ARN
  API_CHILDCAREAPI_TIMESHEETSTABLE_NAME
  ENV
  FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME
  REGION
  STORAGE_CHILDCARESTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */ /* Amplify Params - DO NOT EDIT
  API_CHILDCAREAPI_CARRIERTABLE_ARN
  API_CHILDCAREAPI_CARRIERTABLE_NAME
  API_CHILDCAREAPI_DAILYREPORTTABLE_ARN
  API_CHILDCAREAPI_DAILYREPORTTABLE_NAME
  API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT
  API_CHILDCAREAPI_GRAPHQLAPIIDOUTPUT
  API_CHILDCAREAPI_GUARDIANTABLE_ARN
  API_CHILDCAREAPI_GUARDIANTABLE_NAME
  API_CHILDCAREAPI_INVOICESTABLE_ARN
  API_CHILDCAREAPI_INVOICESTABLE_NAME
  API_CHILDCAREAPI_TIMESHEETSTABLE_ARN
  API_CHILDCAREAPI_TIMESHEETSTABLE_NAME
  ENV
  FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME
  REGION
  STORAGE_CHILDCARESTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

// Get the custom mutations
const { createReport } = require('./mutations/createReport.js');
const { createTimesheet } = require('./mutations/createTimesheet.js');
const { updateTimesheet } = require('./mutations/updateTimesheet.js');
const { createInvoice } = require('./mutations/createInvoice.js');
const { uploadShareboxItem } = require('./mutations/uploadShareboxItem.js');
const { deleteShareboxItem } = require('./mutations/deleteShareboxItem.js');
const {
  guardianDeleteDailyReport
} = require('./mutations/guardianDeleteDailyReport.js');
const {
  guardianUpdateDailyReport
} = require('./mutations/guardianUpdateDailyReport.js');
const { confirmInvoice } = require('./mutations/confirmInvoice.js');
const { adminDeleteCalendar } = require('./mutations/adminDeleteCalendar.js');
const {
  createNoteAndNotetags
} = require('./mutations/createNoteAndNotetags.js');
const {
  adminCreateEmptyReport
} = require('./mutations/adminCreateEmptyReport.js');
const { createSpecialReport } = require('./mutations/createSpecialReport.js');
const {
  createSpecialTimesheet
} = require('./mutations/createSpecialTimesheet.js');
const {
  guardianUpdateSpecialReport
} = require('./mutations/guardianUpdateSpecialReport.js');
const {
  updateSpecialTimesheet
} = require('./mutations/updateSpecialTimesheet.js');
const {
  adminRegenerateInvoice
} = require('./mutations/adminRegenerateInvoice.js');
const { adminArchiveClient } = require('./mutations/adminArchiveClient.js');

// get custom queries
const {
  listDailyReportsByGuardian
} = require('./queries/listDailyReportsByGuardian.js');
const { getGuardianByGuardian } = require('./queries/getGuardianByGuardian');
const {
  listTimeSheetsByGuardian
} = require('./queries/listTimeSheetsByGuardian.js');
const { getChildCarrierStatus } = require('./queries/getChildCarrierStatus.js');
const { listAdminSharebox } = require('./queries/listAdminSharebox.js');
const { listGuardianSharebox } = require('./queries/listGuardianSharebox.js');
const {
  guardianDownloadShareboxItem
} = require('./queries/guardianDownloadShareboxItem.js');
const {
  getDailyReportByGuardian
} = require('./queries/getDailyReportByGuardian');
const { listChildrenByCarrier } = require('./queries/listChildrenByCarrier.js');
const {
  getGuardianFlagStatusByGuardian
} = require('./queries/getGuardianFlagStatusByGuardian.js');
const {
  getFlaggedReportsByGuardian
} = require('./queries/getFlaggedReportsByGuardian.js');
const {
  getFlaggedReportsByTimesheet
} = require('./queries/getFlaggedReportsByTimesheet.js');
const {
  downloadTemporaryTimeSheet
} = require('./queries/downloadTemporaryTimeSheet.js');
const { listEventsByIdentity } = require('./queries/listEventsByIdentity.js');
const {
  getNextEventByIdentity
} = require('./queries/getNextEventByIdentity.js');
const {
  checkUnreadNotesStatus
} = require('./queries/checkUnreadNotesStatus.js');
const {
  listSpecialDailyReportsByGuardian
} = require('./queries/listSpecialDailyReportsByGuardian.js');
const {
  checkCreatedReportsCount
} = require('./queries/checkCreatedReportsCount.js');
const {
  adminCheckChildArchivePossibility
} = require('./queries/adminCheckChildArchivePossibility.js');

// Initialize the resolvers
const resolvers = {
  // Mutations
  createReport,
  createTimesheet,
  updateTimesheet,
  createInvoice,
  deleteShareboxItem,
  uploadShareboxItem,
  guardianDeleteDailyReport,
  guardianUpdateDailyReport,
  confirmInvoice,
  adminDeleteCalendar,
  createNoteAndNotetags,
  adminCreateEmptyReport,
  createSpecialReport,
  createSpecialTimesheet,
  guardianUpdateSpecialReport,
  updateSpecialTimesheet,
  adminRegenerateInvoice,
  adminArchiveClient,
  // queries
  listDailyReportsByGuardian,
  getGuardianByGuardian,
  listTimeSheetsByGuardian,
  getChildCarrierStatus,
  listAdminSharebox,
  listGuardianSharebox,
  guardianDownloadShareboxItem,
  getDailyReportByGuardian,
  listChildrenByCarrier,
  getGuardianFlagStatusByGuardian,
  getFlaggedReportsByGuardian,
  getFlaggedReportsByTimesheet,
  downloadTemporaryTimeSheet,
  listEventsByIdentity,
  getNextEventByIdentity,
  checkUnreadNotesStatus,
  listSpecialDailyReportsByGuardian,
  checkCreatedReportsCount,
  adminCheckChildArchivePossibility
};

exports.handler = async (event) => {
  // Get the handler type
  console.log('Event', event);
  const typeHandler = resolvers[event.fieldName];
  console.log('#typeHandler', typeHandler);
  if (typeHandler) {
    return await typeHandler(event);
  }
  throw new Error(
    'Fehler beim Verarbeiten der Daten, bitte an den Admin wenden'
  );
};
