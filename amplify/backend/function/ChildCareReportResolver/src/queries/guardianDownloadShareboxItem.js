/* eslint-disable */
// Import the delete file from s3 helper function
const { downloadFile } = require('../modules/ses/s3Handler.js');

module.exports = {
  guardianDownloadShareboxItem: async (ctx) => {
    console.log('#CTX-guardianDownloadShareboxItem', ctx)
    try {
      const key = ctx.arguments.input.key

      const file = await downloadFile('private/guardian/' + key);
      console.log(file)

      return JSON.stringify(file)
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`File could not be deleted`, err)
    }
  }
}