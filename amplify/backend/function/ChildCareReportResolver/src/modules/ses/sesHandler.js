const { sendMail } = require('./mailHandler.js');
const { downloadFile } = require('./s3Handler.js');

module.exports = {
  async sesHandler(event) {
    // get invoice data
    const { invoiceID, carrierID, carrierEmail, carrierName, internalNumber } = event

    // set required data
    const key = `private/${carrierID}/${invoiceID}.pdf`;
    const destination = carrierEmail;
    const clientname = carrierName;
    const invoiceNUmber = internalNumber

    // download invoice from s3
    const downloadResponse = await downloadFile(key);
    const file = downloadResponse.Body;

    const mail = await sendMail(destination, clientname, invoiceNUmber, file);
    return mail
  }
};