/* eslint-disable */
module.exports = {
    // Generate the HTML for the email when a new user is created.
    welcomeEmail(username, password) {
        const emailObject = {
            subject: 'Impuls Erziehungshilfe - App Zugangsdaten',
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
                  <td style="padding: 25.0px 25.0px 25.0px 25.0px; font-weight: bold; font-size: 22.0px;text-align: center; width: auto; font-family: 'Trebuchet MS', sans-serif; background-color: #1f2937; color:#ffffff"
                      align="center">
                      Willkommen in der Impuls Erziehungshilfe App
                  </td>
              </tr>
              <tr>
                  <td style="padding: 10.0px 25.0px 20.0px 25.0px; font-weight: bold; font-size: 16.0px;text-align: justify; width: auto; font-family: 'Trebuchet MS', sans-serif;"
                      align="center">
                      <br>
                      <br>
                      Sie wurden zur Impuls Erziehungshilfe App eingeladen. Bitte benutzen Sie die nachfolgenden Daten, um sich in Ihr Konto einzuloggen.
                      <br>
                      <br>
                      Benutzername: ${username}
                      <br>
                      Passwort: ${password}
                      <br>
                      Link zum Login: <a href='https://app.impuls-erziehungshilfen.com/'>Hier klicken</a>
                      <br>
                      <br>
                      <p>
                        Benutzeranleitung: <a href="https://childcare50cffddee9d8472c8a492b4c4d2c10f5103519-prod.s3.eu-central-1.amazonaws.com/public/Betreuer_Anleitung.pdf" download="Betreuer_Anleitung.pdf">herunterladen</a>
                      </p>
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
    },

    // Generate the HTML for the email when a user forgets his password
    passwordForgetEmail(code) {
        const emailObject = {
            subject: 'Impuls Erziehungshilfe App Passwort zurücksetzen',
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
                  <td style="padding: 25.0px 25.0px 25.0px 25.0px; font-weight: bold; font-size: 22.0px;text-align: center; width: auto; font-family: 'Trebuchet MS', sans-serif; background-color: #1f2937; color:#ffffff"
                      align="center">
                      Impuls Erziehungshilfe App
                  </td>
              </tr>
              <tr>
                  <td style="padding: 10.0px 25.0px 20.0px 25.0px; font-weight: bold; font-size: 16.0px;text-align: justify; width: auto; font-family: 'Trebuchet MS', sans-serif;"
                      align="center">
                      <br>
                      <br>
                      Wir haben eine Anfrage zum Zurücksetzen Ihres Passwortes erhalten. Bitte benutzen Sie die nachfolgenden Daten, um Ihr Passwort zurückzusetzen.
                      <br>
                      <br>
                      Sicherheitscode: ${code}
                      <br>
                      <br>
                      Sollten Sie keine Anfrage verschickt haben, können Sie diese E-Mail ignorieren.
                      <br>
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
    },
}