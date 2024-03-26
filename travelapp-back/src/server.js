const http = require('http');
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
require('dotenv').config();
const PORT = process.env.PORT;

const server = http.createServer(app);

async function startServer() {
    try {
        await mongoConnect();
        server.listen(PORT, () => console.log(`Listening on Port: ${PORT}`))
    } catch (err) {
        console.log('Something went Wrong:', err.message)
    }
}

startServer();