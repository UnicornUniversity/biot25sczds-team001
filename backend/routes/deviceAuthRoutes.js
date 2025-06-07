const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const DeviceAuth = require("../models/DeviceAuth");
const basicAuth = require('basic-auth');

const JWT_SECRET_DEVICE = process.env.JWT_SECRET_DEVICE || "iot_secret";
const JWT_EXPIRATION = "15m";
const SALT_ROUNDS = 10;

router.post("/api/register", async (req, res) => {
    try {
        const { name, password, adminKey } = req.body;
        
        if (adminKey !== process.env.ADMIN_KEY) {
            return res.status(403).json({ message: "Invalid admin key" });
        }

        if (!name || typeof name !== "string" || name.trim().length < 3) {
            return res.status(400).json({ message: "Device name is required and must be at least 3 characters." });
        }
        if (!password || typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ message: "Password is required and must be at least 6 characters." });
        }

        const existing = await DeviceAuth.findOne({ name });
        if (existing) {
            return res.status(409).json({ message: "Device with this name already exists." });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const device = new DeviceAuth({ name, passwordHash });
        await device.save();

        const token = jwt.sign(
            { id: device._id, type: "iot" },
            JWT_SECRET_DEVICE,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(201).json({
            message: "Device registered successfully.",
            token,
            device: {
                id: device._id,
                name: device.name
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/api/login", async (req, res) => {
    const creds = basicAuth(req);
    const name = creds.name;
    const password = creds.pass;
    
    if (!name || !password) return res.status(400).json({message: "Device name and password required."});
    
    const device = await DeviceAuth.findOne({name});
    console.log("Login" + name + " Heslo: " + password );
    if(device) console.log("Found");
    
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
