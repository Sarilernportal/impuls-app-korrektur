/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const { getInvoices } = require('../modules/appsync/graphql/queries.js')

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getInvoice: async (ctx) => {
    console.log('#CTX-getInvoice', ctx)
    try {
      const id = ctx.id;
      const response = await request(getInvoices, 'GetInvoices', { id }, appsyncUrl);
      console.log('#R', response);
      const invoice = response.data.getInvoices
      console.log('#INVOICE', invoice);

      return invoice;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Invoice not found`, err)
    }
  }
}