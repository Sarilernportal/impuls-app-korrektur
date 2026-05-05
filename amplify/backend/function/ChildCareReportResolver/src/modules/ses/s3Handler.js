// Configure AWS
const AWS = require('aws-sdk');
// Set the S3 Instance
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports = {
  async listFiles(prefix) {
    const params = {
      Bucket: process.env.STORAGE_CHILDCARESTORAGE_BUCKETNAME,/* required */
      Prefix: prefix  // Can be your folder name
    };
    return await s3.listObjectsV2(params).promise()
  },

  async downloadFile(key) {
    const params = {
      Bucket: process.env.STORAGE_CHILDCARESTORAGE_BUCKETNAME,
      Key: key
    };
    return await s3.getObject(params).promise()
  },

  async uploadFile(data, key, contentType) {
    const params = {
      Bucket: process.env.STORAGE_CHILDCARESTORAGE_BUCKETNAME,
      Body: data,
      Key: key,
      ContentEncoding: 'base64',
      ContentType: contentType
    };
    return await s3.putObject(params).promise()
  },

  async deleteFile(key) {
    const params = {
      Bucket: process.env.STORAGE_CHILDCARESTORAGE_BUCKETNAME,
      Key: key
    };
    return await s3.deleteObject(params).promise()
  }
}