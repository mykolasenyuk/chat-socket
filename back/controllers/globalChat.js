const GlobalMessages = require("../models/globalChat/globalChat");

module.exports.addGlobalMessage = async (req, res, next) => {
    try {
        const { sender, message, isAudio } = req.body;

        if ((!isAudio && typeof message !== 'string') || !message) {
            return res.status(400).json({ msg: "Invalid message." });
        }

        const messageContent = isAudio ? { voice: message } : { text: message };

        const data = await GlobalMessages.create({
            message: messageContent,
            sender,
            isAudio
        });

        if (data) {
            return res.json({ msg: "Message added successfully." });
        } else {
            return res.json({ msg: "Failed to add message to the database." });
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getGlobalMessages = async (req, res, next) => {
    try {
        const messages = await GlobalMessages.find().populate("sender", "username").limit(20);
        res.json(messages);
    } catch (ex) {
        next(ex);
    }
};