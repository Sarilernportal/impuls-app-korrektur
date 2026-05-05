import os
import json
import boto3
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
# from reportlab.pdfgen import canvas
from reportlab.lib.units import cm

def createDailyDocumentation(data):
    # template name, pagesize for printing, margins for all 4 sides (left margin is larger for later physical storing)
    doc = SimpleDocTemplate("/tmp/tagesdoku.pdf", pagesize=letter, leftMargin=2.0*cm, rightMargin=1.0*cm, topMargin=1.0*cm,bottomMargin=1.0*cm)

    # container for the 'Flowable' objects
    elements = []

    styles = getSampleStyleSheet()
    linebreak = Paragraph("<br/><br/>", styles["Normal"])
    #Paragraph styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("small", parent=styles['Normal'], fontSize=8, leading=8)) #new paragraph styles for tables to fit words better inside the cells
    styles.add(ParagraphStyle("small-bold", parent=styles['Normal'], fontSize=8, leading=8, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("medium", parent=styles['Normal'], fontSize=10, leading=10))
    styles.add(ParagraphStyle("medium-bold", parent=styles['Normal'], fontSize=10, leading=10, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("large", parent=styles['Normal'], fontSize=14, leading=16, fontName="Helvetica-Bold"))

    #get logo image
    logo = Image("images/Logo_lq.jpg")
    logo.drawHeight = 2.24*cm #these specific values are needed to not stretch the image 1.12:3.04
    logo.drawWidth = 6.08*cm

    #create top header object
    header = [[Paragraph("Impuls GmbH, Ins. für", styles["small-bold"]), "", logo],
            [Paragraph("Erziehungshilfen und Therapien", styles["small-bold"]), "", ""],
            ["","",""],
            [Paragraph("Bahnhofstrasse 23, 65428 Rüsselsheim", styles["small"]), "", ""],
            [Paragraph("Tel.:06142- 489 80 80- Fax. 06142- 489 80 37", styles["small"]), "", ""],
            [Paragraph("Sonderzeitenbericht – Schulbegleitung", styles["large"]), "", ""]]
    topHeaderTable = Table(header, colWidths="*")
    #header formatting
    topHeaderTable.setStyle(TableStyle([
        ('ALIGN',(0,0),(1,4),'LEFT'),
        ('ALIGN',(2,0),(2,4),'CENTER'),
        ('VALIGN', (0, 0), (1, 5), 'MIDDLE'),
        ('VALIGN', (2, 0), (2, 5), 'TOP'),
        ('FONTSIZE', (1, 0), (1, 0), 14),
        ('TEXTFONT', (0, 0), (-1, -1), 'Times-Bold'),
        ('SPAN',(0,0),(1,0)),
        ('SPAN',(0,1),(1,1)),
        ('SPAN',(0,2),(1,2)),
        ('SPAN',(0,3),(1,3)),
        ('SPAN',(0,4),(1,4)),
        ('SPAN',(0,5),(1,5)),
        ('SPAN',(2,0),(2,5))]))
    elements.append(topHeaderTable)
    elements.append(linebreak)

    # First Table
    companionName = Paragraph(data["schoolguardian"], styles["medium"])
    documentDate = ""
    # check if from+to date should be displayed
    if "endDate" in data and (data["reportActivity"] == "vacation" or data["reportActivity"] == "employeeSickness"):
        documentDate = str(datetime.strptime(data["date"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y')) + ' - ' + str(datetime.strptime(data["endDate"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y'))
    else:
        documentDate = str(datetime.strptime(data["date"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y'))

    if data["reportActivity"] == "supervision" or data["reportActivity"] == "teamMeeting":
        # show date and time
        minuteFrom = data["minuteFrom"]
        minuteTo = data["minuteTo"]
        # add leading 0 if number is smaller than 10 --> better readability
        if data["minuteFrom"] < 10:
            minuteFrom = "0" + str(minuteFrom)
        if data["minuteTo"] < 10:
            minuteTo = "0" + str(minuteTo)
        documentDate += ", " + str(data["hourFrom"]) + ":" + str(minuteFrom) + " - " + str(data["hourTo"]) + ":" + str(minuteTo)

    # create table object
    informationData = [
        [Paragraph("Name Berichterteller/in", styles["medium-bold"]), Paragraph("Datum", styles["medium-bold"])],
        [companionName, documentDate]
    ]
    informationTable = Table(informationData, colWidths="*")
    # formatting
    informationTable.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1),0.25,colors.black),
        ('INNERGRID', (0,0), (1,2), 0.25, colors.black),
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')]))
    elements.append(informationTable)
    elements.append(linebreak)

    # define dict to translate reportAcitivity
    reportAcitivityDict = {
          "holiday": 'Feiertag',
          "vacation": 'Urlaub',
          "employeeSickness": 'Krankmeldung',
          "other": 'Sonstiges',
          "supervision": 'Supervision',
          "teamMeeting": 'Teamsitzung'
        }

    # get values for main section
    dailyReport = Paragraph(data["report"].replace('\n','<br />\n'), styles["medium"])
    reportActivity = Paragraph(reportAcitivityDict[data["reportActivity"]], styles["medium"])

    # create table object
    mainData = [
        [Paragraph("Tätigkeit", styles["medium-bold"]), reportActivity, ""],
        [Paragraph("Begründung", styles["medium-bold"]), dailyReport, ""],
        [Paragraph("(Ereignisse / Notizen / Sonstiges)", styles["small"]), "", ""],
    ]

    mainTable = Table(mainData, colWidths="*")
    # formatting
    mainTable.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1),0.25,colors.black),
        ('LINEBELOW', (0,0), (-1,0), 0.25, colors.black),
        ('LINEAFTER', (0,0), (0,0), 0.25, colors.black),
        ('LINEAFTER', (0,1), (0,2), 0.25, colors.black),
        ('ALIGN',(1,0),(1,0),'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(1,0),(2,0)),
        ('SPAN',(1,1),(2,2))]))
    elements.append(mainTable)
    elements.append(linebreak)

    # get signature
    signature = Image(data["signatureImage"])
    signature.drawHeight = 2.00*cm #these specific values are needed to not stretch the image 1.12:3.04
    signature.drawWidth = 5.25*cm
    # date + signature
    endingData = [
        ["Unterschrift:", signature, ""],
        ["", "Berichterteller/in", ""]
    ]

    # create table
    endingTable = Table(endingData, colWidths="*")
    endingTable.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 0.25, colors.black),
        ('ALIGN',(0,0),(0,0),'LEFT'),
        ('ALIGN',(1,0),(1,1),'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(1,0),(2,0)),
        ('SPAN',(1,1),(2,1))
    ]))
    elements.append(endingTable)

    # write the document to disktest
    doc.build(elements)
    uploadFile(data["id"], data["privatePath"])
    return data["id"] + ".pdf"

def uploadFile(id, path):
    s3 = boto3.resource('s3')   
    BUCKET = os.environ['STORAGE_CHILDCARESTORAGE_BUCKETNAME']

    s3.Bucket(BUCKET).upload_file("/tmp/tagesdoku.pdf", path + id + ".pdf")