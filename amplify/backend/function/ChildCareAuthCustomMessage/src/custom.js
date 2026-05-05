// Import helper functions for creating messages
const { welcomeEmail, passwordForgetEmail } = require('./customMessages.js');

exports.handler = (event, context, callback) => {
  // Define the URL that you want the user to be directed to after verification is complete
  if (event.triggerSource === 'CustomMessage_AdminCreateUser' || event.triggerSource === 'CustomMessage_ForgotPassword') {
    const { usernameParameter, codeParameter } = event.request;

    let emailMessage = '';
    let emailSubject = '';

    if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
      const welcomeEmailObject = welcomeEmail(usernameParameter, codeParameter);
      emailSubject = welcomeEmailObject.subject;
      emailMessage = welcomeEmailObject.htmlMessage;
    } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
      const passwordForgetEmailObject = passwordForgetEmail(codeParameter);
      emailSubject = passwordForgetEmailObject.subject;
      emailMessage = passwordForgetEmailObject.htmlMessage;
    }

    event.response.emailSubject = emailSubject;
    event.response.emailMessage = emailMessage;
    callback(null, event);
  } else {
    callback(null, event);
  }
};
