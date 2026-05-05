/* eslint-disable */
/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const { CognitoIdentityServiceProvider } = require('aws-sdk');
// Initialize the AWS SDK
const AWS = require('aws-sdk');
// Initialize https and url for the appsync graphql query
const https = require('https');
const UrlParse = require('url').URL;
// Get the appsync graphql endpoint
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// Configure the endpoint
const endpoint = new UrlParse(appsyncUrl).hostname.toString();
// Get the query operations for the appsync graphql api
// Guardian
const createGuardian =
  require('./modules/appsync/graphql/mutations.js').createGuardian;
const updateGuardian =
  require('./modules/appsync/graphql/mutations.js').updateGuardian;
const deleteGuardian =
  require('./modules/appsync/graphql/mutations.js').deleteGuardian;

// Get the region
const region = process.env.REGION;

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = process.env.AUTH_CHILDCAREAUTH_USERPOOLID;

// Define attributes, which are not custom to make a whitelist
const standardAttributes = [
  'username',
  'name',
  'familyName',
  'family_name',
  'email',
  'phone',
  'phone_number'
];

async function createUser(groupname, attributes) {
  // Groupname is the userType with first capital letter
  const groupnameMapped =
    groupname.charAt(0).toUpperCase() + groupname.slice(1);
  // Generate random Password if user is admin or scheduler
  const password = generatePassword();
  // The username is set to email if it exists
  const username = attributes.email;
  // First try to create the simple cognito user to the backend
  // We need to catch this specific error seperate, to prevent that when e.g.
  // the error is that an user is already created, the fallback will delete this user
  let createUserResult = null;
  try {
    // create deep copy of attribute object
    var tempAttr = Object.assign({}, attributes);
    // change attributes
    // familyName -> family_name,
    if ('familyName' in tempAttr) {
      Object.defineProperty(
        tempAttr,
        'family_name',
        Object.getOwnPropertyDescriptor(tempAttr, 'familyName')
      );
      delete tempAttr['familyName'];
    }
    if ('phone' in tempAttr) {
      // phone -> phone_number
      Object.defineProperty(
        tempAttr,
        'phone_number',
        Object.getOwnPropertyDescriptor(tempAttr, 'phone')
      );
      delete tempAttr['phone'];
    }

    createUserResult = await createCognitoUser(username, password, tempAttr);
  } catch (err) {
    console.log(err);
    throw err;
  }
  // When the cognito user created successfully, more
  try {
    // try to confirm and set his password
    const setUserPasswordResult = await setUserPassword(username, password);
    // add him to the selected group
    const addToGroupResult = await addUserToGroup(username, groupnameMapped);
    // Get the cognito sub id
    const sub = createUserResult.result.User.Username;
    // Only guardian requires the creation of an appsync item
    if (groupnameMapped === 'Guardian') {
      // create the user graphql item
      const createUserItemResult = await createUserItem(sub, attributes);
    }

    console.log(`Success creating user with username to the backend`);
    return {
      result: createUserResult,
      message: `Success creating user with username to the backend`
    };
    // If something goes wrong while performing this steps, delete the new created cognito user to get a clean backend
  } catch (err) {
    console.error(err);
    const deleteUserResult = await deleteCognitoUser(username);
    throw err;
  }
}

// Update the user according to the changes from the admin
async function updateUser(username, modifyInput) {
  try {
    // create deep copy of modifyInput object to update cognito user data
    var tempAttr = Object.assign({}, modifyInput);
    // change attributes
    if ('familyName' in modifyInput) {
      // familyName -> family_name,
      Object.defineProperty(
        tempAttr,
        'family_name',
        Object.getOwnPropertyDescriptor(tempAttr, 'familyName')
      );
      delete tempAttr['familyName'];
    }
    if ('phone' in modifyInput) {
      // phone -> phone_number
      Object.defineProperty(
        tempAttr,
        'phone_number',
        Object.getOwnPropertyDescriptor(tempAttr, 'phone')
      );
      delete tempAttr['phone'];
    }

    // Update the cognito user in the backend and his attributes
    await updateCognitoUser(username, tempAttr);
    // Update the appsync item as well
    const updateUserResult = await updateUserItem(username, modifyInput);
    console.log('Update User Item successfull', updateUserResult);
    return {
      message: `Success updateing user with username ${username}`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateCognitoUser(username, modifyInput) {
  // Create an empty object for the attributes
  let attributesArray = [];
  // Loop through the modify input object and get the keys and values
  for (let [key, value] of Object.entries(modifyInput)) {
    if (!standardAttributes.includes(key)) {
      key = `custom:${key}`;
    }
    attributesArray.push({
      Name: key,
      Value: value
    });
    // If the key is the email, set it also to verified mail
    if (key === 'email') {
      attributesArray.push({
        Name: 'email_verified',
        Value: 'true'
      });
    }
  }
  // Create the params
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: attributesArray
  };
  try {
    // Do the call to the backend
    const result = await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(params)
      .promise();
    console.log(
      `Success updating user with username ${username} from the userpool`
    );
    return {
      result: result,
      message: `Success updating user with username ${username} from the userpool`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

function generatePassword() {
  // Possible characters
  const pwdChars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  // Password length
  const pwdLen = 8;
  // Generate random password
  let randPassword = '';
  while (!validatePassword(randPassword)) {
    randPassword = Array(pwdLen)
      .fill(pwdChars)
      .map((x) => {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
  }
  return randPassword;
}

function validatePassword(password) {
  if (password === '') {
    return false;
  }
  // Min 8 characters
  if (password.length < 8) {
    return false;
  }
  // Min 1 Lowercase
  if (password.search(/[a-z]/) < 0) {
    return false;
  }
  // Min 1 Uppercase
  if (password.search(/[A-Z]/) < 0) {
    return false;
  }
  // Min 1 Number
  if (password.search(/[0-9]/) < 0) {
    return false;
  }
  if (password.length < 0) {
    return false;
  }
  return true;
}

// Sets a password for the new user and set its confirmation status to confirmed
async function setUserPassword(username, password) {
  const setUserPasswordParams = {
    UserPoolId: userPoolId,
    Username: username,
    Password: password,
    Permanent: true
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminSetUserPassword(setUserPasswordParams)
      .promise();
    console.log(`Success setting user password for ${username}`);
    return {
      message: `Success setting user password for ${username}`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Creates a new user in cognito with the given username
async function createCognitoUser(username, password, attributes) {
  // drop undesired keys
  delete attributes['professional'];

  const cognitoAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (!standardAttributes.includes(key)) {
      key = `custom:${key}`;
    }
    cognitoAttributes.push({
      Name: key,
      Value: value
    });
  }
  // Check if contains mail, so push the verified attribute
  if (attributes.email) {
    cognitoAttributes.push({
      Name: 'email_verified',
      Value: 'true'
    });
  }

  console.log('Attributes', cognitoAttributes);
  const createUserParams = {
    UserPoolId: userPoolId,
    Username: username,
    TemporaryPassword: password,
    UserAttributes: cognitoAttributes
    // MessageAction: 'SUPPRESS' // We have to remove this attribute to get our messages back to the client via sms / email
  };
  if (attributes.email) {
    createUserParams.DesiredDeliveryMediums = ['EMAIL'];
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .adminCreateUser(createUserParams)
      .promise();
    console.log(
      `Success creating user with username ${username} to the userpool`
    );
    return {
      result: result,
      message: `Success creating user with username ${username} to the userpool`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Deletes an existing user in cognito with the given username
async function deleteCognitoUser(username) {
  const deleteUserParams = {
    UserPoolId: userPoolId,
    Username: username
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminDeleteUser(deleteUserParams)
      .promise();
    console.log(
      `Success deleting user with username ${username} from the userpool`
    );
    return {
      message: `Success deleting user with username ${username} from the userpool`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createUserItem(sub, attributes) {
  // change professional from string to boolean
  attributes.professional = attributes.professional === 'Fachkraft';

  // Create the input item
  const item = {
    input: {
      id: sub,
      owner: sub,
      archiveStatus: 'unarchived',
      ...attributes
    }
  };

  console.log('#item: ', item);

  // Create the signer for authentication
  const req = new AWS.HttpRequest(appsyncUrl, region);
  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.body = JSON.stringify({
    query: createGuardian,
    operationName: 'CreateGuardian',
    variables: item
  });
  // Sign the request
  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return new Promise((resolve, reject) => {
    // Make the request
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = '';

      // Fetch the data from the request
      result.on('data', (chunk) => {
        data += chunk;
      });

      // When everything is fetched. resolve the request
      result.on('end', () => {
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
    throw err;
  });
}

async function addUserToGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username
  };

  console.log(`Attempting to add ${username} to ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminAddUserToGroup(params)
      .promise();
    console.log(`Success adding ${username} to ${groupname}`);
    return {
      message: `Success adding ${username} to ${groupname}`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateUserItem(username, modifyInput) {
  // Create the input item
  const item = {
    input: {
      id: username,
      ...modifyInput
    }
  };

  // Create the signer for authentication
  const req = new AWS.HttpRequest(appsyncUrl, region);
  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.body = JSON.stringify({
    query: updateGuardian,
    operationName: 'UpdateGuardian',
    variables: item
  });
  // Sign the request
  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return new Promise((resolve, reject) => {
    // Make the request
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = '';

      // Fetch the data from the request
      result.on('data', (chunk) => {
        data += chunk;
      });

      // When everything is fetched. resolve the request
      result.on('end', () => {
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
    throw err;
  });
}

// Deletes an existing user from the grahpql item
async function deleteUserItem(username) {
  // Create the input item
  const item = {
    input: {
      id: username
    }
  };

  // Create the signer for authentication
  const req = new AWS.HttpRequest(appsyncUrl, region);
  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.body = JSON.stringify({
    query: deleteGuardian,
    operationName: 'DeleteGuardian',
    variables: item
  });
  // Sign the request
  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return new Promise((resolve, reject) => {
    // Make the request
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = '';

      // Fetch the data from the request
      result.on('data', (chunk) => {
        data += chunk;
      });

      // When everything is fetched. resolve the request
      result.on('end', () => {
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
    throw err;
  });
}

// Confirms as an admin without using a confirmation code.
async function confirmUserSignUp(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminConfirmSignUp(params)
      .promise();
    console.log(`Confirmed ${username} registration`);
    return {
      message: `Confirmed ${username} registration`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function disableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username
  };

  try {
    // disable login for user
    const result = await cognitoIdentityServiceProvider
      .adminDisableUser(params)
      .promise();
    // log user out from all devices
    await cognitoIdentityServiceProvider
      .adminUserGlobalSignOut(params)
      .promise();
    // get userGroups
    const userGroups = await listGroupsForUser(username, 25, null);
    // check if user is in group Guardian --> only then we need to update the dynamoDB item
    if (
      userGroups.Groups.some((group) => {
        return group.GroupName === 'Guardian';
      })
    ) {
      // update via appsync
      const modifyInput = { archiveStatus: 'archived' };
      await updateUserItem(username, modifyInput);
    }
    console.log(`Disabled ${username}`);
    return {
      message: `Disabled ${username}`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteUser(username) {
  try {
    // first delete the cognito user
    await deleteCognitoUser(username);
    // second delete the user graphql item
    const deleteUserItemResult = await deleteUserItem(username);
    console.log('Delete User Item successfull', deleteUserItemResult);
    return {
      message: `Success deleted user with username ${username} to the backend`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function enableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminEnableUser(params)
      .promise();
    // get userGroups
    const userGroups = await listGroupsForUser(username, 25, null);
    // check if user is in group Guardian --> only then we need to update the dynamoDB item
    if (
      userGroups.Groups.some((group) => {
        return group.GroupName === 'Guardian';
      })
    ) {
      // update via appsync
      const modifyInput = { archiveStatus: 'unarchived' };
      await updateUserItem(username, modifyInput);
    }
    console.log(`Enabled ${username}`);
    return {
      message: `Enabled ${username}`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username
  };

  console.log(`Attempting to retrieve information for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminGetUser(params)
      .promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsers(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken })
  };

  console.log('Attempting to list users');

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsers(params)
      .promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroups(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken })
  };

  console.log('Attempting to list groups');

  try {
    const result = await cognitoIdentityServiceProvider
      .listGroups(params)
      .promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroupsForUser(username, Limit, NextToken) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken })
  };

  console.log(`Attempting to list groups for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise();
    /**
     * We are filtering out the results that seem to be innapropriate for client applications
     * to prevent any informaiton disclosure. Customers can modify if they have the need.
     */
    result.Groups.forEach((val) => {
      delete val.UserPoolId,
        delete val.LastModifiedDate,
        delete val.CreationDate,
        delete val.Precedence,
        delete val.RoleArn;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsersInGroup(groupname, Limit, NextToken) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken })
  };

  console.log(`Attempting to list users in group ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsersInGroup(params)
      .promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Signs out from all devices, as an administrator.
async function signUserOut(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username
  };

  console.log(`Attempting to signout ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminUserGlobalSignOut(params)
      .promise();
    console.log(`Signed out ${username} from all devices`);
    return {
      message: `Signed out ${username} from all devices`
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  addUserToGroup,
  confirmUserSignUp,
  disableUser,
  enableUser,
  getUser,
  listUsers,
  listGroups,
  listGroupsForUser,
  listUsersInGroup,
  signUserOut
};
