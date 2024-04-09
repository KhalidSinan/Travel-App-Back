const fs = require('fs')
const handlebars = require('handlebars')

require('dotenv').config();


async function generatePDF(templateName, data) {
    const template = createTemplate('views/flight_ticket', { name: 'ss' })

}

generatePDF()

function createTemplate(templateName, data) {
    const source = fs.readFileSync("views/flight_ticket.html", 'utf-8').toString();
    const template = handlebars.compile(source)(data)
    return template;
}

// module.exports = generate