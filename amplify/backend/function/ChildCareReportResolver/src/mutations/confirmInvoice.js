/* eslint-disable */

// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { getInvoices } = require('../modules/appsync/graphql/queries.js')
const { updateInvoices } = require('../modules/appsync/graphql/mutations.js')
const { request } = require('../modules/appsync/appsyncRequest.js');
// Initialize AWS SES email handler
const { sesHandler } = require('../modules/ses/sesHandler.js')

module.exports = {
  confirmInvoice: async (ctx) => {
    try {
      console.log('CTX-CONFIRM-INVOICE', ctx);
      // Get the data from the inputData
      const invoiceId = ctx.arguments.input.invoiceId

      // get invoice object
      const invoiceResponse = await request(getInvoices, 'GetInvoices', { id: invoiceId }, appsyncUrl);
      const invoiceData = invoiceResponse.data.getInvoices;

      // check if invoice is already charged
      if (invoiceData.charged) {
        throw new Error(`Rechnung wurde bereits freigegeben`);
      }

      // check if any dailyReport is in revise status
      for (const report of invoiceData.dailyReport.items) {
        if (report.flag === 'revise') {
          throw new Error(`Tagesbericht der Rechnung befindet sich im Überarbeiten-Zustand`);
        }
      }

      // check if carrier allows automatic mail
      if (invoiceData.carrier.email && invoiceData.carrier.allowAutoInvoice) {
        // provide invoice id to mail handler
        await sesHandler({ invoiceID: invoiceData.id, carrierID: invoiceData.carrier.id, carrierEmail: invoiceData.carrier.email, carrierName: invoiceData.carrier.name, internalNumber: invoiceData.internalNumber })
      }

      // update charged status of invoice
      const invoiceUpdateResponse = await request(updateInvoices, 'UpdateInvoices', { input: { id: invoiceId, charged: true } }, appsyncUrl);
      console.log('#R-invoiceUpdateResponse', invoiceUpdateResponse);

      // return invoice
      return invoiceUpdateResponse
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Rechnung konnte nicht freigegeben werden.`, err)
    }
  }
}