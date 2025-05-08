const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Log = require("../models/Log");
const Device = require("../models/Device");
const Door = require("../models/Door");

let clients = [];

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

// SSE endpoint
router.get("/api/alerts/stream", (req, res) => {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    res.flushHeaders();

    clients.push(res);

    req.on("close", () => {
        clients = clients.filter(c => c !== res);
    });
});

// POST /api/data
router.post("/api/data", verifyDeviceToken, async (req, res) => {
    try {
        const {"motion-detect": motion, "door-movement": door, timestamp, deviceId} = req.body;

        if (!deviceId || !timestamp) {
            return res.status(400).json({message: "Missing required fields"});
        }

        const device = await Device.findById(deviceId);
        if (!device) return res.status(404).json({message: "Device not found"});

        const doorRecord = await Door.findById(device.doorId);
        if (!doorRecord) return res.status(404).json({message: "Door not found"});

        const severity = motion || door ? "warning" : "info";

        const log = new Log({
            _id: `log_${Date.now()}`,
            doorId: device.doorId,
            severity,
            message: `Motion: ${motion}, Door: ${door}`,
            createdAt: new Date(timestamp),
            updatedAt: new Date(timestamp),
        });

        await log.save();

        // Push alert IF warning AND the door is locked
        if (severity === "warning" && doorRecord.locked) {
            const payload = {
                doorId: doorRecord._id,
                severity,
                state: doorRecord.state,
                locked: doorRecord.locked,
                motion,
                door,
                timestamp,
            };

            clients.forEach(client =>
                client.write(`data: ${JSON.stringify(payload)}\n\n`)
            );
        }

        res.status(200).json({message: "Log created", data: log});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;