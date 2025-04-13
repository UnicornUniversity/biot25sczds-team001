const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const iotNodeSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        doorId: {
            type: String,
            required: true,
            ref: "Dvere",
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updateAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: {createdAt: "createdAt", updatedAt: "updateAt"},
    }
);

module.exports = mongoose.model("IotNode", iotNodeSchema);
