/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const { getChild } = require('../modules/appsync/graphql/queries.js')

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getChildCarrierStatus: async (ctx) => {
    console.log('#CTX-getChildCarrierStatus', ctx)
    try {
      const id = ctx.arguments.input.id;
      const response = await request(getChild, 'GetChild', { id }, appsyncUrl);
      console.log('#R', response);
      const child = response.data.getChild
      console.log('#CHILD', child);

      // check if child is connected to carrierContact
      if (!child.carrierContact) {
        return JSON.stringify({ status: false });
      };

      // check if carrierContact is connected to carrier
      if (!child.carrierContact.carrier) {
        return JSON.stringify({ status: false });
      };

      // if child has carrierContact and that carrierContact is connected to a carrier, return true
      // so the guardian knows that he can create a dailyReport and that it will be linked correctly to the carrier (required for invoice creation)
      return JSON.stringify({ status: true });
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Child Carrier status could not be checked`, err)
    }
  }
}