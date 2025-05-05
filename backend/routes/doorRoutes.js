const express = require("express");
const router = express.Router();
const doorDao = require("../dao/doorDao");
const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authTokenValidation");
const Joi = require("joi");

// Validation schemas
const createDoorSchema = Joi.object({
    _id: Joi.string(),
    buildingId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null),
    locked: Joi.boolean().default(true),
    state: Joi.string().valid("safe", "alert", "inactive").default("safe"),
});

const updateDoorSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string().allow("", null),
    buildingId: Joi.string(),
    locked: Joi.boolean(),
    state: Joi.string().valid("safe", "alert", "inactive")
}).min(1);

// List doors for a specific building
router.get("/buildings/:buildingId/doors", authenticateToken, async (req, res) => {
    try {
        const {page = 1, pageSize = 10} = req.query;
        const result = await doorDao.list({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            buildingId: req.params.buildingId,
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Fetch one door by ID
router.get("/doors/:id", authenticateToken, async (req, res) => {
    try {
        const door = await doorDao.get({_id: req.params.id});
        if (!door) return res.status(404).json({message: "Door not found"});
        res.json(door);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Create a new door
router.post("/doors", validate(createDoorSchema), authenticateToken, async (req, res) => {
    try {
        const door = await doorDao.create(req.body);
        res.status(201).json({message: "Door created", data: door});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Update a door by ID
router.put("/doors/:id", validate(updateDoorSchema), authenticateToken, async (req, res) => {
    try {
        const updateData = {...req.body};
        delete updateData._id;
        const door = await doorDao.update({_id: req.params.id, ...updateData});
        if (!door) return res.status(404).json({message: "Door not found"});
        res.json({message: "Door updated", data: door});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Delete a door by ID
router.delete("/doors/:id", authenticateToken, async (req, res) => {
    try {
        const result = await doorDao.delete(req.params.id);
        if (!result) return res.status(404).json({message: "Door not found"});
        res.json({message: "Door deleted"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Toggle door state
router.post("/doors/:id/toggle-state", authenticateToken, async (req, res) => {
    try {
        const door = await doorDao.toggleState(req.params.id);
        if (!door) return res.status(404).json({message: "Door not found"});
        res.json({message: "State toggled", data: door});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Toggle door lock
router.post("/doors/:id/toggle-lock", authenticateToken, async (req, res) => {
    try {
        const door = await doorDao.toggleLock(req.params.id);
        if (!door) return res.status(404).json({message: "Door not found"});
        res.json({message: "Lock toggled", data: door});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Toggle door favourite for the logged-in user
router.post("/doors/:id/toggle-favourite", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedUser = await doorDao.toggleFavourite(userId, req.params.id);
        res.json({message: "Favourite toggled", data: updatedUser.favouriteDoors});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Fetch logs for a door
router.get("/doors/:id/logs", authenticateToken, async (req, res) => {
    try {
        const {limit = 10, offset = 0} = req.query;
        const logs = await doorDao.getLogs(req.params.id, parseInt(limit), parseInt(offset));
        res.json({message: "Logs fetched", data: logs});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;