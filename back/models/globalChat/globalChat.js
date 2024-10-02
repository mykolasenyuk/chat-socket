const { Schema, model } = require("mongoose");

const globalMessageSchema = new Schema(
    {
        message: {
            text: {
                type: String,
            },
            voice: {
                type: String,
            },
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isAudio: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

const GlobalMessages = model("GlobalMessage", globalMessageSchema);

module.exports = GlobalMessages;