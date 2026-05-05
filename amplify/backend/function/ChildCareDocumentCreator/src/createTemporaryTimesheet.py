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
import base64

def createTemporaryTimesheet(data):
    # template name, pagesize for printing, margins for all 4 sides (left margin is larger for later physical storing)
    # doc = SimpleDocTemplate("/tmp/timesheet.pdf", pagesize=letter, leftMargin=2.0*cm, rightMargin=1.0*cm, topMargin=1.0*cm,bottomMargin=1.0*cm)
    stream = io.BytesIO()
    doc = SimpleDocTemplate(stream, pagesize=letter, leftMargin=2.0*cm, rightMargin=1.0*cm, topMargin=1.0*cm,bottomMargin=1.0*cm)

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
            [Paragraph("Vorschau der erbrachten Face-to-Face-Stunden für ambulante pädagogische Leistungen", styles["large"]), "", ""]]
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

    # create child name from firstname + familyname
    childFullNameObj = ""
    # check for first name
    print('#CHILD-DATA',data['child']['data'])
    if data['child']['data']['name'] is not None:
        childFullNameObj = childFullNameObj + data['child']['data']['name']
    # check for family name
    if data['child']['data']['familyName'] is not None:
        childFullNameObj = childFullNameObj + " " + data['child']['data']['familyName']
    
    # Data for top section
    childName = Paragraph(childFullNameObj, styles["medium"])
    companionName = Paragraph(data['child']['guardian']['name'] + ' ' + data['child']['guardian']['familyName'], styles["medium"])
    helpStartDate = Paragraph(data['child']['dateOfRegistration'], styles["medium"])
    month = data['month']
    documentYear = data['documentYear']
    weeklyHours = ""
    if data['child']['data']['weeklyHoursByPlan'] is not None and data['child']['data']['weeklyHoursByPlan'] == True:
        weeklyHours = "gemäß Stundenplan"
    else:
        weeklyHours = str("%0.2f" % data['child']['data']['weeklyHours'])

    # child
    childData = [
        ["Hilfeempfänger:", childName, "", ""]
    ]
    childTable = Table(childData, colWidths="*")
    # formatting
    childTable.setStyle(TableStyle([
        ('BOX', (1,0), (-1,-1),0.25,colors.black),
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(1,0),(3,0))
    ]))
    elements.append(childTable)
    elements.append(Spacer(1, 0.25*cm))

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
        ["Beginn der Hilfe:", helpStartDate, "Abrechnungsmonat:", Paragraph(month + ' ' + str(documentYear), styles["medium"])]
    ]
    thirdDataTable = Table(thirdData, colWidths="*")
    # formatting
    thirdDataTable.setStyle(TableStyle([
        ('BOX', (1,0), (1,0),0.25,colors.black),
        ('BOX', (3,0), (3,0),0.25,colors.black),
        ('ALIGN',(2,0),(2,0),'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(thirdDataTable)
    elements.append(Spacer(1, 0.25*cm))

    # weekly hours, weeks per month, total hours
    fourthData = [
        ["Std. pro Woche", weeklyHours, "", ""],
    ]
    fourthDataTable = Table(fourthData, colWidths="*")
    # formatting
    fourthDataTable.setStyle(TableStyle([
        ('BOX', (1,0), (1,0),0.25,colors.black),
        ('ALIGN',(1,0),(1,0),'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(0,1),(1,1))
    ]))
    elements.append(fourthDataTable)
    elements.append(linebreak)

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

    # count total sick days, up to 3 dick days can be calculated with 30%, if the kid was sick for 4 days or more, sick days can no longer be paid/displayed
    sickDayCount = 0

    # define dict to translate reportAcitivity
    reportActivityDict = {
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

    # add all worked hours to list
    for document in data['documents']:
        # create empty report activity string
        reportActivityString = ""
        # get human readable date string
        date = str(datetime.strptime(document["documentDate"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y'))
        # calculate worked hours of day as decimal value
        hoursDecimal = document['hourTo'] - document['hourFrom'] + (document['minuteTo'] - document['minuteFrom']) / 60


        # update sick count if document is marked sick
        if document["sick"] and (document["sickOnTime"] == False or document["sickOnTime"] is None):
            sickDayCount += 1

        if sickDayCount <= 3 and document["sick"] and (document["sickOnTime"] == False or document["sickOnTime"] is None):
            # add worked hours to total hours worked
            totalCalcHours = totalCalcHours + hoursDecimal
            # create readable String for table
            reportActivityString = Paragraph('Krank (Meldezeit ist kürzer wie 24 Std)', styles["medium"])
            # add entry to table
            singleProofData.append([date, document['hourFrom'], document['minuteFrom'], document['hourTo'], document['minuteTo'], str("{:.2f}".format(hoursDecimal)), reportActivityString])


        # only append row if 
        if document["sick"] == False:
            # add worked hours to total hours worked
            totalCalcHours = totalCalcHours + hoursDecimal
            # check for reportActivity --> use "Betreuung" if none was given
            if document["reportActivity"] is None:
                reportActivityString = "Betreuung"
            else:
                reportActivityString = reportActivityDict[document["reportActivity"]]
            # add entry to table
            singleProofData.append([date, document['hourFrom'], document['minuteFrom'], document['hourTo'], document['minuteTo'], str("{:.2f}".format(hoursDecimal)), reportActivityString])

    singleProofTable = Table(singleProofData, colWidths=[2.5*cm, 2*cm, 2*cm, 2*cm, 2*cm, 3*cm, "*"])
    # formatting
    singleProofTable.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1),0.25,colors.black),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN',(0,0),(6,1),'CENTER'),
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

    # total calculation table
    signatureData = [
        ["", "", ""],
        ["Unterschrift Klassenlehrer/in", "", ""]
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

    streamEncoded = base64.b64encode(stream.getvalue())
    return streamEncoded