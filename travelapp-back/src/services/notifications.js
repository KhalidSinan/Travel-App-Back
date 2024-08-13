const admin = require('firebase-admin');
require('dotenv').config();

// Add User Notification Save To DB 
async function sendPushNotification(title, body, token, data = null) {
    let temp = [];
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
            type: 'MESSAGE', // *,
            extra: JSON.stringify(data)
        },
        token: temp[0],
    };
    temp.forEach(async token => {
        message.token = token
        console.log(await admin.messaging().send(message))
    })

}

module.exports = sendPushNotification;