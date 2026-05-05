/* eslint-disable */

// Configure AWS
const AWS = require('aws-sdk');
// Get the region
const region = process.env.REGION;
// Set the lambda instance
const lambda = new AWS.Lambda(region);

module.exports = {
  async callLambdaFunction(functionName, data) {
    // Create the parameters object for calling the lambda
    let params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify(data)
    };
    // Invoke the lambda with the promises
    const lambdaResult = await lambda.invoke(params).promise();
    // Get the reponse payload and parse its json string
    const response = JSON.parse(lambdaResult.Payload);
    // Get the message from the response body
    const message = response.body;
    // Get the status code from the response body
    const statusCode = response.statusCode;
    // If status code is 200, everything is ok, so publish the success message
    if (statusCode === 200) {
      return message
    }
    // Else something was going wrong on the handler invocation, so throw an error with the given error message
    throw new Error(message)
  }
}