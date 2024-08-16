const fs = require('fs')
const handlebars = require('handlebars')
const PuppeteerHTMLPDF = require("puppeteer-html-pdf");

require('dotenv').config();


async function generatePDF(templateName, data, identifier) {
    const template = createTemplate(templateName, data)

    // Setup PDF
    const htmlPDF = new PuppeteerHTMLPDF();
    htmlPDF.setOptions({ format: "A4" });
    const pdfBuffer = await htmlPDF.create(template);

    const filePath = `public/pdfs/pdf-${identifier}.pdf`;
    await htmlPDF.writeFile(pdfBuffer, filePath);
}

function createTemplate(templateName, data) {
    const source = fs.readFileSync(templateName, 'utf-8').toString();
    const template = handlebars.compile(source)(data)
    return template;
}


module.exports = generatePDF