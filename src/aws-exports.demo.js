// Demo-/Vorschau-Konfiguration für die lokale Ansicht ohne AWS-Backend.
//
// Diese Datei wird beim Befehl `npm run demo` nach `src/aws-exports.js`
// kopiert – aber nur, wenn dort noch keine (echte) Konfiguration liegt.
// So aktiviert sie den lokalen Demo-Modus mit Beispieldaten und überschreibt
// niemals eine produktive AWS/Cognito-Konfiguration.
const awsmobile = {
  localOnly: true
}

export default awsmobile
