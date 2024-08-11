const nodemailer = require('nodemailer');
const fs = require('fs')
const handlebars = require('handlebars')
require('dotenv').config();

async function sendMail(title, receivers, data, attachments = null) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD
        }
    })

    const mailOptions = {
        from: {
            name: 'TripIt',
            address: 'tripit262@gmail.com'
        },
        to: receivers,
        subject: title,
        html: emailTemplate(data.template_name, data),
        attachments
    }

    transporter.sendMail(mailOptions)

}

function emailTemplate(templateName, data) {
    const source = fs.readFileSync(templateName, 'utf-8').toString();
    const template = handlebars.compile(source)
    const replacements = data
    const email = template(replacements)
    return email;
}

module.exports = sendMail;