/* eslint-disable */
module.exports = {
    // Generate the HTML for the email when a new user is created.
    invoiceEmail(customer, invoiceNumber) {
        const emailObject = {
            subject: `Impuls Erziehungshilfen - Rechnung ${invoiceNumber}`,
            htmlMessage: `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
      
      <head>
          <meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
          <style>
              body {
                  margin: 0;
              }
      
              h1 {
                  font-size: 60px;
                  padding-left: auto;
                  padding-right: auto;
                  margin-left: auto;
                  margin-right: auto;
              }
      
              table,
              tr {
                  margin-left: auto;
                  margin-right: auto;
                  font-size: 30;
              }
      
              td {
                  text-align: center;
              }
          </style>
      </head>
      
      <body style="overflow-x: scroll; background-color: #374558;">
          <table cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" style="width: 650px;" border="0">
              <tr>
                  <td style="padding: 25.0px 25.0px 25.0px 25.0px; font-weight: bold; font-size: 22.0px;text-align: center; width: auto; font-family: 'Trebuchet MS', sans-serif;"
                      align="center">
                      Ihre Rechnung ${invoiceNumber}
                  </td>
              </tr>
              <tr>
                  <td style="padding: 10.0px 25.0px 20.0px 25.0px; font-weight: bold; font-size: 16.0px;text-align: justify; width: auto; font-family: 'Trebuchet MS', sans-serif;"
                      align="center">
                      <br>
                      <br>
                      Sehr geehrter Damen und Herren,
                      <br>
                      <br>
                      Sie können die für Sie erstellte Rechnung mit der Nummer ${invoiceNumber} dem Anhang entnehmen.
                      <br>
                      <br>
                      Für Rückfragen stehen wir Ihnen gerne jederzeit zur Verfügung.
                      <br>
                      <br>
                      Mit freundlichen Grüßen
                      <br>
                      <br>
                      Impuls GmbH
                      <br>
                      Institut für Erziehungshilfen und Therapien
                      <br>
                      Bahnhofstrasse 23
                      <br>
                      65428 Rüsselsheim
                      <br>
                      <br>
                      Tel. 06142-489 80 80
                      <br>
                      Email: info@impuls-erziehungshilfen.de
                      <br>
                      <br>
                      ---- Diese Email wurde automatisch generiert ----
                  </td>
              </tr>
              <tr>
                  <td style="padding-top: 20px; padding-bottom: 20px;">
                  </td>
              </tr>
          </table>
      </body>
      </html>`
        };
        return emailObject
    }
}
