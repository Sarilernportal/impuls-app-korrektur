import json
import createReport
import createTimesheet
import createInvoice
import createTemporaryTimesheet
import createSpecialReport
import createSpecialTimesheet 

def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    uploadKey = ''
    if  event["documentType"] == 'dailyReport':
        createReport.createDailyDocumentation(event)
    elif event["documentType"] == 'timeSheet':
        createTimesheet.createTimesheetDocumentation(event)
    elif event["documentType"] == 'invoice':
        createInvoice.createInvoiceDocumentation(event)
    elif  event["documentType"] == 'specialReport':
        createSpecialReport.createDailyDocumentation(event)
    elif  event["documentType"] == 'specialTimeSheet':
        createSpecialTimesheet.createTimesheetDocumentation(event)
    elif event["documentType"] == 'tempTimeSheet':
        tempPDF = createTemporaryTimesheet.createTemporaryTimesheet(event)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                "Content-Type": "application/pdf"
            },
            'body': tempPDF
        }
    return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(uploadKey)
    }