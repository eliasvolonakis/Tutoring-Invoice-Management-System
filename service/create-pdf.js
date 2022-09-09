const credentials = require('./../credentials');
const utils = require('./../utils/utils.js');
const fs = require('fs');

const SESSIONS_PATH = credentials["SESSIONS_PATH"];
const OWNER_NAME = credentials["OWNER_NAME"];
const OWNER_HOME_ADDRESS = credentials["OWNER_HOME_ADDRESS"];
const OWNER_HOME_CITY_PROVINCE_PC = credentials["OWNER_HOME_CITY_PROVINCE_PC"];
const OWNER_TELEPHONE = credentials["OWNER_TELEPHONE"];
const OWNER_EMAIL = credentials["OWNER_EMAIL"];

console.log("Sessions Path: " + SESSIONS_PATH);
console.log("Owner Name: " + OWNER_NAME);
console.log("Owner Home Address: " + OWNER_HOME_ADDRESS);
console.log("Owner Home City Province PC: " + OWNER_HOME_CITY_PROVINCE_PC);
console.log("Owner Telephone: " + OWNER_TELEPHONE);
console.log("Owner Email: " + OWNER_EMAIL);

const PDFDocument = require('pdfkit');
let date = new Date();
const dateString = 'Date: ' + date.toLocaleString('default', { month: 'long' }) + ', ' + date.getDate() + ', ' + date.getFullYear();

function createInvoice() {
    sessionData = getSessionData();
    for (const [key, value] of Object.entries(sessionData)) {
        let firstName = key.split(" ")[0];
        let lastName = utils.getLastNameByFirstName(firstName);
        let studentName = firstName + " " + lastName;
        let numberOfSessions = value.sessionDates.length;
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('./../invoices/' + firstName + " " + date.toLocaleString('default', { month: 'long' }) + " Invoice"));
        doc.font('Times-Bold').fontSize(12).text(OWNER_NAME, 50, 50);
        doc.font('Times-Bold').fontSize(12).text(OWNER_HOME_ADDRESS, 50, 62);
        doc.font('Times-Bold').fontSize(12).text(OWNER_HOME_CITY_PROVINCE_PC, 50, 74);
        doc.font('Times-Bold').fontSize(12).text('T: ' + OWNER_TELEPHONE, 50, 86);
        doc.font('Times-Bold').fontSize(12).text('E: ' + OWNER_EMAIL, 50, 98);
        doc.fillOpacity(0.5)
        doc.font('Times-Roman').fontSize(27.5).text('INTERIM', 50, 180);
        doc.font('Times-Roman').fontSize(27.5).text('INVOICE', 50, 208);
        doc.fillOpacity(1)
        doc.font('Times-Bold').fontSize(14).text(dateString, 50, 250);
        doc.font('Times-Bold').fontSize(14).text("Student: " + studentName, 50, 275);
        
        doc.polygon([50, 340], [50, 400 + 12 * numberOfSessions], [(doc.page.width - 50) / 2, 400 + 12 * numberOfSessions], [(doc.page.width - 50) / 2, 340])
        .stroke();
        doc.font('Times-Roman').fontSize(12).text("DATE", 70, 345);
        doc.polygon([(doc.page.width - 50) / 2, 340], [(doc.page.width - 50) / 2, 400 + 12 * numberOfSessions], [doc.page.width - 50, 400 + 12 * numberOfSessions], [doc.page.width - 50, 340])
        .stroke();
        doc.font('Times-Roman').fontSize(12).text("SERVICE DESCRIPTION", doc.page.width / 2, 345);
        doc.font('Times-Bold').fontSize(12).text("Providing Math Tutoring Services", doc.page.width / 2 + 10, 380);
        doc.font('Times-Roman').fontSize(12).text(`${value.totalSessionsNumber} X $${utils.getSessionFeeByFirstName(firstName)} per session = $${value.totalSessionsNumber * utils.getSessionFeeByFirstName(firstName)}`, doc.page.width / 2 + 10, 400);
        doc.polygon([50, 360], [50, 400 + 12 * numberOfSessions], [doc.page.width - 50, 400 + 12 * numberOfSessions], [doc.page.width - 50, 360])
        .stroke();

        i = 0
        while(i < value.sessionDates.length) {
            // Added logging for debugging purposes
            console.log("Added " + firstName + " session: " + value.sessionDates[i]);
            doc.font('Times-Roman').fontSize(12).text(value.sessionDates[i], 60, 370 + i * 15);
            i ++
        }
        doc.font('Times-Bold').fontSize(12).text(`TOTAL AMOUNT DUE: $${value.totalSessionsNumber * utils.getSessionFeeByFirstName(firstName)}`, doc.page.width / 2 - 80, 400 + 12 * (numberOfSessions + 2));
        doc.end();
    };
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
            }
        } catch(err) {
            console.error(error);
        }
    });
    // Add logging for debugging purposes
    console.log(studentSessionData)
    return studentSessionData;
}

createInvoice();

module.exports = {createInvoice}