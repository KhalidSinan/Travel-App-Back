const admin = require('firebase-admin');
require('dotenv').config();

// Add User Notification Save To DB 
async function sendPushNotification(title, body, token, type = 'MESSAGE', data = {}) {
    let temp = [];
    if (token.length == 0) return
    token.forEach(tok => {
        tok.device_token.forEach(device => {
            temp.push(device.token);
        });
    });

    const messages = temp.map(token => ({
        notification: {
            title,
            body,
        },
        android: {
            notification: {
                channel_id: 'MESSAGE_CHANNEL',
                icon: 'message_icon',
                tag: 'message',
                image: `${process.env.URL}/images/mails/logo.png`,
            },
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            type: type,
            extra: JSON.stringify(data)
        },
        token,
    }));

    for (const message of messages) {
        try {
            await admin.messaging().send(message);
            console.log(`Successfully sent message: ${message.token}`);
        } catch (error) {
            if (error.code === 'messaging/invalid-argument') {
                console.error(`Invalid token: ${message.token}`);
            } else {
                console.error('Error sending message:', error);
            }
        }
    }
}

module.exports = sendPushNotification;