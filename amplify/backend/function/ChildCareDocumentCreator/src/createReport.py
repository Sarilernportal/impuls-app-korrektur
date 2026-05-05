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
            [Paragraph("Dokumentation – Schulbegleitung", styles["large"]), "", ""]]
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
    childName = Paragraph(data["childname"], styles["medium"])
    companionName = Paragraph(data["schoolguardian"], styles["medium"])
    schoolName = Paragraph(data["school"], styles["medium"])

    # create table object
    informationData = [
        [Paragraph("Name v. Kind", styles["medium-bold"]), Paragraph("Name Schulbegleiter", styles["medium-bold"]), Paragraph("Schule / Klasse", styles["medium-bold"])],
        [childName, companionName, schoolName],
        ["","",""]
    ]
    informationTable = Table(informationData, colWidths="*")
    # formatting
    informationTable.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1),0.25,colors.black),
        ('INNERGRID', (0,0), (1,2), 0.25, colors.black),
        ('INNERGRID', (2,0), (2,1), 0.25, colors.black),
        ('LINEBEFORE', (2,0), (2,2), 0.25, colors.black),
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('SPAN',(0,1),(0,2)),
        ('SPAN',(1,1),(1,2))]))
    elements.append(informationTable)
    elements.append(linebreak)

    # subsitute note --> only displayed if true
    # if data["substitute"] != None and data["substitute"] == True:
    #     elements.append(Paragraph("Die Betreuung fand in Vertretung statt.", styles["medium"]))
    #     elements.append(linebreak)
    # else:
    #     elements.append(linebreak)


    # main table
    date = str(datetime.strptime(data["date"], "%Y-%m-%dT%H:%M:%S.%fZ").__format__('%d.%m.%Y %H:%M'))
    stateOfHealth = data["mood"]
    # overwrite state of health if reportActivity is miscellaneous
    if data["reportActivity"] == "miscellaneous":
        stateOfHealth = "nothing"
    homework = [
        {
            'title': 'Deutsch',
            'text': Paragraph(data["homework"]["german"], styles["medium"])
        },
        {
            'title': 'Mathematik',
            'text': Paragraph(data["homework"]["maths"], styles["medium"])
        },
        {
            'title': 'Englisch',
            'text': Paragraph(data["homework"]["english"], styles["medium"])
        }
    ]
    # check for individual entered homework fields
    if (data["homework"]["individual1"]["name"] != '') and (data["homework"]["individual1"]["name"] is not None) and (data["homework"]["individual1"]["value"] != '') and (data["homework"]["individual1"]["value"] is not None):
        homework.append({'title': data["homework"]["individual1"]["name"], 'text': Paragraph(data["homework"]["individual1"]["value"], styles["medium"])})

    if (data["homework"]["individual2"]["name"] != '') and (data["homework"]["individual2"]["name"] is not None) and (data["homework"]["individual2"]["value"] != '') and (data["homework"]["individual2"]["value"] is not None):
        homework.append({'title': data["homework"]["individual2"]["name"], 'text': Paragraph(data["homework"]["individual2"]["value"], styles["medium"])})

    # define dict to translate reportAcitivity
    reportAcitivityDict = {
          "school": 'Schule',
          "helpPlanDiscussion": 'Hilfeplangespräch',
          "getToKnowInterview": 'Kennenlerngespräch',
          "hospitation": 'Hospitation',
          "excursion": 'Ausflug / Klassenfahrt',
          "miscellaneous": 'Sonstiges',
          "holiday": '[i]Feiertag',
          "vacation": '[i]Urlaub',
          "employeeSickness": '[i]Krankmeldung',
          "other": '[i]Sonstiges',
          "supervision": '[i]Supervision',
          "teamMeeting": '[i]Teamsitzung'
        }

    # get values for main section
    reportActivity = Paragraph(reportAcitivityDict[data["reportActivity"]], styles["medium"])
    dailyReport = Paragraph(data["report"], styles["medium"])
    parentReport = Paragraph(data["parentreport"], styles["medium"])
    exchange = Paragraph(data["exchange"], styles["medium"])

    # get state of health image
    stateOfHealthImg = ''
    if(stateOfHealth == 'happy'):
        stateOfHealthImg = Image("images/happy.png")
    elif(stateOfHealth == 'neutral'):
        stateOfHealthImg = Image("images/neutral.png")
    elif(stateOfHealth == 'sad'):
        stateOfHealthImg = Image("images/sad.png")
    elif(stateOfHealth == 'sick'):
        stateOfHealthImg = Image("images/sick.png")
    elif(stateOfHealth == 'nothing'):
        stateOfHealthImg = Image("images/nothing.png")
    stateOfHealthImg.drawHeight = 0.75*cm #these specific values are needed to not stretch the image 1.12:3.04
    stateOfHealthImg.drawWidth = 0.75*cm

    # create secondary homework table
    homeworkData = [
        [],
        []
    ]

    for point in homework:
        homeworkData[0].append(point['title'])
        homeworkData[1].append(point['text'])

    homeworkTable = Table(homeworkData, colWidths="*")
    homeworkTable.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1),0.25,colors.black),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')]))

    # create table object
    mainData = [
        ["Verfassung/Stimmung", stateOfHealthImg, "Datum: "+date],
        ["Tätigkeit", reportActivity, ""],
        ["Tagesbericht", dailyReport, ""],
        [Paragraph("(Positive / schöne Erlebnisse / Reaktion, negative / unschöne Erlebnisse / Reaktion, sonstiges)", styles["small"]), "", ""],
        ["Hausaufgaben", homeworkTable,""],
        [Paragraph("Austausch mit der Schule/ LehrerInnen/Fachfräfte", styles["medium"]), exchange],
        [Paragraph("(Abmachungen, Vereinbarungen, Infos, Sonstiges)", styles["small"]), ""],
        ["Bericht der Eltern", parentReport],
        [Paragraph("(Wie war d. Nachmittag / Abend<br/>/ morgens v. d. Schule Zuhause?<br/>Wie war die Hausaufgabenzeit?)", styles["small"]), ""]
    ]

    mainTable = Table(mainData, colWidths="*")
    # formatting
    mainTable.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1),0.25,colors.black),
        ('INNERGRID', (0,0), (-1,0), 0.25, colors.black),
        ('INNERGRID', (0,4), (-1,5), 0.25, colors.black),
        ('LINEAFTER', (0,6), (0,8), 0.25, colors.black),
        ('LINEAFTER', (0,1), (0,3), 0.25, colors.black),
        ('LINEBELOW', (0,1), (-1,1), 0.25, colors.black),
        ('LINEBELOW', (0,0), (-1,0), 0.25, colors.black),
        ('LINEBELOW', (0,3), (0,3), 0.25, colors.black),
        ('LINEBELOW', (0,6), (0,6), 0.25, colors.black),
        ('LINEBELOW', (1,6), (2,6), 0.25, colors.black),
        ('ALIGN',(1,0),(1,0),'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 7), (2, 8), '#dbdbdb'),
        ('LEFTPADDING', (1, 4), (2, 4), 0),
        ('RIGHTPADDING', (1, 4), (2, 4), 0),
        ('TOPPADDING', (1, 4), (2, 4), 0),
        ('BOTTOMPADDING', (1, 4), (2, 4), 0),
        ('SPAN',(1,1),(2,1)),
        ('SPAN',(1,2),(2,3)),
        ('SPAN',(1,4),(2,4)),
        ('SPAN',(1,5),(2,6)),
        ('SPAN',(1,7),(2,8))]))
    elements.append(mainTable)
    elements.append(linebreak)

    # get signature
    signature = Image(data["signatureImage"])
    signature.drawHeight = 2.00*cm #these specific values are needed to not stretch the image 1.12:3.04
    signature.drawWidth = 5.25*cm
    # date + signature
    endingData = [
        ["Unterschrift:", signature, ""],
        ["", "Schulbegleitung", ""]
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