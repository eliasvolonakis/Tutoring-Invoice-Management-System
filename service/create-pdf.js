require('dotenv').config();
const fs = require('fs');
const SESSIONS_PATH = process.env.SESSIONS_PATH;
const PDFDocument = require('pdfkit');
let date = new Date();
const dateString = 'Date: ' + date.toLocaleString('default', { month: 'long' }) + ', ' + date.getDate() + ', ' + date.getFullYear();

function buildPDF(dataCallback, endCallback) {
    // Adding this to create additional functions if required in the future
    createInvoice(dataCallback, endCallback)

}

function createInvoice(dataCallback, endCallback, studentName = "BOB") {
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);
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

function getSessions() {
    const content = fs.readFileSync('./../sessions.txt', 'utf8');
    console.log(content);
}

getSessions();
//module.exports = { buildPDF };