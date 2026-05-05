import os
import reportlab
import boto3
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_CENTER
from datetime import datetime
from calendar import monthrange
import time
import json
import io

def createTimesheetDocumentation(data):
    # template name, pagesize for printing, margins for all 4 sides (left margin is larger for later physical storing)
    doc = SimpleDocTemplate("/tmp/timesheet.pdf", pagesize=letter, leftMargin=2.0*cm, rightMargin=1.0*cm, topMargin=1.0*cm,bottomMargin=1.0*cm)

    # container for the 'Flowable' objects
    elements = []

    #linebreak text (\n isn't enough apparently --> actual character is neede to create a new line)
    #linebreak = Table([[""]], colWidths="*")
    #changed to paragraph with 2 x <br/> --> no invisible table has to be drawn
    styles = getSampleStyleSheet()
    linebreak = Paragraph("<br/><br/>", styles["Normal"])

    #Paragraph styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("small", parent=styles['Normal'], fontSize=8, leading=8)) #new paragraph styles for tables to fit words better inside the cells
    styles.add(ParagraphStyle("small-bold", parent=styles['Normal'], fontSize=8, leading=8, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("medium", parent=styles['Normal'], fontSize=10, leading=10))
    styles.add(ParagraphStyle("medium-centered", parent=styles['Normal'], fontSize=10, leading=10, alignment=TA_CENTER))
    styles.add(ParagraphStyle("medium-bold", parent=styles['Normal'], fontSize=10, leading=10, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("large", parent=styles['Normal'], fontSize=14, leading=16, fontName="Helvetica-Bold", alignment=TA_CENTER))

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
            [Paragraph("Nachweis/Abrechnung der erbrachten Sonderzeiten", styles["large"]), "", ""]]
    topHeaderTable = Table(header, colWidths="*")
    #header formatting
    topHeaderTable.setStyle(TableStyle([
        ('ALIGN',(0,0),(1,4),'LEFT'),
        ('ALIGN',(2,0),(2,4),'CENTER'),
        ('ALIGN',(0,5),(0,5),'CENTER'),
        ('VALIGN', (0, 0), (1, 5), 'MIDDLE'),
        ('VALIGN', (2, 0), (2, 5), 'TOP'),
        ('SPAN',(0,0),(1,0)),
        ('SPAN',(0,1),(1,1)),
        ('SPAN',(0,2),(1,2)),
        ('SPAN',(0,3),(1,3)),
        ('SPAN',(0,4),(1,4)),
        ('SPAN',(0,5),(2,5)),
        ('SPAN',(2,0),(2,4))]))
    elements.append(topHeaderTable)
    elements.append(linebreak)
    
    # Data for top section
    companionName = Paragraph(data['guardian']['name'] + ' ' + data['guardian']['familyName'], styles["medium"])
    month = data['month']
    documentYear = data['documentYear']

    # companion
    companionData = [
        ["Träger / Fachkraft:", companionName, "", ""]
    ]
    companionTable = Table(companionData, colWidths="*")
    # formatting
    companionTable.setStyle(TableStyle([
        ('BOX', (1,0), (-1,-1),0.25,colors.black),
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(1,0),(3,0))
    ]))
    elements.append(companionTable)
    elements.append(Spacer(1, 0.25*cm))

    # help start date and month
    thirdData = [
        ["Abrechnungsmonat:", Paragraph(month + ' ' + str(documentYear), styles["medium"]), "", ""]
    ]
    thirdDataTable = Table(thirdData, colWidths="*")
    # formatting
    thirdDataTable.setStyle(TableStyle([
        ('BOX', (1,0), (-1,-1),0.25,colors.black),
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(1,0),(3,0))
    ]))
    elements.append(thirdDataTable)
    elements.append(Spacer(1, 0.25*cm))

    # single proof header
    proofHeaderData = [
        [Paragraph("Einzelnachweise:", styles["medium-bold"]), Paragraph("(Zeitangaben viertelstunden-genau)", styles["medium-centered"]), "", "", ""]
    ]
    proofHeaderTable = Table(proofHeaderData, colWidths="*")
    # formatting
    proofHeaderTable.setStyle(TableStyle([
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(1,0),(-1,0))
    ]))
    elements.append(proofHeaderTable)

    # proof table
    singleProofData = [
        ["Datum", "Uhrzeit von", "", "bis", "", "Anzahl Stunden\n(dezimal)", "Aktivität"],
        ["", "Stunde", "Minuten", "Stunde", "Minuten", "", ""]
    ]

    # set up total calculation values
    totalCalcHours = 0

    # define dict to translate reportAcitivity
    reportActivityDict = {
          "school": 'Schule',
          "helpPlanDiscussion": 'Hilfeplangespräch',
          "getToKnowInterview": 'Kennenlerngespräch',
          "hospitation": 'Hospitation',
          "excursion": 'Ausflug / Klassenfahrt',
          "holiday": 'Feiertag',
          "vacation": 'Urlaub',
          "employeeSickness": 'Krankmeldung',
          "other": 'Sonstiges',
          "supervision": 'Supervision',
          "teamMeeting": 'Teamsitzung'
        }
    
    # define blacklist of reports where no time should be noted
    blacklist = [
        'holiday',
        'vacation',
        'employeeSickness',
        'other'
      ]

    # add all worked hours to list
    for document in data['documents']:
        # get human readable date string
        date = ""
        # check if from+to date should be displayed
        if ("documentEndDate" in document and document["documentEndDate"] != None) and (document["reportActivity"] == "vacation" or document["reportActivity"] == "employeeSickness"):
            date = str(datetime.strptime(document["documentDate"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y')) + '\n - \n' + str(datetime.strptime(document["documentEndDate"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y'))
        else:
            date = str(datetime.strptime(document["documentDate"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y'))
        # calculate worked hours of day as decimal value
        hoursDecimal = document['hourTo'] - document['hourFrom'] + (document['minuteTo'] - document['minuteFrom']) / 60
        # get reportActivity
        reportActivityString = reportActivityDict[document["reportActivity"]]
        # add entry to table
        if document["reportActivity"] in blacklist:
            # add entry with no times
            singleProofData.append([date, '0', '0', '0', '0', '0', reportActivityString])
        else:
            # add worked hours to total hours worked
            totalCalcHours = totalCalcHours + hoursDecimal
            # add entry with actual times
            singleProofData.append([date, document['hourFrom'], document['minuteFrom'], document['hourTo'], document['minuteTo'], str("{:.2f}".format(hoursDecimal)), reportActivityString])

    singleProofTable = Table(singleProofData, colWidths=[2.5*cm, 2*cm, 2*cm, 2*cm, 2*cm, 3*cm, "*"])
    # formatting
    singleProofTable.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1),0.25,colors.black),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN',(0,0),(6,1),'CENTER'),
        ('ALIGN',(0,2),(0,-1),'CENTER'),
        ('SPAN',(0,0),(0,1)),
        ('SPAN',(5,0),(5,1)),
        ('SPAN',(6,0),(6,1)),
        ('SPAN',(1,0),(2,0)),
        ('SPAN',(3,0),(4,0)),
        ('BACKGROUND', (5, 0), (5, -1), '#dedede')
    ]))
    elements.append(singleProofTable)
    elements.append(linebreak)

    # total calculation table
    calculationData = [
        ["Gesamtsumme der geleisteten Stunden:", "", "", "", "", "%0.2f" % totalCalcHours],
    ]
    calculationTable = Table(calculationData, colWidths="*")
    # formatting
    calculationTable.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN',(0,0),(4,-1),'RIGHT'),
        ('ALIGN',(5,0),(5,-1),'CENTER'),
        ('SPAN',(0,0),(4,0)),
        ('BACKGROUND', (5, 0), (5, -1), '#dedede'),
        ('LINEBELOW', (5, 0), (5, -1), 0.25, colors.black),
    ]))
    elements.append(calculationTable)
    elements.append(linebreak)
    elements.append(linebreak)

    # get signature
    signature = Image(data["signatureImage"])
    signature.drawHeight = 2.00*cm #these specific values are needed to not stretch the image 1.12:3.04
    signature.drawWidth = 5.25*cm

    # total calculation table
    signatureData = [
        [signature, "", ""],
        ["Unterschrift Betreuer/in", "", ""]
    ]
    signatureTable = Table(signatureData, colWidths="*")
    # formatting
    signatureTable.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN',(0,0),(-1, -1),'CENTER'),
        ('LINEBELOW', (0, 0), (0, 0), 0.25, colors.black),
    ]))
    elements.append(signatureTable)
    elements.append(linebreak)
    

    # write the document to disktest
    doc.build(elements)
    uploadFile(data["id"], data["privatePath"])
    return data["id"] + ".pdf"

def uploadFile(id, path):
    s3 = boto3.resource('s3')   
    BUCKET = os.environ['STORAGE_CHILDCARESTORAGE_BUCKETNAME']

    s3.Bucket(BUCKET).upload_file("/tmp/timesheet.pdf", path + id + ".pdf")