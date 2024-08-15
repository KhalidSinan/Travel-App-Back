const admin = require('firebase-admin');
require('dotenv').config();

// Add User Notification Save To DB 
async function sendPushNotification(title, body, token, type = 'MESSAGE', data = {}) {
    let temp = [];
    token.forEach(tok => {
        tok.device_token.forEach(device => {
            temp.push(device.token)
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

// sendPushNotification(
//     'Trip Ended',
//     'Your Trip Has Ended',
//     [{ device_token: [{ token: "dXMrg-PERhWmewlGGopvgz:APA91bEiRfvjFB1kraN19Qgibe2jD7kpnc2A0GTjm6C0HIQQIxCunBeuRvGNUYpWilqziqMU6UorSOq1bQroqVIoNJYgTDVxd-_P1q00n0YrmCKzBfbnjzVgr15smuT2rbmK52hUJfMG" }] }],
//     '/notification-screen',
//     { id: 1111 }
// )
// sendPushNotification('Testing Home Screen', 'Hello Hamza You are going to home screen', [{ device_token: [{ token: "" }] }], '/notification-screen')

module.exports = sendPushNotification;