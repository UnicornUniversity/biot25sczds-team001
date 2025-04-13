const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const logSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        severity: {
            type: String,
            required: true,
            enum: ["info", "warning", "error"],
        },
        message: {
            type: String,
            required: true,
        },
        relatedDoor: {
            type: String,
            ref: "Dvere",
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

module.exports = mongoose.model("Log", logSchema);
