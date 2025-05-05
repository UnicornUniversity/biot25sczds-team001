const mongoose = require("mongoose");

const dvereSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        buildingId: {
            type: String,
            required: true,
            ref: "Building",
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        locked: {
            type: Boolean,
            default: true,
        },
        state: {
            type: String,
            enum: ["safe", "alert", "inactive"],
            required: true,
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
        _id: false,
        timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"},
    }
);

module.exports = mongoose.model("Door", dvereSchema);