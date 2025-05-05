const express = require("express");
const router = express.Router();
const deviceDao = require("../dao/deviceDao");
const authenticateToken = require("../middleware/authTokenValidation");
const validate = require("../middleware/validate");
const Joi = require("joi");

const createSchema = Joi.object({
    _id: Joi.string(),
    doorId: Joi.string().required(),
    gatewayId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("").default(""),
    created: Joi.boolean().default(true)
});

const updateSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string().allow("", null),
    doorId: Joi.string().allow(null),
    gatewayId: Joi.string().allow(null),
    created: Joi.boolean(),
}).min(1);

// GET /devices/available-controllers?gatewayId=gw001
router.get("/devices/available-controllers", authenticateToken, async (req, res) => {
    try {
        const {gatewayId} = req.query;
        const result = await deviceDao.getAvailableControllers(gatewayId);
        res.json({message: "Available controllers fetched", data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET /devices?gatewayId=...&created=true
router.get("/devices", authenticateToken, async (req, res) => {
    try {
        const {page = 1, pageSize = 10, doorId, gatewayId, created} = req.query;
        const pageInfo = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            doorId,
            gatewayId,
            created: created !== undefined ? created === "true" : undefined,
        };
        const result = await deviceDao.list(pageInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// GET /devices/:id
router.get("/devices/:id", authenticateToken, async (req, res) => {
    try {
        const device = await deviceDao.getById(req.params.id);
        if (!device) return res.status(404).json({message: "Device not found"});
        res.json(device);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// POST /devices
router.post("/devices", validate(createSchema), authenticateToken, async (req, res) => {
    try {
        const device = await deviceDao.create(req.body);
        res.status(201).json({message: "Device created", data: device});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// PUT /devices/:id
router.put("/devices/:id", validate(updateSchema), authenticateToken, async (req, res) => {
    try {
        const device = await deviceDao.updateById(req.params.id, req.body);
        if (!device) return res.status(404).json({message: "Device not found"});
        res.json({message: "Device updated", data: device});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// DELETE /devices/:id
router.delete("/devices/:id", authenticateToken, async (req, res) => {
    try {
        const device = await deviceDao.deleteById(req.params.id);
        if (!device) return res.status(404).json({message: "Device not found"});
        res.json({message: "Device deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;