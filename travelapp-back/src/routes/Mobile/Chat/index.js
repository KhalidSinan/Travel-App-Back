const { validateSendMessage } = require('./chat.validation');
const { getChat, postChatMessage, getLatestMessage, getAllChats } = require('../../../models/chats.model');
const { verifyToken } = require('../../../services/token');
const { encodeImage } = require('../../../services/images');
const { default: mongoose } = require('mongoose');
require('dotenv').config()

const userSocketMap = {}; // Change from object to Map if necessary for better performance with large datasets

async function socketFunctionality(io, socket) {
    const token = socket.handshake.query.token;
    const checkUser = verifyToken(token, process.env.SECRET_KEY)
    if (!checkUser) {
        return socket.disconnect();
    }
    const userID = checkUser.id
    let userChats = await getAllChats(userID)
    userChats = userChats.map(chat => chat.trip_id)
    let mainChatID = null;
    userSocketMap[userID] = socket.id;

    socket.on('join-chat', async (chatId) => {
        if (!mongoose.isValidObjectId(chatId)) {
            socket.emit('chat-error', { message: "Chat not found or access denied." });
            return;
        }
        const chat = await getChat(chatId, userID);
        if (!chat) {
            socket.emit('chat-error', { message: "Chat not found or access denied." });
            return
        }
        socket.join(chatId);
        console.log(`User ${userID} joined chat ${chatId}`);

        mainChatID = chatId
        let messages = []
        for (let i = 0; i < chat.messages.length; i++) {
            let color = chat.users_id.find(user => user.id == chat.messages[i].sender_id.id).color
            if (chat.messages[i].sender_id.id == userID) color = '0xff205E61'
            const pic = chat.messages[i].sender_id.profile_pic ?? 'default_profile_pic.jpg'
            let sentImage = chat.messages[i].image == null ? null : process.env.URL + chat.messages[i].image
            let temp = {
                content: chat.messages[i].content ?? '',
                timestamps: chat.messages[i].timestamp,
                username: chat.messages[i].sender_id.name.first_name + ' ' + chat.messages[i].sender_id.name.last_name,
                user_profile_pic: process.env.URL + pic,
                user_color: color,
                image: sentImage,
                from_me: chat.messages[i].sender_id._id == userID,
            }
            messages.push(temp)
        }
        socket.emit('chat-history', messages);
    });

    socket.on('leave-chat', () => {
        if (mainChatID) {
            socket.leave(mainChatID);
            console.log(`User ${userID} left chat ${mainChatID}`);
            mainChatID = null; // Clear the mainChatID when leaving
        }
    });

    socket.on('send-message', async (data) => {
        let { message, image } = data
        // const { error } = validateSendMessage({ message });
        // if (error) {
        //     socket.emit('message-error', { message: error.details[0].message });
        //     return;
        // }

        const chat = await getChat(mainChatID, userID);
        if (!chat) {
            socket.emit('chat-error', { message: "No Chat Found" });
            return;
        }

        if (image) image = encodeImage(image)


        let messageData = {
            content: message,
            sender_id: userID,
            image: image ?? null
        };

        await postChatMessage(chat, messageData);
        let latestMessage = await getLatestMessage(chat._id)
        let color = chat.users_id.find(user => user.id == latestMessage.sender_id.id).color
        const pic = latestMessage.sender_id.profile_pic ?? '/default_profile_pic.jpg'
        let sentImage = image == null ? null : process.env.URL + image
        let emmitedMessage = {
            content: latestMessage.content,
            timestamps: latestMessage.timestamp,
            username: latestMessage.sender_id.name.first_name + ' ' + latestMessage.sender_id.name.last_name,
            user_profile_pic: process.env.URL + pic,
            image: sentImage,
            user_color: color,
            from_me: false,
        }
        socket.broadcast.to(mainChatID).emit('receive-message', emmitedMessage);
        socket.emit('receive-message', {
            ...emmitedMessage,
            user_color: '0xff205E61',
            from_me: true
        });

        const otherUsers = chat.users_id.filter(user => user.id !== userID);

        otherUsers.forEach(user => {
            const userSocket = io.sockets.sockets.get(userSocketMap[user.id]);
            let message = `${emmitedMessage.username}:${emmitedMessage.content}`
            if (userSocket && !userSocket.rooms.has(mainChatID)) {
                let data = { message, chat_id: mainChatID }
                userSocket.emit('new-message', data);
            }
        });

    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
        delete userSocketMap[userID]
    });
}
module.exports = socketFunctionality;