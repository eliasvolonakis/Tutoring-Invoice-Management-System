const credentials = require('./../credentials');
const fs = require('fs');

const SESSIONS_PATH = credentials["SESSIONS_PATH"];
const OWNER_NAME = credentials["OWNER_EMAIL"];
const OWNER_HOME_ADDRESS = credentials["OWNER_HOME_ADDRESS"];
const OWNER_HOME_CITY_PROVINCE_PC = credentials["OWNER_HOME_CITY_PROVINCE_PC"];
const OWNER_TELEPHONE = credentials["OWNER_TELEPHONE"];

console.log("Sessions Path: " + SESSIONS_PATH);
console.log("Owner Name: " + OWNER_NAME);
console.log("Owner Home Address: " + OWNER_HOME_ADDRESS);
console.log("Owner Home City Province PC: " + OWNER_HOME_CITY_PROVINCE_PC);
console.log("Owner Telephone: " + OWNER_TELEPHONE);

const PDFDocument = require('pdfkit');
let date = new Date();
const dateString = 'Date: ' + date.toLocaleString('default', { month: 'long' }) + ', ' + date.getDate() + ', ' + date.getFullYear();

function createInvoice(studentName = "Bob") {
    sessionData = getSessionData();
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('./../invoices/' + studentName + " " + date.toLocaleString('default', { month: 'long' }) + " Invoice"));
    doc.font('Times-Bold').fontSize(12).text(OWNER_NAME, 50, 50);
    doc.font('Times-Bold').fontSize(12).text(OWNER_HOME_ADDRESS, 50, 62);
    doc.font('Times-Bold').fontSize(12).text(OWNER_HOME_CITY_PROVINCE_PC, 50, 74);
    doc.font('Times-Bold').fontSize(12).text('T: ' + OWNER_TELEPHONE, 50, 86);
    doc.font('Times-Bold').fontSize(12).text('E: ' + OWNER_EMAIL, 50, 98);
    doc.fillOpacity(0.5)
    doc.font('Times-Roman').fontSize(27.5).text('INTERIM', 50, 250);
    doc.font('Times-Roman').fontSize(27.5).text('INVOICE', 50, 278);
    doc.fillOpacity(1)
    doc.font('Times-Roman').fontSize(12).text(dateString, 420, 290);
    doc.font('Times-Bold').fontSize(14).text("Student: " + studentName, 50, 315);
    
    doc.polygon([50, 340], [50, 400], [(doc.page.width - 50) / 2, 400], [(doc.page.width - 50) / 2, 340])
    .stroke();
    doc.font('Times-Roman').fontSize(12).text("DATE", 70, 345);
    doc.polygon([(doc.page.width - 50) / 2, 340], [(doc.page.width - 50) / 2, 400], [doc.page.width - 50, 400], [doc.page.width - 50, 340])
    .stroke();
    doc.font('Times-Roman').fontSize(12).text("SERVICE DESCRIPTION", doc.page.width / 2, 345);
    doc.polygon([50, 360], [50, 400], [doc.page.width - 50, 400], [doc.page.width - 50, 360])
    .stroke();
    doc.font('Times-Roman').fontSize(12).text(dateString, 420, 290);

    doc.end();
}

// Returns an object of the form:
// {Student Name Session: {sessionDates: [], totalSessionsNumber}}
function getSessionData() {
    const content = fs.readFileSync(SESSIONS_PATH, 'utf8');
    const sessions = content.split('\n');
    let studentSessionData = {};
    sessions.forEach(session => {
        try{
            if(session != "") {
                let sessionData = session.split('!');
                if(!(sessionData[0] in studentSessionData)) {
                    studentSessionData[sessionData[0]] = {sessionDates : [sessionData[1]], 
                        totalSessionsNumber : parseFloat(sessionData[2])}
                } else 
                {
                    let currentSessionDates = studentSessionData[sessionData[0]].sessionDates;
                    currentSessionDates.push(sessionData[1]);
                    let totalSessionNumberToAdd = parseFloat(sessionData[2]);
                    studentSessionData[sessionData[0]].totalSessionsNumber += totalSessionNumberToAdd;
                }
                // sessionDates.push(sessionData[0]);
                // totalSessionsHours += parseFloat(sessionData[1]);
            }
        } catch(err) {
            console.error(error);
        }
    });
    // Add logging for debugging
    // console.log({sessionDates: sessionDates, totalSessionsNumber: totalSessionsHours});
    console.log(studentSessionData)
    return studentSessionData;
}

getSessionData();
//createInvoice();
