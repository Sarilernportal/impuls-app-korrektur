// Configure AWS
const nodemailer = require("nodemailer");
const { invoiceEmail } = require('./templates/document.js');
const aws = require("@aws-sdk/client-ses");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: process.env.REGION,
  defaultProvider,
});
// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

module.exports = {
  async sendMail(destination, clientname, invoiceNumber, file) {
    console.log('MAILDATA', destination, clientname, invoiceNumber, file)
    // set sender address
    const from = "Impuls Erziehungshilfen GmbH - Buchhaltung <buchhaltung@impuls-erziehungshilfen.de>";

    const to = destination;
    // const cc = 'dustin.noack@moebus-group.de';

    const template = invoiceEmail(clientname, invoiceNumber);

    const subject = template.subject;
    const html = template.htmlMessage;
    const attachments = [
      {
        filename: `Rechnung-${invoiceNumber}.pdf`,
        content: file
      }
    ];
    // send some mail
    return await transporter.sendMail({ from, to, subject, html, attachments });
  }
}