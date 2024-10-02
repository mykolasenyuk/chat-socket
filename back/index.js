const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require("socket.io");
require('dotenv').config();

const app = express();

const { User } = require('./models');

const { DB_HOST, PORT = 4000 } = process.env;
if (!DB_HOST) {
    console.error("Error: MONGO_URL environment variable is not set.");
    process.exit(1);
}

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const globalRoutes = require("./routes/globalChat");

mongoose
    .connect(DB_HOST)
    .then(() => {
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.log("DB Connection Error: ", err.message);
        process.exit(1); // Exit the process on DB connection error
    });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/global", globalRoutes);

const server = app.listen(PORT, () =>
    console.log(`Server started on ${PORT}`)
);
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const {
        status = 500,
        message = 'Server error',
    } = err; // default error (4args)
    res.status(status).json({ message });
});

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('join-global-chat', async (userId) => {
        try {
            const user = await User.findById(userId).exec();
            if (user) {
                console.log(`User ${userId} joined global chat`);
                console.log(`User Info: ${JSON.stringify(user)}`);

                // Broadcast a message to the global chat
                const joinMessage = {
                    sender: { username: 'System' },  // Indicating the system sent the message
                    message: { text: `${user.username} has joined the global chat.` },
                    createdAt: new Date().toISOString(),  // Adding a timestamp
                };

                // io.emit('receive-global-message', joinMessage); // Broadcast to all connected clients

                socket.emit('user-info', user);
            } else {
                console.log(`User ${userId} not found in the database`);
            }
        } catch (err) {
            console.error('Error fetching user information:', err);
        }
    });

    socket.on('send-global-message', (message) => {
        io.emit('receive-global-message', message); // Broadcast to all connected clients
    });

    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data.msg);
        }
    });
});

module.exports = app;