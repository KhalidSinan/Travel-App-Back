const http = require('http');
const socketio = require('socket.io');

const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const socketFunctionality = require('./routes/Mobile/Chat/index');
require('dotenv').config();

const PORT = process.env.PORT;
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});


async function startServer() {
    try {
        await mongoConnect();
        server.listen(PORT, () => console.log(`Listening on Port: ${PORT}`))
        io.on('connection', (socket) => {
            console.log('a user connected with id', socket.id)
            socketFunctionality(io, socket);
        })
    } catch (err) {
        console.log('Something went Wrong:', err.message)
    }
}

startServer();