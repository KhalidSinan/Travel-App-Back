const paypal = require("paypal-rest-sdk");
require('dotenv').config()

paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_SECRET
});

function paymentSheet(req, res) {
    const payment_data = req.body.data;
    paypal.payment.create(payment_data, function (error, payment) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            for (var index = 0; index < payment.links.length; index++) {
                if (payment.links[index].rel === 'approval_url') {
                    res.redirect(payment.links[index].href);
                }
            }
        }
    });
}

function executePayment(req, res) {
    const amount = req.query.amount;
    const currency = req.query.currency
    const paymentExecutionData = {
        "payer_id": req.query.PayerID,
        "transactions": [{
            "amount": {
                "currency": currency,
                "total": amount
            }
        }]
    };
    const paymentId = req.query.paymentId;
    paypal.payment.execute(paymentId, paymentExecutionData, async function (error, payment) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            // Add Notifications
            res.redirect("http://return_url/?status=success&id=" + payment.id + "&state=" + payment.state);
        }
    });
}

module.exports = {
    paymentSheet,
    executePayment
}