/* eslint-disable */
// Import the upload file from s3 helper function
const { uploadFile } = require('../modules/ses/s3Handler.js');

module.exports = {
  uploadShareboxItem: async (ctx) => {
    console.log('#CTX-uploadShareboxItem', ctx)
    try {
      const files = ctx.arguments.input.files.files
      const folder = ctx.arguments.input.files.folder

      for (const file of files) {
        console.log('#FILE', file)
        // Document is in base64, so decode it to a buffer
        const buf = Buffer.from(file.data, 'base64');

        const key = 'private/' + folder + '/' + file.name

        await uploadFile(buf, key, file.type);
      }

    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Upload could not be finished`, err)
    }
  }
}