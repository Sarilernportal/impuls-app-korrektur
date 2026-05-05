/* eslint-disable */

// Configure AWS
const AWS = require('aws-sdk');
// Get the region
const region = process.env.REGION;
// Initialize the dynamo db doc client
const docClient = new AWS.DynamoDB.DocumentClient({ region });

module.exports = {
  async createReport(
    tableName,
    id,
    data,
    identity,
    key,
    documentStatus,
    reportType
  ) {
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const document = {
      id,
      key,
      childDailyReportId: data.childID,
      guardianDailyReportId: identity,
      carrierDailyReportsId: data.carrierID,
      documentDate: data.date,
      documentEndDate: data.endDate,
      hourFrom: data.hourFrom,
      hourTo: data.hourTo,
      minuteFrom: data.minuteFrom,
      minuteTo: data.minuteTo,
      sick: data.sick,
      sickOnTime: data.sickOnTime,
      substitute: data.substitute,
      homework: data.homework,
      documentStatus: documentStatus,
      reportActivity: data.reportActivity,
      report: data.report,
      exchange: data.exchange,
      parentreport: data.parentreport,
      mood: data.mood,
      createdAt,
      updatedAt,
      owner: identity,
      reportType: reportType,
      type: 'dailyReport',
      __typename: 'Document'
    };
    // report data object
    const createDocumentParams = {
      TableName: tableName,
      Item: document
    };
    await docClient.put(createDocumentParams).promise();
  },
  async createTimesheet(tableName, id, data, identity, key) {
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const document = {
      id,
      key,
      childTimeSheetsId: data.child.id,
      guardianTimeSheetsId: data.child.guardianID,
      carrierTimeSheetsId: data.child.carrierID,
      documentDate: createdAt,
      createdAt,
      updatedAt,
      charged: false,
      transmitted: false,
      owner: identity,
      reportType: 'standard',
      type: 'timeSheet',
      __typename: 'Document'
    };
    // timesheet data object
    const createDocumentParams = {
      TableName: tableName,
      Item: document
    };
    await docClient.put(createDocumentParams).promise();
  },
  async createInvoice(tableName, id, data, key) {
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const document = {
      id,
      key,
      childInvoicesId: data.child.id,
      guardianInvoicesId: data.guardian.id,
      carrierInvoicesId: data.carrier.id,
      internalNumber: data.internalNumber,
      // overwriteHours: data.overwriteHours,
      documentDate: createdAt,
      createdAt,
      updatedAt,
      charged: false,
      transmitted: false,
      type: 'invoice',
      __typename: 'Document'
    };
    // invoice data object
    const createDocumentParams = {
      TableName: tableName,
      Item: document
    };
    await docClient.put(createDocumentParams).promise();
  },
  async createSpecialTimesheet(tableName, id, identity, key) {
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const document = {
      id,
      key,
      guardianTimeSheetsId: identity,
      documentDate: createdAt,
      createdAt,
      updatedAt,
      charged: false,
      transmitted: false,
      owner: identity,
      reportType: 'special',
      type: 'timeSheet',
      __typename: 'Document'
    };
    // timesheet data object
    const createDocumentParams = {
      TableName: tableName,
      Item: document
    };
    await docClient.put(createDocumentParams).promise();
  },
  async updateDocumentTransmitted(tableName, id) {
    // create update object
    const updateDocumentParams = {
      TableName: tableName,
      Key: {
        id: id
      },
      UpdateExpression: 'set documentStatus = :x',
      ExpressionAttributeValues: {
        ':x': 'transmitted'
      }
    };

    // update object
    await docClient.update(updateDocumentParams).promise();
  },
  async updateDocumentTimeSheetLink(tableName, id, timeSheetId) {
    // create update object
    const updateDocumentParams = {
      TableName: tableName,
      Key: {
        id: id
      },
      UpdateExpression: 'set timeSheetsDailyReportId = :x',
      ExpressionAttributeValues: {
        ':x': timeSheetId
      }
    };

    // update object
    await docClient.update(updateDocumentParams).promise();
  },
  async updateDocumentCharged(tableName, id) {
    // create update object
    const updateDocumentParams = {
      TableName: tableName,
      Key: {
        id: id
      },
      UpdateExpression: 'set documentStatus = :x',
      ExpressionAttributeValues: {
        ':x': 'charged'
      }
    };

    // update object
    await docClient.update(updateDocumentParams).promise();
  },
  async updateDocumentInvoiceLink(tableName, id, invoiceId) {
    // create update object
    const updateDocumentParams = {
      TableName: tableName,
      Key: {
        id: id
      },
      UpdateExpression: 'set invoicesDailyReportId = :x',
      ExpressionAttributeValues: {
        ':x': invoiceId
      }
    };

    // update object
    await docClient.update(updateDocumentParams).promise();
  },
  async updateTimeSheetDate(tableName, id, timeSheetDate) {
    // create update object
    const updateDocumentParams = {
      TableName: tableName,
      Key: {
        id: id
      },
      UpdateExpression: 'set timeSheetDate = :x',
      ExpressionAttributeValues: {
        ':x': timeSheetDate.toISOString()
      }
    };

    // update object
    await docClient.update(updateDocumentParams).promise();
  }
};
