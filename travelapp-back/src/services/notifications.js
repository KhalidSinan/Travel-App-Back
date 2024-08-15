const admin = require('firebase-admin');
require('dotenv').config();

// Add User Notification Save To DB 
async function sendPushNotification(title, body, token, type = 'MESSAGE') {
    let temp = [];
    let data = {}
    token.forEach(tok => {
        tok.device_token.forEach(device => {
            if (device.expiry - Date.now() > 0) temp.push(device.token)
        })
    })
    // token = [ { device_token: [{token: 1231231223 }] } ]
    // temp = [token, token, token, token]
    // loop over them and send
    let message = {
        notification: {
            title,
            body,
        },
        android: {
            notification: {
                channel_id: 'MESSAGE_CHANNEL',// *
                icon: 'message_icon', // *
                tag: 'message', // *
                image: 'https://74b6-169-150-196-142.ngrok-free.app/images/mails/logo.png',
            },
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK', // *
            type: type, // *,
            extra: JSON.stringify(data)
        },
        token: temp[0],
    };
    temp.forEach(async token => {
        message.token = token
        await admin.messaging().send(message)
    })
}

// sendPushNotification('Testing Home Screen', 'Hello Hamza You are going to home screen', [{ device_token: [{ token: "" }] }], '/notification-screen')

module.exports = sendPushNotification;