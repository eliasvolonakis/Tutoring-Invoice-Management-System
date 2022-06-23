const express = require('express');
const pdfService = require('../service/create-pdf')

const router = express.Router();
router.get('/invoice', (req, res, next) => {
    const stream = res.writeHead(200, {
        'Content-Type': 'application',
        'Content-Disposition': 'attachment; filename=invoice.pdf'
    });

    pdfService.buildPDF(
        (chunk) => stream.write(chunk),
        () => stream.end()
    );
});

module.exports = router; 


const PDFDocument = require('pdfkit');
const fs = require('fs');

var pdfDoc = new PDFDocument;
pdfDoc.pipe(fs.createWriteStream('text_alignment.pdf'));

pdfDoc.text("This text is left aligned", { align: 'left'})
pdfDoc.text("This text is at the center", { align: 'center'})
pdfDoc.text("This text is right aligned", { align: 'right'})
pdfDoc.text("This text needs to be slightly longer so that we can see that justification actually works as intended", { align: 'justify'})

pdfDoc.end();