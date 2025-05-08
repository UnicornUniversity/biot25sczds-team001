const mongoose = require("mongoose");

const deviceAuthSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("DeviceAuth", deviceAuthSchema);