const mongoose = require("mongoose");

const objektSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        ownerId: {
            type: String,
            required: true,
            ref: "User",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"},
    }
);

module.exports = mongoose.model("Building", objektSchema);