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