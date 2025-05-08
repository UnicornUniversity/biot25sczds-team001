const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const DeviceAuth = require("../models/DeviceAuth");

const JWT_SECRET_DEVICE = process.env.JWT_SECRET_DEVICE || "iot_secret";
const JWT_EXPIRATION = "15m";

router.post("/api/login", async (req, res) => {
    const {name, password} = req.body;

    if (!name || !password) return res.status(400).json({message: "Device name and password required."});

    const device = await DeviceAuth.findOne({name});
    if (!device || !(await bcrypt.compare(password, device.passwordHash))) {
        return res.status(401).json({message: "Invalid credentials."});
    }

    const token = jwt.sign(
        {id: device._id, type: "iot"},
        JWT_SECRET_DEVICE,
        {expiresIn: JWT_EXPIRATION}
    );

    res.json({token});
});

module.exports = router;