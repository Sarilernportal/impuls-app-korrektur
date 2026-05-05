/* eslint-disable */
// import s3 handler
const { listFiles } = require('../modules/ses/s3Handler.js')

module.exports = {
  listGuardianSharebox: async (ctx) => {
    console.log('#CTX-listGuardianSharebox', ctx)
    try {
      // get file list from s3
      const fileResponse = await listFiles('private/guardian')
      console.log('#FILES', fileResponse)

      // get files array
      const files = fileResponse.Contents

      // filter out files with size 0 --> represent folders
      const minSizeFiles = files.filter((file) => { return file.Size > 0 })

      // return file list
      return JSON.stringify(minSizeFiles)
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Sharebox could not be listed`, err)
    }
  }
}