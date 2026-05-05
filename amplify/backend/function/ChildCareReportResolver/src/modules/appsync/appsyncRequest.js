/* eslint-disable */
/**
 *
 * @param {Object} queryDetails the query, operationName, and variables
 * @param {String} appsyncUrl url of your AppSync API
 * @param {String} apiKey the api key to include in headers. if null, will sign with SigV4
 */

// Initialize the aws sdk
const AWS = require('aws-sdk')
// Get the current aws region
const region = process.env.REGION
// Intialize https and url parser for appsync calls
const https = require('https')
const urlParse = require('url').URL

// Export the request
exports.request = (query, operationName, inputItem, appsyncUrl) => {
    // Create a new aws http request
    const req = new AWS.HttpRequest(appsyncUrl, region)
    // Get the endpoint
    const endpoint = new urlParse(appsyncUrl).hostname.toString()
    // Define the request parameters
    req.method = 'POST'
    req.path = '/graphql'
    req.headers.host = endpoint
    req.headers['Content-Type'] = 'application/json'
    // Define the request body
    req.body = JSON.stringify({
        query: query,
        operationName: operationName,
        variables: inputItem
    });

    // Sign the request and add the authorization
    const signer = new AWS.Signers.V4(req, 'appsync', true)
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate())

    return new Promise((resolve, reject) => {
        // Make the request
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
            let data = "";

            // Fetch the data from the request
            result.on("data", (chunk) => {
                data += chunk;
            });

            // When everything is fetched. resolve the request
            result.on("end", () => {
                const completed = JSON.parse(data.toString());
                if (completed.errors && completed.errors.length !== 0) {
                    if (completed.errors[0].message) {
                        reject(new Error(completed.errors[0].message));
                    }
                    reject(new Error(completed));
                }
                resolve(completed);
            });
        });

        // When an error occurs, reject the request
        httpRequest.on('error', (e) => {
            reject(e);
        });

        // Write to the request
        httpRequest.write(req.body);
        httpRequest.end();
    }).catch((err) => {
        // Throw the error, when something goes wrong
        throw err;
    })
}