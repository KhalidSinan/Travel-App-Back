require('dotenv').config()
const URL = process.env.URL;

function createPaymentData(data, amount, type) {
    const currency = 'USD'
    let items = [];
    data.forEach(e => {
        let temp = {}
        if (type == 'flight') {
            temp = {
                name: e.seat_number,
                sku: type,
                price: e.price,
                currency: currency,
                quantity: 1
            }
        }
        else if (type == 'hotel') {
            temp = {
                name: e.code,
                sku: type,
                price: e.overall_price,
                currency: currency,
                quantity: e.count
            }
        }
        items.push(temp)
    })
    const payment_data = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            // "return_url": `http://localhost:5000/payment/execute_payment?amount=${amount}&currency=${currency}`,
            "return_url": `${URL}/payment/execute_payment?amount=${amount}&currency=${currency}`,
            "cancel_url": `${URL}/payment/cancel`
            // "cancel_url": "http://localhost:5000/payment/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "currency": currency,
                "total": amount
            },
            "description": "This is the payment for " + type
        }]
    };
    return payment_data
}

module.exports = createPaymentData