const mongoose = require("mongoose");

const dvereSchema = new mongoose.Schema(
    {
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
            default: false,
        },
        state: {
            type: String,
            enum: ["safe", "alert", "inactive"],
            default: "safe",
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
        timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"},
    }
);

module.exports = mongoose.model("Door", dvereSchema);