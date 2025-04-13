const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const dvereSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        objectId: {
            type: String,
            required: true,
            ref: "Objekt",
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        locked: {
            type: Boolean,
            default: true,
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

module.exports = mongoose.model("Dvere", dvereSchema);
