const { Schema, model } = require("mongoose");
const Joi = require("joi");

const messageSchema = new Schema(
    {
        message: {
            text: {
                type: String,
                required: true,
            },
        },
        users: Array,
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

const joiSchema = Joi.object({
    message: Joi.string().required(),
});

const Messages = model("Message", messageSchema);

module.exports = {
    Messages,
    joiSchema,
};