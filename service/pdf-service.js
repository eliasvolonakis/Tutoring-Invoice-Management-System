const PDFDocument = require('pdfkit');

function buildPDF(dataCallback, endCallback) {
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);
    doc.fontSize(25).text('Some Heading!', 100, 100);
    doc.end();

}

module.exports = { buildPDF };