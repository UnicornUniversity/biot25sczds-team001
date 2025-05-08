const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Log = require("../models/Log");
const Device = require("../models/Device");

const verifyDeviceToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(400).json({message: "Token missing."});

    jwt.verify(token, process.env.JWT_SECRET_DEVICE, (err, device) => {
        if (err) return res.status(401).json({message: "Token is expired or invalid."});
        req.device = device;
        next();
    });
};

// POST /api/data
router.post("/api/data", verifyDeviceToken, async (req, res) => {
    try {
        const {"motion-detect": motion, "door-movement": door, timestamp, deviceId} = req.body;

        if (!deviceId || !timestamp) {
            return res.status(400).json({message: "Missing required fields"});
        }

        const device = await Device.findById(deviceId);
        if (!device) return res.status(404).json({message: "Device not found"});

        const log = new Log({
            _id: `log_${Date.now()}`,
            doorId: device.doorId,
            severity: motion || door ? "warning" : "info",
            message: `Motion: ${motion}, Door: ${door}`,
            createdAt: new Date(timestamp),
            updatedAt: new Date(timestamp),
        });

        await log.save();

        // TODO: Add event

        res.status(200).json({message: "Log created", data: log});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;