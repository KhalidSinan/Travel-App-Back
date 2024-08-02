const { validateCreateChat, validateSendMessage } = require('./chat.validation');
const { getChat, postChat, getChatByTripID, postChatMessage } = require('../../../models/chats.model');
const { getOneOrganizedTrip } = require('../../../models/organized-trips.model');
const { getOrganizerID } = require('../../../models/organizers.model');
const { getOrganizedTripReservationsForOneTrip } = require('../../../models/organized-trip-reservations.model');
const { getUsersID, checkMessageFromWho } = require('./chat.helper');
const { verifyToken } = require('../../../services/token');
const { getUserById } = require('../../../models/users.model');

async function socketFunctionality(io, socket) {
    const token = socket.handshake.query.token;
    const checkUser = verifyToken(token, process.env.SECRET_KEY)
    if (!checkUser) {
        return socket.disconnect();
    }
    const userID = checkUser.id
    let mainChatID;
    socket.on('join-chat', async (chatId) => {
        socket.join(chatId);
        console.log(`User ${userID} joined chat ${chatId}`);
        const chat = await getChat(chatId, userID);
        if (!chat) {
            socket.emit('chat-error', { message: "Chat not found or access denied." });
            return
        }
        mainChatID = chatId
        let messages = []
        for (let i = 0; i < chat.messages.length; i++) {
            let temp = {
                content: chat.messages[i].content,
                timestamps: chat.messages[i].timestamp,
                username: chat.messages[i].sender_id.name.first_name + ' ' + chat.messages[i].sender_id.name.last_name,
                from_me: chat.messages[i].sender_id._id == userID,
            }
            messages.push(temp)
        }
        socket.emit('chat-history', messages);
    });

    socket.on('send-message', async (message) => {
        const { error } = validateSendMessage({ message });
        if (error) {
            socket.emit('message-error', { message: error.details[0].message });
            return;
        }

        const chat = await getChat(mainChatID, userID);
        if (!chat) {
            socket.emit('message-error', { message: "No Chat Found" });
            return;
        }

        let messageData = {
            content: message,
            sender_id: userID
        };
        await postChatMessage(chat, messageData);
        messageData = checkMessageFromWho(messageData, userID)
        io.to(mainChatID).emit('receive-message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
}
module.exports = socketFunctionality;