require('dotenv').config();
const fs = require('fs');

const SESSIONS_PATH = process.env.SESSIONS_PATH;
const OWNER_NAME = process.env.OWNER_EMAIL;
const OWNER_HOME_ADDRESS = process.env.OWNER_HOME_ADDRESS;
const OWNER_HOME_CITY_PROVINCE_PC = process.env.OWNER_HOME_CITY_PROVINCE_PC;
const OWNER_TELEPHONE = process.env.OWNER_TELEPHONE;

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
    doc.font('Times-Bold').fontSize(12).text(process.env.OWNER_NAME, 50, 50);
    doc.font('Times-Bold').fontSize(12).text(process.env.OWNER_HOME_ADDRESS, 50, 62);
    doc.font('Times-Bold').fontSize(12).text(process.env.OWNER_HOME_CITY_PROVINCE_PC, 50, 74);
    doc.font('Times-Bold').fontSize(12).text('T: ' + process.env.OWNER_TELEPHONE, 50, 86);
    doc.font('Times-Bold').fontSize(12).text('E: ' + process.env.OWNER_EMAIL, 50, 98);
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

function getSessionData() {
    //const content = fs.readFileSync(SESSIONS_PATH, 'utf8');
    const content = fs.readFileSync('.././sessions.txt', 'utf8');
    const sessions = content.split('\n');
    let totalSessionsHours = 0;
    let sessionDates = [];
    sessions.forEach(session => {
        try{
            if(session != "") {
                let sessionData = session.split('!');
                sessionDates.push(sessionData[0]);
                totalSessionsHours += parseFloat(sessionData[1]);
            }
        } catch(err) {
            console.error(error);
        }
    });
    // Add logging for debugging
    console.log({sessionDates: sessionDates, totalSessionsNumber: totalSessionsHours});
    return {sessionDates: sessionDates, totalSessionsNumber: totalSessionsHours};
}

function clearSessionsTxt() {
    //Replae with env variable SESSIONS_PATH
    fs.writeFile('.././sessions.txt', "", err => {
          if (err) {
            console.error(err)
          }
    });
}

getSessionData();
createInvoice();
clearSessionsTxt();