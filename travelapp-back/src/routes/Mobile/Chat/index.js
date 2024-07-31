const { httpGetAllChats, httpPostChat, httpPostMessage, httpGetOneChat, httpPutMessage, httpDeleteMessage } = require('./chats.controller');

// use this
// socket.broadcast.emit

async function socketFunctionality(io, socket) {
    // Handle joining a chat room
    socket.on('join-chat', async (data) => {
        const { tripId, userId } = data;
        const chat = await Chat.findOne({ trip_id: tripId });
        if (chat) {
            if (!chat.users_id.includes(userId)) {
                chat.users_id.push(userId);
                await chat.save();
            }
            socket.join(tripId.toString());
            const messages = await Chat.findById(chat._id).populate('messages.sender_id', 'name').select('messages');
            socket.emit('chat-messages', messages.messages);
        } else {
            // Create a new chat room
            const newChat = new Chat({
                trip_id: tripId,
                users_id: [userId],
                name: 'Organized Trip Chat',
                organizer_id: tripId.organizer_id
            });
            const savedChat = await newChat.save();

            socket.join(tripId.toString());
        }
    });

    // Handle new messages
    socket.on('new-message', async (data) => {
        const { tripId, message, userId } = data;

        const newMessage = {
            content: message,
            sender_id: userId
        };

        const chat = await Chat.findOneAndUpdate(
            { trip_id: tripId },
            { $push: { messages: newMessage } },
            { new: true }
        ).populate('messages.sender_id', 'name');

        io.to(tripId.toString()).emit('chat-message', { message: newMessage, sender: chat.messages[chat.messages.length - 1].sender_id });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
}

module.exports = socketFunctionality;