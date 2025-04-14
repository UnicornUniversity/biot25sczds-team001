const express = require("express");
const router = express.Router();
const authDao = require("../dao/authDao");

// Register
router.post("/register", async (req, res) => {
    try {
        const result = await authDao.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const result = await authDao.login(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;