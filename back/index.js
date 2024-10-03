const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
require("dotenv").config();

const app = express();

const { User } = require("./models");

const { DB_HOST, PORT = 4000 } = process.env;
if (!DB_HOST) {
  console.error("Error: MONGO_URL environment variable is not set.");
  process.exit(1);
}

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

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

const server = app.listen(PORT, () => console.log(`Server started on ${PORT}`));
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err; // default error (4args)
  res.status(status).json({ message });
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("join-global-chat", async (userId) => {
    try {
      // Get the user information from the database
      const user = await User.findById(userId);

      // Join the global chat room
      socket.join("global-chat");

      // Broadcast a message to everyone in 'global-chat' room about the new user
      io.to("global-chat").emit("user-joined", {
        userId,
        username: user.username,
        message: `${user.username} has joined the global chat`,
      });
    } catch (err) {
      console.error("Error fetching user data: ", err.message);
    }
  });

  socket.on("send-global-message", (message) => {
    io.to("global-chat").emit("receive-global-message", message);
    console.log(message); // Broadcast to all connected clients
  });

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    }
  });
});

module.exports = app;
