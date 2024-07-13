const admin = require('firebase-admin');
require('dotenv').config();

// Add User Notification Save To DB 
async function sendPushNotification(title, body, token, data = null) {
    let temp = [];
    token.forEach(tok => {
        if (tok.expiry - Date.now() > 0) temp.push(tok.token)
    })
    // temp = [token, token, token, token]
    // loop over them and send
    const message = {
        notification: {
            title,
            body,
        },
        android: {
            notification: {
                channel_id: 'MESSAGE_CHANNEL',// *
                icon: 'message_icon', // *
                tag: 'message', // *
                // image: 'https://b945-93-190-141-59.ngrok-free.app/1711284229607-906706629-Screenshot%202023-12-23%20195454.png',
            },
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK', // *
            type: 'MESSAGE', // *,
            extra: JSON.stringify(data)
        },
        token: temp[0],
    };

    await admin.messaging().send(message);
}

// sendPushNotification('Test Title'+, 'Test Body, Hello All', 'cgiNZXHkShKC2_hEE1pIc5:APA91bFG5rO7jvAOrhGGVu49fvtBZvCX36HY16IdbKZ-hoTsALSXOA5ya-FrDirOM5LNvgzgxym-vyTqGI0vo8hW9LmubVALVXt10li5WDmByzjcphiRlxEWiclwnFX__ih4S6qiduKz');

module.exports = sendPushNotification;