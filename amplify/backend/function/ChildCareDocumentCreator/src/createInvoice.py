import os
import reportlab
import boto3
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph, Spacer
from reportlab.platypus.frames import Frame
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from datetime import datetime
import time
import json
import io

def footer(canvas, doc):
    footerstyles = getSampleStyleSheet()
    footerstyles.add(ParagraphStyle("small", parent=footerstyles['Normal'], fontSize=8, leading=8))
    linebreak = Paragraph("<br/><br/>", footerstyles["small"])

    footer = []
    footer.append(Paragraph("Geschäftsführer<br/>Süreyya Sari<br/><br/>Handelsregister Darmstadt<br/>HRB-Nr.: 94700<br/>Steuernummer: 007 236 01904<br/><br/>Bankverbindung / IBAN<br/>Nassauische Sparkasse<br/>DE61 5105 0015 0107 0942 52", footerstyles['small']))
    Frame(16*cm, -1*cm, 20*cm, 5*cm).addFromList(footer, canvas)

def createInvoiceDocumentation(data):
    # template name, pagesize for printing, margins for all 4 sides (left margin is larger for later physical storing)
    doc = SimpleDocTemplate("/tmp/invoice.pdf", pagesize=letter, leftMargin=2.0*cm, rightMargin=1.0*cm, topMargin=1.0*cm,bottomMargin=1.0*cm)
    # container for the 'Flowable' objects
    elements = []

    print('#CREATE-INVOICE-DATA', data)

    #linebreak text (\n isn't enough apparently --> actual character is neede to create a new line)
    #linebreak = Table([[""]], colWidths="*")
    #changed to paragraph with 2 x <br/> --> no invisible table has to be drawn
    styles = getSampleStyleSheet()
    linebreak = Paragraph("<br/><br/>", styles["Normal"])

    #Paragraph styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("small", parent=styles['Normal'], fontSize=8, leading=8)) #new paragraph styles for tables to fit words better inside the cells
    styles.add(ParagraphStyle("small-bold", parent=styles['Normal'], fontSize=8, leading=8, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("medium", parent=styles['Normal'], fontSize=10, leading=12))
    styles.add(ParagraphStyle("medium-centered", parent=styles['Normal'], fontSize=10, leading=10, alignment=TA_CENTER))
    styles.add(ParagraphStyle("medium-bold", parent=styles['Normal'], fontSize=10, leading=10, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("medium-bold-right", parent=styles['Normal'], fontSize=10, leading=10, fontName="Helvetica-Bold", alignment=TA_RIGHT))
    styles.add(ParagraphStyle("large", parent=styles['Normal'], fontSize=14, leading=16, fontName="Helvetica-Bold", alignment=TA_CENTER))

    #get logo image
    logo = Image("images/Logo_lq.jpg")
    logo.drawHeight = 2.24*cm #these specific values are needed to not stretch the image 1.12:3.04
    logo.drawWidth = 6.08*cm

    # create empty carrier address fields
    carrierName = data["carrier"]["billingName"] if ("billingName" in data["carrier"] and data["carrier"]["billingName"]) else data["carrier"]["name"]
    carrierStreet = ''
    carrierExtra = ''
    carrierCity = ''
    carrierPoBox = ''

    # check if billing or default address should be used
    # useBillingAddres must be true and all required values must be given, otherwise we use the default address values
    if (
            ("useBillingAddress" in data["carrier"] and data["carrier"]["useBillingAddress"]) and
            ("billingStreet" in data["carrier"] and data["carrier"]["billingStreet"] != None) and
            ("billingHouseNumber" in data["carrier"] and data["carrier"]["billingHouseNumber"] != None) and
            ("billingPostalCode" in data["carrier"] and data["carrier"]["billingPostalCode"] != None) and
            ("billingCity" in data["carrier"] and data["carrier"]["billingCity"] != None)
        ):
        # carrier data
        carrierStreet = data["carrier"]["billingStreet"] + " " + data["carrier"]["billingHouseNumber"]
        carrierCity = data["carrier"]["billingPostalCode"] + " " + data["carrier"]["billingCity"]
        # check if billingAddressExtra was provided
        if "billingAddressExtra" in data["carrier"] and data["carrier"]["billingAddressExtra"] != None:
            carrierExtra = data["carrier"]["billingAddressExtra"]
        if "billingPoBox" in data["carrier"] and data["carrier"]["billingPoBox"] != None:
            carrierPoBox = data["carrier"]["billingPoBox"]
    else:
        # carrier data
        carrierStreet = data["carrier"]["street"] + " " + data["carrier"]["houseNumber"]
        carrierCity = data["carrier"]["postalCode"] + " " + data["carrier"]["city"]
        # check if addressExtra was provided
        if "addressExtra" in data["carrier"] and data["carrier"]["addressExtra"] != None:
            carrierExtra = data["carrier"]["addressExtra"]
        if "poBox" in data["carrier"] and data["carrier"]["poBox"] != None:
            carrierPoBox = data["carrier"]["poBox"]
    
    # invoice info
    invoiceDate = datetime.now().strftime("%d.%m.%Y")
    invoiceNumber = data["customInvoiceNumber"] if data.get("customInvoiceNumber") else data["invoiceNumber"]

    #create top header object
    headerData = [
        ["", "", logo],
        [Paragraph(carrierName + "<br/>" + carrierStreet + "<br/>" + "Postfach " + carrierPoBox + "<br/>" + carrierExtra + "<br/>" + carrierCity, styles["medium"]),"",  "IMPULS GmbH\nBahnhofstraße 23\n64528 Rüsselsheim\n\nTel.: 06142-4898080\nFax: 06142-4898037"],
        ["","","\nwww.impuls-erziehungshilfe.de\ninfo@impuls-erziehungshilfe.de"],
        ["","",""],
        ["","",invoiceDate],
        ["","","Rechnungs-Nr.: " + invoiceNumber]
    ]
    topHeaderTable = Table(headerData, colWidths="*")
    #header formatting
    topHeaderTable.setStyle(TableStyle([
        ('LINEBELOW', (0, 1), (0, 1), 0.25, colors.black),
        ('LINEABOVE', (0, 1), (0, 1), 0.25, colors.black),
        ('LINEBEFORE', (0, 1), (0, 1), 0.25, colors.black),
        ('LINEAFTER', (0, 1), (0, 1), 0.25, colors.black),
        ('ALIGN',(2,4),(2,5),'RIGHT'),
        ('VALIGN', (0, 1), (0, 1), 'TOP'),
        ]))
    elements.append(topHeaderTable)
    elements.append(linebreak)

    # main text section
    invoiceMonth = data["month"]
    invoiceYear = str(data["year"])
    childName = data["child"]["name"] + " " + data["child"]["familyName"].upper()
    childBirthday = data["child"]["dateOfBirth"]
    recordNumber = data["child"]["recordNumber"]
    invoiceContent = data["documents"]
    extraHours = data["extraHours"]
    extraHourRate = data["extraHourRate"]
    extraDescription = data["extraDescription"]
    totalServiceHours = 0
    totalPay = 0

    # create record number text depending if a record number was found
    recordNumberText = ""
    if recordNumber != None:
        recordNumberText = ", <b> Aktz.</b> " + recordNumber
    else:
        recordNumberText = ""

    # get hourly rate of guardian - CHANGES EVERY YEAR
    hourlyRate = 0
    if data["guardian"]["professional"]:
        hourlyRate = 60.37
    else:
        hourlyRate = 43.16

    # count total sick days, up to 3 dick days can be calculated with 30%, if the kid was sick for 4 days or more, sick days can no longer be paid 
    sickDayCount = 0

    # get total hours serviced and total pay result
    for content in invoiceContent:
        print('#CONTENT', content)
        # increase sick counter if sick
        if content["sick"] and (content["sickOnTime"] == False or content["sickOnTime"] is None):
            sickDayCount += 1
        
        if (sickDayCount <= 3 and content["sick"] and (content["sickOnTime"] == False or content["sickOnTime"] is None)) or not content["sick"]:
            # get worked hours of dailyReport as decimal value
            hoursDecimal = content['hourTo'] - content['hourFrom'] + (content['minuteTo'] - content['minuteFrom']) / 60
            # increase total worked hours
            totalServiceHours = totalServiceHours + hoursDecimal

        if sickDayCount <= 3 and content["sick"] and (content["sickOnTime"] == False or content["sickOnTime"] is None):
            # 3 days or less AND sick --> payment with 30%
            totalPay = totalPay + hoursDecimal * 0.3 * hourlyRate
        elif not content["sick"]:
            # NOT sick --> full payment
            totalPay = totalPay + hoursDecimal * hourlyRate

    invoiceText = Paragraph("<b>Rechnung für den Monat</b> " + invoiceMonth + " " + invoiceYear + "<b>, gemäß § </b> 35a <b>SGB VIII<br/> für</b> " + childName + "<b>, geb. am</b> " + childBirthday + recordNumberText, styles["medium"])
    elements.append(invoiceText)
    elements.append(Spacer(1, 0.25*cm))
    invoiceTextSecondPart = Paragraph("Sehr geehrte Damen und Herren,<br/>", styles["medium"])
    elements.append(invoiceTextSecondPart)
    elements.append(Spacer(1, 0.25*cm))
    invoiceTextThirdPart = Paragraph("für die Durchführung der oben genannten Maßnahmen stellen wir Ihnen wie vereinbart für " + str("{0:,.2f}".format(totalServiceHours)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " Leistungsstunden", styles["medium"])
    elements.append(invoiceTextThirdPart)
    elements.append(Spacer(1, 0.25*cm))

    #create invoice table
    invoiceData = [
        [Paragraph("Leistungsstunden", styles["medium-bold-right"]), Paragraph("Stundensatz", styles["medium-bold-right"]), Paragraph("Betrag", styles["medium-bold-right"]), Paragraph("Bezeichnung", styles["medium-bold"])]
    ]

    # reset count of total sick days
    sickDayCount = 0

    # define dict to translate reportAcitivity
    reportAcitivityDict = {
          "school": 'Schule',
          "helpPlanDiscussion": 'Hilfeplangespräch',
          "getToKnowInterview": 'Kennenlerngespräch',
          "hospitation": 'Hospitation',
          "excursion": 'Ausflug / Klassenfahrt',
          "holiday": '[i]Feiertag',
          "vacation": '[i]Urlaub',
          "employeeSickness": '[i]Krankmeldung',
          "other": '[i]Sonstiges',
          "supervision": '[i]Supervision',
          "teamMeeting": '[i]Teamsitzung'
        }

    # create variables for standard and sick day hour counting
    standardHours = 0.0
    sickHours = 0.0

    # append all services to table data
    for content in invoiceContent:
        # get hours worken as decimal value
        hoursDecimal = content['hourTo'] - content['hourFrom'] + (content['minuteTo'] - content['minuteFrom']) / 60

        if content["sick"] and (content["sickOnTime"] == False or content["sickOnTime"] is None):
            # increase sick counter if sick
            sickDayCount += 1
        
        if sickDayCount <= 3 and content["sick"] and (content["sickOnTime"] == False or content["sickOnTime"] is None):
            # increase sick hour count
            sickHours += hoursDecimal
        elif content["sick"] == False:
            # increase standard hour count
            standardHours += hoursDecimal
    
    standardHours = round(standardHours * 4) / 4
    sickHours = round(sickHours * 4) / 4

    # append standard and sick hours to table
    invoiceData.append([str("{0:,.2f}".format(standardHours)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " x", str('{0:,.2f}'.format(hourlyRate)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " € =", str('{0:,.2f}'.format(standardHours * hourlyRate)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " €",  "Betreuung"])
    if sickHours > 0:
        invoiceData.append([str("{0:,.2f}".format(sickHours)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " x", 
                            str('{0:,.2f}'.format(hourlyRate * 0.3)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " € (30% des Stundensatzes) =", 
                            str('{0:,.2f}'.format(sickHours * hourlyRate * 0.3)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " €",  
                            "Kurzfristige Terminabsage"
    ])
    
    if extraHours != None and extraHourRate != None and extraDescription != "":
        invoiceData.append([str("{0:,.2f}".format(extraHours)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " x", 
                        str('{0:,.2f}'.format(float(extraHourRate))).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " € =", 
                        str('{0:,.2f}'.format(float(extraHourRate) * float(extraHours))).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " €",  
                        extraDescription
    ])
    # append total sum
    invoiceData.append(["", Paragraph("Summe =", styles["medium-bold-right"]), str('{0:,.2f}'.format(totalPay)).replace(',', 'COMMA').replace('.', ',').replace('COMMA', '.') + " €", ""])

    invoiceTable = Table(invoiceData, colWidths="*")
    #header formatting
    invoiceTable.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 0.25, colors.black),
        ('PADDINGRIGHT', (0, 0), (0, -1), 0.25, colors.black),
        ('ALIGN',(0,0),(2,-1),'RIGHT'),
        ('VALIGN', (0, 1), (0, 1), 'TOP'),
        ]))
    elements.append(invoiceTable)
    elements.append(linebreak)

    invoiceEndText = Paragraph("in Rechnung.<br/><br/>Wir bitten Sie, den oben genannten Betrag auf die unten angegebene Kontonummer zu überweisen.<br/><br/>Wir danken für die freundliche Zusammenarbeit.<br/><br/>Mit freundlichen Grüßen<br/><br/>Buchhaltung Impuls<br/><br/>Die Leistungen sind nach § 4 Nr. 25 UStG. von der Umsatzsteuer befreit.", styles["medium"])
    elements.append(invoiceEndText)

    # write the document to disktest
    doc.build(elements, onFirstPage=footer, onLaterPages=footer)
    uploadFile(data["id"], data["carrier"]["id"])
    return data["id"] + ".pdf"

def uploadFile(id, path):
    s3 = boto3.resource('s3')   
    BUCKET = os.environ['STORAGE_CHILDCARESTORAGE_BUCKETNAME']

    s3.Bucket(BUCKET).upload_file("/tmp/invoice.pdf", "private/" + path + "/" + id + ".pdf")
