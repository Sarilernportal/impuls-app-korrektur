/* eslint-disable */
// Import the delete file from s3 helper function
const { deleteFile } = require('../modules/ses/s3Handler.js');

module.exports = {
  deleteShareboxItem: async (ctx) => {
    console.log('#CTX-deleteShareboxItem', ctx)
    try {
      const key = ctx.arguments.input.key

      await deleteFile(key);

    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`File could not be deleted`, err)
    }
  }
}