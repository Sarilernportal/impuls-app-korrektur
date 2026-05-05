/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const { invoiceNumberByYear } = require('../modules/appsync/graphql/queries.js')
const { updateInvoiceNumber, createInvoiceNumber } = require('../modules/appsync/graphql/mutations.js')

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  invoiceNumberByYear: async (ctx) => {
    console.log('#CTX-invoiceNumberByYear', ctx)
    try {
      const year = ctx.year;
      const response = await request(invoiceNumberByYear, 'InvoiceNumberByYear', { year }, appsyncUrl);
      console.log('#R', response);
      const invoiceNumberList = response.data.invoiceNumberByYear.items;
      console.log('#invoiceNumberList', invoiceNumberList);

      // check if year object exists
      if (invoiceNumberList.length >= 1) {
        // year found --> update value and return
        const newNumber = invoiceNumberList[0].number + 1;

        // update number object
        await request(updateInvoiceNumber, 'UpdateInvoiceNumber', { input: { id: invoiceNumberList[0].id, number: newNumber } }, appsyncUrl);

        // return invoice number
        return newNumber

      } else {
        // no year found --> create new year object
        await request(createInvoiceNumber, 'CreateInvoiceNumber', { input: { year: year, number: 1 } }, appsyncUrl);

        // return invoice number
        return 1
      }
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Child not found`, err)
    }
  }
}