const fs = require('fs')
const handlebars = require('handlebars')
const PuppeteerHTMLPDF = require("puppeteer-html-pdf");

require('dotenv').config();


async function generatePDF(templateName, data) {
    const template = createTemplate('views/flight_ticket', { name: 'ss' })

    // Setup PDF
    const htmlPDF = new PuppeteerHTMLPDF();
    htmlPDF.setOptions({ format: "A4" });
    const pdfBuffer = await htmlPDF.create(template);

    const filePath = `public/pdfs/sample.pdf`;
    await htmlPDF.writeFile(pdfBuffer, filePath);
}

function createTemplate(templateName, data) {
    const source = fs.readFileSync("views/flight_ticket.html", 'utf-8').toString();
    const template = handlebars.compile(source)(data)
    return template;
}

generatePDF('ss', {})

// module.exports = generate