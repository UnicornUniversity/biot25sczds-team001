const mongoose = require("mongoose");

const iotNodeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      ref: "User",
      required: true,
    },
    gatewayId: {
      type: String,
      required: true,
      ref: "Gateway",
    },
    doorId: {
      type: String,
      ref: "Door",
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    created: {
      type: Boolean,
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
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Device", iotNodeSchema);