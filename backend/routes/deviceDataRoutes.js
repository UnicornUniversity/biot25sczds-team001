/**********************************************************************
 *  routes/deviceDataRoutes.js
 *  - ukládá log, jen pokud jsou dveře locked
 *  - security incident → door.state = "alert"
 *  - Socket.IO push:
 *      • door:state – změna stavu dveří (doorId, doorName, buildingId…)
 *      • log:new    – nový log pro přihlášené uživatele
 *********************************************************************/

const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");

const Log    = require("../models/Log");
const Device = require("../models/Device");
const Door   = require("../models/Door");

const JWT_SECRET_DEVICE = process.env.JWT_SECRET_DEVICE || "iot_secret";

/* ---------- ověření tokenu zařízení ---------- */
function verifyDeviceToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token missing." });

  jwt.verify(token, JWT_SECRET_DEVICE, (err, device) => {
    if (err) return res.status(401).json({ message: "Token is expired or invalid." });
    req.device = device;
    next();
  });
}

/* ---------- POST /api/data ---------- */
router.post("/api/data", verifyDeviceToken, async (req, res) => {
  try {
    const {
      "motion-detect": motion = false,
      "door-movement": door   = false,
      timestamp,
      deviceId,
    } = req.body;

    if (!deviceId || !timestamp) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    /* --- zařízení a dveře --- */
    const device  = await Device.findById(deviceId);
    if (!device)  return res.status(404).json({ message: "Device not found" });

    const doorDoc = await Door.findById(device.doorId);
    if (!doorDoc) return res.status(404).json({ message: "Door not found" });

    /* --- logujeme jen zamčené dveře --- */
    if (!doorDoc.locked) {
      return res.status(200).json({ message: "Door unlocked – log skipped." });
    }

    /* --- message & severity --- */
    let severity, message;
    if (motion && door) {
      severity = "error";
      message  = "A security incident has occurred.";
    } else if (motion) {
      severity = "warning";
      message  = "There was movement around the door.";
    } else if (door) {
      severity = "warning";
      message  = "The door was being moved.";
    } else {
      severity = "info";
      message  = "Everything is fine.";
    }

    const io = req.app.get("io");                 // Socket.IO reference

    /* ---------- INCIDENT → DOOR ALERT + PUSH ---------- */
    if (severity === "error") {
      if (doorDoc.state !== "alert") {
        doorDoc.state     = "alert";
        doorDoc.updatedAt = new Date(timestamp);
        await doorDoc.save();
      }
      io.emit("door:state", {
        doorId    : doorDoc._id.toString(),
        doorName  : doorDoc.name,
        buildingId: doorDoc.buildingId.toString(),
        state     : "alert",
        locked    : doorDoc.locked,
        updatedAt : doorDoc.updatedAt,
      });
    }

    /* ---------- ULOŽ LOG + PUSH ---------- */
    const log = await new Log({
      _id      : `log_${Date.now()}`,
      doorId   : doorDoc._id,
      severity,
      message,
      createdAt: new Date(timestamp),
      updatedAt: new Date(timestamp),
    }).save();

    io.emit("log:new", log);

    res.status(200).json({ message: "Log created", data: log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;