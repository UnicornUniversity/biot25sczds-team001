const express = require("express");
const router = express.Router();
const gatewayDao = require("../dao/gatewayDao");
const authenticateToken = require("../middleware/authTokenValidation");
const Joi = require("joi");
const validate = require("../middleware/validate");

const createGatewaySchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(null, "").default(null),
    ownerId: Joi.string().required(),
    buildingId: Joi.string().allow(null),
    created: Joi.boolean().required(),
});

const updateGatewaySchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string().allow(null, ""),
    ownerId: Joi.string(),
    buildingId: Joi.string().allow(null),
    created: Joi.boolean(),
}).min(2);

// GET /gateways
router.get("/gateways", authenticateToken, async (req, res) => {
    try {
        const {page = 1, pageSize = 10, ownerId, buildingId, created} = req.query;
        const pageInfo = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            ownerId,
            buildingId,
            created: created !== undefined ? created === "true" : undefined,
        };
        const result = await gatewayDao.list(pageInfo);
        res.json(result);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET /gateways/:id
router.get("/gateways/:id", authenticateToken, async (req, res) => {
    try {
        const gateway = await gatewayDao.getById(req.params.id);
        if (!gateway) return res.status(404).json({message: "Gateway not found"});
        res.json(gateway);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// POST /gateways
router.post("/gateways", validate(createGatewaySchema), authenticateToken, async (req, res) => {
    try {
        const gateway = await gatewayDao.create(req.body);
        res.status(201).json({message: "Created", data: gateway});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// PUT /gateways/:id
router.put("/gateways/:id", validate(updateGatewaySchema), authenticateToken, async (req, res) => {
    try {
        const gateway = await gatewayDao.updateById(req.params.id, req.body);
        if (!gateway) return res.status(404).json({message: "Gateway not found"});
        res.json({message: "Updated", data: gateway});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// DELETE /gateways/:id
router.delete("/gateways/:id", authenticateToken, async (req, res) => {
    try {
        const result = await gatewayDao.deleteById(req.params.id);
        if (!result) return res.status(404).json({message: "Gateway not found"});
        res.json({message: "Deleted"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// POST /gateways/:id/scan
router.post("/gateways/:id/scan", authenticateToken, async (req, res) => {
    const gatewayId = req.params.id;

    try {
        const Device = require("../models/Device");
        const foundModules = await Device.find({gatewayId, created: false});

        res.json({
            message: `Scan complete for gateway ${gatewayId}`,
            foundModules
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;